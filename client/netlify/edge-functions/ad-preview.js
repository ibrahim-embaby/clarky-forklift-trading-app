// netlify/functions/ad-meta-tags.js
export default async (request, context) => {
  try {
    const url = new URL(request.url);
    const adId = url.pathname.split("/").pop();
    const userAgent = request.headers.get("User-Agent");

    if (userAgent.includes("Googlebot") || userAgent.includes("bingbot")) {
      return Response.redirect(url.origin + "/ads/" + adId, 301);
    }

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky.onrender.com/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();

    if (response.ok && ad) {
      const metaTags = `
      <meta property="og:title" content="${ad.title}" />
      <meta property="og:description" content="${ad.description}" />
      <meta property="og:image" content="${ad.photos[0]}" />
      <meta property="og:url" content="${request.url}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${ad.title}" />
      <meta name="twitter:description" content="${ad.description}" />
      <meta name="twitter:image" content="${ad.photos[0]}" />
    `;

      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        ${metaTags}
        <title>${ad.title}</title>
        <script>
          window.location = '${url.origin}/ads/${adId}';
        </script>
      </head>
      <body>
        Redirecting...
      </body>
      </html>
    `;
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    return {
      statusCode: 404,
      body: "Not Found",
    };
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
