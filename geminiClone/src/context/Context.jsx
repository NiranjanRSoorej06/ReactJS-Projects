// src/context/Context.jsx
import { createContext, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Context = createContext();

const genAI = new GoogleGenerativeAI("AIzaSyDBDUEl-yqN7IGXfxGjXydFGNjaUqJZCVw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ContextProvider = ({ children }) => {

  const [input, setInput]=useState("");
  const [recentPrompt,setRecentPrompt]=useState("");
  const [prevPrompt,setPrevPrompt]=useState([]);
  const [showResult,setShowResult]=useState(false);
  const [loading,setLoading]=useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara=(index,nextWord)=>{
    setTimeout(function (){
      setResultData(prev=>prev+nextWord);
    },75*index)
  }

  const newChat=()=>{
    setLoading(false);
    setShowResult(false);
  }

  const onSent = async (prompt) => {
  try {
    setResultData("")
    setLoading(true)
    setShowResult(true)

    // if no prompt passed, use current input state
    const query = prompt || input;

    // keep track of recent + previous prompts
    setRecentPrompt(query);
    if(prompt==undefined) setPrevPrompt((prev) => [...prev, query]);

    const result = await model.generateContent(query);
    const text = result.response.text();
    let responseArray=text.split("**")
    let newResponse="";
    for(let i=0;i<responseArray.length;i++){
      if(i==0 || i%2==0){
        newResponse+=responseArray[i];
      }else{
        newResponse+="<b>"+responseArray[i]+"</b>"
      }
    }
    let newResponse2=newResponse.split("*").join("</br>");
    let newResponseArray=newResponse2.split(" ");
    for(let i=0;i<newResponseArray.length;i++){
      const nextWord=newResponseArray[i];
      delayPara(i,nextWord+" ");
    }
    setResultData(newResponse2);
    setLoading(false);
    setInput("");


  } catch (error) {
    console.error("Error while generating content:", error);
  } finally {
    setLoading(false);
  }
};

  const contextValue = {
    onSent,
    prevPrompt,setPrevPrompt,
    recentPrompt,setRecentPrompt,
    resultData,setResultData,
    input,setInput,
    showResult,setShowResult,
    loading,setLoading,
    newChat,
    
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
