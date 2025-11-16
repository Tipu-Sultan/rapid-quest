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

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(filename, { resource_type: 'auto' });

    // Delete from DB
    await Document.deleteOne({ _id: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}