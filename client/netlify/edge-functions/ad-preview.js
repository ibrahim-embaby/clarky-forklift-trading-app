export default async (request, context) => {
  try {
    const responsepage = await context.next();
    const page = await responsepage.text();

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if the path matches the pattern /ads/:id (and not /ads/:id/edit)
    const match = pathname.match(/^\/ads\/([a-fA-F0-9]{24})$/);
    if (!match) {
      // Return the original response for non-ad paths (default meta tags should already be in HTML)
      return new Response(page, responsepage);
    }

    const adId = match[1];

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky-eg.netlify.app/.netlify/functions/proxy/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();

    if (!ad) {
      return new Response(page, responsepage);
    }
    console.log("Ad ===== ", ad);

    const updatedPage = page
      .replace("Clarky | كلاركي", ad.title)
      .replace(
        "كلاركي - أول موقع متخصص في مجال الكلاركات في مصر",
        ad.description
      )
      .replace("%PUBLIC_URL%/logo512.png", ad.photos[0]);

    return new Response(updatedPage, responsepage);
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
