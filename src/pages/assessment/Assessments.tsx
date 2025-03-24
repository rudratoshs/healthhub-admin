import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { getAssessments } from '@/lib/assessments';
import { Assessment } from '@/types/assessment';
import StartAssessmentDialog from '@/components/assessment/StartAssessmentDialog';

const Assessments: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userId = user?.id || 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ['assessments', userId],
    queryFn: () => getAssessments(userId),
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch assessments:', error);
      }
    },
    enabled: !!userId,
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            Manage and view your assessments
          </p>
        </div>
        <Button onClick={handleOpenDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Start Assessment
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to fetch assessments. Please try again.
              </AlertDescription>
            </Alert>
          ) : data && data.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data
                .filter((assessment) => assessment.status === 'in_progress')
                .map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                    onClick={() => navigate(`/assessments/${assessment.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {assessment.assessment_type.charAt(0).toUpperCase() +
                          assessment.assessment_type.slice(1)}{' '}
                        Assessment
                      </CardTitle>
                      <CardDescription>
                        Status: {assessment.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Current Phase: {assessment.current_phase}
                      </p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                      Created at:{' '}
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No active assessments found.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to fetch assessments. Please try again.
              </AlertDescription>
            </Alert>
          ) : data && data.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data
                .filter((assessment) => assessment.status === 'completed')
                .map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                    onClick={() => navigate(`/assessments/${assessment.id}/result`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {assessment.assessment_type.charAt(0).toUpperCase() +
                          assessment.assessment_type.slice(1)}{' '}
                        Assessment
                      </CardTitle>
                      <CardDescription>
                        Status: {assessment.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Completed at:{' '}
                        {new Date(assessment.updated_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No completed assessments found.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="all" className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to fetch assessments. Please try again.
              </AlertDescription>
            </Alert>
          ) : data && data.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                  onClick={() =>
                    navigate(
                      assessment.status === 'completed'
                        ? `/assessments/${assessment.id}/result`
                        : `/assessments/${assessment.id}`
                    )
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {assessment.assessment_type.charAt(0).toUpperCase() +
                        assessment.assessment_type.slice(1)}{' '}
                      Assessment
                    </CardTitle>
                    <CardDescription>
                      Status: {assessment.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assessment.status === 'completed' ? (
                      <p>
                        Completed at:{' '}
                        {new Date(assessment.updated_at).toLocaleDateString()}
                      </p>
                    ) : (
                      <p>
                        Current Phase: {assessment.current_phase}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No assessments found.</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      <StartAssessmentDialog
        userId={userId}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Assessments;
