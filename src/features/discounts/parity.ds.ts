export interface Country {
  country: string;
  countryName: string;
}

export interface ParityGroup {
  name: string;
  recommendedDiscountPercentage?: number;
  countries: Country[];
}