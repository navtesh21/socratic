import React from "react";

import Editor from "@monaco-editor/react";

const TestcaseEditor = ({ code }: { code: string }) => {
  return (
    <div className=" overlay rounded-md overflow-hidden w-[70%] h-full shadow-4xl">
      <Editor
        height="20vh"
        width={`100%`}
        language={"python"}
        value={code}
        theme="vs-dark"
        options={{ readOnly: true }}
      />
    </div>
  );
};
export default TestcaseEditor;
