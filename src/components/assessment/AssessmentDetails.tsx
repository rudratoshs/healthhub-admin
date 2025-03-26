
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Assessment } from '@/types/assessment';

interface AssessmentDetailsProps {
  assessment: Assessment;
}

const AssessmentDetails: React.FC<AssessmentDetailsProps> = ({ assessment }) => {
  return (
    <Accordion type="single" collapsible className="mt-8">
      <AccordionItem value="details">
        <AccordionTrigger>Assessment Details</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Assessment ID</p>
              <p className="text-muted-foreground">{assessment.id}</p>
            </div>
            <div>
              <p className="font-medium">Type</p>
              <p className="text-muted-foreground">{assessment.assessment_type}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="text-muted-foreground">{assessment.status}</p>
            </div>
            <div>
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">
                {new Date(assessment.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AssessmentDetails;
