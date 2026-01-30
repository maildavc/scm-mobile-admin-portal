"use client";

import { Integration } from "@/constants/integrations/integrations";
import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { FiEye, FiX } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { TbFilterEdit } from "react-icons/tb";
import Image from "next/image";

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const OptionsButton = ({
  integration,
  onView,
  onReconfigure,
  onDisconnect,
}: {
  integration: Integration;
  onView?: (item: Integration) => void;
  onReconfigure?: (item: Integration) => void;
  onDisconnect?: (item: Integration) => void;
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

  const ReconfigureIcon = ({
    size = 20,
    className,
  }: {
    size?: number;
    className?: string;
  }) => (
    <Image
      src="/reconfigure.svg"
      alt="Reconfigure"
      width={size}
      height={size}
      className={className}
    />
  );

  const menuItems = [
    { icon: FiEye, label: "View Integration", action: onView },
    { icon: ReconfigureIcon, label: "Reconfigure", action: onReconfigure },
    { icon: FiX, label: "Disconnect", action: onDisconnect },
  ];

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
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-red-500 hover:text-white transition-colors"
        >
          <HiMenu size={16} /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 w-56 border border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action?.(integration);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <item.icon size={20} className="text-[#2F3140]" />
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

export const columns = (
  onView?: (item: Integration) => void,
): Column<Integration>[] => [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all"
        />
        <span className="uppercase text-[#2F3140]">INTEGRATION (500)</span>
      </div>
    ),
    className: "w-[25%]",
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <Image
            src="/scmLogo.svg"
            alt={item.name}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <div>
          <p className="font-bold text-[#2F3140] text-sm">{item.name}</p>
          <p className="text-[#707781] text-xs">{item.description}</p>
        </div>
      </div>
    ),
  },
  {
    header: <FilterableHeader>API STATUS</FilterableHeader>,
    className: "w-[15%]",
    render: (item) => (
      <div className="flex">
        <StatusBadge status={item.status} />
      </div>
    ),
  },
  {
    header: <FilterableHeader>DATE CREATED</FilterableHeader>,
    className: "w-[15%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.dateCreated}
      </span>
    ),
  },
  {
    header: <FilterableHeader>LAST UPDATED</FilterableHeader>,
    className: "w-[20%]",
    render: (item) => (
      <div>
        <p className="font-bold text-[#2F3140] text-sm">{item.lastUpdated}</p>
        <p className="text-[#707781] text-xs">{item.updatedBy}</p>
      </div>
    ),
  },
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase text-[#2F3140] text-xs">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (item) => (
      <OptionsButton
        integration={item}
        onView={onView}
        onReconfigure={() => console.log("Reconfigure", item)}
        onDisconnect={() => console.log("Disconnect", item)}
      />
    ),
  },
];
