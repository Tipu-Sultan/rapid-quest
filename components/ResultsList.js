// components/ResultsList.js
'use client';
import FilePreview from './FilePreview';
import { format } from 'date-fns';

export default function ResultsList({ results }) {
  if (!results.length) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No results found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-5">
      {results.map((doc) => (
        <div
          key={doc._id}
          className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
        >
          <div className="p-6 flex gap-5">
            <div className="flex-shrink-0">
              <FilePreview path={doc.path} mimetype={doc.mimetype} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
                {doc.originalName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {doc.category} • {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {doc.topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <a
                href={doc.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
              >
                Open
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}