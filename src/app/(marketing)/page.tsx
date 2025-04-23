import BannerBuilderSection from "../../components/features/marketing/BannerBuilderSection";
import CTASection from "../../components/features/marketing/CTASection";
import Footer from "../../components/features/marketing/Footer";
import GlobalProfitSection from "../../components/features/marketing/GlobalProfitSection";
import HeroSection from "../../components/features/marketing/HeroSection";
import Navbar from "../../components/features/marketing/Navbar";
import SetupFlowSection from "../../components/features/marketing/SetupFlowSection";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
