import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  X,
  ExternalLink,
  ArrowRight,
  Filter,
  Check,
  Copy,
  CornerDownLeft,
  Loader2,
  FolderGit2,
} from 'lucide-react';
import { LinkItem, AiSearchResult } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  onApplyAiFilter: (matchedIds: string[], query: string, summary: string, reasons: Record<string, string>) => void;
  onOpenVibeCode: (link: LinkItem) => void;
  initialQuery?: string;
}

const QUICK_QUERIES = [
  'mobile screen inspo',
  'vibe coding prompts for cursor',
  '3d webgl shaders and particles',
  'ui component kits for react',
  'sound effects for interactions',
  'design systems for ai coding',
];

export const AiSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  links,
  onApplyAiFilter,
  onOpenVibeCode,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AiSearchResult | null>(null);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery && initialQuery !== lastSearchedQuery) {
        setQuery(initialQuery);
        handleExecuteSearch(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleExecuteSearch = async (searchPrompt: string) => {
    const q = searchPrompt.trim();
    if (!q) return;

    setIsLoading(true);
    setLastSearchedQuery(q);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: q,
          links: links,
        }),
      });

      if (!res.ok) {
        throw new Error('AI search request failed');
      }

      const data = await res.json();
      if (data.success) {
        setSearchResult({
          matchedLinkIds: data.matchedLinkIds || [],
          relevanceReasons: data.relevanceReasons || {},
          summary: data.summary || '',
          suggestedTags: data.suggestedTags || [],
          suggestedQueries: data.suggestedQueries || [],
          source: data.source || 'gemini',
        });
      }
    } catch (err) {
      console.error('Error querying AI search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(query);
  };

  const handleQuickPromptClick = (p: string) => {
    setQuery(p);
    handleExecuteSearch(p);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyToLibrary = () => {
    if (!searchResult) return;
    onApplyAiFilter(
      searchResult.matchedLinkIds,
      lastSearchedQuery,
      searchResult.summary,
      searchResult.relevanceReasons
    );
    onClose();
  };

  if (!isOpen) return null;

  // Retrieve matched link items in rank order
  const matchedLinks: { link: LinkItem; reason: string }[] = [];
  if (searchResult) {
    searchResult.matchedLinkIds.forEach((id) => {
      const found = links.find((l) => l.id === id);
      if (found) {
        matchedLinks.push({
          link: found,
          reason: searchResult.relevanceReasons[id] || '',
        });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#EAEAEA] bg-gradient-to-r from-white via-[#F8F9FA] to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#171717] tracking-tight">
                  Stash AI Curator
                </h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[#737373]">
                Ask in natural language to find mobile screens, 3D shaders, prompt systems, or design inspiration.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F1F3F5] transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Query Input Bar */}
        <div className="p-4 border-b border-[#EAEAEA] bg-white">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737373]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything... e.g. 'mobile screen inspo', 'sound libraries', 'cursor prompts'..."
                autoFocus
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-[#F8F9FA] hover:bg-[#F5F7FA] focus:bg-white border border-[#EAEAEA] text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 text-[#737373] hover:text-[#171717]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] text-[#737373] bg-[#EAEAEA] px-1.5 py-0.5 rounded font-mono hidden sm:inline">
                  ↵ Enter
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-[#737373] shrink-0 font-medium mr-1">Suggestions:</span>
            {QUICK_QUERIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleQuickPromptClick(p)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                  query === p
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#171717] border-[#EAEAEA]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200 animate-pulse">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Gemini 3.8 Flash analyzing your library...
                </p>
                <p className="text-xs text-[#737373]">
                  Evaluating semantic meaning, tags, and vibe prompts for "{lastSearchedQuery || query}"
                </p>
              </div>
            </div>
          )}

          {!isLoading && searchResult && (
            <div className="space-y-4">
              {/* AI Curator Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
                      AI Curator Synthesis
                    </h3>
                    <p className="text-xs text-[#1E293B] mt-0.5 leading-relaxed font-medium">
                      {searchResult.summary}
                    </p>
                  </div>
                </div>

                {matchedLinks.length > 0 && (
                  <button
                    onClick={handleApplyToLibrary}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Main Library ({matchedLinks.length})</span>
                  </button>
                )}
              </div>

              {/* Matched Links List */}
              {matchedLinks.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#737373] px-1 font-medium">
                    <span>Ranked Results ({matchedLinks.length})</span>
                    <span className="text-[11px]">Ranked by semantic match confidence</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {matchedLinks.map(({ link, reason }, index) => (
                      <div
                        key={link.id}
                        className="group p-3.5 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#2563EB] hover:shadow-sm transition flex flex-col sm:flex-row gap-3 sm:items-center justify-between"
                      >
                        {/* Left: Thumbnail & details */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Rank badge */}
                          <div className="w-6 h-6 rounded-md bg-[#F8F9FA] text-[#737373] font-mono text-xs flex items-center justify-center font-bold shrink-0 border border-[#EAEAEA]">
                            #{index + 1}
                          </div>

                          {/* Image or Favicon */}
                          <div className="w-16 h-12 rounded-lg bg-[#F8F9FA] border border-[#EAEAEA] overflow-hidden shrink-0 flex items-center justify-center">
                            {link.previewImage ? (
                              <img
                                src={link.previewImage}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : link.favicon ? (
                              <img src={link.favicon} alt="" className="w-5 h-5 rounded" />
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-[#737373]">
                                {link.domain.slice(0, 3)}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-[#171717] group-hover:text-[#2563EB] transition truncate">
                                {link.title || link.domain}
                              </h4>
                              <span className="text-[11px] font-mono text-[#737373] shrink-0">
                                {link.domain}
                              </span>
                            </div>

                            {/* Why it matched highlight */}
                            {reason && (
                              <p className="text-xs text-[#1D4ED8] bg-blue-50/70 border border-blue-100 rounded-md px-2 py-0.5 mt-1 font-medium inline-block max-w-full truncate">
                                💡 {reason}
                              </p>
                            )}

                            {/* Description & Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-[#F1F3F5] text-[#525252]">
                                {link.category}
                              </span>
                              {link.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-[#737373] bg-[#F8F9FA] px-1.5 py-0.2 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAEAEA]">
                          {link.vibeCodePrompt && (
                            <button
                              onClick={() => {
                                onOpenVibeCode(link);
                                onClose();
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-medium flex items-center gap-1 transition"
                              title="View Vibe Coding Prompt"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span className="hidden md:inline">Vibe Prompt</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyLink(link.url, link.id)}
                            className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA] border border-[#EAEAEA] transition"
                            title="Copy URL"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-[#F8F9FA] rounded-xl border border-[#EAEAEA] p-6 space-y-2">
                  <p className="text-sm font-semibold text-[#171717]">
                    No links in your library matched this exact concept.
                  </p>
                  <p className="text-xs text-[#737373] max-w-md mx-auto">
                    Try searching for broader terms or categories like "mobile", "shaders", "prompts", or add new inspiration links to expand your library.
                  </p>
                </div>
              )}

              {/* Follow-up Suggested Searches */}
              {searchResult.suggestedQueries && searchResult.suggestedQueries.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#737373] block mb-1.5">
                    Related Curations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchResult.suggestedQueries.map((sq) => (
                      <button
                        key={sq}
                        onClick={() => {
                          setQuery(sq);
                          handleExecuteSearch(sq);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-[#F8F9FA] border border-[#EAEAEA] text-[#171717] flex items-center gap-1 transition"
                      >
                        <Search className="w-3 h-3 text-[#737373]" />
                        <span>{sq}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && !searchResult && (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-[#171717]">
                  Instant Semantic Search for Your Inspiration
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  As your Stash grows with dozens of bookmarks, AI curator understands your exact intent. Search for "mobile screen inspo", "3d particle shaders", "sound fx", or "vibe prompts".
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left pt-2">
                <button
                  onClick={() => handleQuickPromptClick('mobile screen inspo')}
                  className="p-3 rounded-xl border border-[#EAEAEA] hover:border-[#2563EB] hover:bg-[#F8F9FA] transition text-left group"
                >
                  <span className="text-xs font-semibold text-[#171717] group-hover:text-[#2563EB] block">
                    📱 Mobile screen inspo
                  </span>
                  <span className="text-[11px] text-[#737373]">
                    Find Appshot, Kage, and mobile UI pattern libraries
                  </span>
                </button>

                <button
                  onClick={() => handleQuickPromptClick('vibe coding prompts for cursor')}
                  className="p-3 rounded-xl border border-[#EAEAEA] hover:border-[#2563EB] hover:bg-[#F8F9FA] transition text-left group"
                >
                  <span className="text-xs font-semibold text-[#171717] group-hover:text-[#2563EB] block">
                    ⚡ Vibe coding & Cursor
                  </span>
                  <span className="text-[11px] text-[#737373]">
                    Find DESIGN.md, VibePrompts, and Cursor Lab UI
                  </span>
                </button>

                <button
                  onClick={() => handleQuickPromptClick('3d webgl shaders and particles')}
                  className="p-3 rounded-xl border border-[#EAEAEA] hover:border-[#2563EB] hover:bg-[#F8F9FA] transition text-left group"
                >
                  <span className="text-xs font-semibold text-[#171717] group-hover:text-[#2563EB] block">
                    🎨 3D & WebGL Shaders
                  </span>
                  <span className="text-[11px] text-[#737373]">
                    Explore Three.js Journey, Casberry, and Vanta
                  </span>
                </button>

                <button
                  onClick={() => handleQuickPromptClick('sound effects for interactions')}
                  className="p-3 rounded-xl border border-[#EAEAEA] hover:border-[#2563EB] hover:bg-[#F8F9FA] transition text-left group"
                >
                  <span className="text-xs font-semibold text-[#171717] group-hover:text-[#2563EB] block">
                    🔊 Sound & Audio FX
                  </span>
                  <span className="text-[11px] text-[#737373]">
                    Find UI sound effect archives like uisfx.com
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#EAEAEA] bg-[#FDFDFD] flex items-center justify-between text-xs text-[#737373]">
          <span className="font-mono text-[11px]">
            {links.length} links in your personal Stash
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[#EAEAEA] text-[#171717] font-mono">⌘J</kbd> anytime to open AI Curator
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#171717] hover:bg-[#F1F3F5] transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
