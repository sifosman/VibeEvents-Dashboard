import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Fallback version that doesn't depend on auth
function SimpleCallToAction() {
  return (
    <section className="py-16 bg-primary bg-opacity-10">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Start Planning Your Perfect Event?</h2>
          <p className="text-muted-foreground mb-8">Join thousands who've found their perfect event vendors and planned their special occasions with ease.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button className="px-8 py-3 h-auto bg-primary text-white rounded-lg hover:bg-primary/90 font-medium w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link href="/vendors">
              <Button 
                variant="outline" 
                className="px-8 py-3 h-auto border-primary text-primary rounded-lg hover:bg-accent hover:bg-opacity-50 transition font-medium w-full sm:w-auto"
              >
                Browse Vendors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CallToAction() {
  try {
    // Try to use auth context
    const { useAuth } = require("@/context/AuthContext");
    const { isAuthenticated } = useAuth();

    return (
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Start Planning Your Perfect Event?</h2>
            <p className="text-muted-foreground mb-8">Join thousands who've found their perfect event vendors and planned their special occasions with ease.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/planner">
                    <Button className="px-8 py-3 h-auto bg-primary text-white rounded-lg hover:bg-primary/90 font-medium w-full sm:w-auto">
                      Go to Planner
                    </Button>
                  </Link>
                  <Link href="/vendors">
                    <Button 
                      variant="outline" 
                      className="px-8 py-3 h-auto border-primary text-primary rounded-lg hover:bg-accent hover:bg-opacity-50 transition font-medium w-full sm:w-auto"
                    >
                      Browse Vendors
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button className="px-8 py-3 h-auto bg-primary text-white rounded-lg hover:bg-primary/90 font-medium w-full sm:w-auto">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/vendors">
                    <Button 
                      variant="outline" 
                      className="px-8 py-3 h-auto border-primary text-primary rounded-lg hover:bg-accent hover:bg-opacity-50 transition font-medium w-full sm:w-auto"
                    >
                      Browse Vendors
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    // Fall back to simpler version if auth context is not available
    return <SimpleCallToAction />;
  }
}
