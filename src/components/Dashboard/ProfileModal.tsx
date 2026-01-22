import React from "react";
import Modal from "../Modal";
import { PiCaretDown } from "react-icons/pi";
import { BiUser } from "react-icons/bi";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PERMISSIONS = [
  { label: "Create New Role", module: "User & Role Management" },
  {
    label: "Name of permission here",
    module: "Module the permission comes from",
  },
];

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 md:p-10 min-h-150">
        {/* Header Section */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-18 h-18 rounded-full bg-[#121212] flex items-center justify-center text-white shrink-0">
            <BiUser size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-[#2F3140]">
              Ehizojie Ihayere
            </h2>
            <p className="text-[#707781] text-xs">Permission Name Here</p>
            <button className="flex items-center gap-1 text-[#B2171E] font-medium text-xs mt-1 w-fit">
              Manage Profile <PiCaretDown size={12} />
            </button>
          </div>
        </div>

        {/* Permissions Section */}
        <div>
          <h3 className="font-bold text-[#2F3140] mb-6 text-base">
            User Permissions
          </h3>

          <div className="flex flex-col gap-4">
            {PERMISSIONS.map((permission, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-50 pb-4"
              >
                <span className="text-[#2F3140] text-sm md:text-base">
                  {permission.label}
                </span>
                <span className="text-[#707781] text-sm md:text-base">
                  {permission.module}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
