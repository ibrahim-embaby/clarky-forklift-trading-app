exports.handler = async function (event, context) {
  try {
    // Extract the path that should be forwarded to the backend
    const backendPath = event.rawUrl.replace(
      "https://clarky-eg.netlify.app/.netlify/functions/proxy",
      ""
    );
    console.log("event === ", event);
    // Build the complete URL for the backend request
    const backendUrl = `http://clarky.eu-north-1.elasticbeanstalk.com${backendPath}`;

    // Log the constructed backend URL for debugging
    console.log("Backend URL:", backendUrl);

    // Prepare headers for the request to the backend
    const headers = {
      ...event.headers,
      host: "clarky.eu-north-1.elasticbeanstalk.com",
    };

    // Include cookies in the request headers if they exist
    if (event.headers.cookie) {
      headers["cookie"] = event.headers.cookie;
    }

    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers,
      body: event.httpMethod !== "GET" ? event.body : null,
    });

    // Extract cookies from the backend response
    const responseHeaders = Object.fromEntries(response.headers.entries());
    const responseCookies = responseHeaders["set-cookie"] || [];

    // Prepare headers for the response from the Netlify function
    const netlifyResponseHeaders = {
      "Content-Type": "application/json",
    };

    // Include cookies in the response headers if they exist
    if (responseCookies.length > 0) {
      netlifyResponseHeaders["Set-Cookie"] = responseCookies;
    }

    // Extract the response data
    const responseData = await response.text(); // Use text() if the response is not JSON

    return {
      statusCode: response.status,
      headers: netlifyResponseHeaders,
      body: responseData,
    };
  } catch (error) {
    console.error("Error in proxy function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
