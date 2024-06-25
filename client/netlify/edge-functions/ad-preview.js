export default async (request, context) => {
  try {
    const responsepage = await context.next();
    const page = await responsepage.text();

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if the path matches the pattern /ads/:id (and not /ads/:id/edit)
    const match = pathname.match(/^\/ads\/([a-fA-F0-9]{24})$/);
    if (!match) {
      // Set default meta tags for non-ad pages
      const defaultTitle = "Clarky | كلاركي";
      const defaultDescription =
        "كلاركي - الموقع الأول في مجال الكلاركات في مصر";
      const defaultImage = "%PUBLIC_URL%/images/logo512.png";

      const updatedPage = page
        .replace("__META_TITLE__", defaultTitle)
        .replace("__META_DESCRIPTION__", defaultDescription)
        .replace("__META_IMAGE__", defaultImage);

      return new Response(updatedPage, responsepage);
    }

    const adId = match[1];

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky-eg.netlify.app/.netlify/functions/proxy/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();
    console.log("data ====", ad);

    if (!ad) {
      return new Response(page, responsepage);
    }

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
