import BannerBuilderSection from "./_components/BannerBuilderSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";
import GlobalProfitSection from "./_components/GlobalProfitSection";
import HeroSection from "./_components/HeroSection";
import Navbar from "../../components/ui/codebase/Navbar";
import SetupFlowSection from "./_components/SetupFlowSection";

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
