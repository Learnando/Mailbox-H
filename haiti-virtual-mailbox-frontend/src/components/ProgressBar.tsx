import "../styles/ProgressBar.css";

interface ProgressBarProps {
  currentStep: number;
}

const steps = [
  "Contact Info",
  "Package Details",
  "Shipping & Delivery",
  "Confirm",
];

const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  return (
    <div className="progress-bar">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={label} className="progress-step">
            <div
              className={`circle ${isCompleted ? "completed" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              {isCompleted ? "✔️" : stepNumber}
            </div>
            <div className="step-label">{label}</div>
            {index < steps.length - 1 && (
              <div className={`line ${isCompleted ? "completed" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
