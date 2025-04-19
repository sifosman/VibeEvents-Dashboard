import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Lock, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Star, 
  ChevronRight 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const accountSections = [
  {
    id: "profile",
    label: "Profile",
    icon: <User className="h-5 w-5 mr-2" />,
    href: "/profile",
    description: "View and update your personal information"
  },
  {
    id: "password",
    label: "Password",
    icon: <Lock className="h-5 w-5 mr-2" />,
    href: "/profile/password",
    description: "Change your password and security settings"
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5 mr-2" />,
    href: "/profile/settings",
    description: "Manage your preferences and notification settings"
  },
  {
    id: "faqs",
    label: "FAQs",
    icon: <HelpCircle className="h-5 w-5 mr-2" />,
    href: "/help/faqs",
    description: "Get answers to frequently asked questions"
  },
  {
    id: "reviews",
    label: "Ratings & Reviews",
    icon: <Star className="h-5 w-5 mr-2" />,
    href: "/profile/reviews",
    description: "Manage your ratings and reviews of vendors"
  }
];

export default function MyAccount() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Account | HowzEventz</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar on larger screens */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-background rounded-lg border p-4 shadow-sm sticky top-24">
              <div className="flex flex-col space-y-1">
                <div className="mb-4 pb-4 border-b">
                  <div className="font-semibold text-lg">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>

                {accountSections.map((section) => (
                  <Link 
                    key={section.id} 
                    href={section.href}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      activeTab === section.id 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setActiveTab(section.id)}
                  >
                    {section.icon}
                    {section.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-md text-destructive hover:bg-destructive/10 transition-colors mt-4"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-9">
            {/* Mobile account navigation tabs */}
            <div className="block lg:hidden mb-6">
              <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full overflow-auto">
                  {accountSections.map((section) => (
                    <TabsTrigger key={section.id} value={section.id} className="flex-1">
                      {section.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {accountSections.map((section) => (
                  <TabsContent key={section.id} value={section.id}>
                    <div className="text-center py-4">
                      <div className="flex justify-center mb-2">
                        {section.icon}
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{section.label}</h2>
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                      <Link href={section.href}>
                        <Button>
                          Go to {section.label} <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 border-t pt-4">
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>

            {/* Account section cards - visible on all screen sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className="block"
                >
                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-background">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-primary">
                        {section.icon}
                        <h3 className="font-semibold text-lg">{section.label}</h3>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">{section.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}