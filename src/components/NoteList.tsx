'use client';

import { NoteData } from '../types';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: NoteData[];
  loading: boolean;
  onEdit: (note: NoteData) => void;
  onDelete: (id: string) => void;
  onTogglePin: (note: NoteData) => void;
  searchQuery?: string;
}

export default function NoteList({
  notes,
  loading,
  onEdit,
  onDelete,
  onTogglePin,
  searchQuery,
}: NoteListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse">
            <div className="h-5 bg-slate-200 rounded mb-3 w-3/4" />
            <div className="h-3 bg-slate-100 rounded mb-2" />
            <div className="h-3 bg-slate-100 rounded mb-2 w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-4/6" />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          {searchQuery ? 'No notes found' : 'No notes yet'}
        </h3>
        <p className="text-slate-500 text-sm max-w-sm">
          {searchQuery
            ? `No notes match your search for "${searchQuery}". Try different keywords.`
            : 'Start by creating your first note. Click the "New Note" button to get started.'}
        </p>
      </div>
    );
  }

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return (
    <div>
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pinned</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}

      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Other Notes</h2>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
