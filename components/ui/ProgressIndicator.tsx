import React from 'react';

interface Step {
    number: number;
    title: string;
    completed: boolean;
}

interface ProgressIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepNumber: number) => void;
}

export default function ProgressIndicator({ steps, currentStep, onStepClick }: ProgressIndicatorProps) {
    return (
        <div className="w-full">
            {/* Desktop: Horizontal */}
            <div className="hidden md:flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center flex-1">
                            <button
                                onClick={() => step.completed && onStepClick?.(step.number)}
                                disabled={!step.completed && step.number !== currentStep}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step.number === currentStep
                                        ? 'bg-indigo-600 text-white shadow-lg scale-110'
                                        : step.completed
                                            ? 'bg-green-500 text-white cursor-pointer hover:scale-105'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {step.completed ? '✓' : step.number}
                            </button>
                            <span className={`mt-2 text-xs font-medium text-center ${step.number === currentStep
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : step.completed
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded transition-all ${step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile: Vertical Compact */}
            <div className="md:hidden mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {currentStep}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {steps.find(s => s.number === currentStep)?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Etapa {currentStep} de {steps.length}
                        </p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
