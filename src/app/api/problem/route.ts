import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  if (!req.body) {
    throw new Error("Request body is null");
  }
  const { contestId } = await req.json();
  console.log(contestId, "contestId");
  const data = await axios.post(`${process.env.URL || "http://localhost:8000"}/getQuest`,{
    questId: contestId
  })
  if(!data.data.data.question_slug){
    return NextResponse.json({},{status:404});
  }
  const slug= await data.data.data.question_slug
  console.log(slug, "slug")
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
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: query,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    if(!res.data.data.question){
      return NextResponse.json({},{status:404});
    }

  return NextResponse.json({...res.data.data.question,...data.data.data}, { status: 200 });
  } catch (error) {
    console.log(error);

    throw new Error("Error fetching data");
  }
}
