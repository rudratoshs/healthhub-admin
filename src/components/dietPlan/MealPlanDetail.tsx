
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMealPlan } from '@/lib/dietPlans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Coffee, ChefHat, Clock, Utensils, ArrowLeft, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface MealPlanDetailProps {
  dietPlanId: number;
  mealPlanId: number;
  onBack?: () => void; // Make onBack optional
}

const MealPlanDetail: React.FC<MealPlanDetailProps> = ({ 
  dietPlanId, 
  mealPlanId,
  onBack 
}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['mealPlan', dietPlanId, mealPlanId],
    queryFn: () => getMealPlan(dietPlanId, mealPlanId),
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(`/diet-plans/${dietPlanId}`);
    }
  };

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
          <p>Failed to load meal plan. Please try again later.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleBack}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Meal Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const mealPlan = data.data;
  const dayName = mealPlan.day_of_week ? 
    mealPlan.day_of_week.charAt(0).toUpperCase() + mealPlan.day_of_week.slice(1) : 
    `Day ${mealPlan.day}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          {dayName} - {new Date(mealPlan.date).toLocaleDateString()}
        </h2>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Meal Plans
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
          <CardTitle className="text-xl text-primary-900">Meals</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {mealPlan.meals.length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No meals defined for this day yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {mealPlan.meals.map((meal) => (
                <div key={meal.id} className="py-4 first:pt-0 hover:bg-gray-50 transition-colors rounded-lg p-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlanDetail;
