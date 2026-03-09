'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import SearchBar from '../components/SearchBar';
import { NoteData, CreateNoteDto, UpdateNoteDto, NOTE_CATEGORIES } from '../types';

export default function Home() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  const handleCreate = async (data: CreateNoteDto) => {
    try {
      setFormLoading(true);
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create note');
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      setError('Failed to create note. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateNoteDto) => {
    try {
      setFormLoading(true);
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update note');
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      setError('Failed to update note. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note. Please try again.');
    }
  };

  const handleTogglePin = async (note: NoteData) => {
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (!res.ok) throw new Error('Failed to update note');
      fetchNotes();
    } catch (err) {
      setError('Failed to update note. Please try again.');
    }
  };

  const handleEdit = (note: NoteData) => {
    setEditingNote(note);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-4 font-bold">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-lg">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={NOTE_CATEGORIES}
            />
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingNote(null); }}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors duration-200 whitespace-nowrap"
          >
            <span className="text-lg">+</span> New Note
          </button>
        </div>

        {(showForm || editingNote) && (
          <div className="mb-8">
            <NoteForm
              initialData={editingNote || undefined}
              onSubmit={editingNote ? (data) => handleUpdate(editingNote.id, data) : handleCreate}
              onCancel={handleCancelForm}
              isLoading={formLoading}
              categories={NOTE_CATEGORIES}
            />
          </div>
        )}

        <NoteList
          notes={notes}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}
