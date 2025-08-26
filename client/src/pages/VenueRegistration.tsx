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
import { ChevronLeft, Building, Upload, Users, MessageSquare, MapPin, FileImage, Video, BookOpen, Edit3, Trash2, Plus, Globe, Facebook, Instagram } from "lucide-react";

export default function VenueRegistration() {
  const [, setLocation] = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploadedCatalogues, setUploadedCatalogues] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    venueName: "",
    contactPerson: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    businessRegistrationNumber: "",
    venueAddress: "",
    province: "",
    city: "",
    specificTown: "",
    willingToTravel: "",
    areasCanServe: "",
    venueType: "",
    businessBio: "",
    capacity: "",
    amenities: [] as string[],
    pricing: "",
    availability: "",
    website: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    termsAccepted: false
  });
  
  // Check if accessed from profile (edit mode)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.get('edit') === 'true';
    setIsEditMode(editMode);
    
    if (editMode) {
      // Load existing venue data (mock data for now)
      setFormData({
        venueName: "Grand Ballroom Venue",
        contactPerson: "Sarah Johnson",
        email: "sarah@grandballroom.com",
        phone: "+27 21 555 0123",
        whatsappNumber: "+27 21 555 0123",
        businessRegistrationNumber: "2018/987654/07",
        venueAddress: "456 Venue Street, Cape Town City Centre",
        province: "Western Cape",
        city: "Cape Town",
        specificTown: "City Centre",
        willingToTravel: "no",
        areasCanServe: "local",
        venueType: "Banquet Hall",
        businessBio: "Elegant venue in the heart of Cape Town, perfect for weddings and corporate events with stunning city views.",
        capacity: "150-300 guests",
        amenities: ["Parking Available", "Catering Kitchen", "Audio Visual Equipment", "Air Conditioning"],
        pricing: "",
        availability: "Available year-round, booking required 3 months in advance",
        website: "https://grandballroom.com",
        facebookUrl: "https://facebook.com/grandballroom",
        instagramUrl: "https://instagram.com/grandballroom",
        tiktokUrl: "https://tiktok.com/@grandballroom",
        termsAccepted: true
      });
      
      // Load existing media (mock data)
      setUploadedImages(["ballroom_main.jpg", "ceremony_space.jpg", "reception_area.jpg"]);
      setUploadedVideos(["venue_tour.mp4"]);
      setUploadedCatalogues(["venue_packages.pdf", "catering_menu.pdf"]);
    }
  }, []);

  const venueTypes = [
    "Wedding Venue",
    "Conference Centre", 
    "Banquet Hall",
    "Garden Venue",
    "Beach Venue",
    "Hotel/Resort",
    "Restaurant",
    "Community Centre",
    "Farm Venue",
    "Historic Building"
  ];

  const amenitiesList = [
    "Parking Available",
    "Catering Kitchen",
    "Audio Visual Equipment",
    "Wheelchair Accessible",
    "Air Conditioning",
    "Outdoor Space",
    "Bridal Suite",
    "Dance Floor",
    "Bar Facilities",
    "Accommodation"
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
    console.log(isEditMode ? "Venue profile update:" : "Venue registration:", formData);
    if (isEditMode) {
      alert("Profile updated successfully!");
    } else {
      alert("Registration submitted successfully! We'll review your venue application and get back to you within 2-3 business days.");
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

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity)
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Venue Registration | Vibeventz</title>
        <meta name="description" content="Register your venue on Vibeventz" />
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
              {isEditMode ? <Edit3 className="h-6 w-6 mr-2 text-primary" /> : <Building className="h-6 w-6 mr-2 text-primary" />}
              {isEditMode ? "Edit Venue Profile" : "Venue Registration"}
            </h1>
            <p className="text-muted-foreground mt-1">{isEditMode ? "Update your venue information and media" : "List your venue for special events and celebrations"}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Update Venue Information" : "Venue Information"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venueName">Venue Name *</Label>
                  <Input
                    id="venueName"
                    value={formData.venueName}
                    onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                    placeholder="Your venue name"
                    required
                    disabled={isEditMode}
                    className={isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                  />
                  {isEditMode && <p className="text-xs text-muted-foreground mt-1">Venue name cannot be changed</p>}
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="Manager or owner name"
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
                    placeholder="venue@email.com"
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
                <Label htmlFor="venueAddress">Venue Address *</Label>
                <Textarea
                  id="venueAddress"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({...formData, venueAddress: e.target.value})}
                  placeholder="Complete venue address with directions if needed"
                  required
                  disabled={isEditMode}
                  className={isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                />
                {isEditMode && <p className="text-xs text-muted-foreground mt-1">Venue address cannot be changed</p>}
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

              {/* Venue Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venueType">Venue Type *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, venueType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {venueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Guest Capacity *</Label>
                  <div className="relative">
                    <Users className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="capacity"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      placeholder="e.g., 100-200 guests"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
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
                  placeholder="Share your story, experience, and what makes your venue special..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.businessBio.split(' ').filter(word => word.length > 0).length}/200 words
                </p>
              </div>


              {/* Travel & Service Areas */}
              <div className="space-y-4">
                <div>
                  <Label>Willing to Host Events Outside Your Venue? *</Label>
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

              {/* Amenities */}
              <div>
                <Label>Available Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
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
                        placeholder="https://yourvenue.com"
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
                        placeholder="https://facebook.com/yourvenue"
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
                        placeholder="https://instagram.com/yourvenue"
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
                        placeholder="https://tiktok.com/@yourvenue"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Availability & Booking Info</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  placeholder="Describe your booking process, lead times, available days/seasons"
                  rows={3}
                />
              </div>

              {/* Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pictures Upload */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <FileImage className="h-4 w-4" />
                    Venue Photos
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
                      {uploadedImages.length > 0 ? "Add more photos" : "Upload venue photos"}
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
                    Venue Tours
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
                      {uploadedVideos.length > 0 ? "Add more videos" : "Upload venue tours"}
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
                    Venue Brochures
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
                      {uploadedCatalogues.length > 0 ? "Add more brochures" : "Upload venue brochure"}
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
                  I agree to the terms and conditions and venue listing policies
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!formData.termsAccepted}
              >
                {isEditMode ? "Save Changes" : "Submit Venue Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}