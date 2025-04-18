import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import VendorListing from "./pages/VendorListing";
import VendorDetail from "./pages/VendorDetail";
import PlannerDashboard from "./pages/PlannerDashboard";
import LikedItems from "./pages/LikedItems";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GiftRegistry from "./pages/GiftRegistry";
import ProfileCustomization from "./pages/ProfileCustomization";
import VendorTracking from "./pages/VendorTracking";
import VendorProfileManagement from "./pages/VendorProfileManagement";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { useAuth } from "./context/AuthContext";

// Protected route component
function ProtectedRoute({ component: Component, redirectTo = "/login" }: { component: React.ComponentType, redirectTo?: string }) {
  try {
    // Try to use auth context
    const { user, isLoading } = useAuth();
    const [, setLocation] = useLocation();
    
    // While auth is loading, show loading spinner
    if (isLoading) {
      return (
        <div className="h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    // Redirect to login if not authenticated
    if (!user) {
      setLocation(redirectTo);
      return null;
    }
    
    // If authenticated, render the component
    return <Component />;
  } catch (error) {
    console.error("Auth error in ProtectedRoute:", error);
    // Fallback to login
    const [, setLocation] = useLocation();
    setLocation(redirectTo);
    return null;
  }
};

// Router component with enhanced auth checks
function AppRouter() {
  try {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vendors" component={VendorListing} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Protected routes with auto-redirect */}
        <Route path="/likes">
          <ProtectedRoute component={LikedItems} />
        </Route>
        <Route path="/planner">
          <ProtectedRoute component={PlannerDashboard} />
        </Route>
        <Route path="/gift-registry" component={GiftRegistry} />
        <Route path="/profile/customize">
          <ProtectedRoute component={ProfileCustomization} />
        </Route>
        <Route path="/vendors/tracking">
          <ProtectedRoute component={VendorTracking} />
        </Route>
        <Route path="/vendor/profile" component={VendorProfileManagement} />
        
        <Route component={NotFound} />
      </Switch>
    );
  } catch (error) {
    // Fallback router with no auth-dependent routes
    console.error("Router error:", error);
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vendors" component={VendorListing} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/likes" component={Login} />
        <Route path="/planner" component={Login} />
        <Route path="/gift-registry" component={GiftRegistry} />
        <Route path="/profile/customize" component={Login} />
        <Route path="/vendor/profile" component={Login} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

// Import components
import GeoBlockedView from "./components/shared/GeoBlockedView";
import { NavigationProvider } from "./context/NavigationContext";
import NavigationControls from "./components/navigation/NavigationControls";
import { ScrollRestoration } from "./components/ui/scroll-restoration";

function App() {
  return (
    <NavigationProvider>
      <div className="flex flex-col min-h-screen">
        {/* Add geo-blocking overlay that will only display for blocked countries */}
        <GeoBlockedView />
        <Header />
        <main className="flex-grow">
          <AppRouter />
          {/* Floating back/history navigation */}
          <NavigationControls mode="floating" position="bottom-left" />
        </main>
        <Footer />
        <Toaster />
        {/* Automatically scroll to top on page transitions */}
        <ScrollRestoration />
      </div>
    </NavigationProvider>
  );
}

export default App;
