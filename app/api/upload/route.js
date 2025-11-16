import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import { extractText } from '@/lib/indexer';
import { categorize } from '@/lib/categorizer';

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
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // --- MODIFICATION 1: Removed the Aspose conversion logic ---
    // Now, all files (including DOC/DOCX) will be uploaded using 'auto'
    // which handles them as 'raw' files without any special add-on processing.
    const uploadOptions = {
      upload_preset: 'marketing_assets',
      resource_type: 'auto', // Cloudinary will automatically determine the resource type (e.g., 'raw' for DOC/DOCX)
    };

    const uploadRes = await cloudinary.uploader.upload(dataUri, uploadOptions);

    // --- MODIFICATION 2: Simplified the final URL ---
    // Since we are no longer converting to PDF, the final URL is simply the secure URL.
    const finalUrl = uploadRes.secure_url;

    let content = '';
    try {
      // The extraction logic needs to handle the original file type
      content = await extractText(finalUrl, file.type);
    } catch (err) {
      console.warn('Extraction failed, using filename');
    }

    const { project, team, topics } = categorize(file.name, content);

    const doc = new Document({
      filename: uploadRes.public_id,
      originalName: file.name,
      path: finalUrl,
      // --- MODIFICATION 3: Use the original file's MIME type ---
      // This ensures the browser handles the file correctly for download.
      mimetype: file.type,
      size: file.size,
      content,
      category: `${team} → ${project}`,
      project, team, topics,
      searchableText: `${file.name} ${content} ${topics.join(' ')}`.slice(0, 500000),
    });

    await doc.save();

    return NextResponse.json({ success: true, doc });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}