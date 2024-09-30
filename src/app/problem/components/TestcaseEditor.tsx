import React from "react";

import Editor from "@monaco-editor/react";

const TestcaseEditor = ({ code }: { code: string }) => {
  return (
    <div className=" rounded-md  w-full h-full">
      <Editor
        height="10vh"
        width={`100%`}
        language={"javascript"}
        value={code}
        theme="vs-dark"
      />
    </div>
  );
};
export default TestcaseEditor;
