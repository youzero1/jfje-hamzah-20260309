export interface NoteData {
  id: string;
  title: string;
  content: string;
  category?: string;
  isPinned: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  category?: string;
  isPinned?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  category?: string;
  isPinned?: boolean;
}

export type NoteCategory =
  | 'Shopping List'
  | 'Product Ideas'
  | 'Wishlist'
  | 'Order Notes'
  | 'General';

export const NOTE_CATEGORIES: NoteCategory[] = [
  'Shopping List',
  'Product Ideas',
  'Wishlist',
  'Order Notes',
  'General',
];
