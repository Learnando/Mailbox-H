import "../styles/PackageProgress.css";

interface PackageProgressProps {
  status: string;
}

// ✅ Correct real steps in your app
const steps = ["Pending", "Purchased", "Shipped", "Delivered"];

const PackageProgress = ({ status }: PackageProgressProps) => {
  const normalizedStatus = status.toLowerCase();

  // ✅ Updated mapping for step order
  const statusOrder: Record<string, number> = {
    pending: 0,
    purchased: 1,
    shipped: 2,
    delivered: 3,
  };

  const getStepStatus = (step: string) => {
    const normalizedStep = step.toLowerCase();

    if (normalizedStatus === normalizedStep) {
      return "current";
    }

    if (
      (statusOrder[normalizedStatus] ?? -1) >
      (statusOrder[normalizedStep] ?? -1)
    ) {
      return "completed";
    }

    return "upcoming";
  };

  const getStepIcon = (step: string) => {
    const normalizedStep = step.toLowerCase();
    if (normalizedStep === "pending") return "🛒"; // Cart
    if (normalizedStep === "purchased") return "💳"; // Credit card
    if (normalizedStep === "shipped") return "✈️"; // Airplane
    if (normalizedStep === "delivered") return "📦"; // Package delivered
    return "⭕";
  };

  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <div key={index} className={`progress-step ${getStepStatus(step)}`}>
          <div className="icon">{getStepIcon(step)}</div>
          <div className="label">{step}</div>
          {index < steps.length - 1 && <div className="line" />}
        </div>
      ))}
    </div>
  );
};

export default PackageProgress;
