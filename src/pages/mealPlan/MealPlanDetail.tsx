
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMealPlan } from '@/lib/mealPlans';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import MealPlanDetail from '@/components/dietPlan/MealPlanDetail';

const MealPlanDetailPage: React.FC = () => {
  const { id, dietPlanId } = useParams<{ id: string; dietPlanId: string }>();
  const navigate = useNavigate();
  
  const mealPlanId = id ? parseInt(id) : 0;
  const dietPlanIdInt = dietPlanId ? parseInt(dietPlanId) : 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ['mealPlan', dietPlanIdInt, mealPlanId],
    queryFn: () => getMealPlan(dietPlanIdInt, mealPlanId),
    enabled: !!mealPlanId && !!dietPlanIdInt,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader size="lg" variant="primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Error Loading Meal Plan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>There was an error loading the meal plan. The plan may not exist.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(`/diet-plans/${dietPlanIdInt}`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Diet Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mealPlan = data.data;
  const dayOfWeek = mealPlan.day_of_week.charAt(0).toUpperCase() + mealPlan.day_of_week.slice(1);

  return (
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-primary-900">{dayOfWeek} Meal Plan</h1>
          <p className="text-muted-foreground">View and manage meals for {dayOfWeek}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/diet-plans/${dietPlanIdInt}`)}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Diet Plan
          </Button>
          <Button onClick={() => navigate(`/diet-plans/${dietPlanIdInt}/meal-plans/${mealPlanId}/edit`)} className="bg-primary hover:bg-primary-600">
            <Edit size={16} className="mr-2" />
            Edit Meal Plan
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <Calendar size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">{dayOfWeek}</h2>
            <p className="text-sm text-muted-foreground">Diet Plan ID: {dietPlanIdInt}</p>
          </div>
        </div>
      </div>

      <MealPlanDetail mealPlan={mealPlan} />
    </div>
  );
};

export default MealPlanDetailPage;
