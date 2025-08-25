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

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" onClick={handleProfilePictureUpload}>
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Picture
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                Social Media
              </CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input 
                  id="instagram"
                  value={profileData.instagramUrl}
                  onChange={(e) => setProfileData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Label>
                <Input 
                  id="facebook"
                  value={profileData.facebookUrl}
                  onChange={(e) => setProfileData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Label>
                <Input 
                  id="twitter"
                  value={profileData.twitterUrl}
                  onChange={(e) => setProfileData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                <Input 
                  id="website"
                  value={profileData.websiteUrl}
                  onChange={(e) => setProfileData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword"
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <Button variant="outline" onClick={handlePasswordChange} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Save Profile Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSaveProfile}
              size="lg"
              className="min-w-48"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}