import MultiStepForm from "../components/MultiStepForm"; // ✅ Import the new form
import "../styles/PackageForm.css"; // ✅ Keep the styles

const PackageForm = () => {
  return (
    <div className="package-form-container">
      <h2>📦 Submit Your Package</h2>
      <MultiStepForm /> {/* ✅ Use MultiStepForm instead of old form */}
    </div>
  );
};

export default PackageForm;
