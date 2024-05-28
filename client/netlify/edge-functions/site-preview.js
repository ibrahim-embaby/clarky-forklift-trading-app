// netlify/functions/ad-meta-tags.js
export default async (request, context) => {
  try {
    const responsepage = await context.next();
    const page = await responsepage.text();

    const updatedPage = page
      .replace("__META_TITLE__", "Clarky | كلاركي")
      .replace("__META_DESCRIPTION__", "Forklift Trading Platform")
      .replace(
        "__META_IMAGE__",
        `${new URL(request.url).origin}/images/logo-q.png`
      );

    return new Response(updatedPage, responsepage);
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
