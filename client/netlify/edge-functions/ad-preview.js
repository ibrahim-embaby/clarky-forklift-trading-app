// netlify/functions/ad-meta-tags.js
export default async (request, context) => {
  try {
    const responsepage = await context.next();
    const page = await responsepage.text();

    const url = new URL(request.url);
    const adId = url.pathname.split("/").pop();

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky-eg.netlify.app/.netlify/functions/proxy/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();

    const updatedPage = page
      .replace("__META_TITLE__", ad.title)
      .replace("__META_DESCRIPTION__", ad.description)
      .replace("__META_IMAGE__", ad.photos[0]);

    return new Response(updatedPage, responsepage);
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
