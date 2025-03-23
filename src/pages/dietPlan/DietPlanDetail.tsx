
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDietPlan, deleteDietPlan, duplicateDietPlan, getDietPlanMealPlans } from '@/lib/dietPlans';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Edit, Trash2, User, Utensils } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DeleteDietPlanDialog from '@/components/dietPlan/DeleteDietPlanDialog';
import DuplicateDietPlanDialog from '@/components/dietPlan/DuplicateDietPlanDialog';
import DietPlanDetailTabs from '@/components/dietPlan/DietPlanDetailTabs';
import DietPlanMeals from '@/components/dietPlan/DietPlanMeals';
import { DuplicateDietPlanRequest } from '@/types/dietPlan';
import { Badge } from '@/components/ui/badge';

const DietPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const dietPlanId = id ? parseInt(id) : 0;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dietPlan', dietPlanId],
    queryFn: () => getDietPlan(dietPlanId),
    enabled: !!dietPlanId,
  });

  const { data: mealPlansData } = useQuery({
    queryKey: ['dietPlanMeals', dietPlanId],
    queryFn: () => getDietPlanMealPlans(dietPlanId),
    enabled: !!dietPlanId,
  });

  const hasMealPlans = (mealPlansData?.data?.length ?? 0) > 0;

  const deleteMutation = useMutation({
    mutationFn: () => deleteDietPlan(dietPlanId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Diet plan deleted successfully",
      });
      navigate('/diet-plans');
    },
    onError: (error) => {
      console.error("Error deleting diet plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete diet plan",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (data: DuplicateDietPlanRequest) => duplicateDietPlan(dietPlanId, data),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: "Diet plan duplicated successfully",
      });
      navigate(`/diet-plans/${response.data.id}`);
      queryClient.invalidateQueries({ queryKey: ['dietPlans'] });
    },
    onError: (error) => {
      console.error("Error duplicating diet plan:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate diet plan",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleDuplicate = (data: DuplicateDietPlanRequest) => {
    duplicateMutation.mutate(data);
    setIsDuplicateDialogOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'outline';
    }
  };

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
            <CardTitle className="text-red-700">Error Loading Diet Plan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>There was an error loading the diet plan. The plan may not exist.</p>
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
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold font-playfair text-primary-900">{plan.title}</h1>
            <Badge variant={getStatusBadgeVariant(plan.status)} className="ml-3">
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{plan.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate(`/diet-plans`)}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Diet Plans
          </Button>
          <Button onClick={() => navigate(`/diet-plans/${dietPlanId}/edit`)} className="bg-primary hover:bg-primary-600">
            <Edit size={16} className="mr-2" />
            Edit Plan
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsDuplicateDialogOpen(true)}
          >
            <Copy size={16} className="mr-2" />
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
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

      <div className="space-y-6">
        <DietPlanDetailTabs plan={plan} />
        
        <DietPlanMeals dietPlanId={plan.id} />
      </div>

      <DeleteDietPlanDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={plan.title}
        isDeleting={deleteMutation.isPending}
        hasMealPlans={hasMealPlans}
      />

      <DuplicateDietPlanDialog
        isOpen={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)}
        onConfirm={handleDuplicate}
        title={plan.title}
        clientId={plan.client_id}
        isSubmitting={duplicateMutation.isPending}
      />
    </div>
  );
};

export default DietPlanDetail;
