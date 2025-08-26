import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, UserPlus, Upload, MessageSquare, MapPin, FileImage, Video, BookOpen, Edit3, Trash2, Plus, Globe, Facebook, Instagram } from "lucide-react";

export default function VendorRegistration() {
  const [, setLocation] = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploadedCatalogues, setUploadedCatalogues] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    businessRegistrationNumber: "",
    businessAddress: "",
    province: "",
    city: "",
    specificTown: "",
    willingToTravel: "",
    areasCanServe: "",
    serviceCategory: "",
    businessBio: "",
    portfolio: "",
    website: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    availability: [],
    termsAccepted: false
  });
  
  // Check if accessed from profile (edit mode)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.get('edit') === 'true';
    setIsEditMode(editMode);
    
    if (editMode) {
      // Load existing vendor data (mock data for now)
      setFormData({
        businessName: "Elegant Events Co.",
        contactPerson: "John Smith",
        email: "john@elegantevents.com",
        phone: "+27 11 123 4567",
        whatsappNumber: "+27 11 123 4567",
        businessRegistrationNumber: "2019/123456/07",
        businessAddress: "123 Business Street, Sandton, Johannesburg",
        province: "Gauteng",
        city: "Johannesburg",
        specificTown: "Sandton",
        willingToTravel: "yes",
        areasCanServe: "province",
        serviceCategory: "Wedding Planning",
        businessBio: "We provide exceptional event planning services with over 10 years of experience in creating memorable celebrations.",
        portfolio: "https://elegantevents.com",
        website: "https://elegantevents.com",
        facebookUrl: "https://facebook.com/elegantevents",
        instagramUrl: "https://instagram.com/elegantevents",
        tiktokUrl: "https://tiktok.com/@elegantevents",
        availability: [],
        termsAccepted: true
      });
      
      // Load existing media (mock data)
      setUploadedImages(["wedding1.jpg", "event2.jpg", "decoration3.jpg"]);
      setUploadedVideos(["portfolio_video.mp4"]);
      setUploadedCatalogues(["services_brochure.pdf"]);
    }
  }, []);

  const serviceCategories = [
    "Catering & Food Services",
    "Photography & Videography", 
    "Entertainment & Music",
    "Flowers & Decorations",
    "Wedding Planning",
    "Beauty & Styling",
    "Transportation",
    "Audio Visual & Lighting",
    "Security Services",
    "Cleaning Services"
  ];

  const provinces = [
    "Western Cape",
    "Eastern Cape",
    "Northern Cape",
    "Free State",
    "KwaZulu-Natal",
    "North West",
    "Gauteng",
    "Mpumalanga",
    "Limpopo"
  ];

  const citiesByProvince: { [key: string]: string[] } = {
    "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "George", "Mossel Bay"],
    "Eastern Cape": ["Port Elizabeth", "East London", "Uitenhage", "Grahamstown", "King William's Town"],
    "Northern Cape": ["Kimberley", "Upington", "Kuruman", "Springbok", "De Aar"],
    "Free State": ["Bloemfontein", "Welkom", "Kroonstad", "Bethlehem", "Sasolburg"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Newcastle", "Richards Bay", "Ladysmith"],
    "North West": ["Mahikeng", "Klerksdorp", "Rustenburg", "Potchefstroom", "Vryburg"],
    "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Vanderbijlpark", "Kempton Park"],
    "Mpumalanga": ["Nelspruit", "Witbank", "Middelburg", "Secunda", "Standerton"],
    "Limpopo": ["Polokwane", "Tzaneen", "Phalaborwa", "Musina", "Thohoyandou"]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isEditMode ? "Vendor profile update:" : "Vendor registration:", formData);
    if (isEditMode) {
      alert("Profile updated successfully!");
    } else {
      alert("Registration submitted successfully! We'll review your application and get back to you within 2-3 business days.");
    }
  };
  
  const handleImageDelete = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleVideoDelete = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCatalogueDelete = (index: number) => {
    setUploadedCatalogues(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleMediaUpload = (type: 'images' | 'videos' | 'catalogues') => {
    // Mock file upload - in real app this would handle actual file upload
    const newFile = prompt(`Enter ${type.slice(0, -1)} name:`);
    if (newFile) {
      if (type === 'images') {
        setUploadedImages(prev => [...prev, newFile]);
      } else if (type === 'videos') {
        setUploadedVideos(prev => [...prev, newFile]);
      } else {
        setUploadedCatalogues(prev => [...prev, newFile]);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Vendor Registration | Vibeventz</title>
        <meta name="description" content="Register as a service provider on Vibeventz" />
      </Helmet>

      <div className="container mx-auto py-4 px-4 max-w-3xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setLocation(isEditMode ? "/my-account" : "/subscription")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to {isEditMode ? "My Account" : "Subscription"}
          </Button>

          <div>
            <h1 className="text-2xl font-display font-bold flex items-center">
              {isEditMode ? <Edit3 className="h-6 w-6 mr-2 text-primary" /> : <UserPlus className="h-6 w-6 mr-2 text-primary" />}
              {isEditMode ? "Edit Vendor Profile" : "Vendor Registration"}
            </h1>
            <p className="text-muted-foreground mt-1">{isEditMode ? "Update your business information and media" : "Join our network of trusted service providers"}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Update Business Information" : "Business Information"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Your business name"
                    required
                    disabled={isEditMode}
                    className={isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                  />
                  {isEditMode && <p className="text-xs text-muted-foreground mt-1">Business name cannot be changed</p>}
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="Primary contact name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                    disabled={isEditMode}
                    className={isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                  />
                  {isEditMode && <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed</p>}
                </div>
                <div>
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                  <Input
                    id="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData({...formData, businessRegistrationNumber: e.target.value})}
                    placeholder="e.g., 2019/123456/07"
                    disabled={isEditMode}
                    className={isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                  />
                  {isEditMode && <p className="text-xs text-muted-foreground mt-1">Registration number cannot be changed</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <div className="relative">
                    <MessageSquare className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                      placeholder="+27 XX XXX XXXX"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="businessAddress">Business Address *</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                  placeholder="Your complete business address"
                  required
                  disabled={isEditMode}
                  className={isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                />
                {isEditMode && <p className="text-xs text-muted-foreground mt-1">Business address cannot be changed</p>}
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, province: value, city: ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select 
                    onValueChange={(value) => setFormData({...formData, city: value})}
                    disabled={!formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.province && citiesByProvince[formData.province]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specificTown">Specific Town/Area</Label>
                  <div className="relative">
                    <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="specificTown"
                      value={formData.specificTown}
                      onChange={(e) => setFormData({...formData, specificTown: e.target.value})}
                      placeholder="Suburb or area"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Travel & Service Areas */}
              <div className="space-y-4">
                <div>
                  <Label>Willing to Travel? *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="willingToTravel"
                        value="yes"
                        checked={formData.willingToTravel === "yes"}
                        onChange={(e) => setFormData({...formData, willingToTravel: e.target.value})}
                        className="text-primary"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="willingToTravel"
                        value="no"
                        checked={formData.willingToTravel === "no"}
                        onChange={(e) => setFormData({...formData, willingToTravel: e.target.value})}
                        className="text-primary"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="areasCanServe">How far are you willing to travel?</Label>
                  <Select onValueChange={(value) => setFormData({...formData, areasCanServe: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your service coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nationally">Nationally</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="major-cities-only">Major cities only</SelectItem>
                      <SelectItem value="province">Province</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Details */}
              <div>
                <Label htmlFor="serviceCategory">Service Category *</Label>
                <Select onValueChange={(value) => setFormData({...formData, serviceCategory: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessBio">Tell us about your business/bio (200 words max)</Label>
                <Textarea
                  id="businessBio"
                  value={formData.businessBio}
                  onChange={(e) => {
                    const words = e.target.value.split(' ').filter(word => word.length > 0);
                    if (words.length <= 200) {
                      setFormData({...formData, businessBio: e.target.value});
                    }
                  }}
                  placeholder="Share your story, experience, and what makes your business unique..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.businessBio.split(' ').filter(word => word.length > 0).length}/200 words
                </p>
              </div>


              <div>
                <Label htmlFor="portfolio">Portfolio Link</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                  placeholder="Link to your portfolio or previous work"
                />
              </div>

              {/* Social Media & Online Presence */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Media & Online Presence</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website Address</Label>
                    <div className="relative">
                      <Globe className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="facebookUrl">Facebook Page</Label>
                    <div className="relative">
                      <Facebook className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                        placeholder="https://facebook.com/yourpage"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagramUrl">Instagram Profile</Label>
                    <div className="relative">
                      <Instagram className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="instagramUrl"
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                        placeholder="https://instagram.com/yourprofile"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tiktokUrl">TikTok Profile</Label>
                    <div className="relative">
                      <MessageSquare className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="tiktokUrl"
                        value={formData.tiktokUrl}
                        onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})}
                        placeholder="https://tiktok.com/@yourprofile"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pictures Upload */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <FileImage className="h-4 w-4" />
                    Pictures Album
                  </Label>
                  
                  {/* Existing Images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{image}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleImageDelete(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileImage className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-2">
                      {uploadedImages.length > 0 ? "Add more photos" : "Upload your work photos"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMediaUpload('images')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Images
                    </Button>
                  </div>
                </div>

                {/* Videos Upload */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4" />
                    Video Portfolio
                  </Label>
                  
                  {/* Existing Videos */}
                  {uploadedVideos.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {uploadedVideos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{video}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleVideoDelete(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Video className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-2">
                      {uploadedVideos.length > 0 ? "Add more videos" : "Upload demo videos"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMediaUpload('videos')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Videos
                    </Button>
                  </div>
                </div>

                {/* Catalogue Upload */}
                <div>
                  {!isEditMode && (
                    <div className="mb-4">
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Download Catalogue Template
                      </Button>
                    </div>
                  )}
                  <Label className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4" />
                    Service Catalogues
                  </Label>
                  
                  {/* Existing Catalogues */}
                  {uploadedCatalogues.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {uploadedCatalogues.map((catalogue, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{catalogue}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleCatalogueDelete(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-2">
                      {uploadedCatalogues.length > 0 ? "Add more catalogues" : "Upload service brochure"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMediaUpload('catalogues')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Files
                    </Button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked as boolean})}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and vendor policies
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!formData.termsAccepted}
              >
                {isEditMode ? "Save Changes" : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}