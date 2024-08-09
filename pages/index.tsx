import React, { useState,useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Resizable } from "re-resizable";

const CodeEditor = dynamic(() => import('../components/CodeEditor'), { ssr: false });
const WebView = dynamic(() => import('../components/WebView'), { ssr: false });

type LogMessage = string | { message: string; isError: boolean };

const Home: React.FC = () => {
  const [html, setHtml] = useState('<h1>Hello World</h1>');
  const [css, setCss] = useState('h1 { color: red; }');
  const [js, setJs] = useState('console.log("Hello World");');
  const [output, setOutput] = useState('');
  const [logMessages, setLogMessages] = useState<LogMessage[]>([]); 

  const appendMessage = (message: string, isError: boolean) => {  
    setLogMessages(prev => [...prev, { message, isError }]);  
  };

// 处理编辑器更改的函数  
const handleEditorChange = (language: string, value: string | undefined) => {  
  if (language === 'html') setHtml(value || '');  
  if (language === 'css') setCss(value || '');  
  if (language === 'javascript') {  
    setJs(value || '');  

    // 在尝试执行新代码之前清空 UI 显示的日志  
    setLogMessages([]); 
  
    if (value && value.trim()) {  
      let originalLog = console.log;  
      let originalError = console.error; 
      try {  
        console.log = (...args: any[]) => {  
          const message = args.join(' ');  
          setLogMessages(prev => [...prev, { message, isError: false }]);  
          originalLog.apply(console, args);  
        };  
  
        console.error = (error: any) => {  
          const errorMessage = `Error: ${error}`;  
          setLogMessages(prev => [...prev, { message: errorMessage, isError: true }]);  
          originalError.apply(console, [error]);  
        };  

        // 使用 new Function 而不是 eval 来执行 JavaScript
        const executeJS = new Function(value);
        executeJS();

      } catch (error) {  
        const errorMessage = `Error: ${(error as Error).message}`;  
        setLogMessages(prev => [...prev, { message: errorMessage, isError: true }]);  
      } finally {  
        // 恢复原始的 console 方法
        console.log = originalLog;  
        console.error = originalError;  
      }  
    }  
  }  
};


// useEffect(() => {
//   // 事件处理函数
//   const handleMessage = (event: any) => {
//     if (event.origin !== window.location.origin) return; // 确保消息来源正确
//     if (event.data.source === 'iframe' && event.data.type === 'log') {
//       const message = event.data.data; // 从事件中获取日志消息
//       const isError = event.data.isError || false; // 从事件中获取错误状态，默认为 false
//       setLogMessages(prev => [...prev, { message, isError }]);
//     }
//   };

//   // 添加事件监听器
//   window.addEventListener('message', handleMessage);

//   // 清除事件监听器，防止内存泄漏
//   return () => {
//     window.removeEventListener('message', handleMessage);
//   };
// }, []); // 空依赖数组，确保 useEffect 只在组件挂载时运行一次

  
  return (
    <div style={{padding:'10px'}}>
      <div style={{width:'100vw',height:'30px',backgroundColor:'#5EC2B9',textAlign:'center',lineHeight:'30px',fontSize:'25px',color:'white',letterSpacing:'20px'}}>PlayCode.io</div>
    <div style={{width:'100vw',height:'100vh',display:'flex',flexDirection:'column',marginTop:'5px'}}>
      
      <div style={{display:'flex',flexDirection:'row',height:'20vh'}}>

      <Resizable
            style={{background: "#8cdbd5",display:'flex',flexDirection:'column',boxShadow:'rgba(0, 0, 0, 0.16) 0px 1px 4px',marginRight:'10px'}}
            defaultSize={{width:'50vw',height:'30vh'}}
            >
            <div style={{height:'15px',fontSize:'20px',marginLeft:'10px',zIndex:2}}>HTML</div>
          <div style={{width:'100%',height:'100%',marginTop:'15px'}}>
            <CodeEditor language="html" value={html} onChange={(value) => handleEditorChange('html', value)} />
          </div>
          </Resizable>

          {/* <Resizable
            style={{background: "#8cdbd5",display:'flex',flexDirection:'column',marginLeft:'20px'}}
            defaultSize={{width:'40vw',height:'50vh'}}
            >
            <div>CSS</div>
          <div style={{width:'100%',height:'100%'}}>
            <CodeEditor language="css" value={css} onChange={(value) => handleEditorChange('css', value)} />
          </div>
          </Resizable> */}
          
      <Resizable
            style={{background: "#8cdbd5",display:'flex',flexDirection:'column',marginLeft:'20px',boxShadow:'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}
            defaultSize={{width:'50vw',height:'30vh'}}
            >
            <div style={{height:'15px',fontSize:'20px',marginLeft:'10px',width:'100%',zIndex:2}}>CONSOLE</div>
          <div id="console" style={{ width:'100%',height:'100%',padding: '10px', backgroundColor:'white', color: 'red' ,marginTop:'15px'}}>
          <div id="console" style={{ width: '100%', height: '100%', padding: '10px', backgroundColor: 'white', overflowY: 'auto' }}>  
{logMessages.map((msg, index) => {  
  if (typeof msg === 'object' && msg !== null && 'message' in msg) {  
    // 现在我们知道 msg 是一个对象，并且它有一个 'message' 属性  
    return (  
      <p key={index} style={{ color: msg.isError ? 'red' : '#000',  fontFamily: 'Menlo, Monaco, source-code-pro, Ubuntu Mono, DejaVu sans mono, Consolas, monospace', whiteSpace: 'pre-wrap'/* ... 其他样式 */ }}>  
        {msg.message.replace(/\n/g, '<br/>')}  
      </p>  
    );  
  } else {  
    // 如果 msg 不是我们期望的对象，或者没有 'message' 属性，我们可以提供一个默认的渲染  
    return <p key={index} style={{ color:  '#000',  fontFamily: 'Menlo, Monaco, source-code-pro, Ubuntu Mono, DejaVu sans mono, Consolas, monospace', whiteSpace: 'pre-wrap' }}>{(typeof msg === 'string' ? msg : 'Unknown message')}</p>;  
  }  
})}
</div>
          </div>
          </Resizable>
      </div>

      <div style={{display:'flex',flexDirection:'row',marginTop:'130px',height:'50vh',}}>
      <Resizable
            style={{background: "#8cdbd5",display:'flex',flexDirection:'column',boxShadow:'rgba(0, 0, 0, 0.16) 0px 1px 4px',marginRight:'10px'}}
            defaultSize={{width:'50vw',height:'30vh'}}
            >
            <div style={{height:'15px',fontSize:'20px',marginLeft:'10px',width:'100%',zIndex:2}}>Javascript</div>
          <div style={{width:'100%',height:'100%',marginTop:'15px'}}>
            <CodeEditor language="javascript" value={js} onChange={(value) => handleEditorChange('javascript', value)} />
          </div>
          </Resizable>

          <Resizable
            style={{display:'flex',flexDirection:'column',boxShadow:'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}
            defaultSize={{width:'50vw',height:'50vh'}}
            >
            <div style={{background: "#8cdbd5",height:'30px',fontSize:'20px',marginLeft:'10px',width:'100%'}}>Web View</div>
          <div style={{width:'100%',height:'100%',marginTop:'15px'}}>
            <WebView html={html} css={css} js={js} />
          </div>
          </Resizable>
      </div>
    </div>
    </div>
  );
};

export default Home;