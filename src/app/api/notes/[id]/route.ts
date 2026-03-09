import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../lib/database';
import { Note } from '../../../../entities/Note';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const note = await repo.findOne({ where: { id: params.id } });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error(`GET /api/notes/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const note = await repo.findOne({ where: { id: params.id } });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, category, isPinned } = body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      note.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim() === '') {
        return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
      }
      note.content = content.trim();
    }

    if (category !== undefined) {
      note.category = category || undefined;
    }

    if (isPinned !== undefined) {
      note.isPinned = Boolean(isPinned);
    }

    const updated = await repo.save(note);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PUT /api/notes/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const note = await repo.findOne({ where: { id: params.id } });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await repo.remove(note);
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/notes/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
