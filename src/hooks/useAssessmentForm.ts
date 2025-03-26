import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  updateAssessment, 
  completeAssessment, 
  getAssessment 
} from '@/lib/assessments';
import {
  Assessment,
  AssessmentFormData,
  AssessmentPhase,
  ASSESSMENT_PHASES,
  UpdateAssessmentRequest,
  CompleteAssessmentRequest
} from '@/types/assessment';

export type PhaseFormValues = Record<string, any>;

export const useAssessmentForm = (assessmentId: number | undefined, initialPhase: number = 1) => {
  const [currentPhase, setCurrentPhase] = useState<number>(initialPhase);
  const [formData, setFormData] = useState<AssessmentFormData>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get assessment data
  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => getAssessment(Number(assessmentId)),
    enabled: !!assessmentId,
  });

  useEffect(() => {
    if (assessment && assessment.responses) {
      setFormData(assessment.responses);
      setCurrentPhase(assessment.current_phase || 1);
    }
  }, [assessment]);

  // Get current phase configuration
  const phaseConfig = ASSESSMENT_PHASES[currentPhase - 1] || ASSESSMENT_PHASES[0];
  
  // Generate schema based on current phase questions
  const generatePhaseSchema = (phase: AssessmentPhase) => {
    const schemaMap: Record<string, any> = {};
    
    phase.questions.forEach(question => {
      if (question.type === 'number') {
        let schema = z.coerce.number({
          required_error: `${question.label} is required`,
          invalid_type_error: 'Must be a number',
        });
        
        if (question.required) {
          schema = schema.min(0, { message: 'Must be a positive number' });
        } else {
          schema = schema.optional();
        }
        
        schemaMap[question.id] = schema;
      } else if (question.type === 'select' || question.type === 'radio') {
        let schema = z.string({
          required_error: `${question.label} is required`,
        });
        if (question.required) {
          schema = schema.min(1, { message: `${question.label} is required` });
        } else {
          schema = schema.optional();
        }
        schemaMap[question.id] = schema;
      } else if (question.type === 'multiselect' || question.type === 'checkbox') {
        let schema = z.array(z.string());
        if (question.required) {
          schema = schema.min(1, { message: 'Please select at least one option' });
        }
        schemaMap[question.id] = schema;
      } else {
        let schema = z.string({
          required_error: `${question.label} is required`,
        });
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

  // Setup form
  const form = useForm({
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
        description: "Your assessment progress has been saved."
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
        description: "Your assessment has been successfully completed."
      });
      navigate(`/assessments/${data.id}/result`);
    },
  });

  const handleSubmit = (values: PhaseFormValues) => {
    // Update form data with current phase data
    const updatedFormData = { ...formData, ...values };
    setFormData(updatedFormData);
    
    const currentQuestion = phaseConfig.questions.length > 0 
      ? phaseConfig.questions[0].id 
      : '';
    
    // If this is the last phase, complete the assessment
    if (currentPhase === ASSESSMENT_PHASES.length) {
      completeMutation.mutate({
        final_responses: updatedFormData
      });
    } else {
      // Otherwise, update and move to the next phase
      updateMutation.mutate({
        current_phase: currentPhase,
        current_question: currentQuestion,
        responses: updatedFormData
      });
      
      setCurrentPhase(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 1) {
      setCurrentPhase(prev => prev - 1);
    }
  };

  const handleSaveProgress = () => {
    const values = form.getValues();
    const updatedFormData = { ...formData, ...values };
    setFormData(updatedFormData);
    
    updateMutation.mutate({
      current_phase: currentPhase,
      current_question: phaseConfig.questions[0]?.id || '',
      responses: updatedFormData
    });
  };

  return {
    assessment,
    isLoading,
    currentPhase,
    phaseConfig,
    form,
    updateMutation,
    completeMutation,
    handleSubmit,
    handlePrevious,
    handleSaveProgress,
    totalPhases: ASSESSMENT_PHASES.length
  };
};
