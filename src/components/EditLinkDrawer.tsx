import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Tag,
  Check,
  Trash2,
  Archive,
  ArchiveRestore,
  StickyNote,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { LinkItem, CollectionItem } from '../types';

interface Props {
  link: LinkItem | null;
  onClose: () => void;
  onUpdate: (updatedLink: LinkItem) => void;
  onDelete: (id: string) => void;
  collections: CollectionItem[];
  categories: string[];
}

export const EditLinkDrawer: React.FC<Props> = ({
  link,
  onClose,
  onUpdate,
  onDelete,
  collections,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [notes, setNotes] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [vibeCodePrompt, setVibeCodePrompt] = useState('');

  useEffect(() => {
    if (link) {
      setTitle(link.title || '');
      setDescription(link.description || '');
      setCategory(link.category || 'Website Inspiration');
      setTags(link.tags || []);
      setSelectedCollections(link.collections || []);
      setIsFavorite(link.isFavorite || false);
      setIsArchived(link.isArchived || false);
      setNotes(link.notes || '');
      setGithubUrl(link.githubUrl || '');
      setVibeCodePrompt(link.vibeCodePrompt || '');
    }
  }, [link]);

  if (!link) return null;

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tagInput.trim()) return;

    let clean = tagInput.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;

    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleCollection = (colId: string) => {
    if (selectedCollections.includes(colId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== colId));
    } else {
      setSelectedCollections([...selectedCollections, colId]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...link,
      title: title.trim() || link.domain,
      description: description.trim(),
      category: category || 'Website Inspiration',
      tags,
      collections: selectedCollections,
      isFavorite,
      isArchived,
      notes: notes.trim(),
      githubUrl: githubUrl.trim() || undefined,
      vibeCodePrompt: vibeCodePrompt.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg h-full bg-white border-l border-[#EAEAEA] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#171717]">Edit Link Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#171717] rounded-md hover:bg-[#F8F9FA] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Link URL preview badge */}
          <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#EAEAEA] flex items-center justify-between">
            <span className="text-xs font-mono text-[#737373] truncate mr-2">{link.url}</span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:text-[#1D4ED8] p-1 shrink-0"
              title="Open site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717]">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-sm text-[#171717] focus:outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717]">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
            >
              {categories.filter((c) => c !== 'All Links').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* GitHub Repository (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Related GitHub Repository (Optional)</span>
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs font-mono text-[#171717] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Vibe Code Prompt (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>AI Vibe Coding Prompt (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={vibeCodePrompt}
              onChange={(e) => setVibeCodePrompt(e.target.value)}
              placeholder="Prompt template for Cursor, Claude, Lovable, Bolt, etc."
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs text-[#171717] font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#171717]">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag e.g. #ThreeJS"
                className="flex-1 px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-3 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-xs font-medium text-[#171717] border border-[#EAEAEA]"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#F8F9FA] border border-[#EAEAEA] text-[#171717]"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-[#737373] hover:text-[#DC2626]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Collections */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#171717]">Collections</label>
            <div className="flex flex-wrap gap-2">
              {collections.map((col) => {
                const selected = selectedCollections.includes(col.id);
                return (
                  <button
                    type="button"
                    key={col.id}
                    onClick={() => toggleCollection(col.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      selected
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white text-[#737373] border-[#EAEAEA] hover:border-[#D4D4D4]'
                    }`}
                  >
                    {col.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Personal Notes &amp; Observations</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this link is interesting, design takeaways, layout cues..."
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Status Switches: Favorite & Archived */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-[#171717]">Favorite Link</span>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-[#EAEAEA] pt-3">
              <span className="text-xs font-medium text-[#171717]">Archived</span>
              <input
                type="checkbox"
                checked={isArchived}
                onChange={(e) => setIsArchived(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
              />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete "${link.title}"?`)) {
                  onDelete(link.id);
                  onClose();
                }
              }}
              className="px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#737373] hover:text-[#171717] rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#171717] hover:bg-[#262626] rounded-lg shadow-xs transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
