// components\Common\Profile\ProfileClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Pencil, Camera } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation, 
  useChangePasswordMutation 
} from "@/redux/services/authApi";

export default function ProfileClient() {
  const { data: profileRes, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "account" | "notifications" | "language"
  >("account");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [editNameValue, setEditNameValue] = useState("");
  const [editPhoneValue, setEditPhoneValue] = useState("");
  const [editAddressValue, setEditAddressValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profileRes?.data) {
      const data = profileRes.data;
      setEditNameValue(data.full_name || "");
      setEditPhoneValue(data.phone_number || "");
      setEditAddressValue(data.address || "");
      setPreviewUrl(data.profile_picture);
      setHasChanges(false);
    }
  }, [profileRes]);

  const handleSaveName = () => {
    if (!editNameValue.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsEditingName(false);
    setHasChanges(true);
  };

  const handleCancelName = () => {
    setEditNameValue(profileRes?.data?.full_name || "");
    setIsEditingName(false);
  };

  const handleSavePhone = () => {
    setIsEditingPhone(false);
    setHasChanges(true);
  };

  const handleCancelPhone = () => {
    setEditPhoneValue(profileRes?.data?.phone_number || "");
    setIsEditingPhone(false);
  };

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    setHasChanges(true);
  };

  const handleCancelAddress = () => {
    setEditAddressValue(profileRes?.data?.address || "");
    setIsEditingAddress(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error("All fields required");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const res = await changePassword({
        old_password: passwordData.current,
        new_password: passwordData.new,
        confirm_password: passwordData.confirm
      }).unwrap();

      if (res.success) {
        toast.success("Password changed successfully");
        setIsEditingPassword(false);
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to change password");
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
    setIsEditingPassword(false);
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("full_name", editNameValue);
      formData.append("phone_number", editPhoneValue);
      formData.append("address", editAddressValue);
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      await updateProfile(formData).unwrap();

      toast.success("Profile saved");
      setHasChanges(false);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGlobalCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm("Discard unsaved changes?");
      if (!confirm) return;
    }

    if (profileRes?.data) {
      const data = profileRes.data;
      setEditNameValue(data.full_name || "");
      setEditPhoneValue(data.phone_number || "");
      setEditAddressValue(data.address || "");
      setPreviewUrl(data.profile_picture);
    }
    
    setIsEditingName(false);
    setIsEditingPhone(false);
    setIsEditingAddress(false);
    setIsEditingPassword(false);
    setSelectedFile(null);
    setHasChanges(false);
  };

  if (isProfileLoading) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 text-secondary" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome {profileRes?.data?.full_name?.split(" ")[0] || "Admin"}!
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your profile information here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleGlobalCancel}
            disabled={isSaving}
            className="text-foreground border-gray-300 bg-transparent hover:bg-primary/30 hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGlobalSave}
            disabled={isSaving || !hasChanges}
            className="bg-foreground text-white hover:bg-foreground"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        {/* User Info Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="relative group">
            <div className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 bg-gray-200 border-2 border-primary/20">
              <Image
                src={previewUrl || "/images/avatar.png"}
                alt="Profile"
                width={72}
                height={72}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileRes?.data?.full_name || "Admin"
                  )}&background=random&size=72`;
                }}
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white hover:bg-primary/90 transition-all shadow-sm"
              aria-label="Change profile picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {profileRes?.data?.full_name || "Admin"}
            </h2>
            <p className="text-sm text-secondary">
              Update your profile photo and personal details
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Navigation Tabs */}
          <div className="w-full md:w-48 shrink-0 space-y-3">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${activeSection === "account"
                ? "bg-green-50 text-primary border-l-4 border-primary"
                : "text-secondary hover:bg-blue-50"
                }`}
            >
              Account Settings
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 flex flex-col divide-y divide-gray-100">
            {/* Account Settings Section */}
            {activeSection === "account" && (
              <>
                {/* Name Field */}
                <div className="py-6 first:pt-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Your name
                      </label>

                      {isEditingName ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-6 rounded-lg">
                          <p className="text-sm text-secondary mb-3">
                            Make sure this matches the name on your any Govt. ID.
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Full name
                            </label>
                            <Input
                              value={editNameValue}
                              onChange={(e) => {
                                setEditNameValue(e.target.value);
                                setHasChanges(true);
                              }}
                              className="w-full bg-white border-gray-300 text-foreground dark:text-gray-100"
                              placeholder="Enter your full name"
                              maxLength={32}
                            />
                            <div className="text-right text-xs text-gray-400">
                              {editNameValue.length}/32
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelName}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSaveName}
                              className="text-white hover:bg-foreground"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {profileRes?.data?.full_name || "Not set"}
                        </div>
                      )}
                    </div>

                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="py-6 border-b border-gray-100">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone Number
                      </label>

                      {isEditingPhone ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-6 rounded-lg">
                          <div className="space-y-2">
                            <Input
                              value={editPhoneValue}
                              onChange={(e) => {
                                setEditPhoneValue(e.target.value);
                                setHasChanges(true);
                              }}
                              className="w-full bg-white border-gray-300 text-foreground"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelPhone}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSavePhone}
                              className="text-white hover:bg-foreground"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {profileRes?.data?.phone_number || "Not set"}
                        </div>
                      )}
                    </div>

                    {!isEditingPhone && (
                      <button
                        onClick={() => setIsEditingPhone(true)}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                <div className="py-6 border-b border-gray-100">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Address
                      </label>

                      {isEditingAddress ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-6 rounded-lg">
                          <div className="space-y-2">
                            <Input
                              value={editAddressValue}
                              onChange={(e) => {
                                setEditAddressValue(e.target.value);
                                setHasChanges(true);
                              }}
                              className="w-full bg-white border-gray-300 text-foreground"
                              placeholder="Enter address"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelAddress}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSaveAddress}
                              className="text-white hover:bg-foreground"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {profileRes?.data?.address || "Not set"}
                        </div>
                      )}
                    </div>

                    {!isEditingAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="py-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email
                      </label>
                      <div className="text-foreground">
                        {showEmail
                          ? profileRes?.data?.email
                          : profileRes?.data?.email?.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors"
                    >
                      {showEmail ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {showEmail ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="py-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Password
                      </label>

                      {isEditingPassword ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-6 rounded-lg space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Current password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.current}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  current: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Enter current password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              New password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.new}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  new: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Confirm new password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.confirm}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirm: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="showPassword"
                              checked={showPassword}
                              onChange={(e) =>
                                setShowPassword(e.target.checked)
                              }
                              className="rounded"
                            />
                            <label
                              htmlFor="showPassword"
                              className="text-xs text-secondary"
                            >
                              Show passwords
                            </label>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelPassword}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleChangePassword}
                              className="bg-foreground text-white hover:bg-foreground"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground text-xl leading-none tracking-widest mt-1">
                          ••••••••••••••••
                        </div>
                      )}
                    </div>

                    {!isEditingPassword && (
                      <button
                        onClick={() => setIsEditingPassword(true)}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Change
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
