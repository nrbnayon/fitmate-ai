import PoliciesDisplay from "@/components/Shared/PoliciesDisplay";

export default function PrivacyPage() {
    return (
        <PoliciesDisplay
            showHeader={true}
            defaultTab="privacy"
            className="max-w-4xl mx-auto px-4 py-8"
        />
    );
}