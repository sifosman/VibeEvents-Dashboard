import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  DollarSign, 
  MessageSquare, 
  Users, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText
} from "lucide-react";
import { VendorQuoteDashboard } from "@/components/vendors/VendorQuoteDashboard";

export default function VendorDashboard() {
  // Mock analytics data - in real app this would come from API
  const analytics = {
    totalQuotes: 24,
    pendingQuotes: 7,
    acceptedQuotes: 12,
    totalRevenue: 45750,
    monthlyRevenue: 12300,
    conversionRate: 65,
    averageQuoteValue: 2850
  };

  const recentActivities = [
    {
      id: 1,
      type: 'quote_accepted',
      customer: 'Sarah Johnson',
      amount: 5610,
      timestamp: '2 hours ago',
      description: 'Wedding quote accepted'
    },
    {
      id: 2,
      type: 'new_quote_request',
      customer: 'Michael Chen',
      amount: null,
      timestamp: '4 hours ago',
      description: 'Corporate event quote requested'
    },
    {
      id: 3,
      type: 'message_received',
      customer: 'Emma Williams',
      amount: null,
      timestamp: '6 hours ago',
      description: 'Customer message about birthday party'
    },
    {
      id: 4,
      type: 'invoice_paid',
      customer: 'David Lee',
      amount: 3200,
      timestamp: '1 day ago',
      description: 'Invoice #INV-0024 paid in full'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quote_accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'new_quote_request':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'message_received':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'invoice_paid':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'quote_accepted':
        return <Badge variant="default" className="bg-green-600">Accepted</Badge>;
      case 'new_quote_request':
        return <Badge variant="secondary">New Request</Badge>;
      case 'message_received':
        return <Badge variant="outline">Message</Badge>;
      case 'invoice_paid':
        return <Badge variant="default" className="bg-green-600">Paid</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Vendor Dashboard - HowzEventz</title>
        <meta name="description" content="Manage your quotes, bookings, and customer communications" />
      </Helmet>

      <div className="bg-neutral min-h-[calc(100vh-64px)]">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your quotes, track performance, and communicate with customers
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quote Management
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalQuotes}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.pendingQuotes}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting customer response
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.monthlyRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Quote to booking rate
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-auto p-4 flex flex-col items-center gap-2">
                      <FileText className="h-6 w-6" />
                      <span>Create New Quote</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      <span>Update Availability</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Users className="h-6 w-6" />
                      <span>Contact Customer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest updates and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getActivityIcon(activity.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{activity.customer}</span>
                              {getActivityBadge(activity.type)}
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.amount && (
                            <div className="font-medium">{formatCurrency(activity.amount)}</div>
                          )}
                          <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>This Month's Performance</CardTitle>
                    <CardDescription>Key metrics for the current month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-medium">{formatCurrency(analytics.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quotes Sent</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bookings Confirmed</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Quote Value</span>
                      <span className="font-medium">{formatCurrency(analytics.averageQuoteValue)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your confirmed bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">Sarah's Wedding</div>
                          <div className="text-sm text-muted-foreground">Cape Town</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Aug 15</div>
                          <div className="text-xs text-muted-foreground">120 guests</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">Corporate Launch</div>
                          <div className="text-sm text-muted-foreground">Johannesburg</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Feb 28</div>
                          <div className="text-xs text-muted-foreground">80 guests</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">Birthday Party</div>
                          <div className="text-sm text-muted-foreground">Durban</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Mar 10</div>
                          <div className="text-xs text-muted-foreground">25 guests</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quote Management Tab */}
            <TabsContent value="quotes">
              <VendorQuoteDashboard />
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                  <CardDescription>Manage your bookings and availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Calendar Integration</h3>
                    <p className="text-muted-foreground mb-6">
                      View and manage your event bookings, availability, and schedule
                    </p>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Open Calendar View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Messages</CardTitle>
                  <CardDescription>Communicate with your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Message Center</h3>
                    <p className="text-muted-foreground mb-6">
                      View and respond to customer messages and quote inquiries
                    </p>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}