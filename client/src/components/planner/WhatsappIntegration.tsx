import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { WhatsappGroup } from "@shared/schema";
import { 
  MessageSquare, 
  Link as LinkIcon, 
  Check, 
  X, 
  Plus, 
  RefreshCw, 
  Settings, 
  AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function WhatsappIntegration({ userId }: { userId: number }) {
  const [groupName, setGroupName] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch WhatsApp groups for this user
  const { data: whatsappGroups, isLoading } = useQuery<WhatsappGroup[]>({
    queryKey: [`/api/whatsapp-groups/${userId}`],
  });

  // Add a new WhatsApp group
  const linkGroupMutation = useMutation({
    mutationFn: async (data: { groupName: string; groupId: string }) => {
      return apiRequest("POST", "/api/whatsapp-groups", {
        userId,
        groupName: data.groupName,
        groupId: data.groupId
      });
    },
    onSuccess: () => {
      toast({
        title: "WhatsApp Group Linked",
        description: "Your WhatsApp group has been linked successfully.",
      });
      setGroupName("");
      setGroupId("");
      setIsLinking(false);
      queryClient.invalidateQueries({ queryKey: [`/api/whatsapp-groups/${userId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Linking Group",
        description: error.message || "There was an error linking your WhatsApp group.",
        variant: "destructive",
      });
    }
  });

  // Remove a WhatsApp group
  const unlinkGroupMutation = useMutation({
    mutationFn: async (groupId: number) => {
      return apiRequest("DELETE", `/api/whatsapp-groups/${groupId}`);
    },
    onSuccess: () => {
      toast({
        title: "WhatsApp Group Unlinked",
        description: "Your WhatsApp group has been unlinked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/whatsapp-groups/${userId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Unlinking Group",
        description: error.message || "There was an error unlinking your WhatsApp group.",
        variant: "destructive",
      });
    }
  });

  // Toggle task sync for a group
  const toggleTaskSyncMutation = useMutation({
    mutationFn: async ({ groupId, syncEnabled }: { groupId: number; syncEnabled: boolean }) => {
      return apiRequest("PATCH", `/api/whatsapp-groups/${groupId}/task-sync`, {
        syncEnabled
      });
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your WhatsApp integration settings have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/whatsapp-groups/${userId}`] });
    }
  });

  const handleLinkGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName || !groupId) {
      toast({
        title: "Missing Information",
        description: "Please provide both a group name and group ID.",
        variant: "destructive",
      });
      return;
    }
    
    linkGroupMutation.mutate({ groupName, groupId });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold mb-1">WhatsApp Integration</h2>
          <p className="text-muted-foreground">Connect your WhatsApp groups to sync tasks and updates</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsLinking(true)}
            >
              <LinkIcon size={16} />
              Link WhatsApp Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link a WhatsApp Group</DialogTitle>
              <DialogDescription>
                Link your existing WhatsApp group to sync tasks, timelines, and updates automatically.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleLinkGroup} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input 
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Venue Team, Photography Team, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group-id">WhatsApp Group ID</Label>
                <Input 
                  id="group-id"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Enter the WhatsApp group ID"
                />
                <p className="text-xs text-muted-foreground">
                  You'll receive this ID after adding the HowzEvent bot to your WhatsApp group.
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLinking(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={linkGroupMutation.isPending}
                >
                  {linkGroupMutation.isPending ? "Linking..." : "Link Group"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border border-accent rounded-lg p-6 bg-white">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-primary" />
            <h3 className="font-semibold">Your Linked WhatsApp Groups</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Tasks and updates will be synced between HowzEvent and these WhatsApp groups.
          </p>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : whatsappGroups && whatsappGroups.length > 0 ? (
          <div className="space-y-4">
            {whatsappGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{group.groupName}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <span className="text-xs bg-accent py-1 px-2 rounded-full mr-2">
                          Group ID: {group.groupId.slice(0, 12)}...
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          group.status === "active" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-yellow-100 text-yellow-600"
                        }`}>
                          {group.status === "active" ? "Connected" : "Pending"}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>WhatsApp Group Settings</DialogTitle>
                            <DialogDescription>
                              Configure sync settings for "{group.groupName}"
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Task Synchronization</h4>
                                <p className="text-sm text-muted-foreground">
                                  Create tasks from WhatsApp messages
                                </p>
                              </div>
                              <Switch 
                                checked={group.taskSync || false} 
                                onCheckedChange={(checked) => 
                                  toggleTaskSyncMutation.mutate({ 
                                    groupId: group.id, 
                                    syncEnabled: checked 
                                  })
                                }
                              />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Timeline Synchronization</h4>
                                <p className="text-sm text-muted-foreground">
                                  Add timeline events from WhatsApp messages
                                </p>
                              </div>
                              <Switch 
                                checked={group.timelineSync || false} 
                                onCheckedChange={(checked) => 
                                  toggleTaskSyncMutation.mutate({ 
                                    groupId: group.id, 
                                    syncEnabled: checked 
                                  })
                                }
                              />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Event Notifications</h4>
                                <p className="text-sm text-muted-foreground">
                                  Send event updates to WhatsApp
                                </p>
                              </div>
                              <Switch 
                                checked={group.notificationsEnabled || false} 
                                onCheckedChange={(checked) => 
                                  toggleTaskSyncMutation.mutate({ 
                                    groupId: group.id, 
                                    syncEnabled: checked 
                                  })
                                }
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => unlinkGroupMutation.mutate(group.id)}
                        disabled={unlinkGroupMutation.isPending}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <div className="text-xs py-1 px-2 bg-primary/10 text-primary rounded-md flex items-center gap-1">
                      <Check size={12} /> Task sync enabled
                    </div>
                    <div className="text-xs py-1 px-2 bg-primary/10 text-primary rounded-md flex items-center gap-1">
                      <Check size={12} /> Timeline sync enabled
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Last activity: {
                      new Date(group.lastActivity || group.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-accent/30 rounded-lg p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-medium mb-1">No WhatsApp Groups Linked</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Link your WhatsApp groups to enable automatic task and timeline syncing
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsLinking(true)}
                >
                  <Plus size={16} />
                  Link Your First Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link a WhatsApp Group</DialogTitle>
                  <DialogDescription>
                    Link your existing WhatsApp group to sync tasks, timelines, and updates automatically.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleLinkGroup} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input 
                      id="group-name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Venue Team, Photography Team, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="group-id">WhatsApp Group ID</Label>
                    <Input 
                      id="group-id"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      placeholder="Enter the WhatsApp group ID"
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll receive this ID after adding the HowzEvent bot to your WhatsApp group.
                    </p>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsLinking(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={linkGroupMutation.isPending}
                    >
                      {linkGroupMutation.isPending ? "Linking..." : "Link Group"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      <div className="bg-accent/30 border border-accent rounded-lg p-6">
        <h3 className="font-semibold mb-3">How to connect your WhatsApp group:</h3>
        <ol className="space-y-3 pl-5 list-decimal">
          <li className="text-sm">
            Add the HowzEvent WhatsApp bot (<span className="font-medium">+1 555-123-4567</span>) to your WhatsApp group.
          </li>
          <li className="text-sm">
            Type <span className="font-mono bg-accent/50 px-1 rounded">!register</span> in the group to receive a unique group ID.
          </li>
          <li className="text-sm">
            Come back here and click "Link WhatsApp Group", then enter the group name and ID.
          </li>
          <li className="text-sm">
            Once linked, use the following commands in WhatsApp:
            <ul className="pl-5 mt-2 space-y-1 list-disc">
              <li className="text-sm">
                <span className="font-mono bg-accent/50 px-1 rounded">!task [task description]</span> - Create a new task
              </li>
              <li className="text-sm">
                <span className="font-mono bg-accent/50 px-1 rounded">!timeline [event] [date]</span> - Add timeline event
              </li>
              <li className="text-sm">
                <span className="font-mono bg-accent/50 px-1 rounded">!help</span> - See all available commands
              </li>
            </ul>
          </li>
        </ol>
        <div className="mt-4 pt-4 border-t border-accent">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Standard WhatsApp messaging rates may apply. By linking your WhatsApp group, you agree to our integration terms.
          </p>
        </div>
      </div>
    </div>
  );
}