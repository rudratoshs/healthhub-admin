import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  getWebAssessmentStatus,
  startWebAssessment,
  getWebAssessmentQuestion,
  submitWebAssessmentResponse,
  resumeWebAssessment,
  deleteWebAssessment
} from '@/lib/webAssessment';
import {
  WebAssessmentStatus,
  WebAssessmentQuestion,
  StartAssessmentRequest,
  ResumeAssessmentRequest,
  DeleteAssessmentRequest
} from '@/types/webAssessment';

export const useWebAssessment = () => {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<WebAssessmentQuestion | null>(null);
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [previousResponses, setPreviousResponses] = useState<Record<string, any>>({});
  const [totalPhases, setTotalPhases] = useState(4); // Default value, update from API if available
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get assessment status
  const statusQuery = useQuery({
    queryKey: ['webAssessmentStatus'],
    queryFn: getWebAssessmentStatus,
    refetchOnWindowFocus: false,
  });

  // Set session ID and fetch first question when status is loaded
  useEffect(() => {
    if (statusQuery.data) {
      if (statusQuery.data.has_active_assessment) {
        setSessionId(statusQuery.data.session_id);
        if (statusQuery.data.session_id) {
          fetchQuestion(statusQuery.data.session_id);
        }
      } else if (statusQuery.data.has_completed_assessment) {
        setIsComplete(true);
      }
    }
  }, [statusQuery.data]);

  // Fetch a question for a session
  const fetchQuestion = async (sid: number) => {
    try {
      const question = await getWebAssessmentQuestion(sid);
      console.log('qest',sid)
      setCurrentQuestion(question);
      setCurrentResponse(previousResponses[question.question_id] || null);
    } catch (error) {
      console.error('Error fetching question:', error);
      toast({
        title: "Error",
        description: "Failed to load the assessment question.",
        variant: "destructive"
      });
    }
  };

  // Start assessment mutation
  const startMutation = useMutation({
    mutationFn: (data: StartAssessmentRequest) => startWebAssessment(data),
    onSuccess: (data) => {
      setSessionId(data.session_id);
      if (data.next_question) {
        setCurrentQuestion(data.next_question);
        setCurrentResponse(null);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to start assessment";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      // If there's an active session, we can redirect to it
      if (error?.response?.data?.session_id) {
        setSessionId(error.response.data.session_id);
      }
    }
  });

  // Delete assessment mutation
  const deleteMutation = useMutation({
    mutationFn: (data: DeleteAssessmentRequest) => deleteWebAssessment(data),
    onSuccess: () => {
      setSessionId(null);
      setCurrentQuestion(null);
      setCurrentResponse(null);
      setPreviousResponses({});
      statusQuery.refetch(); // Refresh status after deletion
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete assessment";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  // Resume assessment mutation
  const resumeMutation = useMutation({
    mutationFn: (data: ResumeAssessmentRequest) => resumeWebAssessment(data),
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setCurrentQuestion(data.current_question);

      // Process previous responses
      const responses: Record<string, any> = {};
      Object.entries(data.previous_responses).forEach(([key, value]) => {
        responses[key] = value.response;
      });
      setPreviousResponses(responses);

      toast({
        title: "Assessment Resumed",
        description: "Your assessment has been resumed successfully."
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to resume assessment";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  // Submit response mutation
  const submitMutation = useMutation({
    mutationFn: (data: { sessionId: number; questionId: string; response: any }) => {
      return submitWebAssessmentResponse({
        session_id: data.sessionId,
        question_id: data.questionId,
        response: data.response
      });
    },
    onSuccess: (data) => {
      // Update previous responses
      if (currentQuestion) {
        setPreviousResponses(prev => ({
          ...prev,
          [currentQuestion.question_id]: currentResponse
        }));
      }

      // Check if assessment is complete
      if (data.is_complete) {
        setIsComplete(true);
        toast({
          title: "Assessment Complete",
          description: "Your assessment has been completed successfully."
        });
        navigate('/web-assessment/complete');
      } else if (data.next_question) {
        // Move to next question
        setCurrentQuestion(data.next_question);
        setCurrentResponse(null);
        setValidationError(null);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to submit response";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      setValidationError(errorMessage);
    }
  });

  // Handle start assessment
  const startAssessment = (type: "basic" | "moderate" | "comprehensive", abandonExisting: boolean = false) => {
    startMutation.mutate({ assessment_type: type, abandon_existing: abandonExisting });
  };

  // Handle delete assessment
  const deleteAssessment = (sid: number) => {
    deleteMutation.mutate({ session_id: sid });
  };

  // Handle resume assessment
  const resumeAssessment = (sid: number) => {
    resumeMutation.mutate({ session_id: sid });
  };

  // Handle response changes
  const handleResponseChange = (value: any) => {
    setCurrentResponse(value);
    setValidationError(null);
  };

  // Validate the current response
  const validateResponse = (): boolean => {
    if (!currentQuestion) return false;

    // Basic validation
    if (currentResponse === null || currentResponse === undefined || currentResponse === '') {
      setValidationError('This field is required');
      return false;
    }

    // Number validation
    if (currentQuestion.validation && currentQuestion.validation.includes('numeric')) {
      if (isNaN(Number(currentResponse))) {
        setValidationError('Please enter a valid number');
        return false;
      }

      // Min/max validation
      const minMatch = currentQuestion.validation?.match(/min:(\d+)/);
      const maxMatch = currentQuestion.validation?.match(/max:(\d+)/);

      if (minMatch && Number(currentResponse) < Number(minMatch[1])) {
        setValidationError(`Minimum value is ${minMatch[1]}`);
        return false;
      }

      if (maxMatch && Number(currentResponse) > Number(maxMatch[1])) {
        setValidationError(`Maximum value is ${maxMatch[1]}`);
        return false;
      }
    }

    // Multiple selection validation
    if (currentQuestion.multiple && Array.isArray(currentResponse) && currentResponse.length === 0) {
      setValidationError('Please select at least one option');
      return false;
    }

    return true;
  };

  // Handle submit current response
  const submitResponse = () => {
    if (!sessionId || !currentQuestion) return;

    if (validateResponse()) {
      submitMutation.mutate({
        sessionId,
        questionId: currentQuestion.question_id,
        response: currentResponse
      });
    }
  };

  // Refresh status after a successful start or resume
  useEffect(() => {
    if (sessionId) {
      statusQuery.refetch();
    }
  }, [sessionId]);

  console.log('statusQuery',statusQuery)

  console.log('statusQuery',statusQuery.data)
  return {
    status: statusQuery.data,
    statusLoading: statusQuery.isLoading,
    currentQuestion,
    currentResponse,
    sessionId,
    isComplete,
    validationError,
    previousResponses,
    totalPhases,
    startAssessment,
    resumeAssessment,
    deleteAssessment,
    handleResponseChange,
    submitResponse,
    loading: startMutation.isPending || resumeMutation.isPending || submitMutation.isPending || deleteMutation.isPending,
    startError: startMutation.error,
    resumeError: resumeMutation.error,
    submitError: submitMutation.error,
    deleteError: deleteMutation.error
  };
};
