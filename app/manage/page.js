// app/manage/page.js
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FilePreview from '@/components/FilePreview';
import { format } from 'date-fns';

export default function ManagePage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchDocs = async () => {
    const res = await fetch('/api/documents');
    const data = await res.json();
    setDocs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id, filename) => {
    if (!confirm('Delete this file permanently?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, filename }),
      });

      if (res.ok) {
        setDocs(docs.filter(d => d._id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      alert('Error deleting');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Documents</h1>
            <p className="text-lg text-gray-600">View and delete uploaded files</p>
          </div>

          {docs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500">No documents uploaded yet.</p>
              <a href="/upload" className="mt-4 inline-block text-blue-600 hover:underline">
                Upload now
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {docs.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 flex items-center gap-4 border border-gray-100"
                >
                  <FilePreview path={doc.path} mimetype={doc.mimetype} />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-500 font-semibold text-lg truncate">{doc.originalName}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.category} • {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.topics.map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={doc.path}
                      target="_blank"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(doc._id, doc.filename)}
                      disabled={deleting === doc._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        deleting === doc._id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {deleting === doc._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}