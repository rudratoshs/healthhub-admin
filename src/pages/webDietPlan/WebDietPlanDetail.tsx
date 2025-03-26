import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { getActiveDietPlan, getDayPlan } from '@/lib/webDietPlan';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Clock, Utensils } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const WebDietPlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const today = new Date().getDay();
    return days[today === 0 ? 6 : today - 1]; // Convert to 0-based array index (Sunday = 6)
  });

  // Get diet plan details
  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ['webDietPlan', planId ? parseInt(planId) : 'active'],
    queryFn: () => planId ? getActiveDietPlan() : getActiveDietPlan(),
  });

  // Get day plan details
  const { data: dayPlan, isLoading: dayLoading } = useQuery({
    queryKey: ['webDayPlan', plan?.id, selectedDay],
    queryFn: () => getDayPlan(plan?.id || 0, selectedDay),
    enabled: !!plan?.id,
  });

  const handleBack = () => {
    navigate('/web-diet-plan');
  };

  const handleViewMeal = (mealId: number) => {
    navigate(`/web-diet-plan/meal/${mealId}`);
  };

  if (planLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Diet plan not found. Please go back and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Diet Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Diet Plans
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
        <p className="text-muted-foreground">
          {plan.description || "Your personalized nutrition plan"}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Daily Calories</span>
                    <span className="text-sm font-medium">{plan.daily_calories} kcal</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm font-medium">{plan.protein_grams}g</span>
                  </div>
                  <Progress value={30} className="h-2 bg-blue-100" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Carbs</span>
                    <span className="text-sm font-medium">{plan.carbs_grams}g</span>
                  </div>
                  <Progress value={50} className="h-2 bg-green-100" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fats</span>
                    <span className="text-sm font-medium">{plan.fats_grams}g</span>
                  </div>
                  <Progress value={20} className="h-2 bg-yellow-100" />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Plan Details</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{new Date(plan.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{new Date(plan.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={plan.status === 'active' ? 'default' : 'outline'}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Meal Plan</CardTitle>
              <CardDescription>Select a day to view your meals</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                <TabsList className="grid grid-cols-7">
                  {days.map((day) => (
                    <TabsTrigger key={day} value={day} className="capitalize">
                      {day.slice(0, 3)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {days.map((day) => (
                  <TabsContent key={day} value={day}>
                    <h3 className="text-lg font-medium capitalize mb-4">{day}'s Meals</h3>
                    
                    {dayLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader size="md" />
                      </div>
                    ) : dayPlan && dayPlan.meals && dayPlan.meals.length > 0 ? (
                      <div className="space-y-6">
                        {dayPlan.meals.map((meal) => (
                          <div key={meal.id} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-base font-medium">{meal.name}</h4>
                                <p className="text-sm text-muted-foreground">{meal.time_of_day}</p>
                              </div>
                              <Badge>{meal.calories} kcal</Badge>
                            </div>
                            
                            <p className="text-sm mb-3">{meal.description}</p>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                              <div>Protein: {meal.protein_grams}g</div>
                              <div>Carbs: {meal.carbs_grams}g</div>
                              <div>Fats: {meal.fats_grams}g</div>
                            </div>
                            
                            <Separator className="my-3" />
                            
                            <div className="mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewMeal(meal.id)}
                                className="flex items-center text-xs"
                              >
                                <Utensils className="h-3 w-3 mr-1" />
                                View Recipes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-md">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Meals Available</h3>
                        <p className="text-muted-foreground mb-4">
                          There are no meals available for this day yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebDietPlanDetail;