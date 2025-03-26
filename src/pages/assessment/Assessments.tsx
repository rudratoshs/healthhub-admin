import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAssessment } from "@/lib/assessments";
import StartAssessmentDialog from "@/components/assessment/StartAssessmentDialog";
import { Assessment } from "@/types/assessment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  PlusCircle,
  ArrowUpRight,
  CalendarRange,
  Clock,
  Utensils,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Loader } from "@/components/ui/loader";

const Assessments: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments", user.user?.id],
    queryFn: () => getAssessment(user.user!.id),
    enabled: !!user,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      });
    },
  });

  console.log("assement", assessments);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case "abandoned":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            Abandoned
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "diet":
        return <Utensils className="h-4 w-4 text-green-600" />;
      case "fitness":
        return <Activity className="h-4 w-4 text-blue-600" />;
      case "health":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <ClipboardList className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "diet":
        return "Diet Assessment";
      case "fitness":
        return "Fitness Assessment";
      case "health":
        return "Health Assessment";
      default:
        return "Assessment";
    }
  };

  const handleAssessmentClick = (assessment: Assessment) => {
    if (assessment.status === "completed") {
      navigate(`/assessments/${assessment.id}/result`);
    } else {
      navigate(`/assessments/${assessment.id}`);
    }
  };

  const normalizedAssessments = Array.isArray(assessments)
    ? assessments
    : assessments
    ? [assessments]
    : [];

  const completedAssessments = normalizedAssessments.filter(
    (a) => a.status === "completed"
  );
  const inProgressAssessments = normalizedAssessments.filter(
    (a) => a.status === "in_progress"
  );
  const allAssessments = normalizedAssessments;

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            Take assessments to get personalized diet and fitness plans
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allAssessments.length === 0 ? (
            <Card className="text-center p-6">
              <CardHeader>
                <CardTitle>No Assessments Found</CardTitle>
                <CardDescription>
                  You haven't taken any assessments yet.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center pt-2">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Start New Assessment
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allAssessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAssessmentClick(assessment)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(assessment.assessment_type)}
                        <CardTitle className="text-lg">
                          {getTypeLabel(assessment.assessment_type)}
                        </CardTitle>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                    <CardDescription>
                      Assessment #{assessment.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Phase {assessment.current_phase} of 4</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full gap-1">
                      {assessment.status === "completed"
                        ? "View Results"
                        : "Continue"}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          {inProgressAssessments.length === 0 ? (
            <Card className="text-center p-6">
              <CardHeader>
                <CardTitle>No In-Progress Assessments</CardTitle>
                <CardDescription>
                  You don't have any assessments in progress.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center pt-2">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Start New Assessment
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressAssessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/assessments/${assessment.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(assessment.assessment_type)}
                        <CardTitle className="text-lg">
                          {getTypeLabel(assessment.assessment_type)}
                        </CardTitle>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                    <CardDescription>
                      Assessment #{assessment.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Phase {assessment.current_phase} of 4</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full gap-1">
                      Continue <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedAssessments.length === 0 ? (
            <Card className="text-center p-6">
              <CardHeader>
                <CardTitle>No Completed Assessments</CardTitle>
                <CardDescription>
                  You haven't completed any assessments yet.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center pt-2">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Start New Assessment
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedAssessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    navigate(`/assessments/${assessment.id}/result`)
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(assessment.assessment_type)}
                        <CardTitle className="text-lg">
                          {getTypeLabel(assessment.assessment_type)}
                        </CardTitle>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                    <CardDescription>
                      Assessment #{assessment.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Completed</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full gap-1">
                      View Results <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <StartAssessmentDialog
        userId={user.user?.id || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default Assessments;
