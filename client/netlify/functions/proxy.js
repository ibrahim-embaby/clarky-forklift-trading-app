exports.handler = async function (event, context) {
  try {
    // Extract the path that should be forwarded to the backend
    const backendPath = event.path.replace("/.netlify/functions/proxy", "");

    // Build the complete URL for the backend request
    const backendUrl = `http://clarky.eu-north-1.elasticbeanstalk.com${backendPath}`;

    // Log the constructed backend URL for debugging
    console.log("Backend URL:", backendUrl);

    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        host: "clarky.eu-north-1.elasticbeanstalk.com",
      },
      body: event.httpMethod !== "GET" ? event.body : null,
    });

    console.log("response", response);

    const responseData = await response.text(); // Use text() if the response is not JSON
    console.log("responseData", responseData);

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
      },
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
