import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import { extractText } from '@/lib/indexer';
import { categorize } from '@/lib/categorizer';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Prepare file data for Cloudinary upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // 2. --- Cloudinary Upload Logic ---
    const uploadOptions = {
      upload_preset: 'marketing_assets',
      resource_type: 'auto', 
      folder: 'document-indexer',
    };

    const uploadRes = await cloudinary.uploader.upload(dataUri, uploadOptions);
    const finalUrl = uploadRes.secure_url; 
    const filename = uploadRes.public_id; 

    let content = '';
    let project = 'General';
    let team = 'General';
    let topics = ['General'];

    try {
      // Pass the Cloudinary URL (finalUrl) to extractText for remote processing
      content = await extractText(finalUrl, file.type);

      // Categorize using filename and extracted content
      const categorized = categorize(file.name, content);
      project = categorized.project;
      team = categorized.team;
      topics = categorized.topics;

    } catch (err) {
      console.error('File Processing Error:', err);
      // Fallback to filename categorization if extraction fails entirely
      const categorized = categorize(file.name, file.name);
      project = categorized.project;
      team = categorized.team;
      topics = categorized.topics;
    }

    // 4. Save document metadata to MongoDB
    const doc = new Document({
      filename,
      originalName: file.name,
      path: finalUrl, // Storing the Cloudinary URL
      mimetype: file.type,
      size: file.size,
      content,
      category: `${team} → ${project}`,
      project,
      team,
      topics,
      searchableText: `${file.name} ${content}`.slice(0, 500_000),
    });

    await doc.save();

    return NextResponse.json({ success: true, doc });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

export const runtime = 'nodejs';