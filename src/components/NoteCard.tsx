'use client';

import { NoteData } from '../types';

interface NoteCardProps {
  note: NoteData;
  onEdit: (note: NoteData) => void;
  onDelete: (id: string) => void;
  onTogglePin: (note: NoteData) => void;
  searchQuery?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Shopping List': 'bg-green-100 text-green-700 border-green-200',
  'Product Ideas': 'bg-purple-100 text-purple-700 border-purple-200',
  'Wishlist': 'bg-pink-100 text-pink-700 border-pink-200',
  'Order Notes': 'bg-amber-100 text-amber-700 border-amber-200',
  'General': 'bg-slate-100 text-slate-700 border-slate-200',
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
      : part
  );
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, searchQuery = '' }: NoteCardProps) {
  const categoryColor = note.category ? (CATEGORY_COLORS[note.category] || CATEGORY_COLORS['General']) : '';

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col ${
        note.isPinned ? 'border-primary-300 ring-1 ring-primary-200' : 'border-slate-200'
      }`}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-slate-900 text-base leading-snug flex-1">
            {highlightText(note.title, searchQuery)}
          </h3>
          <button
            onClick={() => onTogglePin(note)}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
            className={`flex-shrink-0 p-1 rounded-md transition-colors ${
              note.isPinned
                ? 'text-primary-600 hover:text-primary-800 bg-primary-50'
                : 'text-slate-300 hover:text-slate-500'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={note.isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {note.category && (
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-3 ${categoryColor}`}>
            {note.category}
          </span>
        )}

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {highlightText(note.content, searchQuery)}
        </p>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 space-y-0.5">
            <div>Created: {formatDate(note.createdAt)}</div>
            {note.updatedAt !== note.createdAt && (
              <div>Updated: {formatDate(note.updatedAt)}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              title="Edit note"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete note"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
