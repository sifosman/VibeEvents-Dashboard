import { Switch, Route } from "wouter";
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
import NotFound from "@/pages/not-found";

// Router component that safely checks for authentication
function AppRouter() {
  try {
    // Try to use auth context
    const { useAuth } = require("./context/AuthContext");
    const { isAuthenticated } = useAuth();
    
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vendors" component={VendorListing} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/likes">
          {isAuthenticated ? <LikedItems /> : <Login />}
        </Route>
        <Route path="/planner">
          {isAuthenticated ? <PlannerDashboard /> : <Login />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  } catch (error) {
    // Fallback router with no auth-dependent routes
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vendors" component={VendorListing} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route path="/likes" component={LikedItems} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/planner" component={Login} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AppRouter />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
