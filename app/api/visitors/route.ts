// app/api/visitors/route.ts
export async function GET() {
  try {
    const res = await fetch("https://hits.sh/ralph12322.github.io.svg", {
      cache: "no-store",
    });
    const svg = await res.text();
    // Extract the last number in the SVG (the hit count)
    const matches = svg.match(/(\d+)<\/text>/g);
    const count = matches
      ? matches[matches.length - 1].replace(/<\/text>/, "")
      : "0";
    return Response.json({ visitors: count });
  } catch {
    return Response.json({ visitors: "0" });
  }
}