"use client";

import { useEffect, useState } from "react";

interface Props {
  html: string;
  className?: string;
}

/**
 * Renders admin-authored HTML with client-side DOMPurify sanitization.
 * Must be a client component — dompurify requires a browser DOM environment
 * and must NOT run in the Node.js SSR path (avoids ERR_REQUIRE_ESM from jsdom).
 *
 * During SSR the raw content is rendered (trusted admin input from our own DB).
 * After hydration DOMPurify re-sanitizes on the client as defense-in-depth.
 */
export function SafeHtmlContent({ html, className }: Props) {
  const [sanitized, setSanitized] = useState(html);

  useEffect(() => {
    import("dompurify").then(({ default: DOMPurify }) => {
      setSanitized(DOMPurify.sanitize(html));
    });
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
