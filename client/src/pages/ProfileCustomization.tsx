import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Image as ImageIcon, 
  Upload, 
  Layout, 
  Type, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Grid, 
  LayoutGrid, 
  LayoutList, 
  UserCircle, 
  Lock, 
  Settings2,
  FileImage,
  ImagePlus,
  FileCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Sample user profile data
const userProfile = {
  id: 1,
  username: 'sarahjohnson',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  avatar: 'https://via.placeholder.com/150',
  coverImage: 'https://via.placeholder.com/800x200',
  bio: 'Event planner with 5+ years experience specializing in weddings and corporate events.',
  phone: '+27 71 234 5678',
  website: 'https://sarahjohnson.events',
  location: 'Cape Town, South Africa',
  social: {
    instagram: 'sarahjohnson_events',
    facebook: 'sarahjohnsonevents',
    twitter: 'sarahjohnsonevent',
    linkedin: 'sarah-johnson-events',
  },
  style: {
    theme: 'light',
    primaryColor: '#6366f1',
    accentColor: '#ec4899',
    fontFamily: 'Inter',
    fontStyle: 'sans-serif',
    cardStyle: 'modern',
    layout: 'grid',
    animationsEnabled: true,
    bannerEnabled: true,
    roundedCorners: 'medium',
    cardSize: 'medium'
  },
  privacy: {
    showEmail: false,
    showPhone: true,
    showSocials: true,
    showLocation: true,
    allowMessages: true,
    showReviews: true,
  },
  isVendor: true,
  vendorCategory: 'Wedding Planner',
  vendorLevel: 'Premium Pro',
  vendorVisibility: 'public',
  vendorDisplay: {
    featuredPhotos: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    galleryLayout: 'grid',
    showPricing: true,
    highlightServices: true,
    hideReviewCount: false,
    accentElement: 'border',
  }
};

