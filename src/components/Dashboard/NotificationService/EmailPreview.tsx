import React from "react";
import Image from "next/image";
import { FiGlobe } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { BsTwitterX } from "react-icons/bs";

interface EmailPreviewProps {
  backgroundColor?: string;
  logoSrc?: string;
  greeting?: string;
  title?: string;
  body?: string;
  signature?: string;
  signatureTeam?: string;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  backgroundColor = "#F8F9FB",
  logoSrc = "/previewlogo.svg",
  greeting = 'Hi {{firstName}},',
  title = "Welcome to SCM Asset Plus — Invest in both Naira and USD",
  body = "We're here to guide you in making smart investments and achieving your financial dreams. Let's take the first step together toward a future of lasting prosperity",
  signature = "Regards,",
  signatureTeam = "SCM Asset Plus Team",
}) => {
  return (
    <div
      className="max-w-2xl mx-auto flex flex-col items-center justify-center mb-8 transition-colors duration-300"
      style={{ backgroundColor }}
    >
      {/* Logo - Centered above card */}
      <div className="my-8 flex flex-col items-center">
        <Image
          src={logoSrc}
          alt="Asset+ Logo"
          width={120}
          height={40}
          className=""
        />
      </div>

      {/* Content Card - White box */}
      <div className="bg-white max-w-xl w-full p-12 text-[#333333]">
        <p className="mb-6 font-medium text-lg">{greeting}</p>
        <p className="mb-6">{title}</p>
        <p className="mb-6 leading-relaxed text-gray-600">{body}</p>
        <div className="mt-8">
          <p>{signature}</p>
          <p>{signatureTeam}</p>
        </div>
      </div>

      {/* Footer - Centered below card */}
      <div className="mt-8 max-w-lg">
        <div className="">
          <p className="text-xs md:text-sm text-[#333333] px-5 md:px-0 mb-6 leading-relaxed">
            This email was sent to{" "}
            <span className="text-[#B2171E] underline cursor-pointer">
              useremail@eatfresh.com.
            </span>{" "}
            If this was sent in error, unsubscribe.
          </p>
        </div>

        <div className="flex py-10 justify-center gap-6 text-[#6A7C94]">
          <BsTwitterX size={22} className="cursor-pointer" />
          <AiFillInstagram size={22} className="cursor-pointer" />
          <FaLinkedin size={22} className="cursor-pointer" />
          <FiGlobe size={22} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
