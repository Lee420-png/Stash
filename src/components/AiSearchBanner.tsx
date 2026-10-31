import React from 'react';
import { Sparkles, X, Filter, RefreshCw, ArrowRight } from 'lucide-react';

interface Props {
  query: string;
  summary: string;
  matchCount: number;
  onClear: () => void;
  onRefine: () => void;
}

export const AiSearchBanner: React.FC<Props> = ({
  query,
  summary,
  matchCount,
  onClear,
  onRefine,
}) => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 mb-4">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-50/80 border border-blue-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
                Stash AI Discovery Filter
              </span>
              <span className="text-xs px-2 py-0.2 rounded-full bg-blue-100 text-[#1D4ED8] font-medium">
                "{query}"
              </span>
              <span className="text-xs text-[#525252]">
                • {matchCount} matched link{matchCount === 1 ? '' : 's'}
              </span>
            </div>
            {summary && (
              <p className="text-xs text-[#1E293B] mt-1 font-medium leading-relaxed max-w-4xl">
                {summary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={onRefine}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8F9FA] text-[#171717] border border-[#CBD5E1] text-xs font-medium flex items-center gap-1.5 shadow-2xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Refine AI Query</span>
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium flex items-center gap-1 shadow-2xs transition"
          >
            <span>Reset Filter</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
