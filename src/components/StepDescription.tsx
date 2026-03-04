interface StepDescriptionProps {
  description: string
  currentStep: number
  totalSteps: number
}

export function StepDescription({ description, currentStep, totalSteps }: StepDescriptionProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-4">
      <span className="text-gray-500 text-sm whitespace-nowrap font-mono">
        Step {Math.max(0, currentStep + 1)}/{totalSteps}
      </span>
      <span className="text-gray-200 text-sm">{description || 'Press Play or Next to begin'}</span>
    </div>
  )
}
