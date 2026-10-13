import React from 'react';
import { Bookmark, Sparkles, Trash2, Folder, Heart } from 'lucide-react';

interface Props {
  totalLinksCount: number;
  favoritesCount: number;
  collectionsCount: number;
  hasDemoLinks: boolean;
  onClearDemoLinks: () => void;
  onOpenAddDrawer: () => void;
}

export const Hero: React.FC<Props> = ({
  totalLinksCount,
  favoritesCount,
  collectionsCount,
  hasDemoLinks,
  onClearDemoLinks,
  onOpenAddDrawer,
}) => {
  return (
    <section className="pt-10 pb-6 px-6 max-w-[1440px] mx-auto border-b border-[#EAEAEA]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
        {/* Editorial Heading */}
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#171717]">
            Everything worth keeping.
          </h1>
          <p className="text-sm md:text-base text-[#737373] leading-relaxed">
            Your personal collection of design inspiration, code, tools, and creative discoveries.
          </p>
        </div>

        {/* Subtle Metadata & Stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#737373]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] rounded-md border border-[#EAEAEA]">
            <span className="font-semibold text-[#171717]">{totalLinksCount}</span>
            <span>saved links</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] rounded-md border border-[#EAEAEA]">
            <span className="font-semibold text-[#171717]">{favoritesCount}</span>
            <span>favorites</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] rounded-md border border-[#EAEAEA]">
            <span className="font-semibold text-[#171717]">{collectionsCount}</span>
            <span>collections</span>
          </div>

          {hasDemoLinks && (
            <button
              onClick={onClearDemoLinks}
              className="text-[#737373] hover:text-[#DC2626] transition flex items-center gap-1 underline underline-offset-4"
              title="Remove sample links and start completely fresh"
            >
              <span>Remove sample links</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
