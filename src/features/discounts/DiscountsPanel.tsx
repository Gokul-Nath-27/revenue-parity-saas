"use client"
import React, { useState } from 'react';

import { parityGroups } from '@/data/parityGroups';

import ParityGroupCard from './ParityGroupCard';

interface GroupSettings {
  discount: string;
  coupon: string;
}

interface GroupSettingsMap {
  [groupName: string]: GroupSettings;
}

const DiscountsPanel = () => {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Country Discounts</h2>
          <p className="text-muted-foreground">
            Leave the discount field blank if you do not want to display deals for any specific parity group.
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default DiscountsPanel;