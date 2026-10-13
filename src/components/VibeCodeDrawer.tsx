import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Terminal,
  Code2,
  FolderGit2,
  BookOpen,
  Tag,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { LinkItem } from '../types';

interface Props {
  link: LinkItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VibeCodeDrawer: React.FC<Props> = ({ link, isOpen, onClose }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'notes'>('prompt');

  if (!isOpen || !link) return null;

  const handleCopyPrompt = () => {
    if (link.vibeCodePrompt) {
      navigator.clipboard.writeText(link.vibeCodePrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const codeSnippet =
    link.codeSnippet ||
    (link.githubUrl
      ? `// Terminal setup for ${link.title}\n` +
        `npm install @types/three three @react-three/fiber @react-three/drei\n\n` +
        `// Open-source repository:\n` +
        `// ${link.githubUrl}\n\n` +
        `import React from 'react';\n` +
        `export default function Scene() {\n` +
        `  return (\n` +
        `    <div className="w-full h-screen bg-neutral-950 flex items-center justify-center">\n` +
        `      {/* Interactive 3D Canvas */}\n` +
        `      <p className="text-white font-mono text-sm">Powered by ${link.domain}</p>\n` +
        `    </div>\n` +
        `  );\n` +
        `}`
      : `// React + Tailwind template for ${link.title}\n` +
        `import React from 'react';\n\n` +
        `export function FeatureSection() {\n` +
        `  return (\n` +
        `    <section className="relative py-24 bg-white text-neutral-900 overflow-hidden">\n` +
        `      <div className="max-w-6xl mx-auto px-6">\n` +
        `        <h2 className="text-4xl font-bold tracking-tight mb-4">${link.title}</h2>\n` +
        `        <p className="text-neutral-600 text-lg max-w-2xl">${link.description}</p>\n` +
        `      </div>\n` +
        `    </section>\n` +
        `  );\n` +
        `}`);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-[#EAEAEA] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 min-w-0">
            {link.favicon && (
              <img
                src={link.favicon}
                alt=""
                className="w-5 h-5 rounded shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-[#737373]">
                  {link.domain}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F8F9FA] border border-[#EAEAEA] text-[#171717]">
                  {link.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#171717] truncate leading-tight mt-0.5">
                {link.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA] transition"
              title="Open site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#F8F9FA] transition"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Header Banner */}
        <div className="px-6 py-3 bg-[#F8F9FA] border-b border-[#EAEAEA] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {link.githubUrl && (
              <a
                href={link.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] text-[#171717] font-medium hover:border-[#171717] transition shadow-xs"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>GitHub Repository</span>
                <ArrowUpRight className="w-3 h-3 text-[#737373]" />
              </a>
            )}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] text-[#171717] font-medium hover:border-[#171717] transition shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Live Website</span>
              <ArrowUpRight className="w-3 h-3 text-[#737373]" />
            </a>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-[#EAEAEA]">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'prompt'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Vibe Prompt
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'code'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Code Template
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'notes'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Notes &amp; Tags
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#171717] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    AI Vibe Coding Prompt
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Ready to paste into Cursor, Claude Code, Lovable, Bolt, or v0.
                  </p>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium transition shadow-xs"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prompt box */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] text-sm text-[#171717] font-mono leading-relaxed whitespace-pre-wrap select-all">
                {link.vibeCodePrompt ||
                  `Build an ultra-polished component inspired by ${link.title} (${link.url}).\nUse clean modern React, Tailwind CSS, high visual hierarchy, subtle micro-interactions, responsive mobile layout, and zero superfluous styling.`}
              </div>

              {/* Quick Prompt Usage Guide */}
              <div className="p-4 rounded-xl border border-[#EAEAEA] bg-white space-y-2">
                <h4 className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#2563EB]" />
                  How to use this prompt
                </h4>
                <ul className="text-xs text-[#737373] space-y-1.5 list-disc list-inside">
                  <li>
                    <strong className="text-[#171717]">Cursor (Cmd + I / Composer):</strong> Paste directly into Composer with your target file open.
                  </li>
                  <li>
                    <strong className="text-[#171717]">Claude Code / Artifacts:</strong> Instruct Claude to create a self-contained component based on this prompt.
                  </li>
                  <li>
                    <strong className="text-[#171717]">Lovable / Bolt.new:</strong> Feed this prompt into the initial project creation input.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#171717] flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-[#2563EB]" />
                    Starter Code &amp; Component Template
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Copy and drop into your React &amp; Tailwind codebase.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium transition shadow-xs"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#171717] text-[#F8F9FA] font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{codeSnippet}</code>
              </pre>

              {link.githubUrl && (
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#171717] block">
                      Direct GitHub Repository
                    </span>
                    <span className="text-xs text-[#737373] font-mono">{link.githubUrl}</span>
                  </div>
                  <a
                    href={link.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-[#EAEAEA] hover:border-[#171717] rounded-lg text-xs font-medium text-[#171717] transition inline-flex items-center gap-1.5"
                  >
                    <span>View Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#171717] flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4 text-[#2563EB]" />
                  Curator Notes &amp; Observations
                </h3>
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] text-xs text-[#171717] leading-relaxed">
                  {link.notes || 'No notes added for this link yet.'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#171717] flex items-center gap-1.5 mb-2">
                  <Tag className="w-4 h-4 text-[#2563EB]" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {link.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-[#F8F9FA] border border-[#EAEAEA] text-xs font-medium text-[#171717]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#171717] mb-2">Metadata</h3>
                <div className="rounded-xl border border-[#EAEAEA] divide-y divide-[#EAEAEA] text-xs">
                  <div className="p-3 flex justify-between">
                    <span className="text-[#737373]">Original URL</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline font-mono truncate max-w-xs"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-[#737373]">Category</span>
                    <span className="font-medium text-[#171717]">{link.category}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-[#737373]">Domain</span>
                    <span className="font-mono text-[#171717]">{link.domain}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-[#737373]">Date Added</span>
                    <span className="text-[#171717]">
                      {new Date(link.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
