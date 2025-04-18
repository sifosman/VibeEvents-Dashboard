import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Vendor } from "@shared/schema";
import { Loader2, Upload, Image, Info, Book, Star, Check, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { SubscriptionBadge } from "@/components/vendors/SubscriptionBadge";

export default function VendorProfileManagement() {
  const { data: vendor, isLoading } = useQuery<Vendor>({
    queryKey: ['/api/vendors/me'],
  });

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic-info");

  // Set up file upload states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [catalogImages, setCatalogImages] = useState<File[]>([]);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // For form inputs
  const [vendorInfo, setVendorInfo] = useState({
    name: "",
    description: "",
    priceRange: "",
    location: "",
    whatsappNumber: "",
    instagramUrl: "",
    websiteUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    isThemed: false,
    themeTypes: [] as string[],
    dietaryOptions: [] as string[],
    cuisineTypes: [] as string[],
    servesAlcohol: true,
  });

  // Load vendor data when it becomes available
  React.useEffect(() => {
    if (vendor) {
      setVendorInfo({
        name: vendor.name || "",
        description: vendor.description || "",
        priceRange: vendor.priceRange || "",
        location: vendor.location || "",
        whatsappNumber: vendor.whatsappNumber || "",
        instagramUrl: vendor.instagramUrl || "",
        websiteUrl: vendor.websiteUrl || "",
        facebookUrl: vendor.facebookUrl || "",
        twitterUrl: vendor.twitterUrl || "",
        youtubeUrl: vendor.youtubeUrl || "",
        isThemed: vendor.isThemed || false,
        themeTypes: vendor.themeTypes || [],
        dietaryOptions: vendor.dietaryOptions || [],
        cuisineTypes: vendor.cuisineTypes || [],
        servesAlcohol: vendor.servesAlcohol !== false, // default to true if undefined
      });
    }
  }, [vendor]);

  // Update basic info mutation
  const updateBasicInfoMutation = useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      const res = await apiRequest("PATCH", "/api/vendors/me", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vendors/me'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload profile image mutation
  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profileImage", file);
      
      const res = await apiRequest("POST", "/api/vendors/me/profile-image", formData, {
        headers: {
          // Don't set Content-Type header, it will be set automatically with boundary
        }
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile image updated",
        description: "Your profile image has been uploaded successfully.",
      });
      setProfileImage(null);
      queryClient.invalidateQueries({ queryKey: ['/api/vendors/me'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload logo image mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logoImage", file);
      
      const res = await apiRequest("POST", "/api/vendors/me/logo", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Logo updated",
        description: "Your logo has been uploaded successfully.",
      });
      setLogoImage(null);
      queryClient.invalidateQueries({ queryKey: ['/api/vendors/me'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload catalog images mutation
  const uploadCatalogMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`catalogImage_${index}`, file);
      });
      
      const res = await apiRequest("POST", "/api/vendors/me/catalog", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Catalog updated",
        description: "Your catalog images have been uploaded successfully.",
      });
      setCatalogImages([]);
      queryClient.invalidateQueries({ queryKey: ['/api/vendors/me'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload additional images mutation
  const uploadAdditionalImagesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`additionalImage_${index}`, file);
      });
      
      const res = await apiRequest("POST", "/api/vendors/me/additional-images", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Images updated",
        description: "Your additional images have been uploaded successfully.",
      });
      setAdditionalImages([]);
      queryClient.invalidateQueries({ queryKey: ['/api/vendors/me'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission for basic info
  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBasicInfoMutation.mutate(vendorInfo);
  };

  // Handle image file selection
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoImage(e.target.files[0]);
    }
  };

  const handleCatalogImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check subscription limits
      const maxPages = getMaxCataloguePages();
      if (filesArray.length > maxPages) {
        toast({
          title: "Subscription limit",
          description: `Your subscription allows a maximum of ${maxPages} catalog pages. Please upgrade to add more.`,
          variant: "destructive",
        });
        return;
      }
      
      setCatalogImages(filesArray);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check subscription limits
      const maxPhotos = getMaxAdditionalPhotos();
      if (filesArray.length > maxPhotos) {
        toast({
          title: "Subscription limit",
          description: `Your subscription allows a maximum of ${maxPhotos} additional photos. Please upgrade to add more.`,
          variant: "destructive",
        });
        return;
      }
      
      setAdditionalImages(filesArray);
    }
  };

  // Helper functions to determine subscription limits
  const getMaxCataloguePages = (): number => {
    if (!vendor) return 0;
    
    switch (vendor.subscriptionTier) {
      case 'free':
        return 5; // Basic tier - 5 pages
      case 'pro':
        return 20; // Pro tier - 20 pages
      case 'premium':
        return 50; // Premium tier - 50 pages
      default:
        return 0;
    }
  };

  const getMaxAdditionalPhotos = (): number => {
    if (!vendor) return 0;
    
    switch (vendor.subscriptionTier) {
      case 'free':
        return 10; // Basic tier - 10 photos
      case 'pro':
        return 30; // Pro tier - 30 photos
      case 'premium':
        return 100; // Premium tier - 100 photos
      default:
        return 0;
    }
  };

  const getMaxWordCount = (): number => {
    if (!vendor) return 0;
    
    switch (vendor.subscriptionTier) {
      case 'free':
        return 300; // Basic tier - 300 words
      case 'pro':
        return 1000; // Pro tier - 1000 words
      case 'premium':
        return 3000; // Premium tier - 3000 words
      default:
        return 0;
    }
  };

  // Upload handlers
  const handleProfileImageUpload = () => {
    if (profileImage) {
      uploadProfileImageMutation.mutate(profileImage);
    }
  };

  const handleLogoUpload = () => {
    if (logoImage) {
      uploadLogoMutation.mutate(logoImage);
    }
  };

  const handleCatalogUpload = () => {
    if (catalogImages.length > 0) {
      uploadCatalogMutation.mutate(catalogImages);
    }
  };

  const handleAdditionalImagesUpload = () => {
    if (additionalImages.length > 0) {
      uploadAdditionalImagesMutation.mutate(additionalImages);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container-custom py-16">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Profile Not Found</CardTitle>
            <CardDescription>
              You need to register as a vendor to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Register as Vendor</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">
          Manage Your Vendor Profile
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            Update your profile information, catalog, and images
          </p>
          <SubscriptionBadge tier={vendor.subscriptionTier} />
        </div>
      </div>

      <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your core business information. This information will be visible to all users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input 
                      id="name" 
                      value={vendorInfo.name} 
                      onChange={(e) => setVendorInfo({...vendorInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Input 
                      id="priceRange" 
                      value={vendorInfo.priceRange} 
                      onChange={(e) => setVendorInfo({...vendorInfo, priceRange: e.target.value})}
                      placeholder="e.g., $100-$500, Budget, Premium"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="description">Business Description</Label>
                    <span className="text-xs text-muted-foreground">
                      Max {getMaxWordCount()} words with your subscription
                    </span>
                  </div>
                  <Textarea 
                    id="description" 
                    value={vendorInfo.description} 
                    onChange={(e) => setVendorInfo({...vendorInfo, description: e.target.value})}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={vendorInfo.location} 
                    onChange={(e) => setVendorInfo({...vendorInfo, location: e.target.value})}
                    placeholder="e.g., Cape Town, South Africa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number (for direct contact)</Label>
                  <Input 
                    id="whatsappNumber" 
                    value={vendorInfo.whatsappNumber} 
                    onChange={(e) => setVendorInfo({...vendorInfo, whatsappNumber: e.target.value})}
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isThemed"
                    checked={vendorInfo.isThemed}
                    onCheckedChange={(checked) => setVendorInfo({...vendorInfo, isThemed: checked})}
                  />
                  <Label htmlFor="isThemed">This is a themed service/venue</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="servesAlcohol"
                    checked={vendorInfo.servesAlcohol}
                    onCheckedChange={(checked) => setVendorInfo({...vendorInfo, servesAlcohol: checked})}
                  />
                  <Label htmlFor="servesAlcohol">Alcohol is served/available</Label>
                </div>

                <Button 
                  type="submit" 
                  className="bg-primary text-white hover:bg-primary/90"
                  disabled={updateBasicInfoMutation.isPending}
                >
                  {updateBasicInfoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Basic Information
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>Catalog</CardTitle>
              <CardDescription>
                Upload your catalog images to showcase your products or services. 
                Your subscription tier allows for up to {getMaxCataloguePages()} catalog pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium text-lg mb-2">Upload Catalog Images</h3>
                  <p className="text-muted-foreground mb-4">
                    {catalogImages.length === 0 
                      ? `Drag and drop files or click to browse. You can upload up to ${getMaxCataloguePages()} images.` 
                      : `Selected ${catalogImages.length} images`}
                  </p>
                  
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="catalog-upload"
                    onChange={handleCatalogImagesChange}
                  />
                  <Label htmlFor="catalog-upload">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => document.getElementById('catalog-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </Label>
                  
                  {catalogImages.length > 0 && (
                    <Button 
                      onClick={handleCatalogUpload}
                      disabled={uploadCatalogMutation.isPending}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      {uploadCatalogMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Upload Catalog Images
                    </Button>
                  )}
                </div>

                {vendor.cataloguePages > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Current Catalog ({vendor.cataloguePages} pages)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* This would show existing catalog pages */}
                      <div className="text-center p-4 bg-neutral rounded-lg">
                        <p className="text-muted-foreground">Catalog display will be implemented based on backend data structure</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-neutral rounded-lg">
                    <p className="text-muted-foreground">No catalog pages uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
                <CardDescription>
                  This is the main image that will be shown on your vendor card.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendor.imageUrl && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                      <img 
                        src={vendor.imageUrl} 
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2 text-sm">
                      {profileImage 
                        ? `Selected: ${profileImage.name}` 
                        : "Choose a new profile image"}
                    </p>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profile-image-upload"
                      onChange={handleProfileImageChange}
                    />
                    <Label htmlFor="profile-image-upload">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => document.getElementById('profile-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </Button>
                    </Label>
                    
                    {profileImage && (
                      <Button 
                        onClick={handleProfileImageUpload}
                        disabled={uploadProfileImageMutation.isPending}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        {uploadProfileImageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
                <CardDescription>
                  Your company logo will be displayed prominently on your profile.
                  {vendor.subscriptionTier === 'free' && " Available for Pro and Premium subscribers only."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendor.logoUrl && (
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border mb-4">
                      <img 
                        src={vendor.logoUrl} 
                        alt={`${vendor.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {vendor.subscriptionTier === 'free' ? (
                      <div className="text-center p-4">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                        <p className="text-muted-foreground mb-2">
                          Logo upload is available for Pro and Premium subscribers only
                        </p>
                        <Button variant="outline">Upgrade Subscription</Button>
                      </div>
                    ) : (
                      <>
                        <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground mb-2 text-sm">
                          {logoImage 
                            ? `Selected: ${logoImage.name}` 
                            : "Choose a company logo"}
                        </p>
                        
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="logo-upload"
                          onChange={handleLogoChange}
                        />
                        <Label htmlFor="logo-upload">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="mr-2"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Select File
                          </Button>
                        </Label>
                        
                        {logoImage && (
                          <Button 
                            onClick={handleLogoUpload}
                            disabled={uploadLogoMutation.isPending}
                            className="bg-primary text-white hover:bg-primary/90"
                          >
                            {uploadLogoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Additional Photos</CardTitle>
                <CardDescription>
                  Add more photos to showcase your business. 
                  Your subscription tier allows for up to {getMaxAdditionalPhotos()} additional photos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium text-lg mb-2">Upload Additional Photos</h3>
                    <p className="text-muted-foreground mb-4">
                      {additionalImages.length === 0 
                        ? `Drag and drop files or click to browse. You can upload up to ${getMaxAdditionalPhotos()} images.` 
                        : `Selected ${additionalImages.length} images`}
                    </p>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="additional-images-upload"
                      onChange={handleAdditionalImagesChange}
                    />
                    <Label htmlFor="additional-images-upload">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => document.getElementById('additional-images-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Files
                      </Button>
                    </Label>
                    
                    {additionalImages.length > 0 && (
                      <Button 
                        onClick={handleAdditionalImagesUpload}
                        disabled={uploadAdditionalImagesMutation.isPending}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        {uploadAdditionalImagesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload Additional Photos
                      </Button>
                    )}
                  </div>

                  {vendor.additionalPhotos && vendor.additionalPhotos.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Current Additional Photos ({vendor.additionalPhotos.length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {vendor.additionalPhotos.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img 
                              src={photo} 
                              alt={`Additional photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-neutral rounded-lg">
                      <p className="text-muted-foreground">No additional photos uploaded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media & External Links</CardTitle>
              <CardDescription>
                Connect your social media accounts and external websites to your vendor profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input 
                      id="websiteUrl" 
                      value={vendorInfo.websiteUrl} 
                      onChange={(e) => setVendorInfo({...vendorInfo, websiteUrl: e.target.value})}
                      placeholder="https://www.yourbusiness.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram</Label>
                    <Input 
                      id="instagramUrl" 
                      value={vendorInfo.instagramUrl} 
                      onChange={(e) => setVendorInfo({...vendorInfo, instagramUrl: e.target.value})}
                      placeholder="https://www.instagram.com/yourbusiness"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook</Label>
                    <Input 
                      id="facebookUrl" 
                      value={vendorInfo.facebookUrl} 
                      onChange={(e) => setVendorInfo({...vendorInfo, facebookUrl: e.target.value})}
                      placeholder="https://www.facebook.com/yourbusiness"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter</Label>
                    <Input 
                      id="twitterUrl" 
                      value={vendorInfo.twitterUrl} 
                      onChange={(e) => setVendorInfo({...vendorInfo, twitterUrl: e.target.value})}
                      placeholder="https://twitter.com/yourbusiness"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube</Label>
                    <Input 
                      id="youtubeUrl" 
                      value={vendorInfo.youtubeUrl} 
                      onChange={(e) => setVendorInfo({...vendorInfo, youtubeUrl: e.target.value})}
                      placeholder="https://www.youtube.com/c/yourbusiness"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-primary text-white hover:bg-primary/90"
                  disabled={updateBasicInfoMutation.isPending}
                >
                  {updateBasicInfoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Social Media Links
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Your current subscription and available features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1 capitalize">{vendor.subscriptionTier} Plan</h3>
                    <p className="text-muted-foreground">
                      {vendor.subscriptionStatus === "active" 
                        ? "Your subscription is active" 
                        : "Your subscription is not active"}
                    </p>
                  </div>
                  
                  {vendor.subscriptionTier !== "premium" && (
                    <Button variant="outline">Upgrade Plan</Button>
                  )}
                </div>

                <Separator />
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Your Features & Limits</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center justify-between">
                      <span>Catalog Pages</span>
                      <span className="font-medium">{vendor.cataloguePages} / {getMaxCataloguePages()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Additional Photos</span>
                      <span className="font-medium">
                        {vendor.additionalPhotos ? vendor.additionalPhotos.length : 0} / {getMaxAdditionalPhotos()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Description Word Count</span>
                      <span className="font-medium">{getMaxWordCount()} words</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Company Logo</span>
                      <span className="font-medium">{vendor.subscriptionTier !== 'free' ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Online Quotes</span>
                      <span className="font-medium">{vendor.onlineQuotes ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Calendar Availability</span>
                      <span className="font-medium">{vendor.calendarView ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Accept Payments</span>
                      <span className="font-medium">{vendor.acceptPayments ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Accept Deposits</span>
                      <span className="font-medium">{vendor.acceptDeposits ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Priority Listing</span>
                      <span className="font-medium">{vendor.priorityListing ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Featured Listing</span>
                      <span className="font-medium">{vendor.featuredListing ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Event Alerts</span>
                      <span className="font-medium">{vendor.eventAlerts ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Lead Notifications</span>
                      <span className="font-medium">{vendor.leadNotifications ? <Check className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}