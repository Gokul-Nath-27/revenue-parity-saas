/*
 * for dev purposes only, after seeding, 
 * please make sure you are manually updating the user to premium
 */
import { randomInt } from "crypto";

import { eq } from "drizzle-orm";

import { TierNames } from "@/data/subscriptionTiers";
import db from "@/drizzle/db";
import { CountryGroupDiscount } from "@/drizzle/schemas/country";
import { ProductCustomization } from "@/drizzle/schemas/customization";
import { Product } from "@/drizzle/schemas/product";
import { UserSubscription } from "@/drizzle/schemas/subscription";
import { User } from "@/drizzle/schemas/user";
import { ProductView } from "@/drizzle/schemas/visits";
import { generateSalt, gethashedPassword } from "@/lib/auth";

type Country = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  code: string;
  country_group_id: string;
  country_group: {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    recommended_discount_percentage: number | null;
  };
}

const domainSuffixes = [
  "app", "store", "shop", "digital", "pro", "premium",
  "plus", "online", "web", "cloud", "hub", "center"
];

const productNames = [
  "Analytics Dashboard Pro",
  "Design Template Bundle",
  "Marketing Toolkit",
  "Developer API Access",
  "E-learning Platform",
  "Project Management Suite",
  "Customer Support System",
  "Content Creation Tools",
  "Social Media Manager",
  "Business Intelligence Suite"
];

const sampleDescriptions = [
  "A comprehensive analytics solution for businesses seeking data-driven insights.",
  "Premium design templates for websites, apps, and marketing materials.",
  "All-in-one marketing toolkit for growing businesses and entrepreneurs.",
  "Full API access for developers to integrate with our platform.",
  "Interactive learning platform with courses across multiple disciplines.",
  "Project management solution for teams of all sizes.",
  "Customer support system with ticketing, live chat, and knowledge base.",
  "Tools for content creators to produce, edit, and distribute high-quality content.",
  "Social media management platform for scheduling, analytics, and engagement.",
  "Business intelligence tools for data analysis and visualization."
];

// Colors for customization
const backgroundColors = [
  "hsl(220, 50%, 20%)",
  "hsl(180, 50%, 20%)",
  "hsl(320, 50%, 20%)",
  "hsl(120, 50%, 20%)",
  "hsl(270, 50%, 20%)",
  "hsl(200, 50%, 20%)",
  "hsl(150, 50%, 20%)",
  "hsl(300, 50%, 20%)",
  "hsl(100, 50%, 20%)",
  "hsl(250, 50%, 20%)"
];

const textColors = [
  "hsl(220, 100%, 93%)",
  "hsl(180, 100%, 93%)",
  "hsl(320, 100%, 93%)",
  "hsl(120, 100%, 93%)",
  "hsl(270, 100%, 93%)",
  "hsl(200, 100%, 93%)",
  "hsl(150, 100%, 93%)",
  "hsl(300, 100%, 93%)",
  "hsl(100, 100%, 93%)",
  "hsl(250, 100%, 93%)"
];


const fontSizes = [
  '0.875rem', // Small
  '1rem',     // Medium
  '1.125rem', // Large
  '1.25rem'   // X-Large
];


const bannerRadiusValues = [
  '0px',   // none
  '10px',  // md
  '20px'   // lg
];

function generateRandomVisitDate(daysAgo = 14): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - randomInt(0, daysAgo * 24 * 60 * 60 * 1000));
  return pastDate;
}

async function createGuestUser() {
  console.log("Creating guest user...");
  
  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, "guest@gmail.com")
  });

  if (existingUser) {
    console.log("Guest user already exists, skipping creation");
    return existingUser;
  }

  const salt = generateSalt();
  const plainPassword = "guest@123";
  const hashedPassword = await gethashedPassword(plainPassword, salt);
  
  const [user] = await db.insert(User).values({
    name: "Guest User",
    email: "guest@gmail.com",
    password: hashedPassword,
    salt: salt,
    role: "user"
  }).returning();


  await db.insert(UserSubscription).values({
    user_id: user.id,
    tier: "Free" as TierNames,
  });

  console.log("Guest user created with premium subscription");
  console.log("Guest login credentials:");
  console.log("Email: guest@gmail.com");
  console.log("Password: guest@123");
  
  return user;
}

