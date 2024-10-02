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
    language_id: 71, // JavaScript (Node.js 12.14.0)
    source_code: `${code}\n${test.TestCase}`,
    stdin: "",
    command_line_arguments: "-Wa",
  }));
  try {
    const batchSubmissions = await submitBatchToJudge0(submissions);
    const tokens = batchSubmissions.map((sub: any) => sub.token);

    const batchResults = await pollForBatchResults(tokens);
    return batchResults.submissions;
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
        "x-rapidapi-key": "5d70440795msh2d446f6248d5fc4p1e5efejsnaf759f693b9a",
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
      "x-rapidapi-key": "5d70440795msh2d446f6248d5fc4p1e5efejsnaf759f693b9a",
    },
  });
  const result = await response.json();

  return result;
}

async function pollForBatchResults(
  tokens: string[],
  maxAttempts = 10,
  delay = 1000
) {
  for (let i = 0; i < maxAttempts; i++) {
    const results = await getBatchSubmissionResults(tokens);
    if (results.submissions.every((result: any) => result.status.id > 2)) {
      return results;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Maximum polling attempts reached");
}
