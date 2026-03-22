"use client";

import dynamic from "next/dynamic";

const ArticleEditor = dynamic(() => import("./ArticleEditor"), { ssr: false });

export default ArticleEditor;
