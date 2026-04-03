// Type definitions for Privacy Policy and Terms & Conditions

export interface SubSection {
  title: string;
  content: string;
}

export interface PolicySection {
  id: number;
  title: string;
  content?: string | null;
  subsections?: SubSection[] | null;
}

export interface PolicyDocument {
  title: string;
  effectiveDate: string;
  sections: PolicySection[];
}

export interface AppInfo {
  name: string;
  version: string;
  platforms: string[];
  lastUpdated: string;
}

export interface PoliciesData {
  appInfo: AppInfo;
  privacyPolicy: PolicyDocument;
  termsAndConditions: PolicyDocument;
}

// Type for expanded sections state
export type ExpandedSections = Record<string, boolean>;
