import React, { useState } from 'react';
import { X, Folder, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { CollectionItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  collections: CollectionItem[];
  onCreateCollection: (name: string, description: string) => void;
  onDeleteCollection: (id: string) => void;
}

export const CollectionsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  collections,
  onCreateCollection,
  onDeleteCollection,
}) => {
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onCreateCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-[#EAEAEA] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-base font-semibold text-[#171717]">Manage Collections</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#171717] rounded-md hover:bg-[#F8F9FA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* New Collection Form */}
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#EAEAEA] space-y-3">
            <div className="text-xs font-semibold text-[#171717]">Create New Collection</div>
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              placeholder="Collection name (e.g. Portfolio Ideas)"
              className="w-full px-3 py-1.5 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] bg-white focus:outline-none focus:border-[#2563EB]"
              required
            />
            <input
              type="text"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-1.5 rounded-lg border border-[#EAEAEA] text-xs text-[#171717] bg-white focus:outline-none focus:border-[#2563EB]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newColName.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Collection</span>
              </button>
            </div>
          </form>

          {/* Existing Collections List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
              Your Collections ({collections.length})
            </div>
            {collections.length === 0 ? (
              <p className="text-xs text-[#737373] py-2">No collections yet. Create your first above.</p>
            ) : (
              <div className="space-y-1.5">
                {collections.map((col) => (
                  <div
                    key={col.id}
                    className="p-3 rounded-lg border border-[#EAEAEA] bg-white hover:bg-[#F8F9FA] transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#171717] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                        <span>{col.name}</span>
                      </div>
                      {col.description && (
                        <p className="text-[11px] text-[#737373] mt-0.5">{col.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete collection "${col.name}"? (Saved links will remain in your library)`)) {
                          onDeleteCollection(col.id);
                        }
                      }}
                      className="p-1 text-[#737373] hover:text-[#DC2626] transition rounded"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAEAEA] bg-[#FDFDFD] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F5] text-xs font-medium text-[#171717]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
