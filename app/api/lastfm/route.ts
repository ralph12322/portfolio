export async function GET() {
    try {
        const res = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ralph12322&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=1&t=${Date.now()}`,
            { cache: "no-store" }
        );

        const data = await res.json();
        const track = data.recenttracks?.track?.[0];

        if (!track) {
            return Response.json({ isPlaying: false, title: null });
        }

        const isPlaying = track["@attr"]?.nowplaying === "true";

        return Response.json({
            isPlaying,
            title: track.name,
            artist: track.artist["#text"],
            album: track.album["#text"],
            albumArt: track.image?.find((i: { size: string }) => i.size === "large")?.["#text"] ?? null,
            url: track.url,
        });
    } catch {
        return Response.json({ isPlaying: false, title: null });
    }
}