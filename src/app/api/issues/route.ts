import { NextResponse } from "next/server";

interface GitHubLabel {
  name: string;
  color: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  labels: GitHubLabel[];
  user: GitHubUser;
  state: string;
  created_at: string;
  comments: number;
}

const REPO = "nhmdnl/ATC-TS-Aman";
const FEEDBACK_LABELS = ["feedback", "bug", "enhancement", "feature", "question"];

export async function GET() {
  try {
    // Fetch recent open issues (feedback-related)
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=all&per_page=15&sort=created&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "ATC-Aman-Launch-Site",
        },
        next: { revalidate: 60 }, // cache for 1 minute
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const issues: GitHubIssue[] = await res.json();

    // Filter out pull requests and map to our format
    const feedback = issues
      .filter((issue) => !issue.pull_request)
      .map((issue) => {
        // Extract the feedback type from labels or title prefix
        const hasLabel = (name: string) =>
          issue.labels.some((l) => l.name.toLowerCase() === name);

        let type: "bug" | "feature" | "feedback" | "question" = "feedback";
        if (hasLabel("bug")) type = "bug";
        else if (hasLabel("enhancement") || hasLabel("feature")) type = "feature";
        else if (hasLabel("question")) type = "question";

        // Also detect from title prefix like [Bug], [Feature], etc.
        const titleLower = issue.title.toLowerCase();
        if (titleLower.startsWith("[bug]") || titleLower.startsWith("bug:") || titleLower.startsWith("bug ")) type = "bug";
        else if (titleLower.startsWith("[feature]") || titleLower.startsWith("[enhancement]") || titleLower.startsWith("feature:")) type = "feature";
        else if (titleLower.startsWith("[question]") || titleLower.startsWith("question:")) type = "question";

        return {
          id: issue.id,
          number: issue.number,
          title: issue.title
            .replace(/^\[(bug|feature|enhancement|feedback|question)\]\s*/i, "")
            .replace(/^(bug|feature|enhancement|feedback|question):\s*/i, ""),
          body:
            issue.body && issue.body.length > 200
              ? issue.body.substring(0, 200) + "..."
              : issue.body || "",
          url: issue.html_url,
          type,
          state: issue.state,
          author: {
            username: issue.user.login,
            avatar: issue.user.avatar_url,
            profileUrl: issue.user.html_url,
          },
          createdAt: issue.created_at,
          commentCount: issue.comments,
          labels: issue.labels.map((l) => ({
            name: l.name,
            color: l.color,
          })),
        };
      });

    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch issues", feedback: [] },
      { status: 500 }
    );
  }
}
