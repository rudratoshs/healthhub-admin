import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createDietPlan } from '@/lib/dietPlans';
import DietPlanForm from '@/components/dietPlan/DietPlanForm';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateDietPlanRequest } from '@/types/dietPlan';

const CreateDietPlan: React.FC = () => {
  const navigate = useNavigate();
  
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateDietPlanRequest) => createDietPlan(data),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Diet plan created successfully",
      });
      navigate(`/diet-plans/${data.data.id}`);
    },
    onError: (error) => {
      console.error("Error creating diet plan:", error);
      toast({
        title: "Error",
        description: "Failed to create diet plan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateDietPlanRequest) => {
    mutate(data);
  };

  return (
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-poppins text-primary-900">Create Diet Plan</h1>
          <p className="text-muted-foreground">Create a new nutritional diet plan for a client</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/diet-plans`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Diet Plans
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-green-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <PlusCircle size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">New Diet Plan</h2>
            <p className="text-sm text-muted-foreground">Creating a personalized nutrition plan</p>
          </div>
        </div>
      </div>

      <Card className="shadow-md border-primary-100">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-green-50 pb-4">
          <CardTitle className="text-xl text-primary-900 font-poppins flex items-center">
            <PlusCircle size={18} className="mr-2 text-green-600" />
            Diet Plan Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <DietPlanForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDietPlan;