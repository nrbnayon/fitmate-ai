// app\(dashboard)\privacy-policy\page.tsx
import PrivacyPolicyClient from "@/components/Common/PrivacyPolicy/PrivacyPolicyClient";
import DashboardHeader from "@/components/Shared/DashboardHeader";

export default function PrivacyPolicyPage() {
    return (
        <>
        <DashboardHeader 
                title="Privacy & policy" 
                description="Xandra Platform" 
              />
        <div className="p-4 md:p-8">
            <PrivacyPolicyClient />
        </div>
        </>
    );
}
