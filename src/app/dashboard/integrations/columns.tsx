"use client";

import { Integration } from "@/constants/integrations/integrations";
import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import Button from "@/components/Button";
import { HiMenu } from "react-icons/hi";
import { TbFilterEdit } from "react-icons/tb";
import { RiApps2Line } from "react-icons/ri";
import Image from "next/image";

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

export const columns: Column<Integration>[] = [
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
      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-red-500 hover:text-white transition-colors">
        <HiMenu color="black" /> Options
      </button>
    ),
  },
];
