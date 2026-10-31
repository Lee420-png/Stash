import React, { useState } from 'react';
import {
  ExternalLink,
  Heart,
  MoreHorizontal,
  Copy,
  Check,
  Edit2,
  Trash2,
  Archive,
  ArchiveRestore,
  Sparkles,
  FolderGit2,
  ArrowUpRight,
} from 'lucide-react';
import { LinkItem, CollectionItem } from '../types';

interface Props {
  link: LinkItem;
  collections: CollectionItem[];
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (link: LinkItem) => void;
  onSelectTag: (tag: string) => void;
  onOpenVibeCode: (link: LinkItem) => void;
  aiMatchReason?: string;
}

export const LinkListItem: React.FC<Props> = ({
  link,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onEdit,
  onSelectTag,
  onOpenVibeCode,
  aiMatchReason,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsMenuOpen(false);
  };

  const handleRowClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const formattedDate = new Date(link.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={handleRowClick}
      className="group flex items-center justify-between p-3.5 bg-white hover:bg-[#F8F9FA] border-b border-[#EAEAEA] transition-colors cursor-pointer text-xs"
    >
      {/* Left: Favicon, Title, Domain */}
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
        {link.favicon ? (
          <img
            src={link.favicon}
            alt=""
            className="w-4 h-4 rounded-sm shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-4 h-4 rounded-sm bg-[#EAEAEA] shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-[#171717] group-hover:text-[#2563EB] transition-colors truncate">
              {link.title || link.domain}
            </span>
            <span className="text-[11px] text-[#737373] font-mono shrink-0 hidden sm:inline">
              {link.domain}
            </span>
          </div>
          {aiMatchReason ? (
            <p className="text-[11px] text-[#1D4ED8] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/60 truncate flex items-center gap-1 font-medium mt-0.5">
              <Sparkles className="w-3 h-3 text-[#2563EB] shrink-0" />
              <span className="truncate">{aiMatchReason}</span>
            </p>
          ) : link.description ? (
            <p className="text-[11px] text-[#737373] truncate hidden md:block">
              {link.description}
            </p>
          ) : null}
        </div>
      </div>

      {/* GitHub & Vibe Code buttons */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0 mr-4" onClick={(e) => e.stopPropagation()}>
        {link.githubUrl && (
          <a
            href={link.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-white hover:bg-[#F1F3F5] text-[#171717] border border-[#EAEAEA]"
          >
            <FolderGit2 className="w-3 h-3 text-[#2563EB]" />
            <span>GitHub</span>
          </a>
        )}
        <button
          onClick={() => onOpenVibeCode(link)}
          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Vibe Prompt</span>
        </button>
      </div>

      {/* Center: Category & Tags */}
      <div className="hidden lg:flex items-center gap-2 shrink-0 mr-4">
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#EAEAEA] text-[#171717]">
          {link.category}
        </span>
        {link.tags?.slice(0, 2).map((t) => (
          <button
            key={t}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTag(t);
            }}
            className="text-[10px] text-[#737373] hover:text-[#171717] bg-[#F1F3F5] px-1.5 py-0.5 rounded"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Right: Date, Favorite, Actions */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-[11px] text-[#A3A3A3] hidden sm:inline mr-2">
          {formattedDate}
        </span>

        <button
          onClick={() => onToggleFavorite(link.id)}
          className={`p-1.5 rounded-md transition ${
            link.isFavorite ? 'text-[#DC2626]' : 'text-[#A3A3A3] hover:text-[#DC2626]'
          }`}
          title="Favorite"
        >
          <Heart className={`w-3.5 h-3.5 ${link.isFavorite ? 'fill-[#DC2626]' : ''}`} />
        </button>

        <button
          onClick={handleCopyUrl}
          className="p-1.5 rounded-md text-[#737373] hover:text-[#171717] transition"
          title="Copy URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#737373]" />}
        </button>

        <button
          onClick={() => onEdit(link)}
          className="p-1.5 rounded-md text-[#737373] hover:text-[#171717] transition"
          title="Edit link"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-md text-[#737373] hover:text-[#171717] transition"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-[#EAEAEA] rounded-xl shadow-lg p-1 z-30 space-y-0.5 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    onOpenVibeCode(link);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-[#2563EB] hover:bg-[#EFF6FF] flex items-center gap-2 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Vibe Prompt</span>
                </button>
                <button
                  onClick={() => {
                    onToggleArchive(link.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-[#171717] hover:bg-[#F8F9FA] flex items-center gap-2"
                >
                  {link.isArchived ? (
                    <>
                      <ArchiveRestore className="w-3.5 h-3.5 text-[#737373]" />
                      <span>Restore from archive</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5 text-[#737373]" />
                      <span>Archive</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (window.confirm(`Delete "${link.title}"?`)) {
                      onDelete(link.id);
                    }
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
