import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getDietPlan, updateDietPlan } from '@/lib/dietPlans';
import DietPlanForm from '@/components/dietPlan/DietPlanForm';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { UpdateDietPlanRequest } from '@/types/dietPlan';

const EditDietPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const dietPlanId = id ? parseInt(id) : 0;

  const { data, isLoading } = useQuery({
    queryKey: ['dietPlan', dietPlanId],
    queryFn: () => getDietPlan(dietPlanId),
    enabled: !!dietPlanId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateDietPlanRequest) => updateDietPlan(dietPlanId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Diet plan updated successfully",
      });
      navigate(`/diet-plans/${dietPlanId}`);
    },
    onError: (error) => {
      console.error("Error updating diet plan:", error);
      toast({
        title: "Error",
        description: "Failed to update diet plan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateDietPlanRequest) => {
    mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader size="lg" variant="primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Diet Plan Not Found</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>The diet plan you're trying to edit could not be found.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(`/diet-plans`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Diet Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = data.data;

  return (
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-poppins text-primary-900">Edit Diet Plan</h1>
          <p className="text-muted-foreground">Update diet plan details and nutrition targets</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/diet-plans/${dietPlanId}`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Diet Plan
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">Client ID: {plan.client_id}</h2>
            <p className="text-sm text-muted-foreground">Diet plan created: {new Date(plan.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <Card className="shadow-md border-primary-100">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
          <CardTitle className="text-xl text-primary-900 font-poppins flex items-center">
            <Edit size={18} className="mr-2 text-primary-600" />
            Edit Diet Plan Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data ? (
            <DietPlanForm
              initialValues={plan}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
              clientId={plan.client_id}
            />
          ) : (
            <div className="text-center p-6">
              <p className="text-muted-foreground">Diet plan data not available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDietPlan;