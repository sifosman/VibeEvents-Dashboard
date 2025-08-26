import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Building, Upload, Users, MessageSquare, MapPin, FileImage, Video, BookOpen } from "lucide-react";

export default function VenueRegistration() {
  const [, setLocation] = useLocation();
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
    description: "",
    amenities: [] as string[],
    pricing: "",
    availability: "",
    website: "",
    termsAccepted: false
  });

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
    console.log("Venue registration:", formData);
    alert("Registration submitted successfully! We'll review your venue application and get back to you within 2-3 business days.");
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
        <title>Venue Registration | HowzEventz</title>
        <meta name="description" content="Register your venue on HowzEventz" />
      </Helmet>

      <div className="container mx-auto py-4 px-4 max-w-3xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setLocation("/subscription")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Subscription
          </Button>

          <div>
            <h1 className="text-2xl font-display font-bold flex items-center">
              <Building className="h-6 w-6 mr-2 text-primary" />
              Venue Registration
            </h1>
            <p className="text-muted-foreground mt-1">List your venue for special events and celebrations</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
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
                  />
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
                  />
                </div>
                <div>
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                  <Input
                    id="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData({...formData, businessRegistrationNumber: e.target.value})}
                    placeholder="e.g., 2019/123456/07"
                  />
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
                />
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

              <div>
                <Label htmlFor="description">Venue Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your venue, atmosphere, unique features, and what makes it special"
                  rows={4}
                  required
                />
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
                  <Label htmlFor="areasCanServe">Service Coverage Area</Label>
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

              <div>
                <Label htmlFor="website">Website/Social Media</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="Your website or social media links"
                />
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
                    Upload Pictures
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileImage className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-2">
                      Upload venue photos
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Images
                    </Button>
                  </div>
                </div>

                {/* Videos Upload */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4" />
                    Upload Videos
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Video className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-2">
                      Upload venue tours
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Videos
                    </Button>
                  </div>
                </div>

                {/* Catalogue Upload */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4" />
                    Upload Catalogue
                  </Label>
                  <div className="mb-2">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Download Catalogue Template
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-2">
                      Upload venue brochure
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
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
                Submit Venue Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}