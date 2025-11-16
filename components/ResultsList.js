// components/ResultsList.js
'use client';
import { useState } from 'react';
import FilePreview from './FilePreview';
import { format } from 'date-fns';

export default function ResultsList({ results }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  if (!results.length) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No results found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-5">
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
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-center mb-4">
                  <FilePreview path={doc.path} mimetype={doc.mimetype} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
                  {doc.originalName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {doc.category}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {doc.topics.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <a
                  href={doc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition text-sm font-medium"
                >
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}