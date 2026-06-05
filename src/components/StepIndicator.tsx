export default function StepIndicator() {
  const steps = [
    { number: 1, label: "Browse", description: "Explore our collection" },
    { number: 2, label: "Customize", description: "Personalize your piece" },
    { number: 3, label: "Checkout", description: "Complete your order" },
  ];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => {
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div className="relative flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300 bg-accent text-primary font-bold text-lg">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-6 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-accent to-accent/30 transform -translate-y-1/2" />
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="font-medium text-sm sm:text-base text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
