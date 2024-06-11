exports.handler = async function (event, context) {
  try {
    // Extract the path that should be forwarded to the backend
    const backendPath = event.path.replace("/.netlify/functions/proxy", "");

    // Build the complete URL for the backend request
    const backendUrl = `http://clarky.eu-north-1.elasticbeanstalk.com${backendPath}`;

    console.log("backendUrl", backendUrl);
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
    const responseCookies = response.headers.raw()["set-cookie"];
    const responseData = await response.text(); // Use text() if the response is not JSON

    // Prepare headers for the response from the Netlify function
    const responseHeaders = {
      "Content-Type": "application/json",
    };

    // Include cookies in the response headers if they exist
    if (responseCookies) {
      responseHeaders["set-cookie"] = responseCookies;
    }

    return {
      statusCode: response.status,
      headers: responseHeaders,
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
