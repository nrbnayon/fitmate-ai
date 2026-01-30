"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Policy {
  id: string;
  title: string;
  description: string;
}

const MOCK_POLICIES: Policy[] = [
  {
    id: "1",
    title: "Top 10 places of Colorado",
    description:
      "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
  },
];

export default function PrivacyPolicyClient() {
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPolicies(MOCK_POLICIES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTitleChange = (id: string, value: string) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, title: value } : p))
    );
    setHasChanges(true);
  };

  const handleDescriptionChange = (id: string, value: string) => {
    if (value.length > 275) {
      toast.error("Character limit exceeded", {
        description: "Description must be 275 characters or less.",
      });
      return;
    }
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, description: value } : p))
    );
    setHasChanges(true);
  };

  const handleAddPolicy = () => {
    const newId = Date.now().toString();
    setPolicies([
      ...policies,
      { id: newId, title: "", description: "" },
    ]);
    setHasChanges(true);
    toast.success("New policy added", {
      description: "Fill in the details for the new policy.",
    });
  };

  const handleDeletePolicy = (id: string) => {
    if (policies.length === 1) {
      toast.error("Cannot delete", {
        description: "At least one policy must remain.",
      });
      return;
    }
    setPolicies(policies.filter((p) => p.id !== id));
    setHasChanges(true);
    toast.success("Policy deleted", {
      description: "The policy has been removed.",
    });
  };

  const handleSave = async () => {
    // Validate all policies
    const hasEmptyFields = policies.some(
      (p) => !p.title.trim() || !p.description.trim()
    );

    if (hasEmptyFields) {
      toast.error("Validation error", {
        description: "Please fill in all policy titles and descriptions.",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Policies saved", {
        description: "All privacy policies have been updated successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      console.error(error)
      toast.error("Failed to save", {
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirm) return;
    }
    router.back();
  };

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-gray-50">
            Privacy and policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, manage and forecast your privacy policies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:border-secondary  "
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-gray-800 text-white hover:bg-foreground dark:bg-gray-700 dark:hover:bg-secondary"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Policies List */}
      <div className="flex flex-col gap-8 flex-1">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative"
          >
            {/* Delete button - only show if more than one policy */}
            {policies.length > 1 && (
              <button
                onClick={() => handleDeletePolicy(policy.id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Delete policy"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Policy title
                </label>
                <Input
                  value={policy.title}
                  onChange={(e) => handleTitleChange(policy.id, e.target.value)}
                  className="bg-white dark:bg-foreground border-gray-300 dark:border-secondary text-foreground dark:text-gray-100 h-11"
                  placeholder="Enter policy title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Textarea
                  value={policy.description}
                  onChange={(e) =>
                    handleDescriptionChange(policy.id, e.target.value)
                  }
                  className="min-h-35 bg-white dark:bg-foreground border-gray-300 dark:border-secondary text-foreground dark:text-gray-100 resize-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter policy description"
                />
                <div className="text-right text-xs text-gray-500   font-medium">
                  {275 - policy.description.length} characters left
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Policy Button */}
        <button
          onClick={handleAddPolicy}
          className="w-full border-2 border-dashed border-gray-300 dark:border-secondary rounded-xl p-6 flex items-center justify-center gap-2 text-gray-500   font-medium hover:bg-gray-50  /50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Policy
        </button>
      </div>
    </div>
  );
}