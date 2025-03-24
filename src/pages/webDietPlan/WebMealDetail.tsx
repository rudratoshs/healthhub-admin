
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { getMealDetails } from '@/lib/webDietPlan';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Clock, Check, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const WebMealDetail: React.FC = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();

  const { data: meal, isLoading } = useQuery({
    queryKey: ['webMeal', parseInt(mealId || '0')],
    queryFn: () => getMealDetails(parseInt(mealId || '0')),
    enabled: !!mealId,
  });

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Meal not found. Please go back and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{meal.name}</h1>
        <p className="text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-1" /> {meal.time_of_day}
          <Badge className="ml-2">{meal.calories} kcal</Badge>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meal Overview</CardTitle>
              <CardDescription>{meal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{meal.protein_grams}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{meal.carbs_grams}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{meal.fats_grams}g</div>
                  <div className="text-sm text-muted-foreground">Fats</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {meal.recipes.map((recipe, index) => (
            <Card key={recipe.id} className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Ingredients</h3>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="h-4 w-4 mr-1 mt-1 text-primary" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-medium mb-2">Nutrition Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: {recipe.nutrition_info.calories} kcal</div>
                    <div>Protein: {recipe.nutrition_info.protein_grams}g</div>
                    <div>Carbs: {recipe.nutrition_info.carbs_grams}g</div>
                    <div>Fats: {recipe.nutrition_info.fats_grams}g</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          {meal.recipes.map((recipe) => (
            <Card key={`instructions-${recipe.id}`} className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {recipe.name} - Preparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex">
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 mt-0.5">
                        {idx + 1}
                      </div>
                      <p>{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  <p>Ensure all ingredients are properly measured for the best results.</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebMealDetail;
