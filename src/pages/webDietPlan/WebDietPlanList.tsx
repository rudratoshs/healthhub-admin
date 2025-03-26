import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { listDietPlans, archiveDietPlan } from '@/lib/webDietPlan';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Clock, CheckCircle, Archive } from 'lucide-react';

const WebDietPlanList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['webDietPlans'],
    queryFn: listDietPlans,
  });

  const archiveMutation = useMutation({
    mutationFn: (planId: number) => archiveDietPlan({ plan_id: planId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webDietPlans'] });
    },
  });

  const handleViewPlan = (planId: number) => {
    navigate(`/web-diet-plan/${planId}`);
  };

  const handleArchivePlan = (planId: number) => {
    if (confirm('Are you sure you want to archive this diet plan?')) {
      archiveMutation.mutate(planId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'inactive':
        return <Archive className="h-4 w-4 text-slate-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Diet Plans</h1>
        <p className="text-muted-foreground">
          View and manage your personalized diet plans
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load diet plans. Please try again.
              </AlertDescription>
            </Alert>
          ) : data && data.data.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data
                .filter((plan) => plan.status === 'active')
                .map((plan) => (
                  <Card key={plan.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold">{plan.title}</CardTitle>
                        <div className="flex items-center">
                          {getStatusIcon(plan.status)}
                        </div>
                      </div>
                      <CardDescription>
                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Daily Calories:</span>
                          <span className="font-medium">{plan.daily_calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{plan.protein_grams}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-medium">{plan.carbs_grams}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fats:</span>
                          <span className="font-medium">{plan.fats_grams}g</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleArchivePlan(plan.id)}
                        disabled={archiveMutation.isPending}
                      >
                        Archive
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewPlan(plan.id)}
                      >
                        View Plan
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No active diet plans found. Complete an assessment to get your personalized diet plan.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="archived" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : data && data.data.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data
                .filter((plan) => plan.status === 'inactive')
                .map((plan) => (
                  <Card key={plan.id} className="shadow-md opacity-75">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold">{plan.title}</CardTitle>
                        <div className="flex items-center">
                          {getStatusIcon(plan.status)}
                        </div>
                      </div>
                      <CardDescription>
                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Daily Calories:</span>
                          <span className="font-medium">{plan.daily_calories} kcal</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPlan(plan.id)}
                      >
                        View Plan
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No archived diet plans found.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : data && data.data.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${plan.status !== 'active' ? 'opacity-75' : ''}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">{plan.title}</CardTitle>
                      <div className="flex items-center">
                        {getStatusIcon(plan.status)}
                      </div>
                    </div>
                    <CardDescription>
                      {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Daily Calories:</span>
                        <span className="font-medium">{plan.daily_calories} kcal</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {plan.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleArchivePlan(plan.id)}
                        disabled={archiveMutation.isPending}
                      >
                        Archive
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant={plan.status === 'active' ? 'default' : 'outline'}
                      onClick={() => handleViewPlan(plan.id)}
                      className="ml-auto"
                    >
                      View Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No diet plans found. Complete an assessment to get your personalized diet plan.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Need a new diet plan? Complete an assessment to get a personalized plan.
        </p>
        <Button onClick={() => navigate('/web-assessment/start')}>
          Start New Assessment
        </Button>
      </div>
    </div>
  );
};

export default WebDietPlanList;