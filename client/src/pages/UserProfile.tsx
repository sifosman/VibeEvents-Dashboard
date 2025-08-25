import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Camera,
  Lock,
  Save,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Globe
} from "lucide-react";

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  // Social Media
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  // Password
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserProfile() {
  const [profileData, setProfileData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    alert("Profile saved successfully!");
  };

  const handlePasswordChange = () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    console.log("Changing password");
    alert("Password changed successfully!");
    setProfileData(prev => ({ 
      ...prev, 
      currentPassword: "", 
      newPassword: "", 
      confirmPassword: "" 
    }));
  };

  const handleProfilePictureUpload = () => {
    // In a real app, this would open a file picker
    alert("Profile picture upload functionality would be implemented here");
  };

  return (
    <>
      <Helmet>
        <title>My Profile - HowzEventz</title>
        <meta name="description" content="Manage your personal profile and account settings" />
      </Helmet>

      <div className="container mx-auto py-4 px-4">
        <h1 className="text-2xl font-display font-bold mb-6">My Profile</h1>

        <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg border">
          {/* Profile Picture Section */}
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Camera className="h-5 w-5" />
              Profile Picture
            </h2>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleProfilePictureUpload}>
                <Camera className="h-4 w-4 mr-2" />
                Upload Picture
              </Button>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <User className="h-5 w-5" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input 
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Phone className="h-5 w-5" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input 
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Instagram className="h-5 w-5" />
              Social Media
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-1 text-sm">
                    <Instagram className="h-3 w-3" />
                    Instagram
                  </Label>
                  <Input 
                    id="instagram"
                    value={profileData.instagramUrl}
                    onChange={(e) => setProfileData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="instagram.com/username"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook" className="flex items-center gap-1 text-sm">
                    <Facebook className="h-3 w-3" />
                    Facebook
                  </Label>
                  <Input 
                    id="facebook"
                    value={profileData.facebookUrl}
                    onChange={(e) => setProfileData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                    placeholder="facebook.com/username"
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="twitter" className="flex items-center gap-1 text-sm">
                    <Twitter className="h-3 w-3" />
                    Twitter
                  </Label>
                  <Input 
                    id="twitter"
                    value={profileData.twitterUrl}
                    onChange={(e) => setProfileData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    placeholder="twitter.com/username"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="flex items-center gap-1 text-sm">
                    <Globe className="h-3 w-3" />
                    Website
                  </Label>
                  <Input 
                    id="website"
                    value={profileData.websiteUrl}
                    onChange={(e) => setProfileData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="yourwebsite.com"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Lock className="h-5 w-5" />
              Change Password
            </h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="currentPassword" className="text-sm">Current Password</Label>
                <Input 
                  id="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                  <Input 
                    id="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handlePasswordChange} className="flex-1 h-9">
              <Lock className="h-3 w-3 mr-2" />
              Change Password
            </Button>
            <Button 
              onClick={handleSaveProfile}
              className="flex-1 h-9"
            >
              <Save className="mr-2 h-3 w-3" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}