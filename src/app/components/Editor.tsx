import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code ,defaultValue}:{onChange:(value:string | undefined) => void,language?:string,code:string,defaultValue?:string}) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value:string | undefined) => {
    setValue(value || "");
    onChange(value);
  };

  useEffect(() => {
    setValue(code || "");
  }, [code]);
  

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="55vh"
        width={`100%`}
        language={language || "python"}
        value={value}
        theme="vs-dark"
        defaultValue={defaultValue || ""}
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;