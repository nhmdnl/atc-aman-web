import { NextResponse } from "next/server";

const REPO = "nhmdnl/ATC-TS-Aman";

interface FeedbackPayload {
  type: "bug" | "feature" | "feedback";
  title: string;
  body: string;
  authorName: string;
}

export async function POST(request: Request) {
  try {
    const body: FeedbackPayload = await request.json();
    const { type, title, body: feedbackBody, authorName } = body;

    // Validate required fields
    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }
    if (!feedbackBody || feedbackBody.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide more detail (at least 10 characters)" },
        { status: 400 }
      );
    }

    // Check if GITHUB_TOKEN is configured
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Feedback submission is not configured. The site owner needs to set the GITHUB_TOKEN environment variable.",
        },
        { status: 503 }
      );
    }

    // Map feedback type to GitHub labels
    const labelMap = {
      bug: ["bug", "from-website"],
      feature: ["enhancement", "from-website"],
      feedback: ["feedback", "from-website"],
    };

    const prefixMap = {
      bug: "[Bug]",
      feature: "[Feature]",
      feedback: "[Feedback]",
    };

    const issueTitle = `${prefixMap[type]} ${title.trim()}`;
    const issueBody = [
      `**Submitted via the ATC Aman launch website**`,
      ``,
      `---`,
      ``,
      feedbackBody.trim(),
      ``,
      `---`,
      `*Submitted by ${authorName || "Anonymous"} via [ATC Aman Website](https://github.com/${REPO})*`,
    ].join("\n");

    // Create the GitHub issue
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/issues`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "ATC-Aman-Launch-Site",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: labelMap[type],
        }),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("GitHub API error:", res.status, errData);
      return NextResponse.json(
        {
          error: `Failed to create issue (${res.status}). ${errData.message || "Please try again later."}`,
        },
        { status: res.status }
      );
    }

    const issue = await res.json();

    return NextResponse.json({
      success: true,
      issueUrl: issue.html_url,
      issueNumber: issue.number,
      message: `Issue #${issue.number} created successfully!`,
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