async function createProductsForUser(userId: string) {
  console.log("Creating products for guest user...");
  
  const countryGroups = await db.query.CountryGroup.findMany();
  
  const countries = await db.query.Country.findMany({
    with: {
      country_group: true
    }
  });
  
  const productIds: string[] = [];
  
  for (let i = 0; i < 10; i++) {
    const name = productNames[i];
    const domainPrefix = name.toLowerCase().replace(/\s+/g, "-");
    const domainSuffix = domainSuffixes[i % domainSuffixes.length];
    const domain = `${domainPrefix}.${domainSuffix}.com`;
    
    const [product] = await db.insert(Product).values({
      user_id: userId,
      name,
      domain,
      description: sampleDescriptions[i % sampleDescriptions.length]
    }).returning();
    
    productIds.push(product.id);
    
    await db.insert(ProductCustomization).values({
      product_id: product.id,
      background_color: backgroundColors[i % backgroundColors.length],
      text_color: textColors[i % textColors.length],
      location_message: "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>\"{coupon}\"</b> to get <b>{discount}%</b> off.",
      class_prefix: `parity-${domainPrefix}`,
      banner_container: "body",
      sticky: true,
      font_size: fontSizes[i % fontSizes.length],
      banner_radius: bannerRadiusValues[i % bannerRadiusValues.length]
    });
    
    for (const countryGroup of countryGroups) {
      const baseDiscount = countryGroup.recommended_discount_percentage || 0.5;
      // Vary by ±40% to create some differences between products
      const variationFactor = 0.6 + (Math.random() * 0.8);
      const discountPercentage = baseDiscount * variationFactor;
      
      const couponPrefix = name.substring(0, 3).toUpperCase();
      const couponSuffix = countryGroup.name.substring(0, 3).toUpperCase();
      
      await db.insert(CountryGroupDiscount).values({
        product_id: product.id,
        country_group_id: countryGroup.id,
        coupon: `${couponPrefix}${couponSuffix}${Math.floor(discountPercentage * 100)}`,
        discount_percentage: discountPercentage
      });
    }
    
    console.log(`Created product: ${name} with domain ${domain}`);
  }
  
  await createVisitData(productIds, countries);
  
  return productIds;
}

async function createVisitData(productIds: string[], countries: Country[]) {
  console.log("Creating visit data...");
  
  const visitValues = [];
  
  for (const [index, productId] of productIds.entries()) {
    const visitCount = index === 0 
      ? randomInt(500, 1000)
      : randomInt(50, 500); 
  
    console.log(`Creating ${visitCount} visits for product ${index + 1}`);
    
    // Create visits for this product
    for (let i = 0; i < visitCount; i++) {
      const country = countries[randomInt(0, countries.length - 1)];
      
      visitValues.push({
        product_id: productId,
        country_id: country.id,
        visited_at: generateRandomVisitDate()
      });
    }
  }
  
  // Insert all visits in batches to avoid query size limits
  const batchSize = 100;
  for (let i = 0; i < visitValues.length; i += batchSize) {
    const batch = visitValues.slice(i, i + batchSize);
    await db.insert(ProductView).values(batch);
  }
  
  console.log(`Created ${visitValues.length} total visit records`);
}

async function main() {
  try {
    const guestUser = await createGuestUser();
    
    await createProductsForUser(guestUser.id);
    
    console.log("✅ Guest user seeding completed successfully");
    console.log(`Created 1 user, 10 products, and visit data`);
    console.log("");
    console.log("You can now log in with:");
    console.log("Email: guest@gmail.com");
    console.log("Password: guest@123");
    
  } catch (error) {
    console.error("Error seeding guest user data:", error);
  } finally {
    process.exit(0);
  }
}


main().catch(console.error); 