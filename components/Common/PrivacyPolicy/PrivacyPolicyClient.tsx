"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, ShieldCheck, FileText, Lock } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { 
  useGetPoliciesQuery, 
  useCreatePolicyMutation, 
  useUpdatePolicyMutation, 
  useDeletePolicyMutation 
} from "@/redux/services/userApi";
import { useUser } from "@/hooks/useUser";
import { Policy as APIPolicy } from "@/types/policies";

interface PolicyState {
  id: string;
  title: string;
  description: string;
}

export default function PrivacyPolicyClient() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { data: policiesData, isLoading: isPoliciesLoading } = useGetPoliciesQuery();
  const [createPolicy] = useCreatePolicyMutation();
  const [updatePolicy] = useUpdatePolicyMutation();
  const [deletePolicy] = useDeletePolicyMutation();

  const [policies, setPolicies] = useState<PolicyState[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (policiesData?.data) {
      const data = policiesData.data;
      const policiesArray: APIPolicy[] = Array.isArray(data) ? data : data.results || [];
      
      setPolicies(policiesArray.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description
      })));
      setDeletedIds([]);
      setHasChanges(false);
    }
  }, [policiesData]);

  const handleTitleChange = (id: string, value: string) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, title: value } : p))
    );
    setHasChanges(true);
  };

  const handleDescriptionChange = (id: string, value: string) => {
    if (value.length > 500) {
      toast.error("Character limit exceeded", {
        description: "Description must be 500 characters or less.",
      });
      return;
    }
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, description: value } : p))
    );
    setHasChanges(true);
  };

  const handleAddPolicy = () => {
    const newId = `new-${Date.now()}`;
    setPolicies([
      ...policies,
      { id: newId, title: "", description: "" },
    ]);
    setHasChanges(true);
  };

  const handleDeletePolicy = (id: string) => {
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      setDeletedIds([...deletedIds, numericId]);
    }
    setPolicies(policies.filter((p) => p.id !== id));
    setHasChanges(true);
  };

  const handleSave = async () => {
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
      if (deletedIds.length > 0) {
        await Promise.all(deletedIds.map(id => deletePolicy(id).unwrap()));
      }

      await Promise.all(policies.map(policy => {
        const isNew = policy.id.startsWith("new-");
        if (isNew) {
          return createPolicy({
            title: policy.title,
            description: policy.description
          }).unwrap();
        } else {
          return updatePolicy({
            id: parseInt(policy.id),
            payload: {
              title: policy.title,
              description: policy.description
            }
          }).unwrap();
        }
      }));

      toast.success("Policies saved", {
        description: "All privacy policies have been updated successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      const err = error as { data?: { message?: string } };
      toast.error("Failed to save", {
        description: err.data?.message || "Please try again.",
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
    if (policiesData?.data) {
      const data = policiesData.data;
      const policiesArray: APIPolicy[] = Array.isArray(data) ? data : data.results || [];
      
      setPolicies(policiesArray.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description
      })));
      setDeletedIds([]);
      setHasChanges(false);
    } else {
      setPolicies([]);
      setHasChanges(false);
    }
  };

  if (isPoliciesLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-8">
        <Skeleton className="h-12 w-64 rounded-full" />
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: PUBLIC (Not Admin)
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col font-nunito relative selection:bg-primary/20">
        
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <button 
            onClick={() => router.back()} 
            className="mb-8 md:mb-12 inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <div className="text-center mb-16 space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white text-primary shadow-xl shadow-primary/10 border border-primary/10 rotate-3 hover:rotate-0 transition-transform duration-300 mb-4"
            >
              <ShieldCheck className="w-10 h-10" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
            >
              Privacy <span className="text-primary">Policy</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium"
            >
              We are committed to protecting your privacy. Read our policies below to understand how we handle your data and safeguard your information.
            </motion.p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            <div className="p-6 sm:p-10 md:p-12 space-y-12">
              {policies.length > 0 ? (
                policies.map((policy, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    key={policy.id} 
                    className="relative group"
                  >
                    {idx !== 0 && <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent -mt-6"></div>}
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <div className="shrink-0 bg-slate-50/80 rounded-2xl p-3 ring-1 ring-slate-100 group-hover:bg-primary/5 group-hover:ring-primary/20 transition-all duration-300 group-hover:scale-110">
                        <Lock className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
                          {policy.title}
                        </h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No Policies Found</h3>
                  <p className="text-slate-500 mt-2">Privacy policies are currently being updated.</p>
                </div>
              )}
            </div>
            {/* Footer decoration */}
            <div className="bg-slate-50 border-t border-slate-100 p-6 sm:p-8 text-center">
               <p className="text-sm font-medium text-slate-500">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ADMIN
  // ==========================================
  return (
    <div className="w-full flex-1 flex flex-col max-w-6xl mx-auto px-4 py-8 font-nunito selection:bg-primary/20">
      {/* Header */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 mb-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy Management
            </h1>
            <p className="text-sm text-slate-500 font-bold mt-1">
              Create, edit, and organize legal policies displayed to your users.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 md:flex-none h-11 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex-1 md:flex-none h-11 bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 shadow-md rounded-xl"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Editor List */}
      <div className="flex flex-col gap-6 flex-1">
        {policies.map((policy, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={policy.id}
            className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 relative shadow-sm group hover:border-primary/40 transition-colors"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 rounded-l-[2rem] group-hover:bg-primary/80 transition-colors" />
            
            <div className="flex justify-between items-center mb-6 pl-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                    {index + 1}
                 </div>
                 <h3 className="font-extrabold text-slate-800 text-lg">Section Header</h3>
              </div>
              
              {policies.length > 1 && (
                <button
                  onClick={() => handleDeletePolicy(policy.id)}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete section"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-6 pl-4">
              <div className="space-y-2">
                <label className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                  Policy Title
                </label>
                <Input
                  value={policy.title}
                  onChange={(e) => handleTitleChange(policy.id, e.target.value)}
                  className="bg-slate-50/50 border-slate-200 text-slate-900 h-12 text-base font-bold rounded-xl focus-visible:ring-primary/30 focus-visible:border-primary shadow-inner"
                  placeholder="e.g. Data Collection & Usage"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center whitespace-pre">
                  <label className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                    Detailed Description
                  </label>
                  <span className={`text-xs font-bold ${policy.description.length > 450 ? 'text-orange-500' : 'text-slate-400'}`}>
                    {policy.description.length} / 500
                  </span>
                </div>
                <Textarea
                  value={policy.description}
                  onChange={(e) =>
                    handleDescriptionChange(policy.id, e.target.value)
                  }
                  className="min-h-[160px] bg-slate-50/50 border-slate-200 text-slate-700 text-base leading-relaxed font-medium rounded-xl focus-visible:ring-primary/30 focus-visible:border-primary resize-y shadow-inner"
                  placeholder="Clearly explain the policy details here..."
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Policy Button */}
        <button
          onClick={handleAddPolicy}
          className="w-full border-2 border-dashed border-slate-300 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 text-slate-500 font-extrabold hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
             <Plus className="w-6 h-6" />
          </div>
          Add New Policy Section
        </button>
      </div>
    </div>
  );
}