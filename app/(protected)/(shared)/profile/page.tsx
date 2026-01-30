import ProfileClient from "@/components/Common/Profile/ProfileClient";
import DashboardHeader from "@/components/Shared/DashboardHeader";

export default function ProfilePage() {
    return (
      <div>
        <DashboardHeader
          title="Profile"
          description="View and manage your profile information"
        />
        <div className="p-4 md:px-8 md:py-6">
          <ProfileClient />
        </div>
      </div>
    );
}
