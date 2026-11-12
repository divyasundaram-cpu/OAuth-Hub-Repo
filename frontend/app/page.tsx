'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, HelpCircle, BookOpen, CheckCircle, Plus, Bookmark } from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  timeline: string;
  description: string;
  isCustom?: boolean;
}

const initialGuides: Guide[] = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer Tools',
    difficulty: 'Easy',
    timeline: 'Instant Approval',
    description: 'Connect repositories and automate webhook pipelines.'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    difficulty: 'Moderate',
    timeline: '2-3 Business Days',
    description: 'Set up bot integrations and event subscriptions.'
  },
  {
    id: 'google',
    name: 'Google Workspace',
    category: 'Productivity',
    difficulty: 'Hard',
    timeline: '1-3 Weeks',
    description: 'Configure OAuth consent screens and domain verification.'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM & Enterprise',
    difficulty: 'Hard',
    timeline: '3-5 Business Days',
    description: 'Connect connected apps and manage security tokens.'
  }
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>(initialGuides);
  const [customGenerated, setCustomGenerated] = useState<Guide | null>(null);

  // Load saved guides from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('oauth_hub_saved_guides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGuides((prev) => [...prev, ...parsed]);
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
      // Create temporary un-saved custom guide to display below search bar
      setCustomGenerated({
        id: query.toLowerCase().replace(/\s+/g, '-'),
        name: query.trim(),
        category: 'Discovered via Live Agent',
        difficulty: 'Moderate',
        timeline: '2-4 Business Days',
        description: `Custom generated connection setup for ${query.trim()}.`,
        isCustom: true
      });
    } else {
      setCustomGenerated(null);
    }
  };

  const handleSaveToLibrary = (guideToSave: Guide) => {
    // Check if already in guides
    if (guides.some((g) => g.name.toLowerCase() === guideToSave.name.toLowerCase())) {
      setCustomGenerated(null);
      return;
    }

    const updatedGuides = [...guides, guideToSave];
    setGuides(updatedGuides);

    // Save only custom guides to localStorage
    const customOnly = updatedGuides.filter((g) => g.isCustom);
    localStorage.setItem('oauth_hub_saved_guides', JSON.stringify(customOnly));
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
          <p className="text-slate-600">AI-First Integration Guides & Live Generator</p>
        </div>

        {/* Search & Configuration Section */}
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

          {/* Live Generated Guide Preview (Shown directly below search bar when not in library) */}
          {customGenerated && (
            <div className="p-6 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-4 transition animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Live Generator Result</span>
                <h3 className="text-lg font-bold text-slate-900">"{customGenerated.name}" not found in Library.</h3>
                <p className="text-sm text-slate-600">
                  That's totally fine. You can have our AI agent check the developer guides and build a custom setup guide instantly.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{customGenerated.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                      Difficulty: {customGenerated.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">Timeline: {customGenerated.timeline}</span>
                  </div>
                  <p className="text-xs text-slate-600">{customGenerated.description}</p>
                </div>

                <button
                  onClick={() => handleSaveToLibrary(customGenerated)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition whitespace-nowrap"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save to Library</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Library Guides Section */}
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
                className="p-5 border border-slate-200 rounded-xl hover:shadow-md transition bg-white flex flex-col justify-between space-y-4"
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
    </main>
  );
}
