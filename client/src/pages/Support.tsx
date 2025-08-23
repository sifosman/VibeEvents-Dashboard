import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  HelpCircle, 
  Send, 
  Bug, 
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
}

export default function Support() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("faq");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  // Query form state
  const [queryForm, setQueryForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: ""
  });

  // Technical issue form state
  const [issueForm, setIssueForm] = useState({
    issueType: "",
    browser: "",
    device: "",
    description: "",
    stepsToReproduce: ""
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! Welcome to HowzEventz support. How can I help you today?',
      timestamp: '09:30'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOnline, setIsChatOnline] = useState(true);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I create an event planning profile?",
      answer: "To create your event planning profile, go to your dashboard and click on 'My Profile'. Fill out all the required information including event type, date, guest count, and your specific requirements. This helps us recommend the most suitable vendors for your event.",
      category: "Getting Started",
      helpful: 45
    },
    {
      id: 2,
      question: "How do I search for vendors?",
      answer: "You can search for vendors by going to the 'Vendors' page and using our advanced filters. Filter by category, location, price range, event type, and specific requirements. You can also use the search bar to find vendors by name or service type.",
      category: "Finding Vendors",
      helpful: 38
    },
    {
      id: 3,
      question: "What's the difference between vendor subscription tiers?",
      answer: "We have three vendor tiers: Basic (free listing with contact info), Premium (enhanced profile with reviews, gallery, and priority placement), and Premium Pro (all Premium features plus advanced analytics, priority support, and featured placement).",
      category: "Vendor Services",
      helpful: 32
    },
    {
      id: 4,
      question: "How do I contact a vendor?",
      answer: "On each vendor's profile page, you'll find contact options including phone, email, and social media links. Premium vendors may also have instant messaging capabilities. Simply click on your preferred contact method to get in touch.",
      category: "Communication",
      helpful: 41
    },
    {
      id: 5,
      question: "Can I save vendors to view later?",
      answer: "Yes! Click the heart icon on any vendor card or profile to add them to your favorites. You can view all your saved vendors by going to 'My Favourites' from your dashboard.",
      category: "Account Features",
      helpful: 29
    },
    {
      id: 6,
      question: "How do I leave a review for a vendor?",
      answer: "After working with a vendor, visit their profile page and click 'Click to Rate & Review'. You'll be able to rate them on various criteria and share your experience to help other users make informed decisions.",
      category: "Reviews",
      helpful: 35
    },
    {
      id: 7,
      question: "What if I forgot my password?",
      answer: "On the login page, click 'Forgot Password' and enter your email address. We'll send you a secure link to reset your password. Make sure to check your spam folder if you don't see the email within a few minutes.",
      category: "Account Issues",
      helpful: 22
    },
    {
      id: 8,
      question: "How do I update my account information?",
      answer: "Go to 'My Account' from your dashboard to update your personal information, email address, phone number, and notification preferences. Changes are saved automatically.",
      category: "Account Management",
      helpful: 18
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Query Submitted Successfully",
      description: "We've received your query and will respond within 24 hours.",
    });

    setQueryForm({
      subject: "",
      category: "",
      priority: "",
      description: ""
    });
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Technical Issue Reported",
      description: "Our technical team has been notified and will investigate the issue.",
    });

    setIssueForm({
      issueType: "",
      browser: "",
      device: "",
      description: "",
      stepsToReproduce: ""
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate support response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Thank you for your message. Let me look into that for you.",
        "I understand your concern. Let me check our records and get back to you.",
        "That's a great question! Here's what I can help you with...",
        "I'll escalate this to our technical team for a detailed response.",
        "Is there anything else I can help you with today?"
      ];
      
      const supportMessage: ChatMessage = {
        id: chatMessages.length + 2,
        sender: 'support',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Support Center - HowzEventz</title>
        <meta name="description" content="Get help with HowzEventz - FAQs, live chat, submit queries, and report technical issues" />
      </Helmet>

      <div className="bg-neutral min-h-[calc(100vh-64px)]">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold mb-4">Support Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Find answers to common questions, chat with our support team, 
              or submit a query for personalized assistance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("faq")}>
              <CardContent className="p-4 text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">FAQs</h3>
                <p className="text-sm text-muted-foreground">Common questions</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("chat")}>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">Live Chat</h3>
                <div className="flex items-center justify-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${isChatOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm text-muted-foreground">{isChatOnline ? 'Online' : 'Offline'}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("query")}>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Submit Query</h3>
                <p className="text-sm text-muted-foreground">Get personalized help</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("technical")}>
              <CardContent className="p-4 text-center">
                <Bug className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="font-medium">Report Issue</h3>
                <p className="text-sm text-muted-foreground">Technical problems</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">FAQs</TabsTrigger>
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
              <TabsTrigger value="query">Submit Query</TabsTrigger>
              <TabsTrigger value="technical">Report Issue</TabsTrigger>
            </TabsList>

            {/* FAQs Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Search through our most common questions and answers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <Badge key={category} variant="secondary" className="cursor-pointer">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <Card key={faq.id} className="border">
                        <CardHeader 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">{faq.question}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                                <span className="text-xs text-muted-foreground">{faq.helpful} found helpful</span>
                              </div>
                            </div>
                            {expandedFAQ === faq.id ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </div>
                        </CardHeader>
                        {expandedFAQ === faq.id && (
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                              <span className="text-sm text-muted-foreground">Was this helpful?</span>
                              <Button variant="outline" size="sm">Yes</Button>
                              <Button variant="outline" size="sm">No</Button>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Live Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Live Chat Support</CardTitle>
                      <CardDescription>
                        Chat with our support team in real-time
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${isChatOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">{isChatOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg h-96 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={!isChatOnline}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!isChatOnline || !newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submit Query Tab */}
            <TabsContent value="query" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Query</CardTitle>
                  <CardDescription>
                    Send us your question and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleQuerySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your query"
                          value={queryForm.subject}
                          onChange={(e) => setQueryForm(prev => ({ ...prev, subject: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={queryForm.category}
                          onChange={(e) => setQueryForm(prev => ({ ...prev, category: e.target.value }))}
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="account">Account Issues</option>
                          <option value="vendors">Vendor Related</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="features">Platform Features</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <select
                        id="priority"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={queryForm.priority}
                        onChange={(e) => setQueryForm(prev => ({ ...prev, priority: e.target.value }))}
                        required
                      >
                        <option value="">Select priority</option>
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your query..."
                        value={queryForm.description}
                        onChange={(e) => setQueryForm(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-32"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Query
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Issues Tab */}
            <TabsContent value="technical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Technical Issue</CardTitle>
                  <CardDescription>
                    Help us fix technical problems by providing detailed information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleIssueSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="issueType">Issue Type</Label>
                        <select
                          id="issueType"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={issueForm.issueType}
                          onChange={(e) => setIssueForm(prev => ({ ...prev, issueType: e.target.value }))}
                          required
                        >
                          <option value="">Select issue type</option>
                          <option value="loading">Page loading issues</option>
                          <option value="login">Login/Authentication problems</option>
                          <option value="search">Search functionality</option>
                          <option value="vendor">Vendor listings/profiles</option>
                          <option value="messaging">Communication features</option>
                          <option value="mobile">Mobile app issues</option>
                          <option value="other">Other technical issue</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="browser">Browser</Label>
                        <select
                          id="browser"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={issueForm.browser}
                          onChange={(e) => setIssueForm(prev => ({ ...prev, browser: e.target.value }))}
                          required
                        >
                          <option value="">Select browser</option>
                          <option value="chrome">Google Chrome</option>
                          <option value="firefox">Mozilla Firefox</option>
                          <option value="safari">Safari</option>
                          <option value="edge">Microsoft Edge</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="device">Device</Label>
                      <select
                        id="device"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={issueForm.device}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, device: e.target.value }))}
                        required
                      >
                        <option value="">Select device type</option>
                        <option value="desktop">Desktop Computer</option>
                        <option value="laptop">Laptop</option>
                        <option value="tablet">Tablet</option>
                        <option value="mobile">Mobile Phone</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issueDescription">Issue Description</Label>
                      <Textarea
                        id="issueDescription"
                        placeholder="Describe what happened, what you expected to happen, and any error messages you saw..."
                        value={issueForm.description}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-24"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                      <Textarea
                        id="stepsToReproduce"
                        placeholder="1. First I did this...&#10;2. Then I clicked on...&#10;3. The error occurred when..."
                        value={issueForm.stepsToReproduce}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, stepsToReproduce: e.target.value }))}
                        className="min-h-24"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Bug className="mr-2 h-4 w-4" />
                      Report Technical Issue
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
              <CardDescription>Alternative contact methods for urgent issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">+27 21 123 4567</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri: 8AM-6PM SAST</p>
                </div>
                
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@howzeventz.com</p>
                  <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                </div>
                
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium">Response Times</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="block">High Priority: 2-4 hours</span>
                    <span className="block">Standard: 24 hours</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}