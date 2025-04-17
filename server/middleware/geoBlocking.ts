import { Request, Response, NextFunction } from 'express';

// List of blocked country codes
const BLOCKED_COUNTRIES = ['IL']; // IL = Israel

// List of blocked IP ranges (example CIDR blocks for Israel)
// These are example ranges and would need to be regularly updated with actual IP ranges
const BLOCKED_IP_RANGES = [
  '31.154.0.0/16',    // Example Israel IP range
  '62.0.0.0/16',      // Example Israel IP range
  '77.124.0.0/14',    // Example Israel IP range
  '79.176.0.0/13',    // Example Israel IP range
  '82.80.0.0/15',     // Example Israel IP range
  '84.108.0.0/16',    // Example Israel IP range
  '89.138.0.0/15',    // Example Israel IP range
  '93.172.0.0/14',    // Example Israel IP range
  '176.12.0.0/16',    // Example Israel IP range
  '193.93.176.0/20',  // Example Israel IP range
  '212.235.0.0/17',   // Example Israel IP range
  '213.57.0.0/16',    // Example Israel IP range
];

/**
 * Check if IP address is within a CIDR range
 * @param ip IP address to check
 * @param cidr CIDR block to check against
 * @returns boolean indicating if IP is in range
 */
const isIpInCidrRange = (ip: string, cidr: string): boolean => {
  const [range, bits = 32] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  
  // Convert IP addresses to integers
  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);
  
  // Check if IP is in range
  return (ipInt & mask) === (rangeInt & mask);
};

/**
 * Convert IP address to integer
 * @param ip IP address
 * @returns integer representation of IP
 */
const ipToInt = (ip: string): number => {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
};

/**
 * Middleware to block requests from specified countries
 */
export const geoBlockingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Get client IP address
  const ip = req.ip || 
            (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
            req.socket.remoteAddress || 
            '';
            
  // Skip for localhost/development
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('::ffff:127.0.0.1')) {
    return next();
  }
  
  // Check against known IP ranges
  const isBlocked = BLOCKED_IP_RANGES.some(range => isIpInCidrRange(ip, range));
  
  // Check country code in headers (if available from a proxy or CDN)
  const countryCode = req.headers['cf-ipcountry'] || req.headers['x-country-code'];
  const isBlockedCountry = countryCode && BLOCKED_COUNTRIES.includes(String(countryCode).toUpperCase());
  
  if (isBlocked || isBlockedCountry) {
    console.log(`[GeoBlocking] Blocked access from ${ip}, country: ${countryCode || 'unknown'}`);
    return res.status(403).json({
      error: 'Access denied',
      message: 'This service is not available in your region',
    });
  }
  
  next();
};

/**
 * Check if a request is coming from a blocked country
 * Useful for client-side checks
 */
export const checkIfBlocked = (req: Request): boolean => {
  // Get client IP address
  const ip = req.ip || 
            (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
            req.socket.remoteAddress || 
            '';
            
  // Skip for localhost/development
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('::ffff:127.0.0.1')) {
    return false;
  }
  
  // Check against known IP ranges
  const isBlocked = BLOCKED_IP_RANGES.some(range => isIpInCidrRange(ip, range));
  
  // Check country code in headers (if available from a proxy or CDN)
  const countryCode = req.headers['cf-ipcountry'] || req.headers['x-country-code'];
  const isBlockedCountry = countryCode && BLOCKED_COUNTRIES.includes(String(countryCode).toUpperCase());
  
  return isBlocked || isBlockedCountry;
};