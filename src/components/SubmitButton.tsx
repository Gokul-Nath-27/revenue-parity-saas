import { useFormStatus } from "react-dom";

import { Button } from "./ui/button";

const SubmitButton = ({ loadingText = "Saving...", text = "Save" }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? loadingText : text}
    </Button>
  );
};

export default SubmitButton;