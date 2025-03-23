
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMealPlan } from '@/lib/mealPlans';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CreateMealPlanRequest } from '@/types/mealPlan';

const formSchema = z.object({
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    required_error: "Please select a day of the week",
  }),
});

const CreateMealPlan: React.FC = () => {
  const { dietPlanId } = useParams<{ dietPlanId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const dietPlanIdInt = dietPlanId ? parseInt(dietPlanId) : 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day_of_week: undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateMealPlanRequest) => createMealPlan(dietPlanIdInt, data),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Meal plan created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['dietPlanMeals', dietPlanIdInt] });
      navigate(`/diet-plans/${dietPlanIdInt}/meal-plans/${response.data.id}`);
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-primary-900">Create Meal Plan</h1>
          <p className="text-muted-foreground">Add a new daily meal plan</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/diet-plans/${dietPlanIdInt}`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Diet Plan
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-green-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <PlusCircle size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">New Meal Plan</h2>
            <p className="text-sm text-muted-foreground">For Diet Plan ID: {dietPlanIdInt}</p>
          </div>
        </div>
      </div>

      <Card className="shadow-md border-primary-100">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-green-50 pb-4">
          <CardTitle className="text-xl text-primary-900 font-playfair flex items-center">
            <Calendar size={18} className="mr-2 text-green-600" />
            Select Day of Week
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-primary-600"
                >
                  {isPending ? 'Creating...' : 'Create Meal Plan'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMealPlan;
