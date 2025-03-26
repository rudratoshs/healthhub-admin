import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  updateAssessment,
  completeAssessment,
  getAssessment,
} from "@/lib/assessments";
import {
  Assessment,
  AssessmentFormData,
  AssessmentPhase,
  ASSESSMENT_PHASES,
  UpdateAssessmentRequest,
  CompleteAssessmentRequest,
} from "@/types/assessment";
import AssessmentProgress from "./AssessmentProgress";

interface AssessmentFormProps {
  initialPhase?: number;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  initialPhase = 1,
}) => {
  const { id: assessmentId } = useParams<{ id: string }>();
  const [currentPhase, setCurrentPhase] = useState<number>(initialPhase);
  const [formData, setFormData] = useState<AssessmentFormData>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get assessment data
  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => getAssessment(Number(assessmentId)),
    enabled: !!assessmentId,
    onSuccess: (data) => {
      if (data.responses) {
        setFormData(data.responses);
        setCurrentPhase(data.current_phase || 1);
      }
    },
  });

  // Get current phase configuration
  const phaseConfig =
    ASSESSMENT_PHASES[currentPhase - 1] || ASSESSMENT_PHASES[0];

  // Generate schema based on current phase questions
  const generatePhaseSchema = (phase: AssessmentPhase) => {
    const schemaMap: Record<string, any> = {};

    phase.questions.forEach((question) => {
      if (question.type === "number") {
        let schema = z.number({
          required_error: `${question.label} is required`,
          invalid_type_error: "Must be a number",
        });

        if (question.required) {
          schema = schema.min(0, { message: "Must be a positive number" });
        } else {
          schema = schema.optional();
        }

        schemaMap[question.id] = schema;
      } else if (question.type === "select" || question.type === "radio") {
        let schema = z.string();
        if (question.required) {
          schema = schema.min(1, { message: `${question.label} is required` });
        } else {
          schema = schema.optional();
        }
        schemaMap[question.id] = schema;
      } else if (
        question.type === "multiselect" ||
        question.type === "checkbox"
      ) {
        let schema = z.array(z.string());
        if (question.required) {
          schema = schema.min(1, {
            message: "Please select at least one option",
          });
        }
        schemaMap[question.id] = schema;
      } else {
        let schema = z.string();
        if (question.required) {
          schema = schema.min(1, { message: `${question.label} is required` });
        } else {
          schema = schema.optional();
        }
        schemaMap[question.id] = schema;
      }
    });

    return z.object(schemaMap);
  };

  const currentSchema = generatePhaseSchema(phaseConfig);
  type FormValues = z.infer<typeof currentSchema>;

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: formData as any,
  });

  // Update assessment mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateAssessmentRequest) =>
      updateAssessment(Number(assessmentId), data),
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "Your assessment progress has been saved.",
      });
    },
  });

  // Complete assessment mutation
  const completeMutation = useMutation({
    mutationFn: (data: CompleteAssessmentRequest) =>
      completeAssessment(Number(assessmentId), data),
    onSuccess: (data) => {
      toast({
        title: "Assessment completed",
        description: "Your assessment has been successfully completed.",
      });
      navigate(`/assessments/${data.id}/result`);
    },
  });

  const onSubmit = (values: FormValues) => {
    // Update form data with current phase data
    const updatedFormData = { ...formData, ...values };
    setFormData(updatedFormData);

    const currentQuestion =
      phaseConfig.questions.length > 0 ? phaseConfig.questions[0].id : "";

    // If this is the last phase, complete the assessment
    if (currentPhase === ASSESSMENT_PHASES.length) {
      completeMutation.mutate({
        final_responses: updatedFormData,
      });
    } else {
      // Otherwise, update and move to the next phase
      updateMutation.mutate({
        current_phase: currentPhase,
        current_question: currentQuestion,
        responses: updatedFormData,
      });

      setCurrentPhase((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 1) {
      setCurrentPhase((prev) => prev - 1);
    }
  };

  const handleSaveProgress = () => {
    const values = form.getValues();
    const updatedFormData = { ...formData, ...values };
    setFormData(updatedFormData);

    updateMutation.mutate({
      current_phase: currentPhase,
      current_question: phaseConfig.questions[0]?.id || "",
      responses: updatedFormData,
    });
  };

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AssessmentProgress
        currentPhase={currentPhase}
        totalPhases={ASSESSMENT_PHASES.length}
        phaseTitle={phaseConfig.title}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{phaseConfig.title}</h3>
            <p className="text-muted-foreground">{phaseConfig.description}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {phaseConfig.questions.map((question) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.label}</FormLabel>
                      {question.helpText && (
                        <FormDescription>{question.helpText}</FormDescription>
                      )}
                      <FormControl>
                        {question.type === "text" && (
                          <Input
                            placeholder={question.placeholder}
                            {...field}
                          />
                        )}
                        {question.type === "number" && (
                          <Input
                            type="number"
                            placeholder={question.placeholder}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                        {question.type === "select" && (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    question.placeholder || "Select an option"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {question.options?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {question.type === "multiselect" && (
                          <div className="space-y-2">
                            {question.options?.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${question.id}-${option.value}`}
                                  checked={(
                                    (field.value as string[]) || []
                                  ).includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValue =
                                      (field.value as string[]) || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        option.value,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (val) => val !== option.value
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`${question.id}-${option.value}`}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {question.type === "radio" && (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {question.options?.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`${question.id}-${option.value}`}
                                />
                                <label
                                  htmlFor={`${question.id}-${option.value}`}
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex justify-between pt-4">
                <div>
                  {currentPhase > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSaveProgress}
                    className="ml-2"
                    disabled={updateMutation.isPending}
                  >
                    Save Progress
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={
                    updateMutation.isPending || completeMutation.isPending
                  }
                >
                  {currentPhase === ASSESSMENT_PHASES.length
                    ? completeMutation.isPending
                      ? "Completing..."
                      : "Complete Assessment"
                    : updateMutation.isPending
                    ? "Saving..."
                    : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {assessment && (
        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="details">
            <AccordionTrigger>Assessment Details</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Assessment ID</p>
                  <p className="text-muted-foreground">{assessment.id}</p>
                </div>
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-muted-foreground">
                    {assessment.assessment_type}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-muted-foreground">{assessment.status}</p>
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(assessment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default AssessmentForm;
