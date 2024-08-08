import React, { useEffect, useRef } from 'react';

interface WebViewProps {
  html: string;
  css: string;
  js: string;
}

const WebView: React.FC<WebViewProps> = ({ html, css, js }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const document = iframeRef.current?.contentDocument;
    if (document) {
      const content = `
        <style>${css}</style>
        ${html}
        <script>${js}<\/script>
      `;
      document.open();
      document.write(content);
      document.close();
    }
  }, [html, css, js]);

  return <iframe ref={iframeRef} style={{ width: '100%', height: '50vh', border: 'none' }} />;
};

export default WebView;