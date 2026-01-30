import ProfileClient from "@/components/Common/Profile/ProfileClient";
import DashboardHeader from "@/components/Shared/DashboardHeader";

export default function SettingsPage() {
    return (
      <div>
        <DashboardHeader
          title="Settings"
          description="View and manage your settings"
        />
        <div className="p-4 md:px-8 md:py-6">
          <ProfileClient />
        </div>
      </div>
    );
}
