"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // This function is used when the main search button is clicked or Enter is pressed.
  const handleSearch = () => {
    onSearch(query.trim(), filter);
  };

  // New handler: Sets the filter and immediately executes the search.
  const handleFilterClick = (newFilter) => {
    if (newFilter === filter) return; // ⛔ prevent duplicate API calls
    setFilter(newFilter);
    onSearch(query.trim(), newFilter);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search campaigns, assets, PDFs, images..."
              className="w-full px-5 py-4 pl-12 text-lg border border-gray-300 rounded-xl 
             text-gray-500 placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             focus:border-transparent transition-shadow"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <svg
              className="absolute left-4 top-5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
          >
            Search
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => handleFilterClick("all")}
          >
            All
          </FilterButton>

          {/* Category Filters */}
          <FilterButton
            active={filter === "General→General"}
            onClick={() => handleFilterClick("General→General")}
          >
            General → General
          </FilterButton>

          <FilterButton
            active={filter === "Design→Brand"}
            onClick={() => handleFilterClick("Design→Brand")}
          >
            Design → Brand
          </FilterButton>
          <FilterButton
            active={filter === "Content→Social"}
            onClick={() => handleFilterClick("Content→Social")}
          >
            Content → Social
          </FilterButton>

          {/* Topic Filters */}
          <FilterButton
            active={filter === "topic-AI"}
            onClick={() => handleFilterClick("topic-AI")}
          >
            AI
          </FilterButton>
          <FilterButton
            active={filter === "topic-SEO"}
            onClick={() => handleFilterClick("topic-SEO")}
          >
            SEO
          </FilterButton>
          <FilterButton
            active={filter === "topic-Growth"}
            onClick={() => handleFilterClick("topic-Growth")}
          >
            Growth
          </FilterButton>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={!active ? onClick : undefined}  
      disabled={active}                         
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all 
        ${active
          ? "bg-blue-600 text-white shadow-sm cursor-not-allowed"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {children}
    </button>
  );
}

