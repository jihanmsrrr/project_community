// components/ArticleHeader.tsx
import React from "react";

const ArticleHeader = () => {
  return (
    <header className="mb-4 border-b pb-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        This is a Placeholder Title for Deployment
      </h1>
      <div className="mt-3 text-sm text-gray-500">
        <span>By Placeholder Author</span>
        <span className="mx-2">•</span>
        <span>July 4, 2025</span>
      </div>
    </header>
  );
};

export default ArticleHeader;
