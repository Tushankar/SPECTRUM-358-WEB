import React, { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Quote,
  Code,
  Type,
  Eye,
  Edit,
} from "lucide-react";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Enter description...",
  height = 200,
  className = "",
  required = false,
}) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const insertText = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);
    if (onChange) {
      onChange(newText);
    }

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: <Bold size={16} />,
      title: "Bold",
      action: () => insertText("**", "**"),
    },
    {
      icon: <Italic size={16} />,
      title: "Italic",
      action: () => insertText("*", "*"),
    },
    {
      icon: <Type size={16} />,
      title: "Heading",
      action: () => insertText("### "),
    },
    {
      icon: <List size={16} />,
      title: "Bullet List",
      action: () => insertText("- "),
    },
    {
      icon: <ListOrdered size={16} />,
      title: "Numbered List",
      action: () => insertText("1. "),
    },
    {
      icon: <Link size={16} />,
      title: "Link",
      action: () => insertText("[Link Text](", ")"),
    },
    {
      icon: <Quote size={16} />,
      title: "Quote",
      action: () => insertText("> "),
    },
    {
      icon: <Code size={16} />,
      title: "Code",
      action: () => insertText("`", "`"),
    },
  ];

  const renderPreview = (text) => {
    // Simple markdown to HTML conversion
    let html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>") // H3
      .replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>") // H2
      .replace(/# (.*?)(\n|$)/g, "<h1>$1</h1>") // H1
      .replace(/^\- (.*?)$/gm, "<li>$1</li>") // Bullet points
      .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>") // Numbered list
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      ) // Links
      .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>") // Quotes
      .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
      .replace(/\n/g, "<br>"); // Line breaks

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, "<ul>$&</ul>");

    return html;
  };

  return (
    <div
      className={`rich-text-editor border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`p-1.5 rounded transition-colors ${
              !isPreview
                ? "text-[#E5B700] bg-yellow-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`p-1.5 rounded transition-colors ${
              isPreview
                ? "text-[#E5B700] bg-yellow-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
            title="Preview"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div style={{ height: `${height}px` }} className="relative">
        {!isPreview ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className="w-full h-full p-3 resize-none border-none outline-none focus:ring-0 text-sm leading-relaxed"
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              fontFamily: "inherit",
            }}
          />
        ) : (
          <div
            className="w-full h-full p-3 overflow-auto text-sm leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                renderPreview(content) ||
                "<p class='text-gray-500'>Nothing to preview</p>",
            }}
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          />
        )}
      </div>

      {/* Character count */}
      {content && (
        <div className="px-3 py-1 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-right">
          {content.length} characters
        </div>
      )}

      {/* Styling for preview content */}
      <style>{`
        .rich-text-editor .prose h1,
        .rich-text-editor .prose h2,
        .rich-text-editor .prose h3 {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #111827;
        }
        
        .rich-text-editor .prose h1 {
          font-size: 1.25rem;
        }
        
        .rich-text-editor .prose h2 {
          font-size: 1.125rem;
        }
        
        .rich-text-editor .prose h3 {
          font-size: 1rem;
        }
        
        .rich-text-editor .prose p {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .rich-text-editor .prose ul {
          margin: 0.5rem 0;
          padding-left: 1.25rem;
        }
        
        .rich-text-editor .prose li {
          margin-bottom: 0.25rem;
          color: #374151;
        }
        
        .rich-text-editor .prose strong {
          font-weight: 600;
          color: #111827;
        }
        
        .rich-text-editor .prose em {
          font-style: italic;
        }
        
        .rich-text-editor .prose a {
          color: #E5B700;
          text-decoration: underline;
        }
        
        .rich-text-editor .prose a:hover {
          color: #d97706;
        }
        
        .rich-text-editor .prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #374151;
        }
        
        .rich-text-editor .prose blockquote {
          border-left: 4px solid #E5B700;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
