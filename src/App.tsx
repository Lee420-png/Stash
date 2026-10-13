import React, { useState, useEffect, useMemo } from 'react';
import {
  LinkItem,
  CollectionItem,
  SortOption,
  ViewMode,
  CategoryType,
} from './types';
import { INITIAL_USER_LINKS, DEFAULT_COLLECTIONS } from './data/initialLinks';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NavigationFilter } from './components/NavigationFilter';
import { Toolbar } from './components/Toolbar';
import { LinkCard } from './components/LinkCard';
import { LinkListItem } from './components/LinkListItem';
import { AddLinkDrawer } from './components/AddLinkDrawer';
import { EditLinkDrawer } from './components/EditLinkDrawer';
import { VibeCodeDrawer } from './components/VibeCodeDrawer';
import { CollectionsModal } from './components/CollectionsModal';
import { ExportImportModal } from './components/ExportImportModal';
import {
  Bookmark,
  Plus,
  Search,
  Check,
  Sparkles,
  Inbox,
  FolderOpen,
  Heart,
  Archive,
} from 'lucide-react';

const STORAGE_LINKS_KEY = 'stash_user_links_v3';
const STORAGE_COLLECTIONS_KEY = 'stash_user_collections_v3';
const STORAGE_VIEW_KEY = 'stash_view_mode_v3';

const DEFAULT_CATEGORIES = [
  'All Links',
  'Website Inspiration',
  'GitHub',
  'Vibe Coding',
  'AI Tools',
  'UI Components',
  '3D & Motion',
  'Prompts',
];

