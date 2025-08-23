import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import VendorListing from "./pages/VendorListing";
import VendorDetail from "./pages/VendorDetail";
import PlannerDashboard from "./pages/PlannerDashboard";
import MyPlanningPage from "./pages/MyPlanningPage";
import EventsDiary from "./pages/EventsDiary";
import QuotesPage from "./pages/QuotesPage";
import BookingConfirmations from "./pages/BookingConfirmations";
import BudgetTracker from "./pages/BudgetTracker";
import LikedItems from "./pages/LikedItems";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GiftRegistry from "./pages/GiftRegistry";
import ProfileCustomization from "./pages/ProfileCustomization";
import VendorTracking from "./pages/VendorTracking";
import VendorProfileManagement from "./pages/VendorProfileManagement";
import ServiceCategories from "./pages/ServiceCategories";
import BrowseByCategory from "./pages/BrowseByCategory";
import MyAccount from "./pages/MyAccount";
import VendorRegistration from "./pages/vendor-registration";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
// import { useAuth } from "./context/AuthContext";

// Protected route component - simplified for now
function ProtectedRoute({ component: Component, redirectTo = "/login" }: { component: React.ComponentType, redirectTo?: string }) {
  // For now, just render the component without auth checks
  return <Component />;
};

// Router component with enhanced auth checks
function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vendors" component={VendorListing} />
      <Route path="/vendors/:id" component={VendorDetail} />
      <Route path="/ServiceCategories" component={ServiceCategories} />
      <Route path="/BrowseByCategory" component={BrowseByCategory} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/vendor-registration" component={VendorRegistration} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/gift-registry" component={GiftRegistry} />
      <Route path="/likes" component={LikedItems} />
      <Route path="/planner" component={MyPlanningPage} />
      <Route path="/profile/customize" component={ProfileCustomization} />
      <Route path="/vendors/tracking" component={VendorTracking} />
      <Route path="/vendor/profile" component={VendorProfileManagement} />
      <Route path="/account" component={MyAccount} />
      <Route path="/planner/events-diary" component={EventsDiary} />
      <Route path="/planner/quotes" component={QuotesPage} />
      <Route path="/planner/bookings" component={BookingConfirmations} />
      <Route path="/planner/budget" component={BudgetTracker} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Import components
import GeoBlockedView from "./components/shared/GeoBlockedView";
import { NavigationProvider } from "./context/NavigationContext";
import NavigationControls from "./components/navigation/NavigationControls";
import { ScrollRestoration } from "./components/ui/scroll-restoration";
import { BottomNav } from "./components/layout/BottomNav";

function App() {
  return (
    <NavigationProvider>
      <div className="flex flex-col min-h-screen">
        {/* Add geo-blocking overlay that will only display for blocked countries */}
        <GeoBlockedView />
        <Header />
        <main className="flex-grow pb-16 md:pb-0">
          <AppRouter />
          {/* Floating back/history navigation - adjusted to avoid bottom nav on mobile */}
          <NavigationControls mode="floating" position="top-left" />
        </main>
        <Footer />
        <BottomNav />
        <Toaster />
        {/* Automatically scroll to top on page transitions */}
        <ScrollRestoration />
      </div>
    </NavigationProvider>
  );
}

export default App;
