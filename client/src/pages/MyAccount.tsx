import { 
  User, 
  Calendar, 
  FileText, 
  Shield, 
  CreditCard, 
  LogOut, 
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useState } from "react";

const accountSections = [
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

const profileOptions = [
  {
    id: "free",
    label: "Free",
    href: "/profile/free"
  },
  {
    id: "subscribers", 
    label: "Subscribers",
    href: "/profile/subscribers"
  }
];

export default function MyAccount() {
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  
  const handleLogout = () => {
    // Simple logout functionality
    alert("Logging out...");
    // In a real app, you would clear authentication state here
  };
  
  const toggleProfile = () => {
    setIsProfileExpanded(!isProfileExpanded);
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
              {/* My Profile Section with Expandable Options */}
              <div>
                <button
                  onClick={toggleProfile}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">My Profile</span>
                  </div>
                  {isProfileExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                
                {/* Profile Sub-options */}
                {isProfileExpanded && (
                  <div className="bg-muted/30">
                    {profileOptions.map((option) => (
                      <Link
                        key={option.id}
                        href={option.href}
                        className="flex items-center justify-between py-3 px-4 pl-12 hover:bg-accent transition-colors border-t border-border/50"
                      >
                        <span className="font-medium text-sm">{option.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Other Account Sections */}
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