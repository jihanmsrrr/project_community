// components/ArticlePage.tsx
import React from "react";
import ArticleHeader from "./ArticleHeader"; // <-- ADD THIS LINE
import Sidebar from "./Sidebar";
import RelatedArticles from "./RelatedArticles";
// import ArticleContent from './ArticleContent/ArticleContent'; // nanti kalau perlu

const ArticlePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <main className="bg-white p-6 rounded-lg shadow-sm">
        <ArticleHeader />
        {/* <ArticleContent /> */}
        <div className="mt-5 text-base leading-relaxed">
          <p>[Isi artikel panjang masuk sini...]</p>
        </div>
      </main>

      <div className="flex flex-col gap-8">
        <Sidebar />
        <RelatedArticles />
      </div>
    </div>
  );
};

export default ArticlePage;
