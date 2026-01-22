import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [4, 5, 7, 10, 15, 20],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      // Add listener on next tick to avoid immediate closing
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);
  const renderPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages
      pages.push(1, 2, 3);
      
      // Add ellipsis
      pages.push("...");
      
      // Always show last 3 pages
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-[#2F3140] text-sm font-medium border border-gray-200 bg-white rounded">
            ...
          </span>
        );
      }
      
      const isCurrent = page === currentPage;
      
      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium border border-gray-200 ${
            isCurrent
              ? "bg-white text-[#2F3140]"
              : "bg-white text-[#2F3140] hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-[#2F3140] font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span>Showing {itemsPerPage}</span>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-[140px] bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden">
            {itemsPerPageOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemsPerPageChange?.(option);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  option === itemsPerPage
                    ? "bg-gray-50 text-[#2F3140] font-medium"
                    : "text-[#2F3140]"
                }`}
              >
                Showing {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-[#707781] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft size={16} />
        </button>
        
        {renderPageNumbers()}
        
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-[#707781] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
