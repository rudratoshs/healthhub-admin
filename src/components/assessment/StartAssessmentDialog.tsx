
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { startAssessment } from '@/lib/assessments';
import { StartAssessmentRequest, AssessmentType } from '@/types/assessment';
import { ClipboardList } from 'lucide-react';

interface StartAssessmentDialogProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  assessment_type: z.enum(['diet', 'fitness', 'health'], {
    required_error: "Assessment type is required",
  }),
});

const StartAssessmentDialog: React.FC<StartAssessmentDialogProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessment_type: 'diet',
    },
  });

  const startAssessmentMutation = useMutation({
    mutationFn: (data: StartAssessmentRequest) => startAssessment(userId, data),
    onSuccess: (assessment) => {
      onClose();
      navigate(`/assessments/${assessment.id}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startAssessmentMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Start New Assessment
          </DialogTitle>
          <DialogDescription>
            Choose the type of assessment you want to start. The assessment will help us create a personalized plan for you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="assessment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diet">Diet Assessment</SelectItem>
                      <SelectItem value="fitness">Fitness Assessment</SelectItem>
                      <SelectItem value="health">Health Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={startAssessmentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={startAssessmentMutation.isPending}
              >
                {startAssessmentMutation.isPending ? 'Starting...' : 'Start Assessment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StartAssessmentDialog;
