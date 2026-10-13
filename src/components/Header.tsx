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
  totalLinksCount,
}) => {
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
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search links, tags, domains, personal notes... (Press / to search)"
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F5F7FA] focus:bg-white border border-[#EAEAEA] text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#737373] hover:text-[#171717]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
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
