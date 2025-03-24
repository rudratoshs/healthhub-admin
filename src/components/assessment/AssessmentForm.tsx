
import React from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useAssessmentForm } from '@/hooks/useAssessmentForm';
import AssessmentProgress from './AssessmentProgress';
import QuestionRenderer from './QuestionRenderer';
import AssessmentDetails from './AssessmentDetails';
import AssessmentFormActions from './AssessmentFormActions';

interface AssessmentFormProps {
  initialPhase?: number;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ initialPhase = 1 }) => {
  const { id: assessmentId } = useParams<{ id: string }>();
  
  const {
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
    totalPhases
  } = useAssessmentForm(Number(assessmentId), initialPhase);

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AssessmentProgress 
        currentPhase={currentPhase} 
        totalPhases={totalPhases}
        phaseTitle={phaseConfig.title} 
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{phaseConfig.title}</h3>
            <p className="text-muted-foreground">{phaseConfig.description}</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {phaseConfig.questions.map((question) => (
                <QuestionRenderer 
                  key={question.id}
                  question={question}
                  form={form}
                />
              ))}
              
              <AssessmentFormActions 
                currentPhase={currentPhase}
                totalPhases={totalPhases}
                updateMutation={updateMutation}
                completeMutation={completeMutation}
                onPrevious={handlePrevious}
                onSaveProgress={handleSaveProgress}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {assessment && <AssessmentDetails assessment={assessment} />}
    </div>
  );
};

export default AssessmentForm;
