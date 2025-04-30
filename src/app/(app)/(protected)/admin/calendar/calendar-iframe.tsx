import React from 'react';

interface ResponsiveIframeProps {
  src: string;
  title?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  className?: string;
}

export function ResponsiveIframe({
  src,
  title,
  aspectRatio = '4:3',
  className,
}: ResponsiveIframeProps) {
  const paddingMap = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className || ''}`}
      style={{ paddingTop: paddingMap[aspectRatio] }}
    >
      <iframe
        src={src}
        title={title || 'Embedded content'}
        className="absolute top-0 left-0 w-full h-full border-0"
        allowFullScreen
      ></iframe>
    </div>
  );
}
