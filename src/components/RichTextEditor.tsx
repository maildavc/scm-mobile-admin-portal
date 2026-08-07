"use client";

import React, { useEffect, useRef } from "react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const FONT_FAMILIES = ["Roboto", "Arial", "Georgia", "Times New Roman"];
const FONT_SIZES = ["12", "14", "16", "18", "20", "24"];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter text",
  required,
  rows = 12,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-[#707781] mb-2">
        {label}
        {required && <span className="text-[#B2171E]"> *</span>}
      </label>

      <div className="mb-2 flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white">
        <select
          aria-label="Font Family"
          className="px-2 py-1 text-sm text-[#2F3140] bg-transparent outline-none"
          onChange={(e) => runCommand("fontName", e.target.value)}
          defaultValue="Roboto"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <select
          aria-label="Font Size"
          className="px-2 py-1 text-sm text-[#2F3140] bg-transparent outline-none"
          onChange={(e) => runCommand("fontSize", e.target.value)}
          defaultValue="3"
        >
          {FONT_SIZES.map((size, index) => (
            <option key={size} value={String(index + 1)}>
              {size}
            </option>
          ))}
        </select>
        <div className="h-5 w-px bg-gray-300" />
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]"
          onClick={() => runCommand("bold")}
        >
          <strong className="text-sm">B</strong>
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]"
          onClick={() => runCommand("italic")}
        >
          <em className="text-sm">I</em>
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140]"
          onClick={() => runCommand("underline")}
        >
          <u className="text-sm">U</u>
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
          onClick={() => runCommand("strikeThrough")}
        >
          S
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
          onClick={() => runCommand("insertUnorderedList")}
        >
          •
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
          onClick={() => runCommand("insertOrderedList")}
        >
          1.
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded text-[#2F3140] text-sm"
          onClick={() => {
            const url = window.prompt("Enter link URL");
            if (url) runCommand("createLink", url);
          }}
        >
          🔗
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-label={label}
        aria-required={required}
        data-placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2F3140] outline-none focus:border-[#B2171E] min-h-40 empty:before:content-[attr(data-placeholder)] empty:before:text-[#707781]"
        style={{ minHeight: `${Math.max(rows, 6) * 1.5}rem` }}
        onInput={() => onChange(editorRef.current?.innerHTML || "")}
        onBlur={() => onChange(editorRef.current?.innerHTML || "")}
      />
    </div>
  );
};

export default RichTextEditor;
