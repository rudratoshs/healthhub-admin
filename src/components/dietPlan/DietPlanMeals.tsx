
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDietPlanMealPlans } from '@/lib/dietPlans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { MealPlan } from '@/types/dietPlan';
import { Calendar, Coffee, ChefHat, Clock, PlusCircle, Utensils } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface DietPlanMealsProps {
  dietPlanId: number;
}

const DietPlanMeals: React.FC<DietPlanMealsProps> = ({ dietPlanId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dietPlanMeals', dietPlanId],
    queryFn: () => getDietPlanMealPlans(dietPlanId),
  });

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return <Coffee className="h-4 w-4 text-orange-500" />;
      case 'lunch':
        return <Utensils className="h-4 w-4 text-green-500" />;
      case 'dinner':
        return <ChefHat className="h-4 w-4 text-blue-500" />;
      case 'snack':
        return <Coffee className="h-4 w-4 text-purple-500" />;
      default:
        return <Utensils className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-700">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load meal plans. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const mealPlans = data.data;

  // Group by day for tab navigation
  const dayTabs = mealPlans.map(mealPlan => ({
    id: mealPlan.id,
    day: mealPlan.day,
    date: mealPlan.date,
  }));

  if (mealPlans.length === 0) {
    return (
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-700">No Meal Plans Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Utensils className="h-12 w-12 mx-auto text-amber-400 mb-4" />
          <p className="mb-4">This diet plan doesn't have any meal plans yet.</p>
          <Button className="bg-primary hover:bg-primary-600">
            <PlusCircle className="h-4 w-4 mr-2" /> Create Meal Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
          <CardTitle className="text-xl text-primary-900">Meal Plans</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue={mealPlans[0]?.id.toString()}>
            <TabsList className="bg-background border-b w-full justify-start overflow-x-auto mb-4">
              {dayTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id.toString()}
                  className="data-[state=active]:bg-primary-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Day {tab.day}: {new Date(tab.date).toLocaleDateString()}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {mealPlans.map((mealPlan: MealPlan) => (
              <TabsContent 
                key={mealPlan.id} 
                value={mealPlan.id.toString()}
                className="animate-fade-in"
              >
                <div className="rounded-lg border mb-6">
                  <div className="bg-primary-50 p-4 rounded-t-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Day {mealPlan.day}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(mealPlan.date).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <PlusCircle className="h-4 w-4 mr-1" /> Add Meal
                    </Button>
                  </div>
                  
                  {mealPlan.meals.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No meals defined for this day.</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {mealPlan.meals.map((meal) => (
                        <div key={meal.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              {getMealTypeIcon(meal.meal_type)}
                              <h4 className="font-medium ml-2">{meal.title}</h4>
                              <Badge variant="outline" className="ml-2 text-xs bg-gray-50">
                                {meal.meal_type}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {meal.time}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                            <div className="bg-blue-50 text-blue-700 p-2 rounded-md text-center">
                              <span className="block font-semibold">{meal.calories}</span>
                              <span>kcal</span>
                            </div>
                            <div className="bg-blue-50 text-blue-700 p-2 rounded-md text-center">
                              <span className="block font-semibold">{meal.protein_grams}g</span>
                              <span>protein</span>
                            </div>
                            <div className="bg-green-50 text-green-700 p-2 rounded-md text-center">
                              <span className="block font-semibold">{meal.carbs_grams}g</span>
                              <span>carbs</span>
                            </div>
                            <div className="bg-yellow-50 text-yellow-700 p-2 rounded-md text-center">
                              <span className="block font-semibold">{meal.fats_grams}g</span>
                              <span>fats</span>
                            </div>
                          </div>
                          
                          {meal.foods.length > 0 && (
                            <>
                              <Separator className="my-3" />
                              <div>
                                <h5 className="text-sm font-medium mb-2">Foods:</h5>
                                <ul className="space-y-1">
                                  {meal.foods.map((food) => (
                                    <li key={food.id} className="text-sm flex justify-between">
                                      <span>{food.name}</span>
                                      <span className="text-muted-foreground">{food.quantity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietPlanMeals;
