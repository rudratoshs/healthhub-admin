
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { getAssessmentResult } from '@/lib/assessments';
import {
  CheckCircle2,
  ArrowRight,
  Calendar,
  Utensils,
  Activity,
  ClipboardList
} from 'lucide-react';

const AssessmentResult = () => {
  const { id } = useParams<{ id: string }>();

  const { data: result, isLoading } = useQuery({
    queryKey: ['assessmentResult', id],
    queryFn: () => getAssessmentResult(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loader size="lg" />;
  }

  if (!result) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Result Not Available</CardTitle>
          <CardDescription>
            The assessment result could not be found or hasn't been generated yet.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link to="/assessments">Back to Assessments</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            <CardTitle>Assessment Completed</CardTitle>
          </div>
          <CardDescription>
            Your assessment has been completed and a personalized plan has been generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
          
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
          {result.diet_plan_id && (
            <Button asChild>
              <Link to={`/diet-plans/${result.diet_plan_id}`}>
                <Utensils className="mr-2 h-4 w-4" />
                View Diet Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <Link to="/assessments">
              <ClipboardList className="mr-2 h-4 w-4" />
              All Assessments
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {result.diet_plan && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              <CardTitle>Your Diet Plan</CardTitle>
            </div>
            <CardDescription>
              Details of your personalized diet plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{result.diet_plan.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Daily Calories</p>
                <p className="font-medium">{result.diet_plan.daily_calories} kcal</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(result.diet_plan.start_date).toLocaleDateString()} to{' '}
                    {new Date(result.diet_plan.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Macros (P/C/F)</p>
                <p className="font-medium">
                  {result.diet_plan.protein_grams}g / {result.diet_plan.carbs_grams}g / {result.diet_plan.fats_grams}g
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to={`/diet-plans/${result.diet_plan.id}`}>
                View Full Diet Plan Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AssessmentResult;
