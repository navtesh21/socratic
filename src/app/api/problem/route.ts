import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!req.body) {
    throw new Error("Request body is null");
  }
  const { contestId, slug: slugParam } = await req.json();
  const questId = contestId ?? slugParam;
  console.log(questId, "contestId");

  let quest;
  try {
    const questRes = await fetch(
      `${process.env.URL || "http://localhost:8000"}/getQuest`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId }),
      }
    );
    if (!questRes.ok) {
      console.log("getQuest failed", questRes.status);
      return NextResponse.json({}, { status: 502 });
    }
    quest = await questRes.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 502 });
  }

  const slug = quest?.data?.question_slug;
  if (!slug) {
    return NextResponse.json({}, { status: 404 });
  }
  console.log(slug, "slug");

  const query = `
  query getProblemDetails($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      difficulty
      likes
      dislikes
      stats
      hints
      exampleTestcases
      translatedTitle
      translatedContent
      isLiked
      isPaidOnly
      topicTags {
        name
        slug
      }
      similarQuestions
      solution {
        id
        canSeeDetail
        paidOnly
        content
      }
      codeSnippets {
        lang
        langSlug
        code
      }
      sampleTestCase
      metaData
      envInfo
      judgerAvailable
      judgeType
      enableRunCode
      enableTestMode
      enableDebugger
    }
  }
`;
  const variables = {
    titleSlug: slug,
  };

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
      console.log("leetcode graphql failed", res.status);
      return NextResponse.json({}, { status: 502 });
    }
    const json = await res.json();

    if (!json?.data?.question) {
      return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(
      { ...json.data.question, ...quest.data },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 502 });
  }
}
