import React from 'react';
import {
  Bookmark,
  Search,
  Plus,
  LayoutGrid,
  List,
  Download,
  Upload,
  FolderPlus,
  X,
  Sparkles,
} from 'lucide-react';
import { ViewMode } from '../types';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddDrawer: () => void;
  onOpenCollectionsModal: () => void;
  onOpenBackupModal: () => void;
  onOpenAiSearch: (initialQuery?: string) => void;
  totalLinksCount: number;
}

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenAddDrawer,
  onOpenCollectionsModal,
  onOpenBackupModal,
  onOpenAiSearch,
  totalLinksCount,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onOpenAiSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#EAEAEA]">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 text-[#171717] hover:opacity-90 transition group">
            <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              S
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-lg tracking-tight text-[#171717]">Stash</span>
              <span className="text-xs text-[#737373] hidden sm:inline">Inspiration Library</span>
            </div>
          </a>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg mx-2">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search library or press Enter for AI curator... (/ to search)"
              className="w-full pl-9 pr-24 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F5F7FA] focus:bg-white border border-[#EAEAEA] text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 text-[#737373] hover:text-[#171717]"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenAiSearch(searchQuery)}
                className="px-2 py-0.8 text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200/60 flex items-center gap-1 transition"
                title="Search with Gemini AI (⌘J)"
              >
                <Sparkles className="w-3 h-3 text-[#2563EB]" />
                <span className="hidden sm:inline">AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Ask AI Librarian Trigger */}
          <button
            onClick={() => onOpenAiSearch()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg transition shadow-2xs"
            title="Ask AI Curator (⌘J)"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">Ask AI</span>
            <kbd className="hidden lg:inline text-[10px] px-1 py-0.2 bg-white/80 rounded border border-blue-200 text-[#2563EB] font-mono">⌘J</kbd>
          </button>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-white text-[#171717] shadow-xs font-medium'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md text-xs transition ${
                viewMode === 'list'
                  ? 'bg-white text-[#171717] shadow-xs font-medium'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Manage Collections */}
          <button
            onClick={onOpenCollectionsModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#171717] bg-[#F8F9FA] hover:bg-[#F5F7FA] border border-[#EAEAEA] rounded-lg transition"
            title="Manage Collections"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#737373]" />
            <span>Collections</span>
          </button>

          {/* Backup / Export */}
          <button
            onClick={onOpenBackupModal}
            className="p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg transition"
            title="Import / Export Data"
            aria-label="Backup and data management"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Add Link Primary Button */}
          <button
            onClick={onOpenAddDrawer}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>
    </header>
  );
};
