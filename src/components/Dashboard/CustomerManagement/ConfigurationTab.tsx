import React from "react";
import { CONFIG_OPTIONS } from "@/constants/customerManagement/customerManagement";

interface ConfigurationTabProps {
  onDeactivate?: () => void;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({
  onDeactivate,
}) => {
  const configOptions = CONFIG_OPTIONS.map((option, index) => ({
    ...option,
    onClick: index === 2 ? onDeactivate : () => {},
  }));

  return (
    <div className="border border-gray-200 rounded-xl p-6 max-w-3xl min-h-120 flex flex-col">
      <h3 className="text-base font-semibold text-[#2F3140] mb-6">Reset</h3>

      <div className="mt-4">
        <div className="space-y-6">
          {configOptions.map((option, index) => (
            <ConfigRow
              key={option.title}
              title={option.title}
              description={option.description}
              buttonText={option.buttonText}
              onClick={option.onClick}
              isLast={index === configOptions.length - 1}
            />
          ))}
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
  isLast,
}: {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  isLast: boolean;
}) => (
  <div
    className={`flex items-start justify-between gap-4 pb-6 ${!isLast ? "border-b border-gray-200" : "border-b border-gray-200"}`}
  >
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-[#2F3140] mb-1">{title}</h4>
      <p className="text-sm text-[#707781]">{description}</p>
    </div>
    <button
      className="px-6 py-2.5 bg-[#F4F4F5] text-[#2F3140] text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
      onClick={onClick}
    >
      {buttonText}
    </button>
  </div>
);

export default ConfigurationTab;
