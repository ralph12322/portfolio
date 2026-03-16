const getAccessToken = async () => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  });
  return res.json();
};

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    if (!access_token) {
      return Response.json({ isPlaying: false, title: null });
    }

    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${access_token}` }, cache: "no-store" }
    );

    // 204 = nothing playing
    if (res.status === 204 || res.status !== 200) {
      return Response.json({ isPlaying: false, title: null });
    }

    const data = await res.json();

    if (!data?.item || !data.is_playing) {
      return Response.json({ isPlaying: false, title: null });
    }

    return Response.json({
      isPlaying: true,
      title: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url ?? null,
      url: data.item.external_urls.spotify,
    });
  } catch {
    return Response.json({ isPlaying: false, title: null });
  }
}