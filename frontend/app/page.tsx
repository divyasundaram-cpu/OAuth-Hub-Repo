'use client';

import { useState } from 'react';
import { Search, Sparkles, HelpCircle, X, Copy, Bot, User, AlertTriangle } from 'lucide-react';

interface AppGuide {
  id: string;
  name: string;
  icon: string;
  category: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  difficultyClass: string;
  timeline: string;
  strictness: string;
  tokenExpiry: string;
  steps: string[];
  blockers: string[];
  agentRole: string;
  humanRole: string;
}

const INITIAL_LIBRARY: AppGuide[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    category: 'Developer Tools',
    difficulty: 'Easy',
    difficultyClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    timeline: 'Instant Approval',
    strictness: 'Low / Public App',
    tokenExpiry: 'Never expires (unless revoked)',
    steps: [
      'Navigate to GitHub Developer Settings > OAuth Apps and register a new application.',
      'Configure authorization callback URL matching your backend handler.',
      'Generate Client Secret and securely store in environment variables.'
    ],
    blockers: [
      'Public OAuth apps are limited to 50 user tokens before requiring app verification.',
      'Rate limit of 5,000 requests per hour applies to authenticated API calls.'
    ],
    agentRole: 'Verified GitHub OAuth endpoints, callback requirements, and token longevity rules.',
    humanRole: 'Store Client Secret securely in environment variables and manage user scopes.'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    category: 'Communication',
    difficulty: 'Moderate',
    difficultyClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    timeline: '2-3 Business Days',
    strictness: 'App Review Required',
    tokenExpiry: 'Token rotation supported (12h/custom)',
    steps: [
      'Create a new app at api.slack.com/apps and configure Bot Token Scopes.',
      'Enable Socket Mode or set up event subscriptions with verified HTTPS endpoints.',
      'Submit app for public directory review if distributing beyond workspace.'
    ],
    blockers: [
      'Adding new scopes after approval triggers re-review queues.',
      'User token rotation requires handling refresh token exchanges.'
    ],
    agentRole: 'Parsed Slack bot scopes, socket mode configs, and review queue criteria.',
    humanRole: 'Submit privacy policy URL and app description for Slack security review.'
  },
  {
    id: 'google',
    name: 'Google Workspace',
    icon: '📁',
    category: 'Productivity',
    difficulty: 'Hard',
    difficultyClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    timeline: '1-3 Weeks',
    strictness: 'Strict / Restricted Scopes',
    tokenExpiry: 'Refresh token expires after 6 months of inactivity',
    steps: [
      'Configure OAuth consent screen in Google Cloud Console with verified domain.',
      'Submit restricted scopes (Gmail/Drive) for CASA security assessment.',
      'Handle unverified app warning screens during testing phase.'
    ],
    blockers: [
      'Restricted scopes trigger mandatory third-party security assessments taking up to 3 weeks.',
      'Test users limited to 100 until publishing status is set to Production.'
    ],
    agentRole: 'Mapped Google OAuth client configurations and restricted scope definitions.',
    humanRole: 'Complete CASA security assessment and provide legal compliance documentation.'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '☁️',
    category: 'CRM & Enterprise',
    difficulty: 'Hard',
    difficultyClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    timeline: '3-5 Business Days',
    strictness: 'Enterprise / Connected App',
    tokenExpiry: 'Configurable session timeouts',
    steps: [
      'Create a Connected App in Salesforce Setup with OAuth enabled.',
      'Configure OAuth scopes and enable digital certificate signatures.',
      'Approve pre-authorized profiles for organization users.'
    ],
    blockers: [
      'IP restriction policies in enterprise orgs can block agent callback IPs.',
      'Manager approval required for custom Connected App publishing.'
    ],
    agentRole: 'Extracted Connected App settings and certificate signature requirements.',
    humanRole: 'Manage enterprise admin profile permissions and consumer key secrets.'
  }
];

