"use client"
import { parityGroups } from "@/data/parityGroups";
import ParityGroupCard from "./ParityGroupCard";
import { useState } from "react";

interface GroupSettings {
  discount: string;
  coupon: string;
}

interface GroupSettingsMap {
  [groupName: string]: GroupSettings;
}
export const ParityGroupForm = () => {
  const [groupSettings, setGroupSettings] = useState<GroupSettingsMap>({});
  const handleUpdateDiscount = (groupName: string, discount: string) => {
    setGroupSettings(prev => ({
      ...prev,
      [groupName]: {
        ...prev[groupName],
        discount
      }
    }));

  };

  const handleUpdateCoupon = (groupName: string, coupon: string) => {
    setGroupSettings(prev => ({
      ...prev,
      [groupName]: {
        ...prev[groupName],
        coupon: coupon.toUpperCase()
      }
    }));

  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {parityGroups.map((group) => (
        <ParityGroupCard
          key={group.name}
          group={group}
          onUpdateDiscount={handleUpdateDiscount}
          onUpdateCoupon={handleUpdateCoupon}
          currentDiscount={groupSettings[group.name]?.discount}
          currentCoupon={groupSettings[group.name]?.coupon}
        />
      ))}
    </div>
  );
};