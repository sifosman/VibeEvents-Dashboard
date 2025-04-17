import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { 
  BarChart,
  LineChart,
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, ChevronDown, Users, Eye, MousePointerClick, Heart, MessageSquare, DollarSign, Clock, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VendorAnalytics as VendorAnalyticsType } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Sample colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function VendorAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('pageViews');

  // Query to fetch vendor analytics data
  const { data: analyticsData, isLoading, error } = useQuery<VendorAnalyticsType[]>({
    queryKey: ['/api/analytics/vendor', dateRange.from.toISOString(), dateRange.to.toISOString()],
  });

  // Query to get leads data
  const { data: leadsData } = useQuery({
    queryKey: ['/api/analytics/vendor/leads', dateRange.from.toISOString(), dateRange.to.toISOString()],
  });

  // Data for Overview cards
  const overviewData = analyticsData ? {
    totalPageViews: analyticsData.reduce((sum, day) => sum + day.pageViews, 0),
    uniqueVisitors: analyticsData.reduce((sum, day) => sum + day.uniqueVisitors, 0),
    avgEngagementTime: Math.round(analyticsData.reduce((sum, day) => sum + day.averageEngagementTime, 0) / analyticsData.length),
    totalLeads: analyticsData.reduce((sum, day) => sum + day.leadsGenerated, 0),
    totalShortlists: analyticsData.reduce((sum, day) => sum + day.shortlistAdds, 0),
    totalInquiries: analyticsData.reduce((sum, day) => sum + day.inquiries, 0),
    websiteClicks: analyticsData.reduce((sum, day) => sum + day.websiteClicks, 0),
    totalRevenue: analyticsData.reduce((sum, day) => sum + day.revenue, 0),
  } : {
    totalPageViews: 0,
    uniqueVisitors: 0,
    avgEngagementTime: 0,
    totalLeads: 0,
    totalShortlists: 0,
    totalInquiries: 0,
    websiteClicks: 0,
    totalRevenue: 0,
  };

  // Format data for line chart
  const formatLineChartData = () => {
    if (!analyticsData) return [];
    
    return analyticsData.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: day.pageViews,
      uniqueVisitors: day.uniqueVisitors,
      leads: day.leadsGenerated,
      shortlists: day.shortlistAdds,
      inquiries: day.inquiries,
      websiteClicks: day.websiteClicks,
      contactClicks: day.contactClicks,
      revenue: day.revenue
    }));
  };

  // Traffic source data for pie chart (sample - would be fetched from API)
  const trafficSourceData = [
    { name: 'Search Results', value: 40 },
    { name: 'Category Pages', value: 25 },
    { name: 'Direct', value: 15 },
    { name: 'Featured Listings', value: 10 },
    { name: 'Social Media', value: 10 }
  ];
  
  // Engagement by type data (sample - would be fetched from API)
  const engagementData = [
    { name: 'Profile Views', value: overviewData.totalPageViews },
    { name: 'Website Clicks', value: overviewData.websiteClicks },
    { name: 'Shortlists', value: overviewData.totalShortlists },
    { name: 'Inquiries', value: overviewData.totalInquiries },
    { name: 'Leads Generated', value: overviewData.totalLeads }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading analytics",
      description: "There was a problem loading your analytics data. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <>
      <Helmet>
        <title>Vendor Analytics Dashboard - HowzEventz</title>
      </Helmet>
      
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your performance metrics and customer engagement.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <CalendarDateRangePicker 
                date={dateRange} 
                setDate={setDateRange} 
              />
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="traffic">Traffic & Engagement</TabsTrigger>
              <TabsTrigger value="leads">Leads & Conversions</TabsTrigger>
              <TabsTrigger value="comparison">Performance Comparison</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalPageViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">In selected date range</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.uniqueVisitors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">In selected date range</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalLeads.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">In selected date range</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Engagement Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.avgEngagementTime}s</div>
                    <p className="text-xs text-muted-foreground">Time spent on your profile</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Shortlist Adds</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalShortlists.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Users who saved your profile</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalInquiries.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Questions about your services</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Website Clicks</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.websiteClicks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Users who clicked to your site</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{overviewData.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From platform transactions</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                  <CardDescription>Track how your metrics change over the selected period</CardDescription>
                  <div className="flex justify-end">
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pageViews">Profile Views</SelectItem>
                        <SelectItem value="uniqueVisitors">Unique Visitors</SelectItem>
                        <SelectItem value="leads">Leads Generated</SelectItem>
                        <SelectItem value="shortlists">Shortlist Adds</SelectItem>
                        <SelectItem value="websiteClicks">Website Clicks</SelectItem>
                        <SelectItem value="inquiries">Inquiries</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatLineChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={selectedMetric} 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Traffic & Engagement Tab */}
            <TabsContent value="traffic" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your visitors are coming from</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {trafficSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement by Type</CardTitle>
                    <CardDescription>How users are interacting with your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>User Behavior Flow</CardTitle>
                    <CardDescription>How users navigate through your content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center space-x-2 py-4">
                      <div className="bg-primary/20 rounded-md p-3 text-center">
                        <p className="font-medium">Profile View</p>
                        <p className="text-sm text-muted-foreground">{overviewData.totalPageViews}</p>
                      </div>
                      <ChevronDown className="rotate-90" />
                      <div className="bg-primary/20 rounded-md p-3 text-center">
                        <p className="font-medium">Gallery View</p>
                        <p className="text-sm text-muted-foreground">{Math.round(overviewData.totalPageViews * 0.65)}</p>
                      </div>
                      <ChevronDown className="rotate-90" />
                      <div className="bg-primary/20 rounded-md p-3 text-center">
                        <p className="font-medium">Website Visit</p>
                        <p className="text-sm text-muted-foreground">{overviewData.websiteClicks}</p>
                      </div>
                      <ChevronDown className="rotate-90" />
                      <div className="bg-primary/20 rounded-md p-3 text-center">
                        <p className="font-medium">Inquiry</p>
                        <p className="text-sm text-muted-foreground">{overviewData.totalInquiries}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Profile to Gallery Conversion Rate</p>
                        <p className="text-2xl font-bold">{Math.round((overviewData.totalPageViews * 0.65 / overviewData.totalPageViews) * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Gallery to Website Conversion Rate</p>
                        <p className="text-2xl font-bold">{Math.round((overviewData.websiteClicks / (overviewData.totalPageViews * 0.65)) * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Website to Inquiry Conversion Rate</p>
                        <p className="text-2xl font-bold">{Math.round((overviewData.totalInquiries / overviewData.websiteClicks) * 100)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Leads & Conversions Tab */}
            <TabsContent value="leads" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                    <CardDescription>Where your leads are coming from</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Direct Profile', value: 45 },
                            { name: 'Search Results', value: 25 },
                            { name: 'Category Page', value: 15 },
                            { name: 'Featured Listing', value: 10 },
                            { name: 'Event Opportunities', value: 5 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {trafficSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Conversion Funnel</CardTitle>
                    <CardDescription>How leads move through your sales funnel</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={[
                          { name: 'Total Profile Views', value: overviewData.totalPageViews },
                          { name: 'Inquiries Received', value: overviewData.totalInquiries },
                          { name: 'Quote Requests', value: Math.round(overviewData.totalInquiries * 0.6) },
                          { name: 'Bookings', value: Math.round(overviewData.totalInquiries * 0.3) },
                          { name: 'Completed Events', value: Math.round(overviewData.totalInquiries * 0.25) }
                        ]}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {[0, 1, 2, 3, 4].map((index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>Your most recent inquiries and leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                        <div>Date</div>
                        <div>Name</div>
                        <div>Type</div>
                        <div>Status</div>
                        <div>Action</div>
                      </div>
                      {leadsData ? (
                        leadsData.map((lead: any, index: number) => (
                          <div key={index} className="grid grid-cols-5 p-3 border-t">
                            <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                            <div>{lead.name}</div>
                            <div>{lead.eventType}</div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              </span>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No leads data available for this period.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Performance Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance vs. Category Average</CardTitle>
                  <CardDescription>See how you compare to other vendors in your category</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Profile Views', yours: overviewData.totalPageViews, average: Math.round(overviewData.totalPageViews * 0.8) },
                        { name: 'Unique Visitors', yours: overviewData.uniqueVisitors, average: Math.round(overviewData.uniqueVisitors * 0.85) },
                        { name: 'Avg. Engagement', yours: overviewData.avgEngagementTime, average: Math.round(overviewData.avgEngagementTime * 0.9) },
                        { name: 'Shortlist Rate', yours: Math.round((overviewData.totalShortlists / overviewData.totalPageViews) * 100), average: 8 },
                        { name: 'Lead Conversion', yours: Math.round((overviewData.totalLeads / overviewData.totalPageViews) * 100), average: 5 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="yours" name="Your Performance" fill="#8884d8" />
                      <Bar dataKey="average" name="Category Average" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Month-over-Month Growth</CardTitle>
                    <CardDescription>Your performance compared to last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Profile Views</p>
                          <div className="text-sm font-medium text-green-600">+12%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[112%] rounded-full bg-green-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Leads Generated</p>
                          <div className="text-sm font-medium text-green-600">+8%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[108%] rounded-full bg-green-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Bookings</p>
                          <div className="text-sm font-medium text-green-600">+5%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[105%] rounded-full bg-green-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Revenue</p>
                          <div className="text-sm font-medium text-green-600">+15%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[115%] rounded-full bg-green-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Rating</CardTitle>
                    <CardDescription>Your overall performance score</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative h-40 w-40">
                      <svg
                        className="h-full w-full"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="10"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 40}`,
                            strokeDashoffset: `${2 * Math.PI * 40 * (1 - 0.85)}`,
                            transformOrigin: "center",
                            transform: "rotate(-90deg)",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">85%</span>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium">Current Ranking</p>
                        <p className="text-2xl font-bold">12 / 156</p>
                        <p className="text-xs text-muted-foreground">In your category</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rating Trend</p>
                        <div className="flex items-center justify-center">
                          <ThumbsUp className="h-6 w-6 text-green-600 mr-1" />
                          <span className="text-xl font-bold text-green-600">Positive</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Improving steadily</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}