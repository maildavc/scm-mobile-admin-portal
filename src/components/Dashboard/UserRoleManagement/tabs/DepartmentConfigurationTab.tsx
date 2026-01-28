"use client";

import React from "react";

interface DepartmentConfigurationTabProps {
  onDeactivate: () => void;
}

const DepartmentConfigurationTab: React.FC<DepartmentConfigurationTabProps> = ({
  onDeactivate,
}) => {
  const configOptions = [
    {
      title: "Department Deactivation",
      description: "Delete or deactivate department",
      buttonText: "Deactivate Department",
      onClick: onDeactivate,
    },
  ];

  return (
    <div className="mt-4">
      <div className="border border-gray-200 rounded-xl p-6 max-w-2xl min-h-112.5 flex flex-col">
        <h3 className="text-sm font-semibold text-[#2F3140] mb-6">Reset</h3>

        <div className="space-y-6 grow">
          {configOptions.map((option, index) => (
            <ConfigRow
              key={option.title}
              title={option.title}
              description={option.description}
              buttonText={option.buttonText}
              onClick={option.onClick}
              showBorder={index < configOptions.length - 1}
            />
          ))}

          {/* Spacer to push border down */}
          <div className="grow border-b border-gray-100"></div>
        </div>
      </div>
    </div>
  );
};

const ConfigRow = ({
  title,
  description,
  buttonText,
  onClick,
  showBorder,
}: {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  showBorder: boolean;
}) => (
  <div
    className={`flex items-center justify-between ${showBorder ? "pb-6 border-b border-gray-100" : ""}`}
  >
    <div>
      <h4 className="text-sm font-semibold text-[#2F3140] mb-1">{title}</h4>
      <p className="text-xs text-[#707781]">{description}</p>
    </div>
    <button
      className="px-6 py-2 bg-[#F4F4F5] text-[#2F3140] text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
      onClick={onClick}
    >
      {buttonText}
    </button>
  </div>
);

export default DepartmentConfigurationTab;
