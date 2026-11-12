'use client';

import { useState, useEffect } from 'react';
import { Search, HelpCircle, Bookmark, X, Sparkles } from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  timeline: string;
  description: string;
  details?: string[];
  isCustom?: boolean;
}

const initialGuides: Guide[] = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer Tools',
    difficulty: 'Easy',
    timeline: 'Instant Approval',
    description: 'Connect repositories and automate webhook pipelines via official GitHub OAuth Apps.',
    details: [
      'Go to your GitHub profile Settings, open Developer Settings, and click OAuth Apps.',
      'Register a new application with your homepage URL and authorization callback URL.',
      'Generate a client secret and note down the client ID for your authentication flow.',
      'Configure webhook subscriptions to secure token events and repository triggers.'
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    difficulty: 'Moderate',
    timeline: '2-3 Business Days',
    description: 'Set up bot integrations and event subscriptions through the Slack API portal.',
    details: [
      'Navigate to api.slack.com/apps and click Create New App from scratch.',
      'Enable Socket Mode or set a public Request URL for handling event subscriptions.',
      'Add required bot token scopes including chat:write, channels:read, and users:read.',
      'Install the app to your workspace and authorize OAuth tokens securely.'
    ]
  },
  {
    id: 'google',
    name: 'Google Workspace',
    category: 'Productivity',
    difficulty: 'Hard',
    timeline: '1-3 Weeks',
    description: 'Configure OAuth consent screens and domain verification in Google Cloud Console.',
    details: [
      'Open the Google Cloud Console and configure your external or internal OAuth consent screen.',
      'Add authorized domains and request necessary scopes for profile, email, and drive APIs.',
      'Create OAuth 2.0 client IDs specifying web application redirect URIs.',
      'Submit app verification details if requesting restricted scopes for production users.'
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM & Enterprise',
    difficulty: 'Hard',
    timeline: '3-5 Business Days',
    description: 'Connect enterprise tools using Salesforce Connected Apps and OAuth settings.',
    details: [
      'Log into Salesforce, go to Setup, and search for App Manager under Platform Tools.',
      'Create a New Connected App, check Enable OAuth Settings, and enter your callback URL.',
      'Select OAuth scopes such as full access and manage user data via APIs.',
      'Save configuration to retrieve your Consumer Key and Consumer Secret.'
    ]
  }
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [customGenerated, setCustomGenerated] = useState<Guide | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('oauth_hub_saved_guides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGuides((prev) => {
          const existingIds = new Set(prev.map(g => g.id));
          const newGuides = parsed.filter((g: Guide) => !existingIds.has(g.id));
          return [...prev, ...newGuides];
        });
      } catch (e) {
        console.error('Failed to load saved guides', e);
      }
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setCustomGenerated(null);
      return;
    }

    const match = guides.find(
      (g) => g.name.toLowerCase() === query.trim().toLowerCase()
    );

    if (!match) {
      setCustomGenerated({
        id: query.toLowerCase().replace(/\s+/g, '-'),
        name: query.trim(),
        category: 'Discovered via Live Agent',
        difficulty: 'Moderate',
        timeline: '2-4 Business Days',
        description: `Custom generated connection setup for ${query.trim()}.`,
        details: [
          `Initiating automated crawl of official developer documentation for ${query.trim()}.`,
          'Analyzing API endpoint structures, authentication handshakes, and token exchange protocols.',
          'Synthesizing secure credential setup guidelines and permission scopes.',
          'Blueprint ready for agent connection and deployment.'
        ],
        isCustom: true
      });
    } else {
      setCustomGenerated(null);
    }
  };

  const handleSaveToLibrary = (guideToSave: Guide) => {
    if (guides.some((g) => g.id === guideToSave.id)) {
      setSelectedGuide(guideToSave);
      setCustomGenerated(null);
      return;
    }

    const updatedGuides = [...guides, guideToSave];
    setGuides(updatedGuides);

    const customOnly = updatedGuides.filter((g) => g.isCustom);
    localStorage.setItem('oauth_hub_saved_guides', JSON.stringify(customOnly));
    
    setSelectedGuide(guideToSave);
    setCustomGenerated(null);
    setSearchQuery('');
  };

  const filteredGuides = guides.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">OAuth Agent Hub</h1>
            <button className="flex items-center gap-1.5 text-sm border border-slate-300 rounded-md px-3 py-1.5 hover:bg-slate-50 transition">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help</span>
            </button>
          </div>
          <p className="text-slate-600">AI-First Integration Guides and Live Generator</p>
        </div>

        {/* Search Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configure your agent's third-party connections</h2>
          <p className="text-sm text-slate-600">Search library guides or type any app name to generate a live setup blueprint instantly.</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search apps (e.g., Slack, GitHub) or type new app (e.g., Swiggy, Zomato)..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Live Generated Guide Preview - displayed directly below search bar */}
          {customGenerated && (
            <div className="p-6 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-4 transition">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Live Generator Result</span>
                <h3 className="text-lg font-bold text-slate-900">"{customGenerated.name}" not found in Library.</h3>
                <p className="text-sm text-slate-600">
                  That is totally fine. You can have our AI agent check the developer guides and build a custom setup guide instantly.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 cursor-pointer flex-1" onClick={() => setSelectedGuide(customGenerated)}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 hover:text-indigo-600 transition underline">{customGenerated.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                      Difficulty: {customGenerated.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">Timeline: {customGenerated.timeline}</span>
                  </div>
                  <p className="text-xs text-slate-600">{customGenerated.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedGuide(customGenerated)}
                    className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition"
                  >
                    View Guide
                  </button>
                  <button
                    onClick={() => handleSaveToLibrary(customGenerated)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition whitespace-nowrap"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Save to Library</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Library Guides */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Library Guides</h2>
            <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
              {filteredGuides.length} Apps Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="p-5 border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 cursor-pointer transition bg-white flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{guide.name}</h3>
                    {guide.isCustom && (
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">
                        Custom Saved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{guide.category}</p>
                  <p className="text-sm text-slate-600">{guide.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Difficulty: <strong className="text-slate-800">{guide.difficulty}</strong></span>
                  <span>Timeline: <strong className="text-slate-800">{guide.timeline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{selectedGuide.category}</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedGuide.name} Setup Guide</h3>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200 font-medium">
                  Difficulty: {selectedGuide.difficulty}
                </span>
                <span className="text-slate-600">Estimated Timeline: <strong>{selectedGuide.timeline}</strong></span>
              </div>

              <p className="text-sm text-slate-600">{selectedGuide.description}</p>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-semibold text-slate-900">Step-by-Step Instructions:</h4>
                <ol className="space-y-2">
                  {selectedGuide.details?.map((step, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-indigo-600">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {selectedGuide.isCustom && !guides.some(g => g.id === selectedGuide.id) && (
                <button
                  onClick={() => handleSaveToLibrary(selectedGuide)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
                >
                  Save to Library
                </button>
              )}
              <button
                onClick={() => setSelectedGuide(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
