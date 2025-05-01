"use client"
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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
  const [state, formAction, pending] = useActionState(updateCountryDiscounts, {
    error: false,
    message: "",
    errorFields: {},
    formData: {},
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
          errorFields={state.errorFields?.[group.id] ?? {}}
          submittedData={state.formData ?? {}}
        />
      ))}
      {/* Loading Spinner */}
      <Button type="submit" className="md:col-span-lo2" disabled={pending}>
        Save
      </Button>
    </form>
  );
}