import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  WebAssessmentQuestion as QuestionType,
  WebAssessmentOption,
} from "@/types/webAssessment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface WebAssessmentQuestionProps {
  question: QuestionType;
  response: any;
  onResponseChange: (value: any) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  validationError?: string | null;
}

const WebAssessmentQuestion: React.FC<WebAssessmentQuestionProps> = ({
  question,
  response,
  onResponseChange,
  onSubmit,
  isLoading = false,
  validationError = null,
}) => {
  // Render different input types based on the question
  const renderQuestionInput = () => {
    if (question.options) {
      if (question.multiple) {
        // Multiple selection with checkboxes
        return (
          <div className="space-y-3">
            {question.options.map((option: WebAssessmentOption) => (
              <div key={option.id} className="flex items-start space-x-2">
                <Checkbox
                  id={option.id}
                  checked={(response || []).includes(option.id)}
                  onCheckedChange={(checked) => {
                    const currentValues = response || [];
                    if (checked) {
                      if (option.title?.toLowerCase().includes("none")) {
                        // Only select "None of these"
                        onResponseChange([option.id]);
                      } else {
                        // Remove "None of these" if selected
                        const filtered = currentValues.filter(
                          (val: string) => {
                            const selectedOption = question.options?.find(o => o.id === val);
                            return selectedOption && !selectedOption.title?.toLowerCase().includes("none");
                          }
                        );
                        onResponseChange([...filtered, option.id]);
                      }
                    } else {
                      onResponseChange(currentValues.filter((val: string) => val !== option.id));
                    }
                  }}
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm leading-none pt-0.5"
                >
                  {option.label ?? option.title}
                </Label>
              </div>
            ))}
            {question.options.some(opt => opt.title?.toLowerCase() === "other") && (
              <div className="mt-4">
                <Label htmlFor="custom-other" className="text-sm leading-none block mb-1">
                  Other (press Enter to add)
                </Label>
                <Input
                  id="custom-other"
                  type="text"
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        const updated = [...(response || []), value];
                        onResponseChange(updated);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(response || [])
                    .filter((val: string) =>
                      !question.options.some(opt => opt.id === val)
                    )
                    .map((val: string, index: number) => (
                      <div key={index} className="bg-muted px-2 py-1 rounded text-sm">
                        {val}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        );
      } else {
        // Single selection with radio buttons
        return (
          <RadioGroup
            value={response || ""}
            onValueChange={onResponseChange}
            className="space-y-3"
          >
            {question.options.map((option: WebAssessmentOption) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.label ?? option.title} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="text-sm leading-none pt-0.5"
                >
                  {option.label ?? option.title}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      }
    } else {
      // Default to text input if no options provided
      if (question.validation?.includes("numeric")) {
        return (
          <Input
            type="number"
            value={response || ""}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="Enter a number"
            className="w-full"
          />
        );
      } else if (question.prompt && question.prompt.length > 80) {
        return (
          <Textarea
            value={response || ""}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="Enter your answer"
            className="w-full"
          />
        );
      } else {
        return (
          <Input
            type="text"
            value={response || ""}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="Enter your answer"
            className="w-full"
          />
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-md mx-auto">
        {question.header && (
          <div className="bg-primary/10 p-4 rounded-t-lg">
            <h2 className="font-medium text-primary">{question.header}</h2>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent>
          {question.body && (
            <p className="mb-4 text-muted-foreground">{question.body}</p>
          )}
          {renderQuestionInput()}

          {validationError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                Submitting <Loader className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default WebAssessmentQuestion;
