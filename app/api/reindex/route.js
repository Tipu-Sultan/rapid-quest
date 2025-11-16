import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import fs from 'fs';
import path from 'path';
import { extractText } from '@/lib/indexer';
import { categorize } from '@/lib/categorizer';

export async function POST() {
  await connectDB();

  const docs = await Document.find({}).lean();
  let updated = 0;

  for (const doc of docs) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', doc.filename);
    if (!fs.existsSync(filePath)) continue;

    const content = await extractText(filePath, doc.mimetype);
    const { project, team, topics } = categorize(doc.originalName, content);

    doc.project = project;
    doc.team = team;
    doc.topics = topics.length > 0 ? topics : ['General'];
    doc.content = content;
    doc.searchableText = `${doc.originalName} ${content} ${doc.topics.join(' ')}`.slice(0, 500_000);

    await Document.updateOne({ _id: doc._id }, doc);
    updated++;
  }

  return NextResponse.json({ message: `Reindexed ${updated} docs` });
}