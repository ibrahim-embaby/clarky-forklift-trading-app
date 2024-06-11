exports.handler = async function (event, context) {
  console.log("event ", event);

  const response = await fetch(
    "http://clarky.eu-north-1.elasticbeanstalk.com" + event.path,
    {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body,
    }
  );
  console.log("response ", response);

  const data = await response.json();
  console.log("data ", data);

  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};
