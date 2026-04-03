"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Eye,
  Edit3,
  Bold,
  Italic,
  List,
  ExternalLink,
  ChevronRight,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  useGetPoliciesQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
} from "@/redux/services/userApi";
import { useUser } from "@/hooks/useUser";
import { Policy as APIPolicy, SinglePolicyResponse } from "@/types/policies";
import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";

interface PolicyState {
  id: string;
  title: string;
  description: string;
  isEditing: boolean;
}

export default function PrivacyPolicyClient() {
  const router = useRouter();
  const { isAdmin } = useUser();
  const { data: policiesData, isLoading: isPoliciesLoading } =
    useGetPoliciesQuery();
  const [createPolicy] = useCreatePolicyMutation();
  const [updatePolicy] = useUpdatePolicyMutation();
  const [deletePolicy] = useDeletePolicyMutation();

  const [policies, setPolicies] = useState<PolicyState[]>([]);
  const [, setDeletedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (policiesData?.data) {
      const data = policiesData.data;
      const policiesArray: APIPolicy[] = Array.isArray(data)
        ? data
        : (data as any).results || [];

      setPolicies(
        policiesArray.map((p) => ({
          id: String(p.id),
          title: p.title,
          description: p.description,
          isEditing: false,
        })),
      );
      setDeletedIds([]);
      setHasChanges(false);
    }
  }, [policiesData]);

  const handleTitleChange = (id: string, value: string) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, title: value } : p)),
    );
    setHasChanges(true);
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, description: value } : p)),
    );
    setHasChanges(true);
  };

  const toggleEditMode = (id: string) => {
    setPolicies(
      policies.map((p) =>
        p.id === id ? { ...p, isEditing: !p.isEditing } : p,
      ),
    );
  };

  const handleSaveSection = async (id: string) => {
    const policy = policies.find((p) => p.id === id);
    if (!policy) return;

    if (!policy.title.trim() || !policy.description.trim()) {
      toast.error("Validation error", {
        description: "Title and description cannot be empty.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const isNew = policy.id.startsWith("new-");
      const payload = {
        title: policy.title,
        description: policy.description,
      };

      if (isNew) {
        const result = (await createPolicy(
          payload,
        ).unwrap()) as SinglePolicyResponse;
        const newId = String(result.data?.id);
        setPolicies((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, id: newId, isEditing: false } : p,
          ),
        );
      } else {
        await updatePolicy({
          id: parseInt(policy.id),
          payload,
        }).unwrap();
        setPolicies((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isEditing: false } : p)),
        );
      }

      toast.success("Section saved successfully");
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

  const handleAddPolicy = () => {
    const newId = `new-${Date.now()}`;
    setPolicies([
      ...policies,
      { id: newId, title: "", description: "", isEditing: true },
    ]);
    setHasChanges(true);
  };

  const handleDeletePolicy = (id: string) => {
    setPolicyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!policyToDelete) return;

    const isNew = policyToDelete.startsWith("new-");

    if (isNew) {
      setPolicies(policies.filter((p) => p.id !== policyToDelete));
      toast.success("Section removed");
    } else {
      setIsSaving(true);
      try {
        await deletePolicy(parseInt(policyToDelete)).unwrap();
        setPolicies(policies.filter((p) => p.id !== policyToDelete));
        toast.success("Section deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete section");
      } finally {
        setIsSaving(false);
      }
    }

    setIsDeleteModalOpen(false);
    setPolicyToDelete(null);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to discard them?",
        )
      )
        return;
    }
    if (policiesData?.data) {
      const data = policiesData.data;
      const policiesArray: APIPolicy[] = Array.isArray(data)
        ? data
        : (data as any).results || [];
      setPolicies(
        policiesArray.map((p) => ({
          id: String(p.id),
          title: p.title,
          description: p.description,
          isEditing: false,
        })),
      );
      setHasChanges(false);
    }
  };

  const insertMarkdown = (id: string, prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(
      `textarea-${id}`,
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = policies.find((p) => p.id === id)?.description || "";
    const selectedText = currentText.substring(start, end);
    const newText =
      currentText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentText.substring(end);
    handleDescriptionChange(id, newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const MarkdownPreview = ({ content }: { content: string }) => (
    <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-primary/80">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "_No content yet. Use Markdown to format your text._"}
      </ReactMarkdown>
    </div>
  );

  if (isPoliciesLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-8 p-4">
        <Skeleton className="h-14 w-80 rounded-3xl" />
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-40 w-full rounded-[2.5rem]" />
          <Skeleton className="h-40 w-full rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  // PUBLIC VIEW
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col font-nunito relative selection:bg-primary/20 overflow-x-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => router.back()}
            className="mb-8 md:mb-12 inline-flex items-center text-sm font-extrabold text-slate-500 hover:text-primary transition-all bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/50 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </motion.button>

          <div className="mb-14 space-y-5">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-primary">
                Policy
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-500 max-w-2xl font-semibold leading-relaxed">
              Your trust is our priority. Please review our policies to
              understand how we protect your privacy.
            </p>
          </div>

          <div className="space-y-8">
            {policies.map((policy, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={policy.id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
              >
                <div className="absolute top-10 left-0 w-2 h-16 bg-indigo-500 rounded-r-full group-hover:h-24 transition-all duration-500 shadow-lg shadow-indigo-200" />
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors mb-6">
                  {policy.title}
                </h2>
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {policy.description}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ADMIN VIEW
  return (
    <div className="w-full flex-1 flex flex-col mx-auto font-nunito selection:bg-indigo-200">
      {/* Admin Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2.5rem] p-5 md:p-8 mb-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl -z-1" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Policy <span className="text-primary italic">Workshop</span>
            </h1>
            <p className="text-base text-slate-500 font-bold mt-1 max-w-md">
              Craft beautiful, legal-ready policies with full Markdown and HTML
              support.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 md:flex-none h-14 border-none text-slate-500 hover:text-white font-black rounded-2xl px-8"
          >
            Discard Changes
          </Button>
        </div>
      </motion.div>

      {/* Editor List */}
      <div className="flex flex-col gap-10">
        <AnimatePresence mode="popLayout">
          {policies.map((policy, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={policy.id}
              className="bg-white border border-slate-200 rounded-[3rem] p-5 md:p-8 relative shadow-lg hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group"
            >
              {/* Sidebar Indicator */}
              <div
                className={cn(
                  "absolute top-10 left-0 w-2 h-20 rounded-r-2xl transition-all duration-500",
                  policy.isEditing
                    ? "bg-indigo-500"
                    : "bg-slate-200 group-hover:bg-indigo-300",
                )}
              />

              <div className="flex justify-between items-center mb-8 pl-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    {index + 1}
                  </div>
                  <h3 className="font-black text-slate-800 text-xl tracking-tight italic uppercase">
                    Section {index + 1}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl mr-4">
                    <button
                      onClick={() => toggleEditMode(policy.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer",
                        policy.isEditing
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800",
                      )}
                    >
                      <Edit3 className="w-4 h-4" /> Write
                    </button>
                    <button
                      onClick={() => toggleEditMode(policy.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer",
                        !policy.isEditing
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800",
                      )}
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </div>

                  <button
                    onClick={() => handleSaveSection(policy.id)}
                    disabled={isSaving}
                    aria-label="Save section"
                    title="Save section"
                    className="p-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-5 h-5" />
                    <span className="hidden sm:inline text-xs font-black uppercase">
                      Save Section
                    </span>
                  </button>

                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    aria-label="Delete section"
                    title="Delete section"
                    className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-8 pl-4">
                {/* Title Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                    Section Heading
                  </label>
                  <Input
                    value={policy.title}
                    onChange={(e) =>
                      handleTitleChange(policy.id, e.target.value)
                    }
                    className="bg-slate-50/80 border-none text-slate-900 h-16 text-xl font-black rounded-3xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 px-8 shadow-inner placeholder:text-slate-300"
                    placeholder="Enter section title..."
                  />
                </div>

                {/* Content Editor / Preview */}
                <div className="space-y-3 min-h-[300px] flex flex-col">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" />
                      {policy.isEditing
                        ? "Rich Document Editor"
                        : "Live Document Preview"}
                    </label>
                    {policy.isEditing && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => insertMarkdown(policy.id, "**", "**")}
                          className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown(policy.id, "*", "*")}
                          className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown(policy.id, "- ")}
                          className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                          title="List"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            insertMarkdown(policy.id, "[", "](url)")
                          }
                          className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                          title="Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 relative rounded-[2.5rem] overflow-hidden border-2 border-transparent focus-within:border-indigo-500/10 transition-all group/editor">
                    {policy.isEditing ? (
                      <textarea
                        id={`textarea-${policy.id}`}
                        value={policy.description}
                        onChange={(e) =>
                          handleDescriptionChange(policy.id, e.target.value)
                        }
                        className="w-full min-h-[300px] bg-slate-50/50 p-8 md:p-10 text-slate-700 text-lg leading-relaxed font-semibold focus:outline-none resize-none placeholder:text-slate-300"
                        placeholder="Start typing your policy content using Markdown or HTML..."
                      />
                    ) : (
                      <div className="w-full min-h-[300px] bg-indigo-50/20 p-8 md:p-10 border-2 border-indigo-100/50 rounded-[2.5rem]">
                        <MarkdownPreview content={policy.description} />
                      </div>
                    )}
                    {policy.isEditing && (
                      <div className="absolute top-4 right-4 text-[10px] font-black text-white bg-indigo-500/80 px-3 py-1.5 rounded-full backdrop-blur-md opacity-0 group-hover/editor:opacity-100 transition-opacity">
                        MARKDOWN ENABLED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={handleAddPolicy}
          className="w-full border-4 border-dashed border-slate-200 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-4 text-slate-400 font-black hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-500 transition-all group"
        >
          <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform" />
          <span className="text-2xl tracking-tight">
            Add New Policy Section
          </span>
        </motion.button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isSaving}
        title="Delete Policy Section"
        description="Are you sure you want to delete this policy section? This action cannot be undone."
      />
    </div>
  );
}
