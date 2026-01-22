import React, { useState } from "react";
import Pagination from "./Pagination";

export interface Column<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string; // Applied to both th and td for width/alignment control
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
}

export default function Table<T>({
  data,
  columns,
  itemsPerPage = 10,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  // Pagination Logic
  const totalPages = Math.ceil(data.length / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const currentData = data.slice(startIndex, startIndex + itemsPerPageState);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="overflow-x-auto mb-6 -mx-8 px-8 md:mx-0 md:px-0">
        <table className="w-full min-w-300 md:min-w-200">
          <thead className="border-b border-[#F4F4F5] bg-white">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-4 px-4 text-left text-xs font-bold text-[#707781] uppercase whitespace-nowrap ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                className="group transition-colors border-b border-[#F4F4F5]"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`py-4 px-4 align-middle whitespace-nowrap ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(item)
                      : col.accessorKey
                        ? (item[col.accessorKey] as React.ReactNode)
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPageState}
          totalItems={data.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