export default function App() {
  // Links state
  const [links, setLinks] = useState<LinkItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LINKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored links:', e);
    }
    return INITIAL_USER_LINKS;
  });

  // Collections state
  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_COLLECTIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored collections:', e);
    }
    return DEFAULT_COLLECTIONS;
  });

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_VIEW_KEY);
      if (stored === 'grid' || stored === 'list') return stored;
    } catch {
      // ignore
    }
    return 'grid';
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All Links');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'recent' | 'archived' | 'collection'>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Drawers & Modals
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [selectedVibeLink, setSelectedVibeLink] = useState<LinkItem | null>(null);
  const [isVibeDrawerOpen, setIsVibeDrawerOpen] = useState(false);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
    } catch (e) {
      console.error('Failed saving links to localStorage:', e);
    }
  }, [links]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (e) {
      console.error('Failed saving collections to localStorage:', e);
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VIEW_KEY, viewMode);
    } catch (e) {
      console.error('Failed saving view mode:', e);
    }
  }, [viewMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAddDrawerOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Vibe Code drawer handler
  const handleOpenVibeCode = (link: LinkItem) => {
    setSelectedVibeLink(link);
    setIsVibeDrawerOpen(true);
  };

  // Link Management Handlers
  const handleAddLink = (newLinkData: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newLink: LinkItem = {
      ...newLinkData,
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    setLinks((prev) => [newLink, ...prev]);
    showToast(`Saved "${newLink.title}" to library`);
  };

  const handleUpdateLink = (updated: LinkItem) => {
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    showToast('Link updated');
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Link deleted');
  };

  const handleToggleFavorite = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextFav = !l.isFavorite;
          showToast(nextFav ? 'Added to favorites' : 'Removed from favorites');
          return { ...l, isFavorite: nextFav, updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  const handleToggleArchive = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextArchived = !l.isArchived;
          showToast(nextArchived ? 'Moved to archive' : 'Restored from archive');
          return { ...l, isArchived: nextArchived, updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  const handleAddToCollection = (linkId: string, collectionId: string) => {
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === linkId) {
          const current = l.collections || [];
          const updatedCols = current.includes(collectionId)
            ? current.filter((c) => c !== collectionId)
            : [...current, collectionId];
          return { ...l, collections: updatedCols, updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
    showToast('Updated collection');
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Collection Handlers
  const handleCreateCollection = (name: string, description?: string, color?: string) => {
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name,
      description,
      color: color || '#2563EB',
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCol]);
    showToast(`Created collection "${name}"`);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    // Remove from links as well
    setLinks((prev) =>
      prev.map((l) => ({
        ...l,
        collections: (l.collections || []).filter((c) => c !== id),
      }))
    );
    if (selectedCollectionId === id) {
      setSelectedCollectionId(null);
      setFilterMode('all');
    }
    showToast('Collection deleted');
  };

  // Demo & Backup Handlers
  const handleClearDemoLinks = () => {
    if (window.confirm('Clear all sample links?')) {
      setLinks([]);
      showToast('Library cleared');
    }
  };

  const handleResetDemoData = () => {
    setLinks(INITIAL_USER_LINKS);
    showToast('Restored library links');
  };

  const handleClearAll = () => {
    setLinks([]);
    setSelectedTags([]);
    setSearchQuery('');
    showToast('Library cleared');
  };

  const handleImportData = (importedLinks: LinkItem[], importedCollections: CollectionItem[]) => {
    setLinks(importedLinks);
    if (importedCollections.length > 0) {
      setCollections(importedCollections);
    }
    showToast('Library successfully imported!');
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('All Links');
    setFilterMode('all');
    setSelectedCollectionId(null);
    setSelectedTags([]);
  };

  // All distinct available tags across library
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    links.forEach((l) => {
      l.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [links]);

  // Filtered & Sorted links
  const filteredLinks = useMemo(() => {
    let result = [...links];

    // Archive filter
    if (filterMode === 'archived') {
      result = result.filter((l) => l.isArchived);
    } else {
      result = result.filter((l) => !l.isArchived);
    }

    // Filter mode: favorites
    if (filterMode === 'favorites') {
      result = result.filter((l) => l.isFavorite);
    }

    // Filter mode: recent (added in last 14 days)
    if (filterMode === 'recent') {
      const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      result = result.filter((l) => new Date(l.createdAt).getTime() > fourteenDaysAgo);
    }

    // Filter mode: collection
    if (filterMode === 'collection' && selectedCollectionId) {
      result = result.filter((l) => l.collections?.includes(selectedCollectionId));
    }

    // Category filter
    if (activeCategory !== 'All Links') {
      result = result.filter((l) => l.category === activeCategory);
    }

    // Tag filter (AND condition)
    if (selectedTags.length > 0) {
      result = result.filter((l) => selectedTags.every((t) => l.tags?.includes(t)));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) => {
        const inTitle = l.title.toLowerCase().includes(q);
        const inDomain = l.domain.toLowerCase().includes(q);
        const inUrl = l.url.toLowerCase().includes(q);
        const inDesc = l.description?.toLowerCase().includes(q);
        const inNotes = l.notes?.toLowerCase().includes(q);
        const inTags = l.tags?.some((t) => t.toLowerCase().includes(q));
        const inCat = typeof l.category === 'string' && l.category.toLowerCase().includes(q);
        const inPrompt = l.vibeCodePrompt?.toLowerCase().includes(q);
        const inGithub = l.githubUrl?.toLowerCase().includes(q);
        return inTitle || inDomain || inUrl || inDesc || inNotes || inTags || inCat || inPrompt || inGithub;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return (a.title || a.domain).localeCompare(b.title || b.domain);
        case 'updated':
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        case 'favorites':
          if (a.isFavorite === b.isFavorite) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.isFavorite ? -1 : 1;
        default:
          return 0;
      }
    });

    return result;
  }, [links, filterMode, selectedCollectionId, activeCategory, selectedTags, searchQuery, sortOption]);

  const favoritesCount = useMemo(() => links.filter((l) => l.isFavorite && !l.isArchived).length, [links]);
  const hasDemoLinks = useMemo(() => links.some((l) => l.isDemo), [links]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCategory !== 'All Links' ||
    filterMode !== 'all' ||
    selectedTags.length > 0 ||
    selectedCollectionId !== null;

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col antialiased selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAddDrawer={() => setIsAddDrawerOpen(true)}
        onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        totalLinksCount={links.length}
      />

      {/* Hero Section */}
      <Hero
        totalLinksCount={links.length}
        favoritesCount={favoritesCount}
        collectionsCount={collections.length}
        hasDemoLinks={hasDemoLinks}
        onClearDemoLinks={handleClearDemoLinks}
        onOpenAddDrawer={() => setIsAddDrawerOpen(true)}
      />

      {/* Navigation Filter Tabs */}
      <NavigationFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        filterMode={filterMode}
        onSelectFilterMode={setFilterMode}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        collections={collections}
        onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)}
        categories={DEFAULT_CATEGORIES}
      />

      {/* Toolbar (Tags, Sort, View mode, Counts) */}
      <Toolbar
        selectedTags={selectedTags}
        allAvailableTags={allAvailableTags}
        onToggleTag={handleToggleTag}
        onClearTags={() => setSelectedTags([])}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFilteredCount={filteredLinks.length}
        totalAllCount={links.length}
        hasActiveFilters={hasActiveFilters}
        onResetAllFilters={handleResetAllFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8">
        {filteredLinks.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View: 3 cols desktop, 2 cols tablet, 1 col mobile */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  collections={collections}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleArchive={handleToggleArchive}
                  onDelete={handleDeleteLink}
                  onEdit={(l) => setEditingLink(l)}
                  onSelectTag={handleToggleTag}
                  onAddToCollection={handleAddToCollection}
                  onOpenVibeCode={handleOpenVibeCode}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#EAEAEA]">
              {filteredLinks.map((link) => (
                <LinkListItem
                  key={link.id}
                  link={link}
                  collections={collections}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleArchive={handleToggleArchive}
                  onDelete={handleDeleteLink}
                  onEdit={(l) => setEditingLink(l)}
                  onSelectTag={handleToggleTag}
                  onOpenVibeCode={handleOpenVibeCode}
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="py-20 px-6 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#EAEAEA] flex items-center justify-center text-[#737373] mx-auto shadow-xs">
              {filterMode === 'favorites' ? (
                <Heart className="w-5 h-5 text-[#DC2626]" />
              ) : filterMode === 'archived' ? (
                <Archive className="w-5 h-5" />
              ) : filterMode === 'collection' ? (
                <FolderOpen className="w-5 h-5 text-[#2563EB]" />
              ) : searchQuery ? (
                <Search className="w-5 h-5" />
              ) : (
                <Inbox className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#171717]">
                {searchQuery
                  ? 'Nothing matches your search.'
                  : filterMode === 'favorites'
                  ? 'No favorites yet.'
                  : filterMode === 'archived'
                  ? 'No archived links.'
                  : filterMode === 'collection'
                  ? 'No links in this collection.'
                  : 'Your next great idea starts here.'}
              </h3>
              <p className="text-xs text-[#737373] mt-1 leading-relaxed">
                {searchQuery || hasActiveFilters
                  ? 'Try clearing your active filters or adjusting your search keywords.'
                  : 'Save your first link to start building your personal inspiration library.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  onClick={handleResetAllFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#171717] border border-[#EAEAEA] transition"
                >
                  Clear all filters
                </button>
              ) : (
                <button
                  onClick={() => setIsAddDrawerOpen(true)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#171717] hover:bg-[#262626] text-white shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add your first link</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] bg-white py-8 px-6 text-xs text-[#737373]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#171717]">Stash</span>
            <span>•</span>
            <span>Personal Inspiration &amp; Link Library</span>
          </div>
          <div className="flex items-center gap-4 text-[#737373]">
            <span>Save fast. Organize effortlessly. Find instantly.</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Link Side Panel */}
      <AddLinkDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleAddLink}
        collections={collections}
        categories={DEFAULT_CATEGORIES}
      />

      {/* Edit Link Side Panel */}
      <EditLinkDrawer
        link={editingLink}
        onClose={() => setEditingLink(null)}
        onUpdate={handleUpdateLink}
        onDelete={handleDeleteLink}
        collections={collections}
        categories={DEFAULT_CATEGORIES}
      />

      {/* Vibe Code & Prompt Drawer */}
      <VibeCodeDrawer
        link={selectedVibeLink}
        isOpen={isVibeDrawerOpen}
        onClose={() => setIsVibeDrawerOpen(false)}
      />

      {/* Collections Modal */}
      <CollectionsModal
        isOpen={isCollectionsModalOpen}
        onClose={() => setIsCollectionsModalOpen(false)}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      {/* Backup / Export / Import Modal */}
      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        links={links}
        collections={collections}
        onImportData={handleImportData}
        onResetDemoData={handleResetDemoData}
        onClearAllData={handleClearAll}
      />
    </div>
  );
}
