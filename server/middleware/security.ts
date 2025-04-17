import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'crypto';

/**
 * SECURITY OPTIMIZATION: Comprehensive security middleware to protect
 * against common web vulnerabilities and attacks
 * 
 * This improves application security for handling 20,000+ users
 */

// Content Security Policy setup
const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://via.placeholder.com"],
    connectSrc: ["'self'", "https://api.stripe.com"],
    frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

// Rate limiting configuration for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skipSuccessfulRequests: false,
});

// More strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
  skipSuccessfulRequests: true, // Don't count successful logins
});

// CSRF token middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Check CSRF token for other methods
  const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
  const storedToken = req.session?.csrfToken;

  if (!csrfToken || !storedToken || csrfToken !== storedToken) {
    return res.status(403).json({ error: 'CSRF token validation failed' });
  }

  next();
};

// Generate and set CSRF token for the session
export const setCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.csrfToken) {
    // Generate random token
    req.session.csrfToken = randomBytes(32).toString('hex');
  }
  
  // Add token to res.locals for templates
  res.locals.csrfToken = req.session.csrfToken;
  
  next();
};

// Configure Helmet middleware with all security headers
export const securityHeaders = helmet({
  contentSecurityPolicy,
  crossOriginEmbedderPolicy: false, // Needed for some third-party integrations
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// SQL injection prevention middleware
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  // Check query parameters and body for SQL injection patterns
  const checkSqlInjection = (obj: any): boolean => {
    if (!obj) return false;
    
    const sqlPatterns = [
      /'\s*or\s*'1'\s*=\s*'1/i,
      /'\s*or\s*1\s*=\s*1/i,
      /'\s*or\s*'\d+'\s*=\s*'\d+/i,
      /'\s*;\s*drop\s+table/i,
      /'\s*;\s*select\s+/i,
      /'\s*;\s*insert\s+/i,
      /'\s*;\s*update\s+/i,
      /'\s*;\s*delete\s+/i,
      /'\s*;\s*alter\s+/i,
      /'\s*union\s+select/i,
      /'\s*exec\s*\(/i,
      /'\s*xp_cmdshell/i,
    ];
    
    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return sqlPatterns.some(pattern => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return checkSqlInjection(value);
      }
      return false;
    };
    
    if (Array.isArray(obj)) {
      return obj.some(item => checkValue(item));
    }
    
    return Object.values(obj).some(value => checkValue(value));
  };
  
  if (checkSqlInjection(req.query) || checkSqlInjection(req.body) || checkSqlInjection(req.params)) {
    console.warn(`[Security] SQL injection attempt detected from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Request contains potentially malicious content' });
  }
  
  next();
};

// Consolidated security middleware to apply all protections
export const applySecurityMiddleware = (app: any) => {
  // Enable Helmet security headers
  app.use(securityHeaders);
  
  // Apply rate limiting
  app.use('/api/', apiLimiter);
  app.use('/api/auth/', authLimiter);
  
  // Apply CSRF protection
  app.use(setCsrfToken);
  
  // Apply SQL injection protection
  app.use(sqlInjectionProtection);
  
  // Set security headers for all responses
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Add CSRF token to response headers for client-side access
    res.setHeader('X-CSRF-Token', req.session?.csrfToken || '');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Disable browser caching for sensitive routes
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
    
    next();
  });
  
  console.log('[Security] Enhanced security middleware applied');
};

export const securityMiddleware = {
  applySecurityMiddleware,
  csrfProtection,
  securityHeaders,
  apiLimiter,
  authLimiter,
};