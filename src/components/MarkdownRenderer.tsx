/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ThemePreset } from "../App";

interface MarkdownRendererProps {
  content: string;
  onLinkClick?: (memoId: string) => void;
  allMemos?: { id: string; title: string }[];
  activeTheme?: ThemePreset;
}

export function MarkdownRenderer({ content, onLinkClick, allMemos = [], activeTheme }: MarkdownRendererProps) {
  const isDark = activeTheme?.isDark ?? false;

  if (!content) return <p className={isDark ? "text-slate-400 italic" : "text-gray-400 italic"}>本文がありません。</p>;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className={`list-disc pl-6 mb-4 space-y-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const flushCodeBlock = (key: string) => {
    if (codeLines.length > 0) {
      elements.push(
        <pre key={`code-${key}`} className={`border rounded p-4 mb-4 font-mono text-xs overflow-x-auto ${isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-gray-50 border-gray-200 text-gray-800"}`}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      codeLines = [];
    }
    inCodeBlock = false;
  };

  // Inline markdown parser (bold, italic, inline code, links)
  const parseInlineMarkdown = (text: string): string => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Italic (*text* or _text_)
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/_(.*?)_/g, "<em>$1</em>");

    // Inline code (`code`)
    const inlineCodeClass = isDark
      ? "bg-slate-800 font-mono text-xs px-1.5 py-0.5 rounded text-pink-400"
      : "bg-gray-100 font-mono text-xs px-1.5 py-0.5 rounded text-red-600";
    html = html.replace(/`(.*?)`/g, `<code class='${inlineCodeClass}'>$1</code>`);

    // Markdown Links [Label](URL)
    const linkClass = isDark
      ? "text-indigo-400 hover:underline font-medium"
      : "text-indigo-600 hover:underline font-medium";

    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, label, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${label}</a>`;
    });

    // Bare URLs (http:// or https://)
    html = html.replace(/(?<!["'=\w])(https?:\/\/[^\s<"'\)]+)/g, (match, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${url}</a>`;
    });

    return html;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(`cb-${i}`);
      } else {
        if (inList) flushList(`list-${i}`);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Header 1
    if (line.startsWith("# ")) {
      if (inList) flushList(`list-${i}`);
      elements.push(
        <h1 key={i} className={`text-2xl font-display font-semibold border-b pb-2 mt-6 mb-4 ${isDark ? "text-slate-100 border-slate-800" : "text-gray-900 border-gray-100"}`}>
          {line.substring(2)}
        </h1>
      );
      continue;
    }

    // Header 2
    if (line.startsWith("## ")) {
      if (inList) flushList(`list-${i}`);
      elements.push(
        <h2 key={i} className={`text-xl font-display font-semibold mt-5 mb-3 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
          {line.substring(3)}
        </h2>
      );
      continue;
    }

    // Header 3
    if (line.startsWith("### ")) {
      if (inList) flushList(`list-${i}`);
      elements.push(
        <h3 key={i} className={`text-lg font-display font-medium mt-4 mb-2 ${isDark ? "text-slate-200" : "text-gray-800"}`}>
          {line.substring(4)}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === "---") {
      if (inList) flushList(`list-${i}`);
      elements.push(<hr key={i} className={`my-6 ${isDark ? "border-slate-800" : "border-gray-200"}`} />);
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      if (inList) flushList(`list-${i}`);
      elements.push(
        <blockquote key={i} className={`border-l-4 pl-4 italic mb-4 my-2 ${isDark ? "border-slate-700 text-slate-400" : "border-gray-300 text-gray-600"}`}>
          {line.substring(2)}
        </blockquote>
      );
      continue;
    }

    // Unordered List Item
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      inList = true;
      listItems.push(line.trim().substring(2));
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      if (inList) flushList(`list-${i}`);
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Standard paragraph
    if (inList) flushList(`list-${i}`);

    // Parse links explicitly to render clickable buttons
    const parsedLine = parseInlineMarkdown(line);
    elements.push(
      <p
        key={i}
        className={`leading-relaxed mb-4 text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}
        dangerouslySetInnerHTML={{ __html: parsedLine }}
      />
    );
  }

  // Flush any remaining active lists or code blocks
  if (inList) flushList("end");
  if (inCodeBlock) flushCodeBlock("end");

  // Render clickable connections separately if they exist in the text as wikilinks (e.g. [[Note Title]])
  return <div className={`max-w-none ${isDark ? "text-slate-300" : "text-slate-800"}`}>{elements}</div>;
}
