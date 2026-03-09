'use client';

import { useState, useEffect } from 'react';
import { NoteData, CreateNoteDto, UpdateNoteDto, NoteCategory } from '../types';

interface NoteFormProps {
  initialData?: NoteData;
  onSubmit: (data: CreateNoteDto | UpdateNoteDto) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  categories: NoteCategory[];
}

export default function NoteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  categories,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    setCategory(initialData?.category || '');
    setIsPinned(initialData?.isPinned || false);
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const errs: { title?: string; content?: string } = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      category: category || undefined,
      isPinned,
    });
  };

  const isEditing = !!initialData;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: undefined })); }}
            placeholder="Enter note title..."
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.title ? 'border-red-400 bg-red-50' : 'border-slate-300'
            }`}
            disabled={isLoading}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setErrors(prev => ({ ...prev, content: undefined })); }}
            placeholder="Write your note content here..."
            rows={5}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-vertical ${
              errors.content ? 'border-red-400 bg-red-50' : 'border-slate-300'
            }`}
            disabled={isLoading}
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              disabled={isLoading}
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    isPinned ? 'bg-primary-600' : 'bg-slate-300'
                  }`}
                  onClick={() => setIsPinned(!isPinned)}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      isPinned ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700">Pin this note</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isEditing ? 'Save Changes' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
}
