import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, defaultValue }: {
  onChange: (value: string | undefined) => void,
  language?: string,
  code: string,
  defaultValue?: string
}) => {
  const [value, setValue] = useState(code || "");
  const displayLanguage = language || "python";

  const handleEditorChange = (value: string | undefined) => {
    setValue(value || "");
    onChange(value);
  };

  useEffect(() => {
    setValue(code || "");
  }, [code]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Language indicator banner - improved styling to match the screenshot */}
      <div className="bg-gray-900 text-white px-4 py-2 font-mono text-sm flex items-center border-b border-gray-700">
        <span className="font-bold">{displayLanguage.charAt(0).toUpperCase() + displayLanguage.slice(1)} 3</span>
      </div>
      
      <div className="overlay w-full h-full shadow-4xl">
        <Editor
          height="55vh"
          width={`100%`}
          language={displayLanguage}
          value={value}
          theme="vs-dark"
          defaultValue={defaultValue || ""}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default CodeEditorWindow;