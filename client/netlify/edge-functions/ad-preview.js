export default async (request, context) => {
  try {
    const url = new URL(request.url);
    const adId = url.pathname.split("/").pop();

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky.onrender.com/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();

    if (response.ok && ad) {
      const url = new URL(request.url);
      const redirectUrl = `${url.origin}/ads/${adId}`;

      if (request.headers.get("Cache-Control") === "no-cache") {
        return new Response("", {
          status: 301,
          headers: { Location: redirectUrl },
        });
      } else {
        // Build the HTML response without the script
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
    }

    return new Response("Not Found", {
      status: 404,
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
