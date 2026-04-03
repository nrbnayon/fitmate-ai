// Configuration and validation schema for policies data

import { z } from 'zod';

// Zod schema for runtime validation
export const SubSectionSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const PolicySectionSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1),
  content: z.string().optional(),
  subsections: z.array(SubSectionSchema).optional(),
});

export const PolicyDocumentSchema = z.object({
  title: z.string().min(1),
  effectiveDate: z.string(),
  sections: z.array(PolicySectionSchema).min(1),
});

export const AppInfoSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // Semver format
  platforms: z.array(z.enum(['iOS', 'Android', 'Web'])).min(1),
  lastUpdated: z.string(), // ISO date format
});

export const PoliciesDataSchema = z.object({
  appInfo: AppInfoSchema,
  privacyPolicy: PolicyDocumentSchema,
  termsAndConditions: PolicyDocumentSchema,
});

// Type inference from schema
export type ValidatedPoliciesData = z.infer<typeof PoliciesDataSchema>;

/**
 * Validate policies data against schema
 * @param data - Data to validate
 * @returns Validation result with errors if any
 */
export function validatePoliciesData(data: unknown) {
  try {
    const validated = PoliciesDataSchema.parse(data);
    return { valid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, data: null, errors: error.errors };
    }
    return { valid: false, data: null, errors: [error] };
  }
}

// Configuration guidelines
export const POLICIES_CONFIG = {
  // Route configuration
  routes: {
    public: '/privacy', // For unauthenticated users
    protected: '/privacy', // For authenticated users
  },

  // Email addresses that appear in content
  emails: {
    privacy: 'privacy@fitmate.com',
    legal: 'legal@fitmate.com',
    dpo: 'dpo@fitmate.com', // Data Protection Officer
  },

  // Contact information
  contact: {
    email: 'privacy@fitmate.com',
    phone: '+1 (555) 123-4567',
    address: '123 Wellness Street, Health City, HC 12345',
  },

  // App information
  app: {
    name: 'Beauty Vibe',
    version: '1.0.0', // Update when releasing new versions
    platforms: ['iOS', 'Android'],
  },

  // Compliance requirements
  compliance: {
    gdpr: true, // EU GDPR
    ccpa: true, // California CCPA
    hipaa: false, // Only if handling Protected Health Information
    age_restriction: 13, // Minimum age requirement
  },

  // Update frequency
  updateSchedule: {
    frequency: 'annually', // annual, semi-annual, quarterly
    lastReview: '2024-04-03',
    nextReview: '2025-04-03',
  },

  // Content guidelines
  content: {
    minSectionsPrivacy: 10,
    minSectionsTerms: 12,
    maxSectionLength: 2000, // characters
  },
};

// Helper function to validate email addresses in config
export function validateEmailsConfig(emails: typeof POLICIES_CONFIG.emails) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors: string[] = [];

  Object.entries(emails).forEach(([key, email]) => {
    if (!emailRegex.test(email)) {
      errors.push(`Invalid email for ${key}: ${email}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// Helper function to check if policies need update
export function isPoliciesOutdated(lastUpdated: string, dayThreshold: number = 365): boolean {
  const lastUpdateDate = new Date(lastUpdated);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastUpdateDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > dayThreshold;
}

// Version changelog
export const VERSION_HISTORY = [
  {
    version: '1.0.0',
    date: '2024-04-03',
    changes: [
      'Initial release with comprehensive privacy policy and terms & conditions',
      'Added JSON-based policy management',
      'Created public and protected pages',
      'Mobile optimization for iOS and Android',
    ],
  },
];

// Recommended app store links
export const APP_STORE_URLS = {
  privacyPolicyPath: '/privacy', // Relative to app domain
  termsPath: '/privacy', // Can be same page with tab switching
  appName: 'Beauty Vibe',
};

// Export all constants for easier importing
export default {
  POLICIES_CONFIG,
  APP_STORE_URLS,
  VERSION_HISTORY,
  validatePoliciesData,
  validateEmailsConfig,
  isPoliciesOutdated,
};
