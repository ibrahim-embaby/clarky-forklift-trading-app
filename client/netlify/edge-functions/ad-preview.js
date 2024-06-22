export default async (request, context) => {
  try {
    const responsepage = await context.next();
    const page = await responsepage.text();

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if the path matches the pattern /ads/:id (and not /ads/:id/edit)
    const match = pathname.match(/^\/ads\/([a-fA-F0-9]{24})$/);
    if (!match) {
      // If not matched, return the original response without modifications
      return new Response(page, responsepage);
    }

    const adId = match[1];
    console.log("ad id ==== ", adId);

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky-eg.netlify.app/.netlify/functions/proxy/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();
    console.log("data ====", ad);

    const updatedPage = page
      .replace("__META_TITLE__", ad.title)
      .replace("__META_DESCRIPTION__", ad.description)
      .replace("__META_IMAGE__", ad.photos[0]);

    return new Response(updatedPage, responsepage);
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
