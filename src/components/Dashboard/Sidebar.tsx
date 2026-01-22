"use client";

import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { IconType } from 'react-icons';

export interface SidebarMenuItem {
  icon: IconType;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  menuItems: SidebarMenuItem[];
  onItemClick?: (label: string) => void;
}

// Create context for sidebar state
const SidebarContext = createContext<{
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
} | null>(null);


export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hamburger button component to be used in PageHeader
export const SidebarToggle: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Toggle menu"
    >
      {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ menuItems, onItemClick }) => {
  const { isOpen, closeSidebar } = useSidebar();

  const handleItemClick = (label: string) => {
    closeSidebar();
    if (onItemClick) {
      onItemClick(label);
    }
  };

  return (
    <>

      {/* Backdrop - Mobile & Tablet Only */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop (sticky) */}
      <div className="w-64 hidden md:block px-4 shrink-0 h-[calc(100vh-88px)] sticky top-22 overflow-y-auto pt-6">
        <div className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              onClick={(e) => {
                if (item.href === "#" || onItemClick) {
                   e.preventDefault();
                   handleItemClick(item.label);
                }
              }} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.isActive 
                  ? 'bg-[#2F3140] text-white' 
                  : 'text-[#2F3140]'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Sheet - Mobile & Tablet Only */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#2F3140]">Menu</h2>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                onClick={(e) => {
                  if (item.href === "#" || onItemClick) {
                     e.preventDefault();
                     handleItemClick(item.label);
                  } else {
                     closeSidebar();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.isActive 
                    ? 'bg-[#2F3140] text-white' 
                    : 'text-[#707781] hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
