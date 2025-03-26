import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDietPlanMealPlans,
  createMealPlan,
  deleteMealPlan,
} from "@/lib/dietPlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { MealPlan, CreateMealPlanRequest } from "@/types/dietPlan";
import {
  Calendar,
  Coffee,
  ChefHat,
  Clock,
  PlusCircle,
  Utensils,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import AddMealPlanDialog from "./AddMealPlanDialog";
import DeleteMealPlanDialog from "./DeleteMealPlanDialog";

interface DietPlanMealsProps {
  dietPlanId: number;
}

const DietPlanMeals: React.FC<DietPlanMealsProps> = ({ dietPlanId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dietPlanMeals", dietPlanId],
    queryFn: () => getDietPlanMealPlans(dietPlanId),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateMealPlanRequest) =>
      createMealPlan(dietPlanId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meal plan created successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["dietPlanMeals", dietPlanId],
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to create meal plan",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (mealPlanId: number) => deleteMealPlan(dietPlanId, mealPlanId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meal plan deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["dietPlanMeals", dietPlanId],
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete meal plan",
        variant: "destructive",
      });
    },
  });

  const handleAddMealPlan = (data: CreateMealPlanRequest) => {
    createMutation.mutate(data);
  };

  const handleDeleteMealPlan = () => {
    if (selectedMealPlan) {
      deleteMutation.mutate(selectedMealPlan.id);
    }
  };

  const openDeleteDialog = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setIsDeleteDialogOpen(true);
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return <Coffee className="h-4 w-4 text-orange-500" />;
      case "lunch":
        return <Utensils className="h-4 w-4 text-green-500" />;
      case "dinner":
        return <ChefHat className="h-4 w-4 text-blue-500" />;
      case "snack":
        return <Coffee className="h-4 w-4 text-purple-500" />;
      default:
        return <Utensils className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDayInfo = (mealPlan: MealPlan) => {
    const day = mealPlan.day_of_week
      ? mealPlan.day_of_week.charAt(0).toUpperCase() +
        mealPlan.day_of_week.slice(1)
      : `Day ${mealPlan.day}`;
    return `${day} - ${new Date(mealPlan.date).toLocaleDateString()}`;
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
  const dayTabs = mealPlans.map((mealPlan) => ({
    id: mealPlan.id,
    day: mealPlan.day,
    date: mealPlan.date,
    day_of_week: mealPlan.day_of_week,
  }));

  console.log('mealPlans',mealPlans)
  console.log('dayTabs',dayTabs)


  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3 flex flex-row justify-between items-center">
          <CardTitle className="text-xl text-primary-900">Meal Plans</CardTitle>
          <Button
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary-600"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Day
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {mealPlans.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Utensils className="h-12 w-12 mx-auto text-amber-400 mb-4" />
              <p className="mb-4 text-muted-foreground">
                This diet plan doesn't have any meal plans yet.
              </p>
              <Button
                className="bg-primary hover:bg-primary-600"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Create Meal Plan
              </Button>
            </div>
          ) : (
            <Tabs defaultValue={mealPlans[0]?.id.toString()}>
              <TabsList className="bg-background border-b w-full justify-start overflow-x-auto mb-4">
                {dayTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id.toString()}
                    className="data-[state=active]:bg-primary-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {tab.day_of_week
                      ? tab.day_of_week.charAt(0).toUpperCase() +
                        tab.day_of_week.slice(1)
                      : `Day ${tab.day}`}
                    : {new Date(tab.date).toLocaleDateString()}
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
                        <h3 className="font-semibold">
                          {mealPlan.day_of_week
                            ? mealPlan.day_of_week.charAt(0).toUpperCase() +
                              mealPlan.day_of_week.slice(1)
                            : `Day ${mealPlan.day}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(mealPlan.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Meal
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(mealPlan)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {!mealPlan.meals || mealPlan.meals.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No meals defined for this day.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {mealPlan.meals?.map((meal) => (
                          <div
                            key={meal.id}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {getMealTypeIcon(meal.meal_type)}
                                <h4 className="font-medium ml-2">
                                  {meal.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs bg-gray-50"
                                >
                                  {meal.meal_type}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(meal.time_of_day).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">
                              {meal.description}
                            </p>

                            <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                              <div className="bg-blue-50 text-blue-700 p-2 rounded-md text-center">
                                <span className="block font-semibold">
                                  {meal.calories}
                                </span>
                                <span>kcal</span>
                              </div>
                              <div className="bg-blue-50 text-blue-700 p-2 rounded-md text-center">
                                <span className="block font-semibold">
                                  {meal.protein_grams}g
                                </span>
                                <span>protein</span>
                              </div>
                              <div className="bg-green-50 text-green-700 p-2 rounded-md text-center">
                                <span className="block font-semibold">
                                  {meal.carbs_grams}g
                                </span>
                                <span>carbs</span>
                              </div>
                              <div className="bg-yellow-50 text-yellow-700 p-2 rounded-md text-center">
                                <span className="block font-semibold">
                                  {meal.fats_grams}g
                                </span>
                                <span>fats</span>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <AddMealPlanDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onConfirm={handleAddMealPlan}
        isSubmitting={createMutation.isPending}
      />

      {selectedMealPlan && (
        <DeleteMealPlanDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteMealPlan}
          dayInfo={formatDayInfo(selectedMealPlan)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default DietPlanMeals;
