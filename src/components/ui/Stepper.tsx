// src/components/ui/Stepper.tsx
import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-center min-w-[500px]">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center text-center relative group shrink-0">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2',
                    isCompleted
                      ? 'bg-ratq-700 border-ratq-700 text-white'
                      : isCurrent
                      ? 'border-ratq-700 text-ratq-700 bg-canvas shadow-xs'
                      : 'border-border text-fg-subtle bg-muted'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : index + 1}
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span
                    className={clsx(
                      'text-xs font-semibold whitespace-nowrap',
                      isCurrent ? 'text-fg' : 'text-fg-subtle'
                    )}
                  >
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span className="text-[10px] text-fg-subtle mt-0.5 whitespace-nowrap">
                      {step.timestamp}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mx-2 -mt-6 transition-colors',
                    isCompleted ? 'bg-ratq-700' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
