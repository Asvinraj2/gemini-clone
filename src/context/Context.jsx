import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {


    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("")

    const delayPara = (index, nextWord) => {
        setTimeout(function (){
            setResultData(prev => prev+nextWord);
        }, 75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt !== undefined){
            response = await run(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev => [...prev,input])
            setRecentPrompt(input)
            response = await run(input)
        }
  
        let responseArray = response.split("**");
        let newResponse = "" ;
        for(let i = 0; i < responseArray.length; i++)
        {
            if (i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i = 0; i<newResponseArray.length;i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+ " ")
        }

        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider


    // const onSent = async (prompt) => {
    //     setResultData("");
    //     setLoading(true);
    //     setShowResult(true);
    //     setRecentPrompt(input);
    
    //     const response = await run(input);
    
    //     let formattedResponse = response
    //         .replace(/\*\*(.*?)\*\*/g, "<h3>$1</h3>")  // Convert **bold headers** to <h3> headers
    //         .replace(/\*(.*?)\*/g, "<b>$1</b>")        // Convert *bold text* to <b>bold</b>
    //         .replace(/- (.*?)\n/g, "<li>$1</li>")      // Convert "- text" to list items
    //         .replace(/\n{2,}/g, "</p><p>")             // Ensure proper paragraph spacing
    //         .replace(/\n/g, "<br>")                    // Convert single line breaks
    //         .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>"); // Format code blocks
    
    //     // Wrap in a structured paragraph format
    //     let structuredResponse = `<p>${formattedResponse}</p>`;
    
    //     setResultData(structuredResponse);
    //     setLoading(false);
    //     setInput("");
    // };
    
    
    // const onSent = async (prompt) => {
    //     setResultData("");
    //     setLoading(true);
    //     setShowResult(true);
    //     setRecentPrompt(input);
    
    //     const response = await run(input);
    
    //     let formattedResponse = response
    //         .replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>") // **Bold Headers** → <h2> (Gemini-style main headings)
    //         .replace(/\*(.*?)\*/g, "<b>$1</b>")       // *Bold Text* → <b> (Gemini-style emphasis)
    //         .replace(/- (.*?)\n/g, "<li>$1</li>")     // "- List items" → <li> (for proper bullet points)
    //         .replace(/\n{2,}/g, "</p><p>")            // Double new lines → Paragraph separation
    //         .replace(/\n/g, "<br>")                   // Single new lines → Line breaks
    //         .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>"); // Code Blocks
    
    //     // Ensure list items are properly wrapped inside <ul>
    //     formattedResponse = formattedResponse.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
    
    //     // Ensure final output is well-structured inside paragraphs
    //     let structuredResponse = `<p>${formattedResponse}</p>`;
    
    //     setResultData(structuredResponse);
    //     setLoading(false);
    //     setInput("");
    // };