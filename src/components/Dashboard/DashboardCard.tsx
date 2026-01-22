import React from "react";
import { IconType } from "react-icons";
import Link from "next/link";

interface DashboardCardProps {
  icon: IconType;
  title: string;
  description: string;
  path?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, description, path }) => {
  const CardContent = () => (
    <div className="group bg-[#F4F4F5] cursor-pointer rounded-xl px-8 pt-4 pb-8 flex flex-col items-center justify-center text-center gap-4 h-full">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-dark-gray group-hover:text-primary-red transition-colors mb-2">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-bold text-dark-gray group-hover:text-primary-red transition-colors mb-2">{title}</h3>
        <p className="text-xs text-[#707781] leading-relaxed max-w-75 mx-auto">
          {description}
        </p>
      </div>
    </div>
  );

  if (path) {
    return (
      <Link href={path} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default DashboardCard;
