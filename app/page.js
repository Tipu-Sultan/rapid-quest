// app/page.js
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ResultsList from '@/components/ResultsList';

export default function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (query = '', filter = 'all') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filter !== 'all') params.append('filter', filter);

    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    performSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Find Any Marketing Asset Instantly</h2>
          <p className="text-lg text-gray-600">Search across campaigns, designs, reports, and more.</p>
        </div>
        <SearchBar onSearch={performSearch} />
      </section>

      <section>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ResultsList results={results} />
        )}
      </section>

      <footer className="mt-20 py-8 text-center text-sm text-gray-500">
        <p>Marketing Search Tool • Built with Next.js 15 & MongoDB</p>
      </footer>
    </div>
  );
}