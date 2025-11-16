// app/api/upload/route.js
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

    // Auto-convert DOCX to PDF for better preview
    const uploadOptions = {
      upload_preset: 'marketing_assets',
      resource_type: 'auto',
      ...(file.type.includes('word') && { raw_convert: 'aspose' }), // DOCX → PDF
    };

    const uploadRes = await cloudinary.uploader.upload(dataUri, uploadOptions);

    // Use PDF URL if converted
    const finalUrl = uploadOptions.raw_convert ? `${uploadRes.secure_url}.pdf` : uploadRes.secure_url;

    let content = '';
    try {
      content = await extractText(finalUrl, file.type);
    } catch (err) {
      console.warn('Extraction failed, using filename');
    }

    const { project, team, topics } = categorize(file.name, content);

    const doc = new Document({
      filename: uploadRes.public_id,
      originalName: file.name,
      path: finalUrl,
      mimetype: file.type.includes('word') ? 'application/pdf' : file.type, // PDF for previews
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