import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Check,
  FolderGit2,
} from 'lucide-react';
import { LinkItem, CollectionItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLink: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  collections: CollectionItem[];
  categories: string[];
}

export const AddLinkDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  collections,
  categories,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [favicon, setFavicon] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [category, setCategory] = useState<string>('Website Inspiration');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [vibeCodePrompt, setVibeCodePrompt] = useState('');

  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [fetchNotice, setFetchNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on URL input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      // reset
      setUrl('');
      setTitle('');
      setDescription('');
      setDomain('');
      setFavicon('');
      setPreviewImage('');
      setCategory('Website Inspiration');
      setTags([]);
      setSuggestedTags([]);
      setTagInput('');
      setSelectedCollections([]);
      setIsFavorite(false);
      setNotes('');
      setGithubUrl('');
      setVibeCodePrompt('');
      setFetchNotice(null);
    }
  }, [isOpen]);

  // Handle URL change & auto-fetch metadata
  const handleUrlBlur = async () => {
    if (!url.trim()) return;
    await fetchMetadata(url.trim());
  };

  const handleUrlPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim().startsWith('http')) {
      setTimeout(() => fetchMetadata(pastedText.trim()), 50);
    }
  };

  const fetchMetadata = async (rawUrl: string) => {
    let cleanUrl = rawUrl.trim();
    if (!cleanUrl) return;

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
      setUrl(cleanUrl);
    }

    let parsedDomain = '';
    try {
      parsedDomain = new URL(cleanUrl).hostname.replace(/^www\./, '');
      setDomain(parsedDomain);
      setFavicon(`https://www.google.com/s2/favicons?domain=${parsedDomain}&sz=128`);
    } catch {
      // ignore
    }

    setIsLoadingMetadata(true);
    setFetchNotice(null);

    try {
      const res = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      if (!res.ok) throw new Error('Could not automatically retrieve metadata');

      const result = await res.json();
      if (result.success && result.data) {
        const { title: t, description: d, ogImage, domain: dom, category: cat, suggestedTags: stags } = result.data;
        if (t) setTitle(t);
        if (d) setDescription(d);
        if (ogImage) setPreviewImage(ogImage);
        if (dom) setDomain(dom);
        if (cat) setCategory(cat);
        if (cleanUrl.includes('github.com')) {
          setGithubUrl(cleanUrl);
        }
        if (stags && Array.isArray(stags)) {
          setSuggestedTags(stags);
          if (tags.length === 0) {
            setTags(stags.slice(0, 3));
          }
        }
      }
    } catch (err: any) {
      setFetchNotice('Automatic preview restricted. You can enter title and notes manually.');
      if (!title && parsedDomain) {
        setTitle(parsedDomain);
      }
    } finally {
      setIsLoadingMetadata(false);
    }
  };

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

  const handleToggleSuggestedTag = (tag: string) => {
    if (tags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      setTags([...tags, tag]);
    }
  };

  const toggleCollection = (colId: string) => {
    if (selectedCollections.includes(colId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== colId));
    } else {
      setSelectedCollections([...selectedCollections, colId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    let finalDomain = domain;
    if (!finalDomain) {
      try {
        finalDomain = new URL(finalUrl).hostname.replace(/^www\./, '');
      } catch {
        finalDomain = finalUrl;
      }
    }

    onSave({
      url: finalUrl,
      domain: finalDomain,
      title: title.trim() || finalDomain,
      description: description.trim(),
      previewImage: previewImage.trim(),
      favicon: favicon || `https://www.google.com/s2/favicons?domain=${finalDomain}&sz=128`,
      category: category || 'Website Inspiration',
      tags,
      collections: selectedCollections,
      isFavorite,
      isArchived: false,
      notes: notes.trim(),
      githubUrl: githubUrl.trim() || undefined,
      vibeCodePrompt: vibeCodePrompt.trim() || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg h-full bg-white border-l border-[#EAEAEA] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
              +
            </div>
            <h2 className="text-base font-semibold text-[#171717]">Save Link to Library</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#171717] rounded-md hover:bg-[#F8F9FA] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: URL input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#171717]">
              Website or GitHub URL <span className="text-[#2563EB]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                onPaste={handleUrlPaste}
                placeholder="Paste any website, GitHub repo, or inspiration link..."
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#EAEAEA] text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition font-mono text-xs"
                required
              />
              {isLoadingMetadata && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#737373]">
              Paste URL to automatically extract title, preview image, category, and tags.
            </p>
          </div>

          {fetchNotice && (
            <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#EAEAEA] text-xs text-[#737373]">
              {fetchNotice}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#171717]">
              Title <span className="text-[#2563EB]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bruno Simon Three.js Journey"
              className="w-full px-3 py-2 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB] transition"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#171717]">
              Description <span className="text-[#737373] font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of the resource..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] transition resize-none"
            />
          </div>

          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#171717]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] bg-white focus:outline-none focus:border-[#2563EB] transition cursor-pointer"
            >
              {categories.filter((c) => c !== 'All Links').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* GitHub Repository (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Direct GitHub Repository (Optional)</span>
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
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
              rows={2}
              value={vibeCodePrompt}
              onChange={(e) => setVibeCodePrompt(e.target.value)}
              placeholder="AI prompt template to recreate this design with Cursor or Claude..."
              className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-lg text-xs text-[#171717] font-mono focus:outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#171717]">Tags</label>
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
                placeholder="Add tag (e.g. #ThreeJS, #WebGL)..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB] transition"
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

            {suggestedTags.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] text-[#737373] block mb-1">Suggested:</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleToggleSuggestedTag(st)}
                      className={`text-[11px] px-2 py-0.5 rounded transition ${
                        tags.includes(st)
                          ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                          : 'bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#737373]'
                      }`}
                    >
                      {st} {tags.includes(st) ? '✓' : '+'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Collections */}
          {collections.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#171717]">
                Add to Collections (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {collections.map((col) => {
                  const isChecked = selectedCollections.includes(col.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => toggleCollection(col.id)}
                      className={`text-left p-2 rounded-lg border text-xs transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#2563EB]/5 border-[#2563EB]/30 text-[#171717]'
                          : 'bg-[#F8F9FA] border-[#EAEAEA] text-[#737373] hover:text-[#171717]'
                      }`}
                    >
                      <span className="truncate">{col.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Personal Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#171717]">
              Personal Notes <span className="text-[#737373] font-normal">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. This website has an interesting scroll transition. Experiment with something similar in next project."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] transition resize-none"
            />
          </div>

          {/* Favorite toggle */}
          <label className="flex items-center gap-2.5 text-xs text-[#171717] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="rounded text-[#2563EB] focus:ring-[#2563EB]"
            />
            <span className="font-medium">Mark as favorite</span>
          </label>
        </form>

        {/* Panel Footer */}
        <div className="p-5 border-t border-[#EAEAEA] bg-[#FDFDFD] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#737373] hover:text-[#171717] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!url.trim()}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Save Link
          </button>
        </div>
      </div>
    </div>
  );
};
