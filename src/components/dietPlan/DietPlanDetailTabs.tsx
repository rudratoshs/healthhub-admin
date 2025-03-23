
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Utensils, PieChart, Clock, ListChecks } from 'lucide-react';
import { DietPlan } from '@/types/dietPlan';
import { Separator } from '@/components/ui/separator';

interface DietPlanDetailTabsProps {
  plan: DietPlan;
}

const DietPlanDetailTabs: React.FC<DietPlanDetailTabsProps> = ({ plan }) => {
  // Calculate macronutrient percentages
  const totalGrams = plan.protein_grams + plan.carbs_grams + plan.fats_grams;
  const proteinPercentage = Math.round((plan.protein_grams / totalGrams) * 100);
  const carbsPercentage = Math.round((plan.carbs_grams / totalGrams) * 100);
  const fatsPercentage = Math.round((plan.fats_grams / totalGrams) * 100);
  
  // Calculate nutrient calories
  const proteinCalories = plan.protein_grams * 4; // 4 calories per gram
  const carbsCalories = plan.carbs_grams * 4; // 4 calories per gram
  const fatsCalories = plan.fats_grams * 9; // 9 calories per gram
  
  // Duration
  const startDate = new Date(plan.start_date);
  const endDate = new Date(plan.end_date);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4 bg-background w-full justify-start border-b overflow-x-auto">
        <TabsTrigger value="overview" className="data-[state=active]:bg-primary-50">
          <PieChart className="h-4 w-4 mr-2" /> Overview
        </TabsTrigger>
        <TabsTrigger value="nutrition" className="data-[state=active]:bg-primary-50">
          <Utensils className="h-4 w-4 mr-2" /> Nutrition
        </TabsTrigger>
        <TabsTrigger value="schedule" className="data-[state=active]:bg-primary-50">
          <CalendarDays className="h-4 w-4 mr-2" /> Schedule
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
              <CardTitle className="text-xl text-primary-900">Diet Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Title</h3>
                  <p className="text-lg">{plan.title}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                  <p>{plan.description || "No description provided."}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                    <p className="capitalize">{plan.status}</p>
                  </div>
                  
                  <div className="bg-primary-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-muted-foreground">Client ID</h3>
                    <p>{plan.client_id}</p>
                  </div>
                  
                  <div className="bg-primary-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
                    <p>{new Date(plan.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="bg-primary-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
                    <p>{new Date(plan.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
              <CardTitle className="text-xl text-primary-900">Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Daily Target</h3>
                  <p className="text-xl font-bold">{plan.daily_calories} kcal</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Duration</h3>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary-600" />
                    <p>{durationDays} days</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Date Range</h3>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary-600" />
                    <p>{new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="nutrition" className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
              <CardTitle className="text-xl text-primary-900">Macronutrients</CardTitle>
              <CardDescription>Daily macronutrient targets</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <h3 className="font-medium text-sm text-blue-700">Protein</h3>
                    <p className="text-xl font-bold text-blue-800">{plan.protein_grams}g</p>
                    <p className="text-xs text-muted-foreground">{proteinPercentage}% of total</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                    <h3 className="font-medium text-sm text-green-700">Carbs</h3>
                    <p className="text-xl font-bold text-green-800">{plan.carbs_grams}g</p>
                    <p className="text-xs text-muted-foreground">{carbsPercentage}% of total</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                    <h3 className="font-medium text-sm text-yellow-700">Fats</h3>
                    <p className="text-xl font-bold text-yellow-800">{plan.fats_grams}g</p>
                    <p className="text-xs text-muted-foreground">{fatsPercentage}% of total</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Macro Distribution</h3>
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${proteinPercentage}%` }}
                      title={`Protein: ${proteinPercentage}%`}
                    ></div>
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${carbsPercentage}%` }}
                      title={`Carbs: ${carbsPercentage}%`}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-full" 
                      style={{ width: `${fatsPercentage}%` }}
                      title={`Fats: ${fatsPercentage}%`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-blue-700">Protein: {proteinPercentage}%</span>
                    <span className="text-green-700">Carbs: {carbsPercentage}%</span>
                    <span className="text-yellow-700">Fats: {fatsPercentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
              <CardTitle className="text-xl text-primary-900">Calorie Distribution</CardTitle>
              <CardDescription>How calories are distributed</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Protein</span>
                    </div>
                    <span className="font-medium">{proteinCalories} kcal</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Carbohydrates</span>
                    </div>
                    <span className="font-medium">{carbsCalories} kcal</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Fats</span>
                    </div>
                    <span className="font-medium">{fatsCalories} kcal</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Calories</span>
                    <span className="font-bold text-lg">{proteinCalories + carbsCalories + fatsCalories} kcal</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Target Calories</span>
                    <span className="font-bold text-lg">{plan.daily_calories} kcal</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-primary-50 mt-4">
                  <h3 className="font-medium text-sm mb-2">Calorie Sources</h3>
                  <div className="h-5 bg-white rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-300" 
                      style={{ width: `${(proteinCalories / plan.daily_calories) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-green-500 h-full transition-all duration-300" 
                      style={{ width: `${(carbsCalories / plan.daily_calories) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-full transition-all duration-300" 
                      style={{ width: `${(fatsCalories / plan.daily_calories) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-blue-700">{Math.round((proteinCalories / plan.daily_calories) * 100)}%</span>
                    <span className="text-green-700">{Math.round((carbsCalories / plan.daily_calories) * 100)}%</span>
                    <span className="text-yellow-700">{Math.round((fatsCalories / plan.daily_calories) * 100)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="schedule" className="animate-fade-in">
        <Card>
          <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-3">
            <CardTitle className="text-xl text-primary-900">Plan Schedule</CardTitle>
            <CardDescription>Date range and timeline for this diet plan</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="font-medium text-sm text-muted-foreground">Start Date</h3>
                  <p className="text-lg">{new Date(plan.start_date).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="font-medium text-sm text-muted-foreground">End Date</h3>
                  <p className="text-lg">{new Date(plan.end_date).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="font-medium text-sm text-muted-foreground">Duration</h3>
                  <p className="text-lg">{durationDays} days</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-4">Progress Timeline</p>
                <div className="relative pt-6">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute -top-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                      style={{ left: '0%' }}
                    ></div>
                    <div 
                      className="absolute -top-0 left-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                      style={{ left: '100%' }}
                    ></div>
                    
                    {/* Today marker */}
                    {new Date() >= startDate && new Date() <= endDate && (
                      <div 
                        className="absolute -top-6 transform -translate-x-1/2"
                        style={{ 
                          left: `${((new Date().getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100}%` 
                        }}
                      >
                        <div className="w-0.5 h-10 bg-primary-600"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-primary-600 text-white text-xs rounded px-2 py-1">
                          Today
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ 
                        width: `${Math.max(0, Math.min(100, ((new Date().getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100))}%`
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{new Date(plan.start_date).toLocaleDateString()}</span>
                    <span>{new Date(plan.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DietPlanDetailTabs;
