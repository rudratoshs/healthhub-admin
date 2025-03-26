
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SubscriptionPlan, CreateSubscriptionPlanRequest, UpdateSubscriptionPlanRequest } from '@/types/subscription';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  code: z.string().min(2, { message: 'Code must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  monthly_price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  quarterly_price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  annual_price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  max_clients: z.coerce.number().min(1, { message: 'Must allow at least 1 client' }),
  max_diet_plans: z.coerce.number().min(0, { message: 'Must be a positive number' }),
  ai_meal_generation: z.boolean(),
  ai_meal_generation_limit: z.coerce.number().min(0, { message: 'Must be a positive number' }),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan;
  onSubmit: (data: CreateSubscriptionPlanRequest | UpdateSubscriptionPlanRequest) => void;
  isLoading?: boolean;
}

const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({
  plan,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan?.name || '',
      code: plan?.code || '',
      description: plan?.description || '',
      monthly_price: plan?.monthly_price || 0,
      quarterly_price: plan?.quarterly_price || 0,
      annual_price: plan?.annual_price || 0,
      max_clients: plan?.features?.max_clients || 0,
      max_diet_plans: plan?.features?.max_diet_plans || 0,
      ai_meal_generation: plan?.features?.ai_meal_generation || false,
      ai_meal_generation_limit: plan?.features?.ai_meal_generation_limit || 0,
      is_active: plan?.is_active ?? true,
    },
  });

  const handleSubmit = (values: FormValues) => {
    const formData = {
      name: values.name,
      code: values.code,
      description: values.description,
      monthly_price: values.monthly_price,
      quarterly_price: values.quarterly_price,
      annual_price: values.annual_price,
      features: {
        max_clients: values.max_clients,
        max_diet_plans: values.max_diet_plans,
        ai_meal_generation: values.ai_meal_generation,
        ai_meal_generation_limit: values.ai_meal_generation_limit,
      },
      is_active: values.is_active,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="Basic Plan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Code</FormLabel>
                <FormControl>
                  <Input placeholder="basic" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for this plan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A basic plan for small gyms..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="monthly_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quarterly_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quarterly Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annual_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Features</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="max_clients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Clients</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_diet_plans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Diet Plans per Client</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ai_meal_generation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>AI Meal Generation</FormLabel>
                  <FormDescription>
                    Allow subscribers to generate meals using AI
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('ai_meal_generation') && (
            <FormField
              control={form.control}
              name="ai_meal_generation_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Generation Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of meals that can be generated using AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  Is this plan available for subscription?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Plan'}
        </Button>
      </form>
    </Form>
  );
};

export default SubscriptionPlanForm;
