import { 
  User, 
  Calendar, 
  FileText, 
  Shield, 
  CreditCard, 
  LogOut, 
  ChevronRight 
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

const accountSections = [
  {
    id: "profile",
    label: "My Profile",
    icon: <User className="h-5 w-5" />,
    href: "/profile"
  },
  {
    id: "planner",
    label: "My Planner",
    icon: <Calendar className="h-5 w-5" />,
    href: "/planner"
  },
  {
    id: "quotes",
    label: "My Quotes",
    icon: <FileText className="h-5 w-5" />,
    href: "/planner/quotes"
  },
  {
    id: "terms",
    label: "Vibeventz Terms and Policies",
    icon: <Shield className="h-5 w-5" />,
    href: "/terms-and-policies"
  },
  {
    id: "subscription",
    label: "My Subscription",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/subscription"
  }
];

export default function MyAccount() {
  const handleLogout = () => {
    // Simple logout functionality
    alert("Logging out...");
    // In a real app, you would clear authentication state here
  };

  return (
    <>
      <Helmet>
        <title>My Account | Vibeventz</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

        <div className="max-w-md mx-auto">
          <div className="bg-background rounded-lg border shadow-sm">
            {/* Account menu options */}
            <div className="divide-y divide-border">
              {accountSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">
                      {section.icon}
                    </div>
                    <span className="font-medium">{section.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
              
              {/* Logout option */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors text-destructive"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}