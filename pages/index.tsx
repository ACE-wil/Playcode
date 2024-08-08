import React, { useState,useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Resizable } from "re-resizable";

const CodeEditor = dynamic(() => import('../components/CodeEditor'), { ssr: false });
const WebView = dynamic(() => import('../components/WebView'), { ssr: false });



const Home: React.FC = () => {
  const [html, setHtml] = useState('<h1>Hello World</h1>');
  const [css, setCss] = useState('h1 { color: red; }');
  const [js, setJs] = useState('console.log("Hello World");');
  const [output, setOutput] = useState('');


  const appendMessage = (message: string, isError: boolean) => {
    const consoleDiv = document.getElementById('console') as HTMLDivElement;
    if (!consoleDiv) return;
    // 清空控制台 div 的内容
    consoleDiv.innerHTML = '';

    const p = document.createElement('p');
    p.textContent = message;
    p.style.color = isError ? 'red' : '#000';
    p.style.fontFamily = 'Menlo,Monaco,source-code-pro,Ubuntu Mono,DejaVu sans mono,Consolas,monospace';
    consoleDiv.appendChild(p);
  };


  const handleEditorChange = (language: string, value: string | undefined) => {
    if (language === 'html') setHtml(value || '');
    if (language === 'css') setCss(value || '');
    if (language === 'javascript') {
      setJs(value || '');
  
      // 清空控制台
      appendMessage('', false); // 这里可以传入一个空字符串和false来清空控制台
  
      if (value && value.trim()) { // 只有在代码非空的情况下才执行eval
        try {
          const oldLog = console.log;
          const oldError = console.error;
  
          // 重定向 console.log 和 console.error
          console.log = (message: any) => {
            appendMessage(`${message}`, false);
          };
          console.error = (error: any) => {
            appendMessage(`Error: ${error}`, true);
          };
  
          // 注意：使用 eval() 有一定的安全风险
          eval(value as string);
  
          // 恢复原始的 console.log 和 console.error
          console.log = oldLog;
          console.error = oldError;
        } catch (error: any) {
          appendMessage(`Error: ${error.message}`, true);
        }
      }
    };
  };



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
          </div>
          </Resizable>
      </div>

      <div style={{display:'flex',flexDirection:'row',marginTop:'130px',height:'50vh',}}>
      <Resizable
            style={{background: "#8cdbd5",display:'flex',flexDirection:'column',boxShadow:'rgba(0, 0, 0, 0.16) 0px 1px 4px',marginRight:'10px'}}
            defaultSize={{width:'50vw',height:'30vh'}}
            >
            <div style={{height:'15px',fontSize:'20px',marginLeft:'10px',width:'100%',zIndex:2}}>javascript</div>
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