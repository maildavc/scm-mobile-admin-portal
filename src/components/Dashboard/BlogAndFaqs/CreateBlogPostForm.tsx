import React from "react";
import Button from "@/components/Button";

interface CreateBlogPostFormProps {
  onCancel: () => void;
}

const CreateBlogPostForm: React.FC<CreateBlogPostFormProps> = ({ onCancel }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#2F3140] mb-6">Create New Blog Post</h2>
      <p className="text-gray-500 mb-8">Form content goes here...</p>
      <div className="w-32">
        <Button text="Cancel" variant="outline" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateBlogPostForm;
