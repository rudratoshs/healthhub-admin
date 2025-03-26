
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGym } from "@/lib/gyms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Users, Settings } from "lucide-react";
import AIClientSettings from "@/components/aiConfiguration/AIClientSettings";
import GymSubscriptionDetails from "@/components/subscription/GymSubscriptionDetails";
import SubscribeGymDialog from "@/components/subscription/SubscribeGymDialog";
import CancelGymSubscriptionDialog from "@/components/subscription/CancelGymSubscriptionDialog";

const GymDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gymId = id ? parseInt(id) : 0;
  
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["gym", gymId],
    queryFn: () => getGym(gymId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading gym details...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
        Error loading gym: {(error as Error).message}
      </div>
    );
  }

  const gym = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{gym.name}</h1>
          <p className="text-muted-foreground">Gym details and management</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/gyms/${gym.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Gym
          </Button>
          <Button onClick={() => navigate(`/gyms/${gym.id}/users`)}>
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button onClick={() => navigate(`/gyms/${gym.id}/ai-configurations`)}>
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gym Information</CardTitle>
              <CardDescription>Basic details about the gym</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p className="text-sm text-muted-foreground">{gym.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Phone</h3>
                  <p className="text-sm text-muted-foreground">{gym.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground">{gym.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(gym.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(gym.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/gyms">Back to Gyms</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="subscription" className="space-y-4">
          <GymSubscriptionDetails 
            gymId={gymId}
            onSubscribe={() => setIsSubscribeDialogOpen(true)}
            onUpdateSubscription={() => setIsSubscribeDialogOpen(true)}
            onCancelSubscription={() => setIsCancelDialogOpen(true)}
          />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <AIClientSettings gymId={gymId} />
        </TabsContent>
      </Tabs>
      
      <SubscribeGymDialog 
        gymId={gymId}
        isOpen={isSubscribeDialogOpen}
        onClose={() => setIsSubscribeDialogOpen(false)}
      />
      
      <CancelGymSubscriptionDialog
        gymId={gymId}
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
      />
    </div>
  );
};

export default GymDetail;
