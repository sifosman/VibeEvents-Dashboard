import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// SCALING OPTIMIZATION: Enhanced connection pool configuration for high traffic
// This configuration optimizes the database connection pool for high concurrency
// workloads, improving the app's ability to handle multiple simultaneous connections
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool (adjust based on server capacity)
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection to become available
  
  // Additional connection handling strategy
  retryStrategy: (err, count) => {
    console.log(`Connection retry attempt ${count}, error: ${err.message}`);
    // Exponential backoff with jitter to prevent thundering herd
    const delay = Math.min(
      Math.floor(Math.random() * 100) + Math.pow(2, count) * 50,
      2000
    );
    return delay;
  }
});

// Initialize Drizzle with the optimized pool
export const db = drizzle(pool, { schema });

// Health monitoring for connection pool
const monitorPoolHealth = () => {
  const stats = {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
  
  console.log(`[DB Pool Health] ${JSON.stringify(stats)}`);
  
  // Alert if waiting count is high
  if (stats.waitingCount > 5) {
    console.warn(`[DB Pool Warning] High waiting count: ${stats.waitingCount}`);
  }
};

// Check pool health every 60 seconds
setInterval(monitorPoolHealth, 60000);