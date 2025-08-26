import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/layout/Header";
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
import VenueSearch from "./pages/VenueSearch";
import VendorSearch from "./pages/VendorSearch";
import ServiceProviderSearch from "./pages/ServiceProviderSearch";
import MyAccount from "./pages/MyAccount";
import VendorRegistration from "./pages/vendor-registration";
import VendorRegistrationForm from "./pages/VendorRegistration";
import VenueRegistration from "./pages/VenueRegistration";
import Subscription from "./pages/Subscription";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import VendorReview from "./pages/VendorReview";
import Support from "./pages/Support";
import VendorDashboard from "./pages/VendorDashboard";
import BrowserProfile from "./pages/BrowserProfile";
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
      <Route path="/vendors/:id/review" component={VendorReview} />
      <Route path="/ServiceCategories" component={ServiceCategories} />
      <Route path="/BrowseByCategory" component={BrowseByCategory} />
      <Route path="/venue-search/:categoryId">
        {params => <VenueSearch categoryId={parseInt(params.categoryId)} />}
      </Route>
      <Route path="/vendor-search/:categoryId">
        {params => <VendorSearch categoryId={parseInt(params.categoryId)} />}
      </Route>
      <Route path="/service-provider-search/:categoryId">
        {params => <ServiceProviderSearch categoryId={parseInt(params.categoryId)} />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/vendor-registration" component={VendorRegistrationForm} />
      <Route path="/venue-registration" component={VenueRegistration} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/profile/free" component={BrowserProfile} />
      <Route path="/support" component={Support} />
      <Route path="/vendor-dashboard" component={VendorDashboard} />
      <Route path="/gift-registry" component={GiftRegistry} />
      <Route path="/LikedItems" component={LikedItems} />
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
        <BottomNav />
        <Toaster />
        {/* Automatically scroll to top on page transitions */}
        <ScrollRestoration />
      </div>
    </NavigationProvider>
  );
}

export default App;
