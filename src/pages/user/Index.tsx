import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentComplaints } from "@/components/dashboard/RecentComplaints";
import { UpcomingNotices } from "@/components/dashboard/UpcomingNotices";

const Index = () => {
  return (
    <>
      <WelcomeBanner />
      <SummaryCards />
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentComplaints />
        <UpcomingNotices />
      </div>
    </>
  );
};

export default Index;
