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
import { ChevronLeft, Building, Upload, Users } from "lucide-react";

export default function VenueRegistration() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    venueName: "",
    contactPerson: "",
    email: "",
    phone: "",
    venueAddress: "",
    venueType: "",
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricing">Pricing Information</Label>
                  <Input
                    id="pricing"
                    value={formData.pricing}
                    onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                    placeholder="e.g., R5000 per day or R150 per person"
                  />
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

              {/* Photo Upload */}
              <div>
                <Label>Venue Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Upload high-quality photos of your venue spaces (interior, exterior, setup examples)
                  </p>
                  <Button variant="outline" className="mt-2">
                    Choose Photos
                  </Button>
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