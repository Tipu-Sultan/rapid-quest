// app/api/documents/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';

export async function GET() {
  try {
    await connectDB();
    const docs = await Document.find({})
      .sort({ uploadedAt: -1 })
      .select('originalName path mimetype filename category topics uploadedAt')
      .lean();
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}