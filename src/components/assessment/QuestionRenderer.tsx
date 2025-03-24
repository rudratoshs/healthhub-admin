
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AssessmentQuestion } from '@/types/assessment';

interface QuestionRendererProps {
  question: AssessmentQuestion;
  form: UseFormReturn<any>;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  question,
  form
}) => {
  return (
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
            {question.type === 'text' && (
              <Input 
                placeholder={question.placeholder}
                {...field}
              />
            )}
            {question.type === 'number' && (
              <Input 
                type="number"
                placeholder={question.placeholder}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            )}
            {question.type === 'select' && (
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={question.placeholder || "Select an option"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {question.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {question.type === 'multiselect' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${question.id}-${option.value}`}
                      checked={(field.value as string[] || []).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value as string[] || [];
                        if (checked) {
                          field.onChange([...currentValue, option.value]);
                        } else {
                          field.onChange(currentValue.filter(val => val !== option.value));
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
            {question.type === 'radio' && (
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {question.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <label htmlFor={`${question.id}-${option.value}`}>{option.label}</label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuestionRenderer;
