import React from 'react';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import CountryFlag from './CountryFlag';
import { ParityGroup } from './parity.ds';

interface ParityGroupCardProps {
  group: ParityGroup;
  onUpdateDiscount: (groupName: string, discount: string) => void;
  onUpdateCoupon: (groupName: string, coupon: string) => void;
  currentDiscount?: string;
  currentCoupon?: string;
}

const ParityGroupCard = ({
  group,
  onUpdateDiscount,
  onUpdateCoupon,
  currentDiscount,
  currentCoupon
}: ParityGroupCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
      <div className="relative z-10">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          {group.recommendedDiscountPercentage && (
            <p className="text-sm text-muted-foreground">
              Recommended discount: {group.recommendedDiscountPercentage * 100}%
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 bg-muted/30 rounded-md">
              {group.countries.map((country) => (
                <CountryFlag
                  key={country.country}
                  countryCode={country.country}
                  countryName={country.countryName}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`discount-${group.name}`}>Discount %</Label>
                <Input
                  id={`discount-${group.name}`}
                  type="number"
                  min="0"
                  max="100"
                  placeholder={group.recommendedDiscountPercentage
                    ? `${group.recommendedDiscountPercentage * 100}`
                    : "Enter discount"
                  }
                  value={currentDiscount || ''}
                  onChange={(e) => onUpdateDiscount(group.name, e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`coupon-${group.name}`}>Coupon Code</Label>
                <Input
                  id={`coupon-${group.name}`}
                  placeholder="Enter coupon code"
                  value={currentCoupon || ''}
                  onChange={(e) => onUpdateCoupon(group.name, e.target.value)}
                  className="bg-background uppercase"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ParityGroupCard;