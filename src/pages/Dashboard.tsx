
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import StatCard from "@/components/StatCard";
import { Users, Utensils, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const pieData = [
  { name: "Active", value: 65, color: "#9b87f5" },
  { name: "Inactive", value: 25, color: "#fec6a1" },
  { name: "Pending", value: 10, color: "#d3e4fd" },
];

const areaData = [
  { name: "Jan", users: 30, plans: 40 },
  { name: "Feb", users: 45, plans: 55 },
  { name: "Mar", users: 75, plans: 85 },
  { name: "Apr", users: 85, plans: 95 },
  { name: "May", users: 95, plans: 105 },
  { name: "Jun", users: 115, plans: 125 },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const chartConfig = {
    users: {
      label: "Users",
      theme: {
        light: "#9b87f5",
        dark: "#7E69AB",
      },
    },
    plans: {
      label: "Meal Plans",
      theme: {
        light: "#fec6a1",
        dark: "#FFA99F",
      },
    },
  };

  return (
    <div className="space-y-8 p-8">
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
            <CardTitle>Growth Overview</CardTitle>
            <CardDescription>User and meal plan growth over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="plansGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fec6a1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fec6a1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#9b87f5"
                    fillOpacity={1}
                    fill="url(#usersGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="plans"
                    name="Meal Plans"
                    stroke="#fec6a1"
                    fillOpacity={1}
                    fill="url(#plansGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>Current user status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
