'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import policiesData from '@/lib/policies.json';
import { ExpandedSections, PoliciesData } from '@/types/policies.types';

interface PoliciesDisplayProps {
  showHeader?: boolean;
  defaultTab?: 'privacy' | 'terms';
  className?: string;
}

export default function PoliciesDisplay({
  showHeader = true,
  defaultTab = 'privacy',
  className = '',
}: PoliciesDisplayProps) {
  const typedPoliciesData = policiesData as PoliciesData;
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const currentPolicy =
    activeTab === 'privacy'
      ? typedPoliciesData.privacyPolicy
      : typedPoliciesData.termsAndConditions;

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {typedPoliciesData.appInfo.name}
          </h1>
          <p className="text-slate-600">
            Privacy Policy & Terms and Conditions
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: {new Date(typedPoliciesData.appInfo.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'privacy'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'terms'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
          }`}
        >
          Terms & Conditions
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {currentPolicy.sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleSection(`${activeTab}-${section.id}`)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {section.id}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                {expandedSections[`${activeTab}-${section.id}`] ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </button>

            {expandedSections[`${activeTab}-${section.id}`] && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                {/* Regular content */}
                {section.content && (
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                )}

                {/* Subsections */}
                  {Array.isArray(section.subsections) && section.subsections.length > 0 && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-slate-900 mb-2">
                          {subsection.title}
                        </h4>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {showHeader && (
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-2">App Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Application</p>
              <p className="font-semibold text-slate-900">{typedPoliciesData.appInfo.name}</p>
            </div>
            <div>
              <p className="text-slate-600">Version</p>
              <p className="font-semibold text-slate-900">{typedPoliciesData.appInfo.version}</p>
            </div>
            <div>
              <p className="text-slate-600">Platforms</p>
              <p className="font-semibold text-slate-900">
                {typedPoliciesData.appInfo.platforms.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
      {showHeader && (
        <div className="mt-8 text-center text-sm text-slate-600">
          <p>
            If you have any questions, please contact us at{' '}
            <a
              href="mailto:privacy@fitmate.com"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              privacy@fitmate.com
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
