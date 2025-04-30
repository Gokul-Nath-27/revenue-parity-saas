import { ParityGroupForm } from "./parity-group-form";

const DiscountsPanel = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Country Discounts</h2>
          <p className="text-muted-foreground">
            Leave the discount field blank if you do not want to display deals for any specific parity group.
          </p>
        </div>
      </div>
      <ParityGroupForm />
    </div>
  );
};
export default DiscountsPanel;