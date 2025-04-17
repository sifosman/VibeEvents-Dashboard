import React, { useEffect, useState } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// List of blocked country codes
const BLOCKED_COUNTRIES = ['IL']; // IL = Israel

/**
 * Component that displays a blocking screen for users from restricted countries
 * This is a client-side fallback in case server-side blocking is bypassed
 */
const GeoBlockedView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is from a blocked country
    const checkLocation = async () => {
      try {
        // Use a free geolocation API to get the user's country
        // This is a fallback to the server-side blocking
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Get the country code
        const countryCode = data.country_code;
        setCountry(countryCode);
        
        // Check if country is in the blocked list
        if (BLOCKED_COUNTRIES.includes(countryCode)) {
          setIsBlocked(true);
          
          // Log the blocked access
          console.log(`[GeoBlock] Access attempted from blocked country: ${countryCode}`);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkLocation();
  }, []);

  // If not blocked, don't render anything
  if (!isBlocked && !loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              {loading ? (
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              ) : (
                <Shield className="h-10 w-10 text-destructive" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {loading ? 'Checking location...' : 'Access Restricted'}
          </CardTitle>
          <CardDescription className="text-center">
            {loading 
              ? 'Please wait while we verify your location.'
              : 'This service is not available in your region.'}
          </CardDescription>
        </CardHeader>
        
        {!loading && (
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Due to regional restrictions, HowzEventz is not available in Israel ({country}).
                If you believe this is an error, please contact customer support.
              </p>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex flex-col space-y-2">
          {!loading && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          )}
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            <span>HowzEventz Security</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeoBlockedView;