import React from 'react';
import dynamic from 'next/dynamic';
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default), { ssr: false });


interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  return (
    <MonacoEditor
      height="50vh"
      language={language}
      value={value}
      onChange={(newValue:any) => onChange(newValue)}
      theme="vs-dark"
    />
  );
};

export default CodeEditor;