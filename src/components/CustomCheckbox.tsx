import React from "react";

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <div 
    className="flex items-center gap-3 cursor-pointer group select-none"
    onClick={onChange}
  >
    <div className={`relative w-6 h-6 rounded border-2 transition-all duration-200 ${
      checked ? 'border-[#B2171E]' : 'border-[#707781]'
    }`}>
      {checked && (
        <div className="absolute -top-1 -right-1 bg-white bg-opacity-100">
          <svg width="18" height="18" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6666 1L5.49992 10.1667L1.33325 6" stroke="#B2171E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
    <span className="text-sm font-medium text-[#17181A]">{label}</span>
  </div>
);

export default CustomCheckbox;