"use client"
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import SubmitButton from "@/components/SubmitButton";

import { updateCountryDiscounts } from "../actions";

import ParityGroupCard from "./ParityGroupCard";
import { CountryGroup } from "./ParityGroupFormWrapper";
export default function ParityGroupForm({
  productId,
  countryGroups,
}: {
  productId: string;
  countryGroups: CountryGroup;
}) {
  const [state, formAction] = useActionState(updateCountryDiscounts, {
    error: false,
    message: "",
  });


  useEffect(() => {
    if (!state.error && state.message) {
      toast.success(state.message);
    }
  }, [state])


  return (
    <form className="grid md:grid-cols-2 gap-6 relative" action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      {countryGroups.map((group) => (
        <ParityGroupCard
          key={group.id}
          group={group}
          {...(state.error && {
            errorFields: state.errorFields?.[group.id] ?? {},
            submittedData: state.formData ?? {},
          })}
        />
      ))}
      <SubmitButton text="Save the changes" />
    </form>
  );
}