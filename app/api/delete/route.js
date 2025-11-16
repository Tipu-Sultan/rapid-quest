// app/api/delete/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const { id, filename } = await req.json();

    if (!id || !filename) {
      return NextResponse.json({ error: 'Missing id or filename' }, { status: 400 });
    }

    // 1. Delete from DB first (rollback if Cloudinary fails)
    const dbResult = await Document.deleteOne({ _id: id });
    if (dbResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 2. Delete from Cloudinary with correct options
    const cloudinaryResult = await cloudinary.uploader.destroy(filename, {
      resource_type: 'image',  // PDFs are 'image' type
      invalidate: true,        // Clear CDN cache
    });

    // 3. Check Cloudinary response
    if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
      // Rollback DB if Cloudinary fails
      await Document.create({
        _id: id,
        filename,
        // ... other fields (fetch from original doc if needed)
      });
      return NextResponse.json({ 
        error: `Cloudinary delete failed: ${cloudinaryResult.result}`,
        details: cloudinaryResult
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      cloudinary: cloudinaryResult.result,
      deletedCount: dbResult.deletedCount 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Delete failed', 
      details: error.message 
    }, { status: 500 });
  }
}