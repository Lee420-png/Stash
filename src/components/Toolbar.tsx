import React from 'react';
import {
  Tag,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  Filter,
} from 'lucide-react';
import { SortOption, ViewMode } from '../types';

interface Props {
  selectedTags: string[];
  allAvailableTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  totalAllCount: number;
  hasActiveFilters: boolean;
  onResetAllFilters: () => void;
}

export const Toolbar: React.FC<Props> = ({
  selectedTags,
  allAvailableTags,
  onToggleTag,
  onClearTags,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalAllCount,
  hasActiveFilters,
  onResetAllFilters,
}) => {
  return (
    <div className="py-4 border-b border-[#EAEAEA] bg-white">
      <div className="max-w-[1440px] mx-auto px-6 space-y-3">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Match Count & Clear Filters */}
          <div className="flex items-center gap-3">
            <span className="text-[#737373] font-medium">
              Showing <strong className="text-[#171717]">{totalFilteredCount}</strong> of {totalAllCount} links
            </span>

            {hasActiveFilters && (
              <button
                onClick={onResetAllFilters}
                className="text-[#2563EB] hover:underline font-medium flex items-center gap-1"
              >
                <span>Clear filters</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-[#737373]">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-[#F8F9FA] hover:bg-[#F5F7FA] border border-[#EAEAEA] rounded-md px-2.5 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#2563EB] transition cursor-pointer"
              >
                <option value="newest">Recently added</option>
                <option value="oldest">Oldest first</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="updated">Recently updated</option>
                <option value="favorites">Favorites first</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-[#F8F9FA] border border-[#EAEAEA] rounded-md">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#171717] shadow-xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'list'
                    ? 'bg-white text-[#171717] shadow-xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filters Row */}
        {allAvailableTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-[#737373] flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" />
              <span>Tags:</span>
            </span>

            {allAvailableTags.slice(0, 15).map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[#737373] hover:text-[#171717] border border-[#EAEAEA]'
                  }`}
                >
                  <span>{tag}</span>
                  {isSelected && <X className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}

            {selectedTags.length > 0 && (
              <button
                onClick={onClearTags}
                className="text-xs text-[#737373] hover:text-[#171717] underline ml-1"
              >
                Clear tags
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
