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
  StickyNote,
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
  onAddToCollection: (linkId: string, collectionId: string) => void;
  onOpenVibeCode: (link: LinkItem) => void;
}

export const LinkCard: React.FC<Props> = ({
  link,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onEdit,
  onSelectTag,
  onOpenVibeCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsMenuOpen(false);
  };

  const handleCardClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const formattedDate = new Date(link.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-[#EAEAEA] hover:border-[#D4D4D4] hover:shadow-sm rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Preview Thumbnail Container (16:9) */}
        <div className="relative w-full aspect-video bg-[#F8F9FA] overflow-hidden border-b border-[#EAEAEA]">
          {link.previewImage && !imgFailed ? (
            <img
              src={link.previewImage}
              alt=""
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            // Clean minimal fallback preview
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F8F9FA] to-[#F1F3F5]">
              {link.favicon ? (
                <img
                  src={link.favicon}
                  alt=""
                  className="w-10 h-10 rounded-lg mb-2 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span className="text-xs font-semibold text-[#171717] font-mono">{link.domain}</span>
            </div>
          )}

          {/* Quick Favorite Top Right Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(link.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition ${
              link.isFavorite
                ? 'bg-white/95 text-[#DC2626] shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#737373] hover:text-[#DC2626] opacity-0 group-hover:opacity-100'
            }`}
            title={link.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${link.isFavorite ? 'fill-[#DC2626]' : ''}`} />
          </button>

          {/* Category Chip Top Left */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[#171717] border border-[#EAEAEA] shadow-xs">
              {link.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Favicon & Domain Header */}
          <div className="flex items-center justify-between text-xs text-[#737373] mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {link.favicon ? (
                <img
                  src={link.favicon}
                  alt=""
                  className="w-4 h-4 rounded-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span className="font-medium text-[#737373] truncate">{link.domain}</span>
            </div>
            <span className="text-[11px] text-[#A3A3A3] shrink-0 ml-2">{formattedDate}</span>
          </div>

          {/* Link Title */}
          <h3 className="text-base font-semibold text-[#171717] group-hover:text-[#2563EB] transition-colors leading-snug mb-1.5 line-clamp-2">
            {link.title || link.domain}
          </h3>

          {/* Description */}
          {link.description && (
            <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed mb-3">
              {link.description}
            </p>
          )}

          {/* Direct GitHub & Vibe Code Bar */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
            {link.githubUrl && (
              <a
                href={link.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-white hover:bg-[#F8F9FA] text-[#171717] border border-[#EAEAEA] shadow-2xs hover:border-[#171717] transition"
                title="View GitHub Repository"
              >
                <FolderGit2 className="w-3 h-3 text-[#2563EB]" />
                <span>GitHub Repo</span>
                <ArrowUpRight className="w-2.5 h-2.5 text-[#737373]" />
              </a>
            )}

            <button
              onClick={() => onOpenVibeCode(link)}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] transition"
              title="Open Vibe Code Prompt and Code Drawer"
            >
              <Sparkles className="w-3 h-3 text-[#2563EB]" />
              <span>Vibe Prompt</span>
            </button>
          </div>

          {/* Personal Note Highlight (if exists) */}
          {link.notes && (
            <div className="mb-3 p-2.5 rounded-lg bg-[#F8F9FA] border border-[#EAEAEA] flex items-start gap-2 text-xs text-[#171717]">
              <StickyNote className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="line-clamp-2 italic text-[#525252]">"{link.notes}"</p>
            </div>
          )}

          {/* Tags list */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {link.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag(tag);
                  }}
                  className="text-[11px] font-medium text-[#737373] hover:text-[#171717] bg-[#F8F9FA] hover:bg-[#F1F3F5] px-2 py-0.5 rounded transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div
        className="px-5 py-3 border-t border-[#EAEAEA] bg-[#FDFDFD] flex items-center justify-between text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 text-[#737373]">
          <span className="text-[11px] hover:text-[#171717] flex items-center gap-1 font-medium">
            Visit site <ExternalLink className="w-3 h-3" />
          </span>
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyUrl}
              className="p-1.5 rounded-md text-[#737373] hover:text-[#171717] hover:bg-[#F5F7FA] transition"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onEdit(link)}
              className="p-1.5 rounded-md text-[#737373] hover:text-[#171717] hover:bg-[#F5F7FA] transition"
              title="Edit link & notes"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-md text-[#737373] hover:text-[#171717] hover:bg-[#F5F7FA] transition"
              title="More actions"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-[#EAEAEA] rounded-xl shadow-lg p-1 z-30 space-y-0.5 animate-in fade-in duration-150">
                <button
                  onClick={handleCopyUrl}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-[#171717] hover:bg-[#F8F9FA] flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-[#737373]" />
                  <span>Copy URL</span>
                </button>

                <button
                  onClick={() => {
                    onOpenVibeCode(link);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-[#2563EB] hover:bg-[#EFF6FF] flex items-center gap-2 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Vibe Code &amp; Prompt</span>
                </button>

                <button
                  onClick={() => {
                    onEdit(link);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-[#171717] hover:bg-[#F8F9FA] flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#737373]" />
                  <span>Edit link &amp; notes</span>
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
                      <span>Archive link</span>
                    </>
                  )}
                </button>

                <div className="my-1 border-t border-[#EAEAEA]" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (window.confirm(`Delete "${link.title}" from your library?`)) {
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
