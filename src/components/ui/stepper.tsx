
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export const Stepper = ({ currentStep, steps, className }: StepperProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    {
                      "bg-green-500 text-white": isCompleted,
                      "bg-blue-500 text-white": isCurrent,
                      "bg-gray-200 text-gray-500": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step Title */}
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      {
                        "text-green-600": isCompleted,
                        "text-blue-600": isCurrent,
                        "text-gray-500": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    {
                      "bg-green-500": index < currentStep,
                      "bg-gray-200": index >= currentStep,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
