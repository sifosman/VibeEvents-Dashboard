# HowzEventz - Event Planning Platform

## Overview

HowzEventz is a comprehensive event planning platform that connects event hosts with service providers. The platform serves as a marketplace where users can discover vendors, manage event planning tasks, track budgets, and coordinate all aspects of event organization. Built with React, TypeScript, and Express.js, it offers both web and mobile-responsive experiences for planning various types of events including weddings, corporate functions, festivals, and celebrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: Radix UI components with Tailwind CSS for consistent design system
- **Styling**: Tailwind CSS with custom theme configuration and Shadcn/ui component library
- **Authentication**: Context-based authentication with persistent sessions

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Build System**: Vite for frontend bundling and esbuild for backend compilation
- **File Uploads**: Multer middleware for handling image and document uploads
- **Security**: Helmet for security headers, rate limiting, and geo-blocking middleware

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations for database schema versioning
- **Connection Pooling**: Enhanced connection pool configuration for high concurrency workloads
- **Caching**: In-memory caching with NodeCache for API response optimization

### Authentication and Authorization
- **Session Management**: Cookie-based sessions with persistent authentication
- **User Roles**: Role-based access control (user, vendor, admin)
- **Protected Routes**: Client-side route protection with authentication context
- **Password Security**: Secure password hashing and validation

### External Dependencies

#### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management
- **Sharp**: Image processing and optimization for vendor profiles and content

#### Payment Processing
- **Stripe**: Payment gateway integration for subscription billing and one-time payments
- **Stripe React**: Frontend components for secure payment form handling

#### Communication Services
- **Twilio**: WhatsApp Business API integration for vendor notifications
- **SendGrid**: Email service for marketing campaigns and transactional emails
- **SMS Services**: Bulk SMS notifications for event reminders

#### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form management with validation
- **React Helmet**: Dynamic document head management for SEO

#### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **PostCSS**: CSS processing and optimization
- **ESBuild**: Fast JavaScript bundler for production builds

#### Content and Media
- **Cloudinary**: Cloud-based image and video management (referenced in security policies)
- **Google Fonts**: Typography with Montserrat and Playfair Display fonts

#### Security and Monitoring
- **Helmet**: Security middleware for HTTP headers
- **Express Rate Limit**: API rate limiting for DDoS protection
- **Content Security Policy**: XSS protection and secure resource loading
- **CSRF Protection**: Cross-site request forgery prevention