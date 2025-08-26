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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart as BarChartIcon, 
  Users, 
  Zap, 
  DollarSign, 
  Calendar, 
  Layers, 
  Search, 
  TrendingUp,
  Download,
  Globe,
  HardDrive,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  ThumbsUp,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppAnalytics as AppAnalyticsType } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Sample colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AdminAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  });
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState('totalPageViews');

  // Query to fetch app analytics data
  const { data: analyticsData, isLoading, error } = useQuery<AppAnalyticsType[]>({
    queryKey: ['/api/analytics/app', dateRange.from.toISOString(), dateRange.to.toISOString()],
  });

  // Data for Overview cards
  const overviewData = analyticsData ? {
    totalPageViews: analyticsData.reduce((sum, day) => sum + day.totalPageViews, 0),
    uniqueVisitors: analyticsData.reduce((sum, day) => sum + day.uniqueVisitors, 0),
    newUserSignups: analyticsData.reduce((sum, day) => sum + day.newUserSignups, 0),
    searchCount: analyticsData.reduce((sum, day) => sum + day.searchCount, 0),
    eventLeadsCreated: analyticsData.reduce((sum, day) => sum + day.eventLeadsCreated, 0),
    activeUsers: analyticsData.reduce((sum, day) => sum + day.activeUsers, 0),
    vendorSignups: analyticsData.reduce((sum, day) => sum + day.vendorSignups, 0),
    subscriptionConversions: analyticsData.reduce((sum, day) => sum + day.subscriptionConversions, 0),
    subscriptionRevenue: analyticsData.reduce((sum, day) => sum + day.subscriptionRevenue, 0),
    adRevenue: analyticsData.reduce((sum, day) => sum + day.adRevenue, 0),
    totalRevenue: analyticsData.reduce((sum, day) => sum + day.totalRevenue, 0),
  } : {
    totalPageViews: 23450,
    uniqueVisitors: 7890,
    newUserSignups: 642,
    searchCount: 18730,
    eventLeadsCreated: 356,
    activeUsers: 3456,
    vendorSignups: 124,
    subscriptionConversions: 87,
    subscriptionRevenue: 45600,
    adRevenue: 12400,
    totalRevenue: 58000,
  };

  // Format data for charts
  const formatLineChartData = () => {
    if (!analyticsData) {
      // Sample data for demonstration
      return Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          totalPageViews: 500 + Math.floor(Math.random() * 300),
          uniqueVisitors: 200 + Math.floor(Math.random() * 150),
          newUserSignups: 10 + Math.floor(Math.random() * 25),
          searchCount: 400 + Math.floor(Math.random() * 200),
          activeUsers: 100 + Math.floor(Math.random() * 50),
          revenue: 1500 + Math.floor(Math.random() * 1000),
        };
      });
    }
    
    return analyticsData.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalPageViews: day.totalPageViews,
      uniqueVisitors: day.uniqueVisitors,
      newUserSignups: day.newUserSignups,
      searchCount: day.searchCount,
      activeUsers: day.activeUsers,
      revenue: day.totalRevenue
    }));
  };

  // Revenue breakdown
  const revenueBreakdown = [
    { name: 'Basic Subscriptions', value: overviewData.subscriptionRevenue * 0.2, color: '#0088FE' },
    { name: 'Pro Subscriptions', value: overviewData.subscriptionRevenue * 0.35, color: '#00C49F' },
    { name: 'Premium Pro Subscriptions', value: overviewData.subscriptionRevenue * 0.45, color: '#FFBB28' },
    { name: 'Banner Ads', value: overviewData.adRevenue * 0.4, color: '#FF8042' },
    { name: 'Featured Listings', value: overviewData.adRevenue * 0.35, color: '#8884d8' },
    { name: 'Promoted Content', value: overviewData.adRevenue * 0.25, color: '#82ca9d' }
  ];

  // User acquisition data
  const userAcquisitionData = [
    { name: 'Organic Search', value: overviewData.newUserSignups * 0.35, color: '#0088FE' },
    { name: 'Direct Traffic', value: overviewData.newUserSignups * 0.25, color: '#00C49F' },
    { name: 'Social Media', value: overviewData.newUserSignups * 0.2, color: '#FFBB28' },
    { name: 'Referrals', value: overviewData.newUserSignups * 0.1, color: '#FF8042' },
    { name: 'Paid Campaigns', value: overviewData.newUserSignups * 0.1, color: '#8884d8' },
  ];

  // Category popularity
  const categoryData = [
    { name: 'Venues', views: 8750, leads: 320 },
    { name: 'Catering', views: 6240, leads: 280 },
    { name: 'Entertainment', views: 5320, leads: 195 },
    { name: 'Photography', views: 4180, leads: 145 },
    { name: 'Decor', views: 3950, leads: 135 },
    { name: 'Attire', views: 2870, leads: 95 },
    { name: 'Planning', views: 2340, leads: 85 },
  ];

  // Time on site data
  const timeOnSiteData = [
    { name: '< 30 sec', users: 1250 },
    { name: '30-60 sec', users: 1850 },
    { name: '1-3 min', users: 2450 },
    { name: '3-5 min', users: 1780 },
    { name: '5-10 min', users: 1340 },
    { name: '> 10 min', users: 820 }
  ];

  // Device breakdown
  const deviceData = [
    { name: 'Mobile', value: overviewData.uniqueVisitors * 0.65, color: '#0088FE' },
    { name: 'Desktop', value: overviewData.uniqueVisitors * 0.28, color: '#00C49F' },
    { name: 'Tablet', value: overviewData.uniqueVisitors * 0.07, color: '#FFBB28' },
  ];

  // Vendor subscription tier distribution
  const vendorTierData = [
    { name: 'Free', value: 630, color: '#0088FE' },
    { name: 'Pro', value: 320, color: '#00C49F' },
    { name: 'Premium Pro', value: 150, color: '#FFBB28' },
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
        <title>Admin Analytics Dashboard - Vibeventz</title>
      </Helmet>
      
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Platform Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive analytics for platform performance and growth</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <CalendarDateRangePicker 
                date={dateRange} 
                setDate={setDateRange} 
              />
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">User Metrics</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
              <TabsTrigger value="content">Content Performance</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalPageViews.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">12%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.uniqueVisitors.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">8%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New User Signups</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.newUserSignups.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">15%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{overviewData.totalRevenue.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">18%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance Over Time</CardTitle>
                  <CardDescription>Track key metrics over the selected period</CardDescription>
                  <div className="flex justify-end">
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="totalPageViews">Page Views</SelectItem>
                        <SelectItem value="uniqueVisitors">Unique Visitors</SelectItem>
                        <SelectItem value="newUserSignups">New User Signups</SelectItem>
                        <SelectItem value="searchCount">Search Queries</SelectItem>
                        <SelectItem value="activeUsers">Active Users</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={formatLineChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey={selectedMetric} 
                        stroke="#8884d8" 
                        fillOpacity={0.2}
                        fill="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue sources distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {revenueBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>User Acquisition Channels</CardTitle>
                    <CardDescription>Where new users are coming from</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userAcquisitionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {userAcquisitionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${Math.round(value)} users`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Page views and leads by service category</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="views" name="Page Views" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="leads" name="Leads Generated" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* User Metrics Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.activeUsers.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">5%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Vendors</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.vendorSignups.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">12%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Search Queries</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.searchCount.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">23%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(overviewData.newUserSignups / overviewData.uniqueVisitors * 100).toFixed(2)}%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">3.5%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Distribution</CardTitle>
                    <CardDescription>Traffic by device type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${Math.round(value)} users`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                    <CardDescription>Time spent on site distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeOnSiteData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" name="Number of Users" fill="#8884d8">
                          {timeOnSiteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Users by geographic location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">South Africa</span>
                          </div>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2 w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Nigeria</span>
                          </div>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <Progress value={8} className="h-2 w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Kenya</span>
                          </div>
                          <span className="text-sm font-medium">5%</span>
                        </div>
                        <Progress value={5} className="h-2 w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Ghana</span>
                          </div>
                          <span className="text-sm font-medium">4%</span>
                        </div>
                        <Progress value={4} className="h-2 w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Other</span>
                          </div>
                          <span className="text-sm font-medium">5%</span>
                        </div>
                        <Progress value={5} className="h-2 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>User Behavior</CardTitle>
                    <CardDescription>Key user activities and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Avg. Pages per Session</div>
                          <div className="text-2xl font-bold">4.7</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">0.3</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Avg. Session Duration</div>
                          <div className="text-2xl font-bold">4m 12s</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">18s</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Bounce Rate</div>
                          <div className="text-2xl font-bold">34.2%</div>
                          <div className="flex items-center text-xs">
                            <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">2.5%</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Returning Users</div>
                          <div className="text-2xl font-bold">43%</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">5%</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Most Common Search Queries</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-primary/10 rounded-full px-3 py-1 text-xs">Wedding venues</div>
                          <div className="bg-primary/10 rounded-full px-3 py-1 text-xs">Birthday catering</div>
                          <div className="bg-primary/10 rounded-full px-3 py-1 text-xs">DJs near me</div>
                          <div className="bg-primary/10 rounded-full px-3 py-1 text-xs">Photographers</div>
                          <div className="bg-primary/10 rounded-full px-3 py-1 text-xs">Affordable venues</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Revenue Analytics Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subscription Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{overviewData.subscriptionRevenue.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">15%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Advertising Revenue</CardTitle>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{overviewData.adRevenue.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">23%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subscription Conversions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.subscriptionConversions.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">12%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue breakdown over time</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Jan', subscription: 32000, advertising: 8000, total: 40000 },
                        { month: 'Feb', subscription: 35000, advertising: 8500, total: 43500 },
                        { month: 'Mar', subscription: 37000, advertising: 9200, total: 46200 },
                        { month: 'Apr', subscription: 39500, advertising: 10000, total: 49500 },
                        { month: 'May', subscription: 41000, advertising: 10600, total: 51600 },
                        { month: 'Jun', subscription: 44000, advertising: 11200, total: 55200 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                      <Legend />
                      <Area type="monotone" dataKey="subscription" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="advertising" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Subscription Tiers</CardTitle>
                    <CardDescription>Distribution of vendor subscription levels</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vendorTierData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {vendorTierData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} vendors`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Metrics</CardTitle>
                    <CardDescription>Key subscription performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Monthly Recurring Revenue (MRR)</div>
                          <div className="text-sm font-medium">R{(overviewData.subscriptionRevenue / 6).toLocaleString()}</div>
                        </div>
                        <Progress value={85} className="h-2 w-full" />
                        <div className="text-xs text-muted-foreground">Up 15% from last month</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Churn Rate</div>
                          <div className="text-sm font-medium">3.2%</div>
                        </div>
                        <Progress value={32} className="h-2 w-full bg-muted" />
                        <div className="text-xs text-muted-foreground">Down 0.8% from last month</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Average Revenue Per User (ARPU)</div>
                          <div className="text-sm font-medium">R418</div>
                        </div>
                        <Progress value={78} className="h-2 w-full" />
                        <div className="text-xs text-muted-foreground">Up 5% from last month</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Lifetime Value (LTV)</div>
                          <div className="text-sm font-medium">R5,460</div>
                        </div>
                        <Progress value={90} className="h-2 w-full" />
                        <div className="text-xs text-muted-foreground">Up 8% from last month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Advertising Performance</CardTitle>
                    <CardDescription>Key advertising metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Total Impressions</div>
                          <div className="text-2xl font-bold">1.2M</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">15%</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Click-Through Rate</div>
                          <div className="text-2xl font-bold">3.8%</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">0.5%</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Active Ad Campaigns</div>
                          <div className="text-2xl font-bold">28</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">5</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Avg. CPM</div>
                          <div className="text-2xl font-bold">R32.50</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">R1.80</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Top Performing Ad Placements</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Homepage Banner</span>
                            <span>CTR: 5.2%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Category Page Sidebar</span>
                            <span>CTR: 4.7%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Search Results Top</span>
                            <span>CTR: 4.1%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Vendor Listing Footer</span>
                            <span>CTR: 3.8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Forecast</CardTitle>
                    <CardDescription>Projected revenue for next 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jul', projected: 58000, target: 60000 },
                          { month: 'Aug', projected: 62000, target: 65000 },
                          { month: 'Sep', projected: 67000, target: 70000 },
                          { month: 'Oct', projected: 72000, target: 75000 },
                          { month: 'Nov', projected: 78000, target: 80000 },
                          { month: 'Dec', projected: 85000, target: 85000 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                        <Legend />
                        <Line type="monotone" dataKey="projected" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Content Performance Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,105</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">124</span>
                      <span className="ml-1">new this period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Event Leads Created</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.eventLeadsCreated.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">18%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Featured Content Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24,320</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">22%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blog & Content Engagement</CardTitle>
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8,734</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500 font-medium">15%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Content</CardTitle>
                  <CardDescription>Top performing pages and categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Top Vendor Categories by Traffic</h4>
                      <div className="space-y-4">
                        {categoryData.map((category, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{category.name}</div>
                              <div className="text-sm">{category.views.toLocaleString()} views</div>
                            </div>
                            <Progress value={(category.views / Math.max(...categoryData.map(c => c.views))) * 100} className="h-2 w-full" />
                          </div>
                        )).slice(0, 5)}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-4">Top Blog Posts</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">10 Tips for Planning Your Dream Wedding</div>
                            <div className="text-sm text-muted-foreground">Published: April 5, 2025</div>
                          </div>
                          <div className="text-sm font-medium">5,320 views</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">How to Choose the Perfect Caterer for Your Event</div>
                            <div className="text-sm text-muted-foreground">Published: March 22, 2025</div>
                          </div>
                          <div className="text-sm font-medium">4,150 views</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">Budget-Friendly Event Planning Guide</div>
                            <div className="text-sm text-muted-foreground">Published: April 10, 2025</div>
                          </div>
                          <div className="text-sm font-medium">3,780 views</div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">Corporate Event Planning 101</div>
                            <div className="text-sm text-muted-foreground">Published: March 15, 2025</div>
                          </div>
                          <div className="text-sm font-medium">3,210 views</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Feedback & Ratings</CardTitle>
                    <CardDescription>Reviews and ratings across the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-4xl font-bold">4.7</div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-5 w-5 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">Average vendor rating</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>Total reviews: 3,480</div>
                          <div className="text-green-500">+18% increase</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span>5 stars</span>
                            <div className="w-48 mx-4">
                              <Progress value={75} className="h-2" />
                            </div>
                          </div>
                          <span>75%</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span>4 stars</span>
                            <div className="w-48 mx-4">
                              <Progress value={18} className="h-2" />
                            </div>
                          </div>
                          <span>18%</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span>3 stars</span>
                            <div className="w-48 mx-4">
                              <Progress value={5} className="h-2" />
                            </div>
                          </div>
                          <span>5%</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span>2 stars</span>
                            <div className="w-48 mx-4">
                              <Progress value={1} className="h-2" />
                            </div>
                          </div>
                          <span>1%</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span>1 star</span>
                            <div className="w-48 mx-4">
                              <Progress value={1} className="h-2" />
                            </div>
                          </div>
                          <span>1%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Search Analytics</CardTitle>
                    <CardDescription>Performance of platform search functionality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Total Searches</div>
                          <div className="text-2xl font-bold">{overviewData.searchCount.toLocaleString()}</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">23%</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Search Click-Through</div>
                          <div className="text-2xl font-bold">68%</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">3%</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Zero Results Rate</div>
                          <div className="text-2xl font-bold">4.2%</div>
                          <div className="flex items-center text-xs">
                            <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">1.3%</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Avg. Results Displayed</div>
                          <div className="text-2xl font-bold">28</div>
                          <div className="flex items-center text-xs">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">5</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Top Search Terms with No Results</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs">Virtual event planners</div>
                          <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs">Vegan catering Durban</div>
                          <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs">Stadium venues Port Elizabeth</div>
                          <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs">Eco-friendly decor rental</div>
                        </div>
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