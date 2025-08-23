import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertVendorRegistrationSchema, type InsertVendorRegistration } from "@shared/schema";
import { Upload, FileText, Image, Video, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Available hashtags for vendors
const AVAILABLE_HASHTAGS = [
  "luxury", "budget-friendly", "outdoor", "indoor", "vintage", "modern",
  "rustic", "elegant", "family-friendly", "eco-friendly", "custom",
  "traditional", "contemporary", "bohemian", "minimalist", "glamorous"
];

export default function VendorRegistration() {
  const { toast } = useToast();
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{
    catalogue?: string;
    pictures: string[];
    videos: string[];
  }>({
    pictures: [],
    videos: [],
  });

  // Fetch categories for the dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery<Array<{ id: number; name: string }>>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertVendorRegistration>({
    resolver: zodResolver(insertVendorRegistrationSchema.extend({
      categoryId: insertVendorRegistrationSchema.shape.categoryId,
      hashtags: insertVendorRegistrationSchema.shape.hashtags.optional(),
    })),
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      ownerName: "",
      idNumber: "",
      billingAddress: "",
      locationAddress: "",
      googleMapsLocation: "",
      about: "",
      cateringCapacity: undefined,
      servicesProducts: "",
      uniqueFeatures: "",
      hashtags: [],
      categoryId: undefined,
      catalogueFileUrl: "",
      pictureUrls: [],
      videoUrls: [],
      acceptedTerms: false,
      contactEmail: "",
      contactPhone: "",
      websiteUrl: "",
      instagramUrl: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertVendorRegistration) => {
      const registrationData = {
        ...data,
        hashtags: selectedHashtags,
        catalogueFileUrl: uploadedFiles.catalogue || "",
        pictureUrls: uploadedFiles.pictures,
        videoUrls: uploadedFiles.videos,
        acceptedDate: data.acceptedTerms ? new Date().toISOString() : null,
      };
      
      const response = await apiRequest("POST", "/api/vendor-registrations", registrationData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your vendor registration application has been submitted successfully. We'll review it and get back to you within 3-5 business days.",
      });
      form.reset();
      setSelectedHashtags([]);
      setUploadedFiles({ pictures: [], videos: [] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleFileUpload = (type: 'catalogue' | 'pictures' | 'videos') => (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      
      if (type === 'catalogue') {
        setUploadedFiles(prev => ({ ...prev, catalogue: uploadedUrl }));
      } else if (type === 'pictures') {
        setUploadedFiles(prev => ({ 
          ...prev, 
          pictures: [...prev.pictures, uploadedUrl] 
        }));
      } else if (type === 'videos') {
        setUploadedFiles(prev => ({ 
          ...prev, 
          videos: [...prev.videos, uploadedUrl] 
        }));
      }
      
      toast({
        title: "File Uploaded",
        description: `Your ${type} file has been uploaded successfully.`,
      });
    }
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const onSubmit = (data: InsertVendorRegistration) => {
    if (!data.acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    registrationMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Registration</h1>
        <p className="text-gray-600">
          Join our marketplace and connect with customers planning their special events.
          Fill out the form below to start your application process.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic information about your company and business registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Company registration number" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner's Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of business owner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Owner's ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Category *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                Billing and business location details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full billing address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Location Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Physical business location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="googleMapsLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Google Maps link or coordinates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Tell us about your services and what makes you unique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Your Business *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business, history, and what you offer..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servicesProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range of Services/Products *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List all the services and products you offer..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uniqueFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unique Features</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What makes your business special and unique?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cateringCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catering Capacity (if applicable)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Maximum number of people you can cater for"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hashtags Selection */}
              <div className="space-y-3">
                <Label>Select Hashtags (Optional)</Label>
                <p className="text-sm text-gray-600">
                  Choose tags that best describe your business style and offerings.
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_HASHTAGS.map((hashtag) => (
                    <Badge
                      key={hashtag}
                      variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => toggleHashtag(hashtag)}
                    >
                      #{hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How customers can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="business@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+27 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.instagram.com/yourbusiness" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload your business catalogue, pictures, and videos to showcase your work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Business Catalogue (PDF)</Label>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={10485760} // 10MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleFileUpload('catalogue')}
                  buttonClassName="w-full"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Upload Catalogue</span>
                  </div>
                </ObjectUploader>
                {uploadedFiles.catalogue && (
                  <p className="text-sm text-green-600">✓ Catalogue uploaded successfully</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Business Pictures</Label>
                <ObjectUploader
                  maxNumberOfFiles={10}
                  maxFileSize={5242880} // 5MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleFileUpload('pictures')}
                  buttonClassName="w-full"
                >
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Upload Pictures ({uploadedFiles.pictures.length}/10)</span>
                  </div>
                </ObjectUploader>
              </div>

              <div className="space-y-2">
                <Label>Business Videos</Label>
                <ObjectUploader
                  maxNumberOfFiles={5}
                  maxFileSize={52428800} // 50MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleFileUpload('videos')}
                  buttonClassName="w-full"
                >
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Upload Videos ({uploadedFiles.videos.length}/5)</span>
                  </div>
                </ObjectUploader>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="acceptedTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the terms and conditions *
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        By checking this box, you agree to our vendor terms and conditions,
                        privacy policy, and commission structure. You can review these
                        documents <a href="/terms" className="text-primary hover:underline">here</a>.
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={registrationMutation.isPending}
              className="px-8 py-2"
            >
              {registrationMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}