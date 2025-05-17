export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const query = searchParams.get("type") || "pharmacy"; // default ke pharmacy

    const response = await fetch(
        `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&radius=1000&query=${query}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: process.env.FOURSQUARE_API_KEY,
            },
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Gagal memuat data Foursquare" }), {
            status: 500,
        });
    }

    const data = await response.json();

    const results = data.results.map((place) => ({
        name: place.name,
        category: place.categories?.[0]?.name || "unknown",
        distance: place.distance,
    }));

    return new Response(JSON.stringify({ results }), {
        headers: { "Content-Type": "application/json" },
    });
}
