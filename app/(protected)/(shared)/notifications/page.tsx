import NotificationsClient from "@/components/Notifications/NotificationsClient";
import DashboardHeader from "@/components/Shared/DashboardHeader";

export default function NotificationsPage() {
    return (
        <> <DashboardHeader
            title="Notifications"
            description="Stay updated with the latest activities"
        />

            <div className="px-4 md:px-8 mt-8">
                <NotificationsClient />
            </div>
        </>
    );
}
