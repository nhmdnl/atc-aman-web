import { NextResponse } from "next/server";

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body: string;
  assets: ReleaseAsset[];
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/nhmdnl/ATC-TS-Aman/releases",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "ATC-Aman-Launch-Site",
        },
        next: { revalidate: 300 }, // cache for 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const releases: GitHubRelease[] = await res.json();

    // Find the latest non-draft release
    const latest = releases.find((r) => !r.draft && !r.prerelease);

    if (!latest) {
      return NextResponse.json(
        { error: "No releases found" },
        { status: 404 }
      );
    }

    // Find the Windows installer (.exe)
    const winInstaller = latest.assets.find(
      (a) =>
        a.name.endsWith(".exe") &&
        a.content_type === "application/x-msdownload"
    );

    return NextResponse.json({
      version: latest.tag_name,
      releaseName: latest.name,
      releaseUrl: latest.html_url,
      publishedAt: latest.published_at,
      releaseNotes: latest.body,
      installer: winInstaller
        ? {
            name: winInstaller.name,
            url: winInstaller.browser_download_url,
            sizeBytes: winInstaller.size,
            sizeMB: (winInstaller.size / (1024 * 1024)).toFixed(1),
          }
        : null,
      allAssets: latest.assets.map((a) => ({
        name: a.name,
        url: a.browser_download_url,
        sizeMB: (a.size / (1024 * 1024)).toFixed(1),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 }
    );
  }
}
