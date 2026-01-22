import React from "react";
import { FiArrowRight } from "react-icons/fi";

interface SearchItem {
  title: string;
  module: string;
}

interface SearchResultsProps {
  results: SearchItem[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchTerm }) => {
  if (results.length === 0) return null;

  // Function to highlight matched text (case-insensitive)
  const getHighlightedText = (text: string, highlight: string) => {
    // Escape special characters in highlight string to prevent regex errors
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));
    
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="bg-transparent font-bold">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="w-full mt-8 bg-white rounded-xl shadow-2xl overflow-hidden py-2">
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="text-[#707781] text-sm">
          Search result for <span className="font-semibold text-[#2F3140]">&lsquo;{searchTerm}&rsquo;</span>
        </p>
      </div>
      <div>
        {results.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 cursor-pointer"
          >
            <div>
              <h4 className="text-[#2F3140] text-sm md:text-base mb-1">
                {getHighlightedText(item.title, searchTerm)}
              </h4>
              <p className="text-[#707781] text-xs">
                {item.module}
              </p>
            </div>
            <FiArrowRight className="text-[#707781]" size={22} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
