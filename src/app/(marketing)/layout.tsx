import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { DisclosureBar } from "@/components/marketing/DisclosureBar";
import { PageTransition } from "@/components/motion/PageTransition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <DisclosureBar />
      <MarketingFooter />
    </div>
  );
}
