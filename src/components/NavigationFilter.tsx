import React from 'react';
import {
  Bookmark,
  Heart,
  Clock,
  Archive,
  Folder,
  Layers,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { CollectionItem } from '../types';

interface Props {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  filterMode: 'all' | 'favorites' | 'recent' | 'archived' | 'collection';
  onSelectFilterMode: (mode: 'all' | 'favorites' | 'recent' | 'archived' | 'collection') => void;
  selectedCollectionId: string | null;
  onSelectCollection: (colId: string | null) => void;
  collections: CollectionItem[];
  onOpenCollectionsModal: () => void;
  categories: string[];
}

export const NavigationFilter: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  filterMode,
  onSelectFilterMode,
  selectedCollectionId,
  onSelectCollection,
  collections,
  onOpenCollectionsModal,
  categories,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#EAEAEA]">
      <div className="max-w-[1440px] mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Category Horizontal Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = filterMode === 'all' && activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectFilterMode('all');
                  onSelectCategory(cat);
                  onSelectCollection(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Favorites, Recently Added, Collections Dropdown, Archived */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Favorites */}
          <button
            onClick={() => {
              onSelectFilterMode(filterMode === 'favorites' ? 'all' : 'favorites');
              onSelectCollection(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterMode === 'favorites'
                ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 font-semibold'
                : 'text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterMode === 'favorites' ? 'fill-[#2563EB]' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Recently Added */}
          <button
            onClick={() => {
              onSelectFilterMode(filterMode === 'recent' ? 'all' : 'recent');
              onSelectCollection(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterMode === 'recent'
                ? 'bg-[#171717] text-white'
                : 'text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Added</span>
          </button>

          {/* Collections Selector Dropdown */}
          <div className="relative group">
            <select
              value={selectedCollectionId || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  onSelectFilterMode('collection');
                  onSelectCollection(val);
                } else {
                  onSelectFilterMode('all');
                  onSelectCollection(null);
                }
              }}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer appearance-none pr-7 ${
                filterMode === 'collection' && selectedCollectionId
                  ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30 font-semibold'
                  : 'bg-[#F8F9FA] text-[#737373] hover:text-[#171717] border-[#EAEAEA]'
              }`}
            >
              <option value="">Collections ({collections.length})</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  📁 {col.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Archived */}
          <button
            onClick={() => {
              onSelectFilterMode(filterMode === 'archived' ? 'all' : 'archived');
              onSelectCollection(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              filterMode === 'archived'
                ? 'bg-[#171717] text-white'
                : 'text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA]'
            }`}
            title="Archived Links"
          >
            <Archive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Archived</span>
          </button>
        </div>
      </div>
    </div>
  );
};
