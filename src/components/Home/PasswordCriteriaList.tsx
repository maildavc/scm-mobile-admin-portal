import React from "react";
import { FaCheck, FaRegCircle } from "react-icons/fa";

interface CriteriaItemProps {
  isValid: boolean;
  label: string;
}

const CriteriaItem: React.FC<CriteriaItemProps> = ({ isValid, label }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-200 ${
          isValid
            ? "bg-green-500/20 border-green-500 text-green-500"
            : "border-[#6E6D7A] text-transparent"
        }`}
      >
        {isValid && <FaCheck size={10} />}
      </div>
      <span
        className={`text-sm transition-colors duration-200 ${
          isValid ? "text-gray-200" : "text-[#6E6D7A]"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

interface PasswordCriteriaListProps {
  criteria: {
    hasSmallLetter: boolean;
    hasCapitalLetter: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    hasMinLength: boolean;
  };
}

export const PasswordCriteriaList: React.FC<PasswordCriteriaListProps> = ({
  criteria,
}) => {
  return (
    <div className="flex flex-col gap-3 py-2">
      <CriteriaItem isValid={criteria.hasSmallLetter} label="1 small letter" />
      <CriteriaItem isValid={criteria.hasMinLength} label="6 characters" />
      <CriteriaItem isValid={criteria.hasNumber} label="1 number" />
      <CriteriaItem isValid={criteria.hasCapitalLetter} label="1 capital letter" />
      <CriteriaItem
        isValid={criteria.hasSpecialChar}
        label="1 special character e.g. !@#$%^&*()?"
      />
    </div>
  );
};
