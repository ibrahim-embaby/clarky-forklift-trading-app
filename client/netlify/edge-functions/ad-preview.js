// netlify/functions/ad-meta-tags.js

export default async (request, context) => {
  try {
    console.log("request: =--->", request);
    const url = new URL(request.rawUrl);
    console.log("request.rawUrl: =--->", request.rawUrl);
    const adId = url.pathname.split("/").pop();
    console.log("adId =========> ", adId);

    // Fetch the ad details from your backend
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/v1/ads/${adId}`
    );
    const ad = await response.json();

    if (response.ok && ad) {
      const metaTags = `
      <meta property="og:title" content="${ad.title}" />
      <meta property="og:description" content="${ad.description}" />
      <meta property="og:image" content="${ad.photos[0]}" />
      <meta property="og:url" content="${request.rawUrl}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${ad.title}" />
      <meta name="twitter:description" content="${ad.description}" />
      <meta name="twitter:image" content="${ad.photos[0]}" />
    `;

      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `
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
      `,
      };
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
