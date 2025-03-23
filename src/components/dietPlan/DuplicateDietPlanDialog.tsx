
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DuplicateDietPlanRequest } from '@/types/dietPlan';

const duplicateFormSchema = z.object({
  new_title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  client_id: z.number().int().positive({ message: 'Client ID is required' }),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

interface DuplicateDietPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DuplicateDietPlanRequest) => void;
  title: string;
  clientId: number;
  isSubmitting: boolean;
}

const DuplicateDietPlanDialog: React.FC<DuplicateDietPlanDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  clientId,
  isSubmitting,
}) => {
  const form = useForm<z.infer<typeof duplicateFormSchema>>({
    resolver: zodResolver(duplicateFormSchema),
    defaultValues: {
      new_title: `Copy of ${title}`,
      client_id: clientId,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const handleSubmit = (data: z.infer<typeof duplicateFormSchema>) => {
    // Ensure all required fields are present for DuplicateDietPlanRequest
    const duplicateData: DuplicateDietPlanRequest = {
      new_title: data.new_title,
      client_id: data.client_id,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    onConfirm(duplicateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Copy className="h-5 w-5 mr-2 text-primary" /> Duplicate Diet Plan
          </DialogTitle>
          <DialogDescription>
            Create a copy of this diet plan with a new title and optional dates.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="new_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-600"
              >
                {isSubmitting ? 'Duplicating...' : 'Duplicate'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateDietPlanDialog;
