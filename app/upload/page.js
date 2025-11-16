// app/upload/page.js
'use client';
import { useState } from 'react';
import Header from '@/components/Header';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Uploaded & indexed successfully!');
      } else {
        alert('Upload failed. Try again.');
      }
    } catch (err) {
      alert('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Marketing Assets
            </h1>
            <p className="text-lg text-gray-600">
              Drag & drop or click to upload. Files are auto-categorized.
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-300 bg-white hover:border-gray-400'
            } ${uploading ? 'opacity-75' : ''}`}
          >
            <input
              type="file"
              onChange={handleChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
            />

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <p className="text-xl font-medium text-gray-700 mb-2">
                {uploading ? 'Uploading & Indexing...' : 'Drop files here or click to browse'}
              </p>

              <p className="text-sm text-gray-500">
                Supports: <span className="font-medium">PDF, DOCX, PNG, JPG, TXT</span>
              </p>

              {uploading && (
                <div className="mt-6 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Search
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}