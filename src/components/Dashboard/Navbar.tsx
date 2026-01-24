"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import SearchResults from "./SearchResults";
import { SEARCH_ITEMS } from "@/constants/search";
import RoleToggle from "./RoleToggle";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Filter items based on search query
  const filteredResults = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full bg-[#1A1A1A] text-white px-4 py-3 md:px-8 md:py-4">
      <div className="flex flex-nowrap items-center gap-3 md:gap-6">
        {/* Logo */}
        <div className="flex items-center shrink-0 order-1">
          <Image
            src="/scmassetLogo.svg"
            alt="SCM Logo"
            width={160}
            height={160}
            className="md:w-32 w-28 h-auto"
          />
        </div>

        {/* Mobile Right Side - Role Toggle + Search Icon + User Icon */}
        <div className="flex md:hidden items-center gap-3 ml-auto order-2">
          {/* Role Toggle - Mobile */}
          <RoleToggle />

          {/* Search Icon - Mobile only */}
          <div
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A2A2A] border border-gray-700"
          >
            <FiSearch className="text-white" size={16} />
          </div>

          {/* User Profile Icon */}
          <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center border border-gray-700">
            <BiUser className="text-gray-300" size={16} />
          </div>
        </div>

        {/* Search Bar - Desktop always visible, Mobile shows when clicked */}
        <div
          className={`${isSearchOpen ? "w-full" : "hidden"} md:block md:w-full md:max-w-2xl md:mx-auto order-3 md:order-2 relative`}
        >
          <div className="relative z-50 group border border-[#2F3140] rounded-xl overflow-visible">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch
                className="text-white group-focus-within:text-white transition-colors"
                size={18}
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              // onBlur={() => setTimeout(() => setShowResults(false), 200)} // Delay to allow clicking items
              className="block w-full pl-10 pr-3 py-2 md:py-2.5 bg-[#202023] border border-transparent rounded-xl text-xs md:text-sm placeholder-white text-white focus:outline-none transition-colors"
              placeholder="Search for customers, product offering, users, role and others"
            />
          </div>

          {/* Search Dropdown */}
          {showResults && searchQuery && (
            <>
              <div
                className="fixed inset-0 z-40 bg-[#000000]/64"
                onClick={() => setShowResults(false)}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[120%] z-50">
                <SearchResults
                  results={filteredResults}
                  searchTerm={searchQuery}
                />
              </div>
            </>
          )}
        </div>

        {/* Role Toggle - Desktop */}
        <div className="hidden md:flex items-center shrink-0 order-3">
          <RoleToggle />
        </div>

        {/* User Profile - Desktop shows full info */}
        <div className="hidden md:flex items-center gap-3 shrink-0 order-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">Ehizojie Ihayere</p>
            <p className="text-xs text-gray-400">Initiator Permission Name</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center border border-gray-700">
            <BiUser className="text-gray-300" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