const fontOptions = [
  { value: 'Inter', label: 'Inter (Sans-Serif)', category: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto (Sans-Serif)', category: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat (Sans-Serif)', category: 'sans-serif' },
  { value: 'Merriweather', label: 'Merriweather (Serif)', category: 'serif' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)', category: 'serif' },
  { value: 'Georgia', label: 'Georgia (Serif)', category: 'serif' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (Monospace)', category: 'monospace' },
];

const cardStyleOptions = [
  { value: 'modern', label: 'Modern (Minimalist)' },
  { value: 'classic', label: 'Classic (Bordered)' },
  { value: 'elevated', label: 'Elevated (Shadow)' },
  { value: 'gradient', label: 'Gradient (Colored)' },
  { value: 'outlined', label: 'Outlined (Thin Border)' },
];

const layoutOptions = [
  { value: 'grid', label: 'Grid Layout', icon: LayoutGrid },
  { value: 'list', label: 'List Layout', icon: LayoutList },
  { value: 'masonry', label: 'Masonry Grid', icon: Grid },
];

const cornerOptions = [
  { value: 'none', label: 'None (Square)' },
  { value: 'small', label: 'Small (4px)' },
  { value: 'medium', label: 'Medium (8px)' },
  { value: 'large', label: 'Large (12px)' },
  { value: 'full', label: 'Full (Rounded)' },
];

const cardSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const accentElementOptions = [
  { value: 'border', label: 'Colored Border' },
  { value: 'background', label: 'Background Accent' },
  { value: 'text', label: 'Text Accent' },
  { value: 'banner', label: 'Top Banner' },
  { value: 'minimal', label: 'Subtle Accents' },
];

export default function ProfileCustomization() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('appearance');
  const [profile, setProfile] = useState(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  
  // Preview toggle
  const [showPreview, setShowPreview] = useState(false);
  
  // Image upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [featuredFiles, setFeaturedFiles] = useState<File[]>([]);
  
  // Handle color change
  const handleColorChange = (type: 'primaryColor' | 'accentColor', color: string) => {
    setProfile({
      ...profile,
      style: {
        ...profile.style,
        [type]: color,
      }
    });
  };
  
  // Handle saving profile changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    toast({
      title: "Profile updated",
      description: "Your profile customizations have been saved.",
    });
    
    setIsSaving(false);
  };
  
  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Image quality check would happen here
      
      setAvatarFile(file);
      
      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Image quality check would happen here
      
      setCoverFile(file);
      
      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          coverImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle featured photos upload
  const handleFeaturedPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Limit to 5 files
      const selectedFiles = Array.from(files).slice(0, 5);
      
      // Image quality check would happen here
      // For each file...
      
      setFeaturedFiles(prev => [...prev, ...selectedFiles]);
      
      // Update preview
      const newFeaturedPhotos = [...profile.vendorDisplay.featuredPhotos];
      
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newFeaturedPhotos.push(reader.result as string);
          setProfile({
            ...profile,
            vendorDisplay: {
              ...profile.vendorDisplay,
              featuredPhotos: newFeaturedPhotos.slice(0, 5), // Keep max 5
            }
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Function to generate styles based on profile settings
  const getPreviewStyles = () => {
    return {
      fontFamily: profile.style.fontFamily,
      '--primary-color': profile.style.primaryColor,
      '--accent-color': profile.style.accentColor,
      borderRadius: 
        profile.style.roundedCorners === 'none' ? '0' :
        profile.style.roundedCorners === 'small' ? '4px' :
        profile.style.roundedCorners === 'medium' ? '8px' :
        profile.style.roundedCorners === 'large' ? '12px' : '9999px',
    } as React.CSSProperties;
  };
  
  return (
    <>
      <Helmet>
        <title>Profile Customization - HowzEventz</title>
      </Helmet>
      
      <div className="bg-background min-h-screen py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile Customization</h1>
              <p className="text-muted-foreground">Personalize your profile appearance and privacy settings</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Profile Customization</CardTitle>
                  <CardDescription>
                    Customize how your profile appears to visitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                      <TabsTrigger value="appearance">
                        <Palette className="h-4 w-4 mr-2" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger value="layout">
                        <Layout className="h-4 w-4 mr-2" />
                        Layout
                      </TabsTrigger>
                      <TabsTrigger value="privacy">
                        <Lock className="h-4 w-4 mr-2" />
                        Privacy
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Profile Images</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Profile Photo</Label>
                            <div className="flex items-start gap-4">
                              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                {profile.avatar ? (
                                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <ImagePlus className="h-4 w-4" />
                                    Upload new photo
                                  </div>
                                </Label>
                                <Input 
                                  id="avatar-upload" 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden"
                                  onChange={handleAvatarUpload}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Recommended: 400x400px or larger square JPG, PNG
                                </p>
                                {avatarFile && (
                                  <div className="flex items-center text-xs text-green-600">
                                    <FileCheck className="h-3 w-3 mr-1" />
                                    {avatarFile.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Cover Photo</Label>
                            <div className="space-y-2">
                              <div className="h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                {profile.coverImage ? (
                                  <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Label htmlFor="cover-upload" className="cursor-pointer">
                                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <Upload className="h-4 w-4" />
                                    Upload cover image
                                  </div>
                                </Label>
                                <Input 
                                  id="cover-upload" 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden"
                                  onChange={handleCoverUpload}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Recommended: 1200x300px JPG, PNG
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Color Scheme</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primary-color">Primary Color</Label>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-10 h-10 rounded-md border" 
                                style={{ backgroundColor: profile.style.primaryColor }}
                              />
                              <Input
                                id="primary-color"
                                type="color"
                                value={profile.style.primaryColor}
                                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="accent-color">Accent Color</Label>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-10 h-10 rounded-md border" 
                                style={{ backgroundColor: profile.style.accentColor }}
                              />
                              <Input
                                id="accent-color"
                                type="color"
                                value={profile.style.accentColor}
                                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <div className="flex items-center gap-4">
                            <RadioGroup
                              value={profile.style.theme}
                              onValueChange={(value) => setProfile({
                                ...profile,
                                style: {
                                  ...profile.style,
                                  theme: value,
                                }
                              })}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="theme-light" />
                                <Label htmlFor="theme-light">Light</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="theme-dark" />
                                <Label htmlFor="theme-dark">Dark</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="theme-system" />
                                <Label htmlFor="theme-system">System</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Typography</h3>
                        <div className="space-y-2">
                          <Label htmlFor="font-family">Font Family</Label>
                          <Select 
                            value={profile.style.fontFamily}
                            onValueChange={(value) => {
                              const fontOption = fontOptions.find(f => f.value === value);
                              setProfile({
                                ...profile,
                                style: {
                                  ...profile.style,
                                  fontFamily: value,
                                  fontStyle: fontOption?.category || 'sans-serif',
                                }
                              })
                            }}
                          >
                            <SelectTrigger id="font-family">
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontOptions.map(font => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="card-style">Card Style</Label>
                          <Select 
                            value={profile.style.cardStyle}
                            onValueChange={(value) => setProfile({
                              ...profile,
                              style: {
                                ...profile.style,
                                cardStyle: value,
                              }
                            })}
                          >
                            <SelectTrigger id="card-style">
                              <SelectValue placeholder="Select card style" />
                            </SelectTrigger>
                            <SelectContent>
                              {cardStyleOptions.map(style => (
                                <SelectItem key={style.value} value={style.value}>
                                  {style.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="animations"
                            checked={profile.style.animationsEnabled}
                            onCheckedChange={(checked) => setProfile({
                              ...profile,
                              style: {
                                ...profile.style,
                                animationsEnabled: checked,
                              }
                            })}
                          />
                          <Label htmlFor="animations">Enable animations</Label>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Layout Tab */}
                    <TabsContent value="layout" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Layout Options</h3>
                        
                        <RadioGroup
                          value={profile.style.layout}
                          onValueChange={(value) => setProfile({
                            ...profile,
                            style: {
                              ...profile.style,
                              layout: value,
                            }
                          })}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          {layoutOptions.map(option => {
                            const Icon = option.icon;
                            return (
                              <div 
                                key={option.value}
                                className={`border rounded-md p-4 cursor-pointer ${
                                  profile.style.layout === option.value ? 'border-primary bg-primary/5' : ''
                                }`}
                              >
                                <div className="flex items-center mb-4">
                                  <RadioGroupItem value={option.value} id={`layout-${option.value}`} />
                                  <Label htmlFor={`layout-${option.value}`} className="ml-2">{option.label}</Label>
                                </div>
                                <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                                  <Icon className="h-8 w-8 text-muted-foreground" />
                                </div>
                              </div>
                            );
                          })}
                        </RadioGroup>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Visual Style</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rounded-corners">Rounded Corners</Label>
                          <Select 
                            value={profile.style.roundedCorners}
                            onValueChange={(value) => setProfile({
                              ...profile,
                              style: {
                                ...profile.style,
                                roundedCorners: value,
                              }
                            })}
                          >
                            <SelectTrigger id="rounded-corners">
                              <SelectValue placeholder="Select corner style" />
                            </SelectTrigger>
                            <SelectContent>
                              {cornerOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="card-size">Card Size</Label>
                          <Select 
                            value={profile.style.cardSize}
                            onValueChange={(value) => setProfile({
                              ...profile,
                              style: {
                                ...profile.style,
                                cardSize: value,
                              }
                            })}
                          >
                            <SelectTrigger id="card-size">
                              <SelectValue placeholder="Select card size" />
                            </SelectTrigger>
                            <SelectContent>
                              {cardSizeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="banner-enabled"
                            checked={profile.style.bannerEnabled}
                            onCheckedChange={(checked) => setProfile({
                              ...profile,
                              style: {
                                ...profile.style,
                                bannerEnabled: checked,
                              }
                            })}
                          />
                          <Label htmlFor="banner-enabled">Show profile banner</Label>
                        </div>
                        
                        <Separator />
                        
                        {profile.isVendor && (
                          <>
                            <h3 className="text-lg font-medium">Vendor Display Options</h3>
                            
                            <div className="space-y-2">
                              <Label htmlFor="accent-element">Accent Element</Label>
                              <Select 
                                value={profile.vendorDisplay.accentElement}
                                onValueChange={(value) => setProfile({
                                  ...profile,
                                  vendorDisplay: {
                                    ...profile.vendorDisplay,
                                    accentElement: value,
                                  }
                                })}
                              >
                                <SelectTrigger id="accent-element">
                                  <SelectValue placeholder="Select accent style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {accentElementOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Featured Photos (Up to 5)</Label>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {profile.vendorDisplay.featuredPhotos.map((photo, index) => (
                                  <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                                    <img src={photo} alt={`Featured ${index + 1}`} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                {profile.vendorDisplay.featuredPhotos.length < 5 && (
                                  <Label 
                                    htmlFor="featured-upload" 
                                    className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary"
                                  >
                                    <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Add photo</span>
                                  </Label>
                                )}
                                <Input 
                                  id="featured-upload" 
                                  type="file" 
                                  accept="image/*" 
                                  multiple 
                                  className="hidden"
                                  onChange={handleFeaturedPhotosUpload}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Recommended: Square images, at least 600x600px
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="gallery-layout">Gallery Layout</Label>
                              <Select 
                                value={profile.vendorDisplay.galleryLayout}
                                onValueChange={(value) => setProfile({
                                  ...profile,
                                  vendorDisplay: {
                                    ...profile.vendorDisplay,
                                    galleryLayout: value,
                                  }
                                })}
                              >
                                <SelectTrigger id="gallery-layout">
                                  <SelectValue placeholder="Select gallery layout" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grid">Grid Layout</SelectItem>
                                  <SelectItem value="masonry">Masonry Layout</SelectItem>
                                  <SelectItem value="carousel">Carousel Layout</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="show-pricing"
                                  checked={profile.vendorDisplay.showPricing}
                                  onCheckedChange={(checked) => setProfile({
                                    ...profile,
                                    vendorDisplay: {
                                      ...profile.vendorDisplay,
                                      showPricing: checked,
                                    }
                                  })}
                                />
                                <Label htmlFor="show-pricing">Show pricing information</Label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="highlight-services"
                                  checked={profile.vendorDisplay.highlightServices}
                                  onCheckedChange={(checked) => setProfile({
                                    ...profile,
                                    vendorDisplay: {
                                      ...profile.vendorDisplay,
                                      highlightServices: checked,
                                    }
                                  })}
                                />
                                <Label htmlFor="highlight-services">Highlight key services</Label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="hide-review-count"
                                  checked={profile.vendorDisplay.hideReviewCount}
                                  onCheckedChange={(checked) => setProfile({
                                    ...profile,
                                    vendorDisplay: {
                                      ...profile.vendorDisplay,
                                      hideReviewCount: checked,
                                    }
                                  })}
                                />
                                <Label htmlFor="hide-review-count">Hide review count</Label>
                              </div>
                            </div>
                            
                            <Separator />
                          </>
                        )}
                      </div>
                    </TabsContent>
                    
                    {/* Privacy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Privacy Settings</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-email">Show Email Address</Label>
                              <p className="text-xs text-muted-foreground">Allow visitors to see your email address</p>
                            </div>
                            <Switch
                              id="show-email"
                              checked={profile.privacy.showEmail}
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                privacy: {
                                  ...profile.privacy,
                                  showEmail: checked,
                                }
                              })}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-phone">Show Phone Number</Label>
                              <p className="text-xs text-muted-foreground">Allow visitors to see your phone number</p>
                            </div>
                            <Switch
                              id="show-phone"
                              checked={profile.privacy.showPhone}
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                privacy: {
                                  ...profile.privacy,
                                  showPhone: checked,
                                }
                              })}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-socials">Show Social Media Links</Label>
                              <p className="text-xs text-muted-foreground">Display your social media profiles</p>
                            </div>
                            <Switch
                              id="show-socials"
                              checked={profile.privacy.showSocials}
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                privacy: {
                                  ...profile.privacy,
                                  showSocials: checked,
                                }
                              })}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-location">Show Location</Label>
                              <p className="text-xs text-muted-foreground">Display your location information</p>
                            </div>
                            <Switch
                              id="show-location"
                              checked={profile.privacy.showLocation}
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                privacy: {
                                  ...profile.privacy,
                                  showLocation: checked,
                                }
                              })}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="allow-messages">Allow Direct Messages</Label>
                              <p className="text-xs text-muted-foreground">Let visitors contact you via direct message</p>
                            </div>
                            <Switch
                              id="allow-messages"
                              checked={profile.privacy.allowMessages}
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                privacy: {
                                  ...profile.privacy,
                                  allowMessages: checked,
                                }
                              })}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="show-reviews">Show Reviews</Label>
                              <p className="text-xs text-muted-foreground">Display reviews on your profile</p>
                            </div>
                            <Switch
                              id="show-reviews"
                              checked={profile.privacy.showReviews}
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                privacy: {
                                  ...profile.privacy,
                                  showReviews: checked,
                                }
                              })}
                            />
                          </div>
                        </div>
                        
                        {profile.isVendor && (
                          <>
                            <Separator />
                            
                            <h3 className="text-lg font-medium">Vendor Visibility</h3>
                            
                            <RadioGroup
                              value={profile.vendorVisibility}
                              onValueChange={(value) => setProfile({
                                ...profile,
                                vendorVisibility: value,
                              })}
                              className="space-y-2"
                            >
                              <div className="flex items-start space-x-2">
                                <RadioGroupItem value="public" id="visibility-public" className="mt-1" />
                                <div>
                                  <Label htmlFor="visibility-public">Public</Label>
                                  <p className="text-xs text-muted-foreground">Your profile is visible to everyone and appears in search results</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <RadioGroupItem value="limited" id="visibility-limited" className="mt-1" />
                                <div>
                                  <Label htmlFor="visibility-limited">Limited Visibility</Label>
                                  <p className="text-xs text-muted-foreground">Your profile is only visible to users who have your direct link</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <RadioGroupItem value="private" id="visibility-private" className="mt-1" />
                                <div>
                                  <Label htmlFor="visibility-private">Private</Label>
                                  <p className="text-xs text-muted-foreground">Your profile is hidden and not available to the public</p>
                                </div>
                              </div>
                            </RadioGroup>
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Profile Preview</CardTitle>
                    <CardDescription>
                      See how your profile will appear to visitors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showPreview ? (
                      <div className="space-y-4" style={getPreviewStyles()}>
                        {/* Profile preview */}
                        <div className={`relative rounded-md overflow-hidden ${
                          profile.style.cardStyle === 'modern' ? 'shadow-sm' :
                          profile.style.cardStyle === 'elevated' ? 'shadow-lg' :
                          profile.style.cardStyle === 'gradient' ? 'bg-gradient-to-br from-primary/10 to-accent/10' :
                          profile.style.cardStyle === 'outlined' ? 'border border-primary/20' :
                          'border'
                        }`}>
                          {/* Banner */}
                          {profile.style.bannerEnabled && (
                            <div className="h-32 w-full">
                              {profile.coverImage ? (
                                <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-primary/40 to-accent/40" />
                              )}
                            </div>
                          )}
                          
                          {/* Avatar */}
                          <div className={`${profile.style.bannerEnabled ? '-mt-10' : 'mt-4'} flex justify-center`}>
                            <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                              profile.vendorDisplay.accentElement === 'border' ? 'border-primary' : 'border-background'
                            } bg-background`}>
                              {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Profile info */}
                          <div className="p-4 text-center">
                            <h3 className="text-lg font-bold">{profile.name}</h3>
                            {profile.isVendor && (
                              <div className="text-sm text-muted-foreground">{profile.vendorCategory}</div>
                            )}
                            <div className={`mt-2 text-sm ${
                              profile.vendorDisplay.accentElement === 'text' ? 'text-primary' : ''
                            }`}>
                              {profile.bio}
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              {profile.privacy.showLocation && (
                                <div className="text-sm">{profile.location}</div>
                              )}
                              {profile.privacy.showEmail && (
                                <div className="text-sm">{profile.email}</div>
                              )}
                              {profile.privacy.showPhone && (
                                <div className="text-sm">{profile.phone}</div>
                              )}
                            </div>
                            
                            {/* Social links */}
                            {profile.privacy.showSocials && (
                              <div className="mt-4 flex justify-center space-x-3">
                                {Object.keys(profile.social).map(platform => (
                                  <div key={platform} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-xs">{platform.charAt(0).toUpperCase()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="mt-4">
                              <Button
                                className={
                                  profile.style.layout === 'list' ?
                                  'w-auto' : 'w-full'
                                }
                                variant={
                                  profile.vendorDisplay.accentElement === 'background' ?
                                  'default' : 'outline'
                                }
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Vendor content preview */}
                        {profile.isVendor && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium border-b pb-1">Featured Photos</h4>
                            <div className={`grid ${
                              profile.vendorDisplay.galleryLayout === 'list' ? 'grid-cols-1 gap-2' :
                              profile.vendorDisplay.galleryLayout === 'masonry' ? 'grid-cols-2 gap-2' :
                              'grid-cols-2 gap-1'
                            }`}>
                              {profile.vendorDisplay.featuredPhotos.slice(0, 2).map((photo, index) => (
                                <div key={index} className={`aspect-square bg-muted rounded-md overflow-hidden ${
                                  profile.style.cardStyle === 'elevated' ? 'shadow-sm' : ''
                                }`}>
                                  <img src={photo} alt={`Featured ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                            
                            {profile.vendorDisplay.showPricing && (
                              <div className="mt-2 p-2 border rounded-md">
                                <div className="text-sm font-medium">Price Range</div>
                                <div className="text-lg font-bold">R5,000 - R15,000</div>
                              </div>
                            )}
                            
                            {profile.vendorDisplay.highlightServices && (
                              <div className="mt-2">
                                <div className="text-sm font-medium mb-1">Services</div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">Service 1</Badge>
                                  <Badge variant="outline" className="text-xs">Service 2</Badge>
                                  <Badge variant="outline" className="text-xs">Service 3</Badge>
                                </div>
                              </div>
                            )}
                            
                            {profile.privacy.showReviews && !profile.vendorDisplay.hideReviewCount && (
                              <div className="flex items-center text-sm">
                                <span className="flex items-center text-yellow-500">
                                  ★★★★☆
                                </span>
                                <span className="ml-1">4.0 (15 reviews)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Preview Hidden</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Click "Show Preview" to see how your profile will look
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Image Quality Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>AI blur detection enabled</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Content moderation active</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Image optimization</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Secure storage (encrypted)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}