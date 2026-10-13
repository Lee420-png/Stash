import React, { useRef, useState } from 'react';
import { X, Download, Upload, Check, AlertCircle, RefreshCw, Trash2, Database } from 'lucide-react';
import { LinkItem, CollectionItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  collections: CollectionItem[];
  onImportData: (importedLinks: LinkItem[], importedCollections: CollectionItem[]) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
}

export const ExportImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  links,
  collections,
  onImportData,
  onResetDemoData,
  onClearAllData,
}) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      linksCount: links.length,
      collectionsCount: collections.length,
      links,
      collections,
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stash-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      links,
      collections,
    };
    navigator.clipboard.writeText(JSON.stringify(backupData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed || !Array.isArray(parsed.links)) {
          throw new Error('Invalid backup file. Must contain a "links" array.');
        }

        const validLinks = parsed.links as LinkItem[];
        const validCollections = (Array.isArray(parsed.collections) ? parsed.collections : []) as CollectionItem[];

        onImportData(validLinks, validCollections);
        setImportStatus(`Successfully restored ${validLinks.length} links and ${validCollections.length} collections!`);
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#EAEAEA] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-base font-semibold text-[#171717]">Backup &amp; Library Data</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#171717] rounded-md hover:bg-[#F8F9FA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Note about local storage */}
          <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] text-[#737373] space-y-1">
            <div className="font-semibold text-[#171717] flex items-center gap-1.5">
              <span>Local Browser Storage</span>
            </div>
            <p>
              Your links, personal notes, tags, and collections are saved securely in your browser's local storage. Exporting a JSON backup ensures you never lose links across devices or if you clear your browser cache.
            </p>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Export section */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#171717]">Export Backup</h4>
            <p className="text-[#737373]">Download all {links.length} saved links and {collections.length} collections as a single JSON file.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-lg bg-[#171717] hover:bg-[#262626] text-white font-medium flex items-center gap-2 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON Backup</span>
              </button>
              <button
                onClick={handleCopyJSON}
                className="px-3 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#171717] font-medium border border-[#EAEAEA] flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : null}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="space-y-2 pt-3 border-t border-[#EAEAEA]">
            <h4 className="font-semibold text-[#171717]">Restore / Import Backup</h4>
            <p className="text-[#737373]">Restore your library from a previously exported JSON backup file.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#171717] font-medium border border-[#EAEAEA] flex items-center gap-2 transition"
            >
              <Upload className="w-3.5 h-3.5 text-[#737373]" />
              <span>Select Backup File to Import...</span>
            </button>
          </div>

          {/* Library Reset & Demos */}
          <div className="space-y-2 pt-3 border-t border-[#EAEAEA]">
            <h4 className="font-semibold text-[#171717]">Sample Data &amp; Reset</h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  if (window.confirm('Restore initial demo sample links? Existing custom links will be preserved.')) {
                    onResetDemoData();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#171717] border border-[#EAEAEA] flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#737373]" />
                <span>Reload Sample Links</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear ALL links from your library? This cannot be undone unless you have an exported backup.')) {
                    onClearAllData();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] border border-[#FEE2E2] flex items-center gap-1.5 transition font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Links</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAEAEA] bg-[#FDFDFD] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-xs font-medium text-[#171717]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
