// netlify/functions/ad-meta-tags.js
export default async (request, context) => {
  try {
    console.log("request: =--->", request);
    const url = new URL(request.url);
    console.log("request.url: =--->", request.url);
    const adId = url.pathname.split("/").pop();
    console.log("adId =========> ", adId);

    // Fetch the ad details from your backend
    const response = await fetch(
      `https://clarky.onrender.com/api/v1/ads/${adId}`
    );
    const { data: ad } = await response.json();
    console.log("response =====> ", response);
    console.log("ad data =====> ", ad);

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
      console.log("============ reatched= =========");

      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        ${metaTags}
        <title>${ad.title}</title>
        <script>
          window.location = '${url.origin}/#/ads/${adId}';
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
