"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import Image from "next/image";
import { FiX, FiCheck, FiEye } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";

type BlogPost = {
  id: string;
  title: string;
  description: string;
  author: string;
  audience: string;
  dateCreated: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  approverStatus: "Approved" | "Awaiting Approval";
  image: string;
};

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const OptionsButton = ({
  blogPost,
  onView,
  onEdit,
  onDelete,
  isApprover,
}: {
  blogPost: BlogPost;
  onView?: (post: BlogPost) => void;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
  isApprover?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const approverMenuItems = [
    {
      icon: FiEye,
      label: "View Request",
      onClick: () => {
        setIsOpen(false);
        onView?.(blogPost);
      },
    },
    {
      icon: FiCheck,
      label: "Approve Request",
      onClick: () => {
        setIsOpen(false);
        onView?.(blogPost);
      },
    },
    {
      icon: FiX,
      label: "Reject Request",
      onClick: () => {
        setIsOpen(false);
        onView?.(blogPost);
      },
    },
  ];

  const initiatorMenuItems = [
    {
      icon: FiEye,
      label: "View Blog",
      onClick: () => {
        setIsOpen(false);
        onView?.(blogPost);
      },
    },
    {
      icon: FiCheck,
      label: "Edit Blog",
      onClick: () => {
        setIsOpen(false);
        onEdit?.(blogPost);
      },
    },
    {
      icon: FiX,
      label: "Delete Blog Request",
      onClick: () => {
        setIsOpen(false);
        onDelete?.(blogPost);
      },
    },
  ];

  const menuItems = isApprover ? approverMenuItems : initiatorMenuItems;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-gray-200 transition-colors"
        >
          <HiMenu color="black" /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 min-w-40 border border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <item.icon size={18} className="text-[#2F3140]" />
                <span className="text-sm text-[#2F3140] font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const createBlogPostColumns = (
  onView?: (post: BlogPost) => void,
  isApprover?: boolean,
): Column<BlogPost>[] => [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all blogs"
        />
        <span className="uppercase text-[#2F3140]">BLOG POST (500)</span>
      </div>
    ),
    className: "w-[35%] !whitespace-normal",
    render: (post) => (
      <div className="flex items-start gap-3">
        {/* Placeholder image logic, using next/image */}
        <div className="shrink-0 w-10 h-10 relative overflow-hidden rounded-md bg-gray-100">
          {/* Using a generic placeholder if image fails or just the provided image path */}
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-[#2F3140] text-sm leading-tight line-clamp-2">
            {post.title}
          </p>
          <p className="text-xs text-[#707781] mt-0.5 line-clamp-1">
            {post.description}
          </p>
          <p className="text-[10px] text-[#707781] mt-1">{post.author}</p>
        </div>
      </div>
    ),
  },
  {
    header: <FilterableHeader>AUDIENCE</FilterableHeader>,
    className: "w-[13%]",
    render: (post) => (
      <span className="text-sm text-[#2F3140] font-bold">{post.audience}</span>
    ),
  },
  {
    header: <FilterableHeader>DATE CREATED</FilterableHeader>,
    className: "w-[13%]",
    render: (post) => (
      <span className="text-sm text-[#2F3140] font-bold">
        {post.dateCreated}
      </span>
    ),
  },
  {
    header: <FilterableHeader>LAST UPDATED</FilterableHeader>,
    className: "w-[14%]",
    render: (post) => (
      <div className="flex flex-col">
        <span className="text-sm text-[#2F3140] font-bold">
          {post.lastUpdated}
        </span>
        <span className="text-xs text-[#707781]">{post.lastUpdatedBy}</span>
      </div>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[10%]",
    render: (post) => <StatusBadge status={isApprover ? post.approverStatus : post.status} />,
  },
  {
    header: <div className="text-xs text-[#2F3140] uppercase">ACTION</div>,
    className: "w-[10%]",
    render: (post) => (
      <OptionsButton 
        blogPost={post} 
        onView={onView}
        onEdit={onView}
        onDelete={onView}
        isApprover={isApprover} 
      />
    ),
  },
];
