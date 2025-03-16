
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { Users, Utensils, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening with your nutrition planning.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Download Reports</Button>
          <Button>Create New Plan</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Clients"
          value="24"
          icon={<Users size={18} />}
          trend={{ value: 12, positive: true }}
          description="vs. last month"
        />
        <StatCard
          title="Meal Plans"
          value="128"
          icon={<Utensils size={18} />}
          trend={{ value: 8, positive: true }}
          description="vs. last month"
        />
        <StatCard
          title="Scheduled Sessions"
          value="32"
          icon={<Calendar size={18} />}
          trend={{ value: 4, positive: false }}
          description="vs. last month"
        />
        <StatCard
          title="Client Progress"
          value="87%"
          icon={<TrendingUp size={18} />}
          description="Average goal achievement"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your most recent nutrition planning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Utensils className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New meal plan created</p>
                  <p className="text-xs text-muted-foreground">
                    You created a new meal plan for Sarah Johnson
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New client registered</p>
                  <p className="text-xs text-muted-foreground">
                    Michael Brown signed up for your services
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">5h ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Progress update</p>
                  <p className="text-xs text-muted-foreground">
                    Emily Wilson reached 75% of her weight goal
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">1d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled client sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">David Williams</p>
                    <p className="text-xs text-muted-foreground">
                      Initial Nutrition Consultation
                    </p>
                  </div>
                </div>
                <div className="text-sm">Today, 2:00 PM</div>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jessica Miller</p>
                    <p className="text-xs text-muted-foreground">
                      Progress Review
                    </p>
                  </div>
                </div>
                <div className="text-sm">Tomorrow, 10:30 AM</div>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Robert Taylor</p>
                    <p className="text-xs text-muted-foreground">
                      Meal Plan Adjustment
                    </p>
                  </div>
                </div>
                <div className="text-sm">Sep 15, 3:15 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
