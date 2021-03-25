const http = require("http");
const url = require("url");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET);
const allowed_origins = new Set(process.env.PROCA_DONATE_CORS_DOMAINS.split(';').filter(x => x !== ''));

// log(`CORS DOMAINS ${allowed_origins.keys()}`);
// log(`allowed_origins ${allowed_origins.has("http")}`);

const log = (request, msg, ...args) => {
  console.log(`[proca-donate] [${new Date().toUTCString()}] [${request.url}] ${msg}`, ...args);
}

const paymentIntent = async (request, param) => {
  // TODO: reject if actionPage missing?
  param.meta = {
    actionPage: param.actionPage || "?",
    referer: request.headers.referer
  };
  const r = await stripe.paymentIntents.create({
    amount: param.amount * 100,
    currency: (param.currency && param.currency.toLowerCase()) || 'eur',
    payment_method_types: param.payment_method_types || ['card'],
  });

  log(request, `stripe response`, r);

  if (r.client_secret)
    return { "secret": r.client_secret };
  return {};
};

const checkOrigin = (request) => {
  let origin = request.headers['origin'];

  return allowed_origins.has(origin);
}
const corsResponse = (request, response) => {

  if (!checkOrigin(request)) {
    response.statusCode = 401;
    return response.end();
  }

  response.statusCode = 204;

  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "*");
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Max_age", "86400");
  response.setHeader("Vary", "Origin");

  return response.end();
}

const httpServer = http.createServer(async (request, response) => {

  const getBody = async (req) => {
    return new Promise((resolve, reject) => {
      try {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); // convert Buffer to string
        });

        req.on("end", () => {
          //resolve(parse(body));
          resolve(body);
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  switch (request.method) {
    case "GET":
      response.statusCode = 500;
      response.end(
        JSON.stringify({ error: true, message: "no-get" })
      );
      break;
    case "OPTIONS":
      corsResponse(request, response);
      break;
    default:
      break; // empty blocks hurt my eyes. =)
  }

  // any other request.method is treated as a request to process ?
  if (request.method !== "POST") {
    response.statusCode = 400;
    log(request, `oops, method is ${request.method}`);
    response.end(JSON.stringify({ error: true, message: "Please use POST." }))
    return;
  }
  const parsedUrl = new URL(request.url, `http://${request.headers.host}`);

  // the browser should never let this happen, but hey
  if (!checkOrigin(request)) {
    response.statusCode = 401;
    return response.end();
  }

  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", request.headers['origin']);

  if (parsedUrl.pathname === "/stripe/oneoff") {
    let data = null;
    const body = await getBody(request);

    try {

      to_charge = JSON.parse(body);
      // TODO: validation
      // NOTE: Stripe returns a payment intent without valid parameters, what's going on there?
      return response.end(JSON.stringify(await paymentIntent(request, to_charge)));

    } catch (e) {

      if (e instanceof SyntaxError) {
        response.statusCode = 400;
        return response.end(
          JSON.stringify({ error: true, message: "no-json", received: body })
        );
      }

      log(request, `Exception ${e} ${e.stack}`);

      response.statusCode = 500;
      return response.end();
    }
  }

  response.statusCode = 404;
  response.end(
    JSON.stringify({ error: true, message: "404", "path": parsedUrl.path })
  );

});


const port = process.env.PROCA_DONATE_PORT || 8888;
httpServer.listen(port, () => {
  console.log(`[proca-donate] Listening on ${port}`);
});
