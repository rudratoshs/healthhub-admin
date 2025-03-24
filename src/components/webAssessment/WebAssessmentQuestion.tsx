
import React from 'react';
import { useState } from 'react';
import { WebAssessmentQuestion as QuestionType } from '@/types/webAssessment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WebAssessmentQuestionProps {
  question: QuestionType;
  value: any;
  onChange: (value: any) => void;
  error: string | null;
}

const WebAssessmentQuestion: React.FC<WebAssessmentQuestionProps> = ({
  question,
  value,
  onChange,
  error
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.valueAsNumber);
  };

  const handleOptionChange = (value: string) => {
    onChange(value);
  };

  const handleMultipleOptionChange = (optionValue: string, checked: boolean) => {
    // If value is not an array, initialize it
    let currentValues = Array.isArray(value) ? [...value] : [];
    
    if (checked) {
      currentValues.push(optionValue);
    } else {
      currentValues = currentValues.filter(val => val !== optionValue);
    }
    
    onChange(currentValues);
  };

  const renderInputField = () => {
    // Handle number inputs
    if (question.validation && question.validation.includes('numeric')) {
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={handleNumberChange}
          placeholder="Enter your answer"
          className="mt-2"
        />
      );
    }
    
    // Handle text inputs with potentially long responses
    if (!question.options) {
      if (question.validation && question.validation.includes('max:') && 
          parseInt(question.validation.split('max:')[1]) > 100) {
        return (
          <Textarea
            value={value || ''}
            onChange={handleTextChange}
            placeholder="Enter your answer"
            className="mt-2"
            rows={4}
          />
        );
      } else {
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={handleTextChange}
            placeholder="Enter your answer"
            className="mt-2"
          />
        );
      }
    }
    
    // Handle multiple choice questions
    if (question.options) {
      if (question.multiple) {
        return (
          <div className="space-y-2 mt-4">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleMultipleOptionChange(option.value, checked === true)
                  }
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={handleOptionChange}
            className="mt-4 space-y-2"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      }
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md animate-fade-in">
      {question.header && (
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{question.header}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-4">
        <CardDescription className="text-lg font-medium text-foreground mb-4">
          {question.prompt}
        </CardDescription>
        
        {question.body && (
          <p className="text-muted-foreground mb-4">{question.body}</p>
        )}
        
        {renderInputField()}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default WebAssessmentQuestion;
