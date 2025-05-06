import React from 'react';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

import CountryFlag from './CountryFlag';
import { CountryGroups } from './ParityGroupFormWrapper';

interface ParityGroupCardProps {
  group: CountryGroups[number];
  errorFields?: Record<string, string[]>;
  submittedData?: Record<string, string>;
}

const getDisCountPercentage = (number: number | undefined) => {
  return number !== undefined ? Math.round(number * 100) : "";
};

const ParityGroupCard = ({ group, errorFields, submittedData }: ParityGroupCardProps) => {
  const { countries, discount, name, id, recommendedDiscount } = group;

  const submittedDiscount = submittedData?.[`groups[${id}][discount_percentage]`];
  const submittedCoupon = submittedData?.[`groups[${id}][coupon]`];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
      <div className="relative z-10">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          {recommendedDiscount && (
            <p className="text-sm text-muted-foreground">
              Recommended Discount: {recommendedDiscount * 100}%
            </p>
          )}
          {errorFields?.group && (
            <p className="text-destructive text-sm">{errorFields.group[0]}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 bg-muted/30 rounded-md">
              {countries.map((country) => (
                <CountryFlag
                  key={country.code}
                  countryCode={country.code}
                  countryName={country.name}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`discount-${id}`}>Discount %</Label>
                <Input
                  id={`discount-${id}`}
                  type="text"
                  name={`groups[${id}][discount_percentage]`}
                  defaultValue={submittedDiscount ?? getDisCountPercentage(discount?.discount_percentage) ?? ""}
                  className={cn('bg-background', { 'border-destructive': errorFields?.discount_percentage })}
                />
                {errorFields?.discount_percentage && (
                  <p className="text-destructive text-sm">
                    {errorFields.discount_percentage[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`coupon-${id}`}>Coupon Code</Label>
                <Input
                  id={`coupon-${id}`}
                  name={`groups[${id}][coupon]`}
                  defaultValue={submittedCoupon ?? discount?.coupon ?? ""}
                  placeholder="Enter coupon code"
                  className={cn('bg-background uppercase', { 'border-destructive': errorFields?.coupon })}
                />
                {errorFields?.coupon && (
                  <p className="text-destructive text-sm">
                    {errorFields.coupon[0]}
                  </p>
                )}
              </div>
            </div>

            <Input
              type="hidden"
              name={`groups[${id}][countryGroupId]`}
              value={id}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ParityGroupCard;