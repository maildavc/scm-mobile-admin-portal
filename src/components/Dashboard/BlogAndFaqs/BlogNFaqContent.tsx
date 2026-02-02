import React from "react";

interface BlogNFaqContentProps {
  heading: string;
  paragraph1: string;
  subheading?: string;
  paragraph2?: string;
  showImage?: boolean;
}

const BlogNFaqContent: React.FC<BlogNFaqContentProps> = ({
  heading,
  paragraph1,
  subheading,
  paragraph2,
  showImage = true,
}) => {
  return (
    <div className="mt-6 mb-4 w-full border border-gray-200 rounded-xl p-8 h-[calc(100vh-250px)] overflow-y-auto">
      <div className="mx-auto max-w-2xl">
        {showImage && (
          /* Placeholder Image */
          <div className="w-full h-48 rounded-2xl mb-6 relative overflow-hidden bg-gradient-to-r from-[#D8EAF8] via-[#E0DEF7] to-[#E0F5F8] shrink-0">
            <div className="absolute inset-0">
              {/* Organic mesh gradient background */}
              <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[200%] bg-blue-200/20 blur-3xl rounded-full rotate-12" />
              <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[200%] bg-purple-200/20 blur-3xl rounded-full -rotate-12" />

              {/* Main Center Sphere */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#FDF6C9_0%,_#D3CFF6_40%,_#9CB9F6_100%)] shadow-xl z-10" />

              {/* Small Top Sphere */}
              <div className="absolute top-10 left-[40%] w-6 h-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#FEF9C3_0%,_#C4B5FD_100%)] shadow-md z-10" />

              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            </div>
          </div>
        )}

        {/* Content Text */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#2F3140] text-base">
            {heading}
          </h3>
          <p className="text-sm text-[#707781] leading-relaxed">
            {paragraph1}
          </p>

          {subheading && (
            <h4 className="font-bold text-[#2F3140] text-sm pt-2">
              {subheading}
            </h4>
          )}
          
          {paragraph2 && (
            <p className="text-sm text-[#707781] leading-relaxed">
              {paragraph2}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogNFaqContent;
