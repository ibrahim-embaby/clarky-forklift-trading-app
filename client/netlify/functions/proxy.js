exports.handler = async function (event, context) {
  const response = await fetch(
    "http://clarky.eu-north-1.elasticbeanstalk.com" + event.path,
    {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body,
    }
  );

  const data = await response.json();
  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};
