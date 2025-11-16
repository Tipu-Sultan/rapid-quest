// components/Header.js
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/knowledge_pro.png" alt="Logo" width={40} height={40} className="rounded-lg" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Marketing Search
          </h1>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/manage"
            className="text-blue-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            Manage
          </Link>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload
          </Link>
        </nav>
      </div>
    </header>
  );
}