import { Metadata } from "next";

import BannerBuilderSection from "@/features/marketing/components/BannerBuilderSection";
import CTASection from "@/features/marketing/components/CTASection";
import Footer from "@/features/marketing/components/Footer";
import GlobalProfitSection from "@/features/marketing/components/GlobalProfitSection";
import HeroSection from "@/features/marketing/components/HeroSection";
import Navbar from "@/features/marketing/components/Navbar";
import SetupFlowSection from "@/features/marketing/components/SetupFlowSection";

export const metadata: Metadata = {
  title: "RevenueParity",
  description: "RevenueParity is a platform that helps you optimize your pricing and increase your revenue.",
};

export default async function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <BannerBuilderSection />
        <SetupFlowSection />
        <GlobalProfitSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
