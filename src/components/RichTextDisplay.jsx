import React from "react";
import DOMPurify from "dompurify";

const RichTextDisplay = ({
  content,
  maxLength = null,
  className = "",
  showFullContent = false,
}) => {
  if (!content) return null;

  // Convert simple markdown to HTML (matching RichTextEditor logic)
  const markdownToHtml = (text) => {
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

    // Wrap consecutive list items in ul tags (improved logic)
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, "<ul>$&</ul>");

    return html;
  };

  // Sanitize the content for safe rendering
  const sanitizeContent = (htmlContent) => {
    return DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "code",
        "pre",
        "a",
        "hr",
      ],
      ALLOWED_ATTR: ["href", "title", "class", "target", "rel"],
      ALLOW_DATA_ATTR: false,
    });
  };

  // If maxLength is specified and we're not showing full content, truncate
  let displayContent = content;
  let isTruncated = false;

  if (maxLength && !showFullContent) {
    // Remove markdown/HTML tags for length calculation
    const textContent = content
      .replace(/(\*\*.*?\*\*|\*.*?\*|`.*?`|#{1,6}\s|[\[\]()>-])/g, "")
      .replace(/<[^>]*>/g, "");
    if (textContent.length > maxLength) {
      // Truncate the plain text and add ellipsis
      const truncatedText = textContent.substring(0, maxLength) + "...";
      displayContent = truncatedText;
      isTruncated = true;
    }
  }

  // Check if content contains markdown or HTML tags
  const hasMarkdown =
    /(\*\*.*?\*\*|\*.*?\*|#{1,6}\s|`.*?`|\[.*?\]\(.*?\)|^[\-\d+\.]\s|^>\s)/m.test(
      content
    );
  const hasHtmlTags = /<[^>]*>/g.test(content);

  if ((hasMarkdown || hasHtmlTags) && !isTruncated) {
    // Convert markdown to HTML and sanitize
    const htmlContent = hasMarkdown
      ? markdownToHtml(displayContent)
      : displayContent;

    return (
      <>
        <div
          className={`rich-text-display prose prose-sm max-w-none ${className}`}
          dangerouslySetInnerHTML={{
            __html: sanitizeContent(htmlContent),
          }}
          style={{
            wordBreak: "break-word",
            lineHeight: "1.5",
          }}
        />

        {/* Inline styling for proper display */}
        <style>{`
          .rich-text-display.prose h1,
          .rich-text-display.prose h2,
          .rich-text-display.prose h3 {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            font-weight: 600 !important;
            color: #111827 !important;
          }
          
          .rich-text-display.prose h1 {
            font-size: 1.25rem !important;
          }
          
          .rich-text-display.prose h2 {
            font-size: 1.125rem !important;
          }
          
          .rich-text-display.prose h3 {
            font-size: 1rem !important;
          }
          
          .rich-text-display.prose p {
            margin-bottom: 0.5rem !important;
            color: #374151 !important;
          }
          
          .rich-text-display.prose ul {
            margin: 0.5rem 0 !important;
            padding-left: 1.25rem !important;
            list-style-type: disc !important;
          }
          
          .rich-text-display.prose li {
            margin-bottom: 0.25rem !important;
            color: #374151 !important;
            display: list-item !important;
          }
          
          .rich-text-display.prose strong {
            font-weight: 600 !important;
            color: #111827 !important;
          }
          
          .rich-text-display.prose em {
            font-style: italic !important;
          }
          
          .rich-text-display.prose a {
            color: #E5B700 !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
          
          .rich-text-display.prose a:hover {
            color: #d97706 !important;
          }
          
          .rich-text-display.prose code {
            background-color: #f3f4f6 !important;
            padding: 0.125rem 0.25rem !important;
            border-radius: 0.25rem !important;
            font-size: 0.875rem !important;
            color: #374151 !important;
            font-family: 'Courier New', monospace !important;
          }
          
          .rich-text-display.prose blockquote {
            border-left: 4px solid #E5B700 !important;
            padding-left: 1rem !important;
            margin: 0.5rem 0 !important;
            color: #6b7280 !important;
            font-style: italic !important;
          }
        `}</style>
      </>
    );
  }

  // For plain text or truncated content
  return (
    <div
      className={`rich-text-display ${className}`}
      style={{
        wordBreak: "break-word",
        lineHeight: "1.5",
      }}
    >
      {displayContent}
    </div>
  );
};

export default RichTextDisplay;
