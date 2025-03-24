
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssessment } from '@/lib/assessments';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Loader } from '@/components/ui/loader';
import AssessmentForm from '@/components/assessment/AssessmentForm';
import { ClipboardList, Home } from 'lucide-react';

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => getAssessment(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loader size="lg" />;
  }

  // If assessment is completed, redirect to result page
  if (assessment?.status === 'completed') {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Assessment Completed</h1>
          <p className="text-muted-foreground">
            This assessment has already been completed. You can view the results below.
          </p>
          <Button asChild>
            <Link to={`/assessments/${id}/result`}>View Assessment Results</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/assessments">
                <div className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Assessments
                </div>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              Assessment #{id}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {assessment?.assessment_type === 'diet' && 'Diet Assessment'}
          {assessment?.assessment_type === 'fitness' && 'Fitness Assessment'}
          {assessment?.assessment_type === 'health' && 'Health Assessment'}
          {!assessment?.assessment_type && 'Assessment'}
        </h1>
        <p className="text-muted-foreground">
          Complete all phases of the assessment to get your personalized plan
        </p>
      </div>

      <AssessmentForm initialPhase={assessment?.current_phase} />
    </div>
  );
};

export default AssessmentDetail;
