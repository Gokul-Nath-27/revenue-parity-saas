import Image from 'next/image'
import React from 'react';

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
}

const CountryFlag = ({ countryCode, countryName }: CountryFlagProps) => {
  return (
    <Image
      src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
      alt={`${countryName} flag`}
      title={countryName}
      width={20}
      height={15}
      className="inline-block w-5 h-[15px] rounded-sm border border-border/50 hover:scale-150 transition-transform duration-200"
    />
  );
};

export default CountryFlag;