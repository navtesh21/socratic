"use server";
interface test {
  TestCase: string;
}

interface sub {
  language_id: number; // JavaScript (Node.js 12.14.0)
  source_code: string;
  stdin: string;
}
export const executeCode = async (code: string, testcases: test[]) => {
  const submissions = testcases.map((test) => ({
    language_id: 63, // JavaScript (Node.js 12.14.0)
    source_code: `${code}\n${test.TestCase}`,
    stdin: "",
  }));

  try {
    const batchSubmissions = await submitBatchToJudge0(submissions);
    const tokens = batchSubmissions.map((sub:any) => sub.token);

    const results = await getBatchSubmissionResults(tokens);
    return results.submissions;
  } catch (error) {
    console.error("Error executing code:", error);
  }
};

async function submitBatchToJudge0(submissions: sub[]) {
  const response = await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions/batch",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": "6963af567emsh116854882431c7dp1271d3jsn71c401ef3e22",
      },
      body: JSON.stringify({ submissions }),
    }
  );
  const result = await response.json();
  return result;
}

async function getBatchSubmissionResults(tokens: string[]) {
  const url = new URL("https://judge0-ce.p.rapidapi.com/submissions/batch");
  url.searchParams.append("tokens", tokens.join(","));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "x-rapidapi-key": "6963af567emsh116854882431c7dp1271d3jsn71c401ef3e22",
    },
  });
  const result = await response.json();
  return result;
}

