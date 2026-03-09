import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../lib/database';
import { Note } from '../../../entities/Note';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    let query = repo.createQueryBuilder('note');

    if (search) {
      query = query.where(
        '(note.title LIKE :search OR note.content LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category) {
      if (search) {
        query = query.andWhere('note.category = :category', { category });
      } else {
        query = query.where('note.category = :category', { category });
      }
    }

    query = query
      .orderBy('note.isPinned', 'DESC')
      .addOrderBy('note.updatedAt', 'DESC');

    const notes = await query.getMany();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const body = await request.json();

    const { title, content, category, isPinned } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const note = repo.create({
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      category: category || null,
      isPinned: isPinned === true,
    });

    const saved = await repo.save(note);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
