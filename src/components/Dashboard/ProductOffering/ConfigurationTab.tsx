import React from "react";

interface ConfigurationTabProps {
  onDeactivate?: () => void;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({
  onDeactivate,
}) => {
  const configOptions = [
    {
      title: "Disable product",
      description: "Temporarily disable product",
      buttonText: "Disable Product",
      mobileButtonText: "Disable",
      onClick: () => {},
    },
    {
      title: "Product Deactivation",
      description: "Delete or deactivate product",
      buttonText: "Deactivate Product",
      mobileButtonText: "Deactivate",
      onClick: onDeactivate,
    },
  ];

  return (
    <div className="mt-4">
      <div className="mb-8">
        <p className="text-[13px] text-[#707781] font-medium mb-1">
          Portfolio size
        </p>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-1">NGN200M</h2>
        <p className="text-[13px] text-[#707781] font-medium">
          101M customers subscribed
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 max-w-2xl min-h-112.5 flex flex-col">
        <h3 className="text-sm font-semibold text-[#2F3140] mb-6">Reset</h3>

        <div className="space-y-6 grow">
          {configOptions.map((option, index) => (
            <ConfigRow
              key={option.title}
              title={option.title}
              description={option.description}
              buttonText={option.buttonText}
              mobileButtonText={option.mobileButtonText}
              onClick={option.onClick}
              showBorder={index === 0}
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
  mobileButtonText,
  onClick,
  showBorder,
}: {
  title: string;
  description: string;
  buttonText: string;
  mobileButtonText: string;
  onClick?: () => void;
  showBorder: boolean;
}) => (
  <div className={`flex items-center justify-between ${showBorder ? "pb-6 border-b border-gray-100" : ""}`}>
    <div>
      <h4 className="text-sm font-semibold text-[#2F3140] mb-1">{title}</h4>
      <p className="text-xs text-[#707781]">{description}</p>
    </div>
    <button
      className="px-6 py-2 bg-[#F4F4F5] text-[#2F3140] text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
      onClick={onClick}
    >
      <span className="hidden md:inline">{buttonText}</span>
      <span className="md:hidden">{mobileButtonText}</span>
    </button>
  </div>
);

export default ConfigurationTab;
