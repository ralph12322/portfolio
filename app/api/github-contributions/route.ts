// app/api/github-contributions/route.ts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") ?? "";

    // Use GitHub's contribution calendar API instead
    const res = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "X-Requested-With": "XMLHttpRequest",
        },
        cache: "no-store",
      }
    );
    const html = await res.text();

    // Sum all data-level squares with their counts
    const matches = [...html.matchAll(/data-count="(\d+)"/g)];
    const total = matches.reduce((sum, m) => sum + parseInt(m[1]), 0);

    return Response.json({ contributions: total > 0 ? total.toLocaleString() : "—" });
  } catch {
    return Response.json({ contributions: "—" });
  }
}