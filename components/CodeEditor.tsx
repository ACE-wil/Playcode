import React from 'react';
import dynamic from 'next/dynamic';
import { Monaco } from '@monaco-editor/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default), { ssr: false });


interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs', // 基于浅色主题
      inherit: true, // 继承基础主题
      rules: [
          { token: 'comment', foreground: '6a737d', fontStyle: 'italic' }, // 灰色注释
          { token: 'keyword', foreground: 'A855CD', fontStyle: 'bold' }, // 暗紫色关键字
          { token: 'identifier', foreground: '1053CF' }, // 默认标识符颜色：黑色
          { token: 'string', foreground: '005cc5' }, // 字符串：湖蓝色
          { token: 'number', foreground: '005cc5' }, // 数字：湖蓝色
          { token: 'delimiter', foreground: '228B22' }, // 括号：森林浅绿色
          { token: 'type', foreground: 'DAA520' }, // 类型/类名：深黄色
          { token: 'function', foreground: 'AE8BE8' }, // 函数名：暗紫色
          { token: 'function.invoke', foreground: 'F9F5A3' }, // 函数名调用：湖蓝色
          { token: 'property', foreground: 'B59A41' }, // 属性方法：粉色
          { token: 'variable', foreground: 'DAA520' }, // 变量：红色
          { token: 'variable.unused', foreground: '6a737d' }, // 未使用的变量：灰色
          { token: 'operator', foreground: '0FECA6' }, // 操作符：紫色
          { token: 'builtin', foreground: '4b0082' }, // 内建函数/对象：暗紫色
          { token: 'console', foreground: '605B05' }, // console：深黄色
      ],
      colors: {
          'editor.background': '#ffffff', // 白色背景
          'editor.foreground': '#000000', // 主文本颜色：黑色
          'editorLineNumber.foreground': '#333333', // 行号颜色：深灰色
          'editorCursor.foreground': '#800080', // 光标颜色：紫色
          'editorCursor.background': '#ffffff00', // 光标背景：透明（无背景色）
          'editor.selectionBackground': '#ADD8E6', // 选中文本背景：浅蓝色
          'editor.selectionHighlightBackground': '#ADD8E6', // 非活动选中文本背景：浅蓝色
          'editor.wordHighlightBackground': '#ADD8E6', // 变量高亮背景：浅蓝色
          'editor.lineHighlightBackground': '#f6f8fa', // 当前行背景：浅灰色
          'editorLineNumber.activeForeground': '#000000', // 活动行号颜色：黑色
          'editor.findMatchBackground': '#FFFF00', // 查找匹配项背景：黄色
          'editor.findMatchHighlightBackground': '#FFFF00', // 查找高亮背景：黄色
          'editor.hoverHighlightBackground': '#ADD8E6', // 悬停时高亮背景：浅蓝色
          'editorBracketMatch.background': '#ffffff00', // 匹配括号背景：森林浅绿色
          'editorBracketMatch.border': '#228B22', // 匹配括号边框：森林浅绿色
          'editorGutter.background': '#ffffff', // 边栏背景：白色
          'editorGutter.addedBackground': '#81b88b', // 添加的行背景：浅绿
          'editorGutter.modifiedBackground': '#e2c08d', // 修改的行背景：浅橙
          'editorGutter.deletedBackground': '#e06c75', // 删除的行背景：红色
          'editorOverviewRuler.border': '#e1e4e8', // 概览标尺边框颜色：浅灰色
          'editorError.foreground': '#FF0000', // 错误提示：红色
          'editorWarning.foreground': '#FFA500', // 警告提示：橙色
          'editorInfo.foreground': '#0000FF', // 信息提示：蓝色
          'editorLightBulb.foreground': '#FFCC00', // 智能提示：黄色
          'editorWhitespace.foreground': '#d1d5da', // 空白字符颜色：浅灰色
      },
    });
  };
  return (
    <MonacoEditor
      height="50vh"
      language={language}
      value={value}
      onChange={(newValue:any) => onChange(newValue)}
      beforeMount={handleEditorWillMount} // 定义主题的钩子
      theme="myCustomTheme" // 应用自定义主题
    />
  );
};

export default CodeEditor;