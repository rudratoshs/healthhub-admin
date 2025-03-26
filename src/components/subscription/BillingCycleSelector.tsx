
import React from 'react';
import { BillingCycle } from '@/types/subscription';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface BillingCycleSelectorProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

const BillingCycleSelector: React.FC<BillingCycleSelectorProps> = ({ value, onChange }) => {
  const handleValueChange = (val: string) => {
    if (val && (val === 'monthly' || val === 'quarterly' || val === 'annual')) {
      onChange(val as BillingCycle);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-sm font-medium">Billing Cycle</div>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={handleValueChange}
        className="justify-center"
      >
        <ToggleGroupItem value="monthly" className="flex-1">
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem value="quarterly" className="flex-1">
          Quarterly
        </ToggleGroupItem>
        <ToggleGroupItem value="annual" className="flex-1">
          Annual
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default BillingCycleSelector;