export default function OAuthAgentHub() {
  const [guides, setGuides] = useState<AppGuide[]>(INITIAL_LIBRARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<AppGuide | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const filteredGuides = guides.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exactMatchFound = filteredGuides.length > 0 || searchQuery.trim() === '';

  const handleLiveGeneration = async (appName: string) => {
    setIsGenerating(true);
    setSimLogs([`Searching developer documentation and OAuth endpoints for "${appName}"...`]);

    setTimeout(() => setSimLogs(prev => [...prev, `Crawling authorization code grant requirements and callback configurations...`]), 1200);
    setTimeout(() => setSimLogs(prev => [...prev, `Analyzing token expiry rules, rate limits, and verification strictness...`]), 2500);
    setTimeout(() => setSimLogs(prev => [...prev, `Structuring actionable setup blueprint and generating agent vs human boundaries...`]), 3800);

    setTimeout(() => {
      setIsGenerating(false);
      const generatedGuide: AppGuide = {
        id: appName.toLowerCase().replace(/\s+/g, '-'),
        name: appName,
        icon: '✨',
        category: 'Discovered via Live Agent',
        difficulty: 'Moderate',
        difficultyClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        timeline: '2-4 Business Days',
        strictness: 'Standard Developer Account',
        tokenExpiry: 'Standard OAuth 2.0 (Refresh Token supported)',
        steps: [
          `Navigate to ${appName} Developer Portal and register a new OAuth application.`,
          'Configure authorized redirect URIs for your backend callback endpoint.',
          'Request required API scopes for read/write agent access.',
          'Generate Client ID and Client Secret, store securely in environment variables.'
        ],
        blockers: [
          `Ensure your ${appName} account has proper admin permissions to register integrations.`,
          'Check rate-limiting headers during initial bulk data synchronization.'
        ],
        agentRole: `Agent successfully crawled ${appName} documentation, parsed endpoints, and mapped scope requirements.`,
        humanRole: 'Human developer must securely store Client Secrets and complete final production submission.'
      };

      setGuides(prev => [generatedGuide, ...prev]);
      setSelectedGuide(generatedGuide);
      setSearchQuery('');
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">⚡</div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">OAuth Agent Hub</h1>
              <p className="text-xs text-slate-500">AI-First Integration Guides & Live Generator</p>
            </div>
          </div>
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Configure your agent's third-party connections</h2>
            <p className="text-sm text-slate-600">Search library guides or type any app name to generate a live setup blueprint instantly.</p>
          </div>
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps (e.g., Slack, GitHub) or type new app (e.g., Notion)..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </section>

        {!exactMatchFound && searchQuery.trim() !== '' && !isGenerating && (
          <div className="bg-white border border-indigo-100 rounded-2xl p-6 text-center shadow-sm space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <p className="text-sm text-slate-700 font-medium">
                <span className="font-bold">"{searchQuery}"</span> not found in Library.
              </p>
              <p className="text-xs text-slate-500">That’s totally fine—you can have our AI agent crawl developer docs and build a custom setup guide instantly.</p>
            </div>
            <div>
              <button 
                onClick={() => handleLiveGeneration(searchQuery)}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Live Guide for {searchQuery}</span>
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                <h3 className="font-semibold text-sm">Agent Investigating Integration...</h3>
              </div>
            </div>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              {simLogs.map((log, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-indigo-400">→</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className={`space-y-4 transition-opacity ${!exactMatchFound && searchQuery.trim() !== '' ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Library Guides</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">{filteredGuides.length} Apps Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredGuides.map((app) => (
              <div 
                key={app.id}
                onClick={() => setSelectedGuide(app)}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl group-hover:bg-indigo-50 transition-colors">{app.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{app.name}</h4>
                    <p className="text-xs text-slate-500">{app.category}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Difficulty:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-md ${app.difficultyClass}`}>{app.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="font-medium text-slate-700">{app.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedGuide && (
          <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">{selectedGuide.icon}</div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-slate-900">{selectedGuide.name}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${selectedGuide.difficultyClass}`}>{selectedGuide.difficulty}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedGuide.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => alert('Markdown copied to clipboard!')}
                  className="flex items-center space-x-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </button>
                <button onClick={() => setSelectedGuide(null)} className="text-slate-400 hover:text-slate-600 p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Approval Timeline</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{selectedGuide.timeline}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Verification Strictness</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{selectedGuide.strictness}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Token Expiry & Rotation</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{selectedGuide.tokenExpiry}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">Step-by-Step Setup Blueprint</h4>
              <div className="space-y-3">
                {selectedGuide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-indigo-600">0{idx + 1}</span>
                    <span className="text-slate-700 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Known Blockers & Nuances</span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                {selectedGuide.blockers.map((blocker, idx) => (
                  <li key={idx}>{blocker}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
                  <Bot className="w-4 h-4" />
                  <span>What the AI Agent Did</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedGuide.agentRole}</p>
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Where Human Takes Over</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedGuide.humanRole}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900">Help</h3>
              <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p><strong className="text-slate-800">Library:</strong> Select any guide for common apps (Slack, GitHub, Google, Salesforce) to check setup steps and verification timelines.</p>
              <p><strong className="text-slate-800">Live Generator:</strong> Type any app name in the search bar above to let our AI agent crawl developer documentation and generate a custom setup blueprint in real time.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setIsHelpOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-xl">Got it</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>OAuth Agent Hub • Designed for AI-First Product Management & Engineering Teams</p>
      </footer>
    </div>
  );
}
