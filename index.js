const http = require("http");
const url = require("url");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const paymentIntent = async (param) => {
  
  const r= await stripe.paymentIntents.create({
    amount: param.amount *100 || 404,
    currency: (param.currency && param.currency.toLowerCase()) || 'eur',
  payment_method_types: ['card'],
});
  console.log(r);
  return r;
};

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

  const parsedUrl = url.parse(request.url, true);
  response.setHeader("Content-Type", "application/json");

  switch (parsedUrl.path) {
    case "/stripe/oneoff":
      let data = null;
      const body = await getBody(request);
      try {
        data = JSON.parse(body);
      } catch (e) {
        response.statusCode = 404;
        return response.end(
          JSON.stringify({ error: true, message: "no-json", received: body })
        );
      }
      response.end(JSON.stringify(await paymentIntent(data)));
      break;
    default:
      response.statusCode = 404;
      response.end(
        JSON.stringify({ error: true, message: "404", "path": parsedUrl.path })
      );
  }
});

httpServer.listen(process.env.PORT || 8888, () => {
  console.log(`\x1b[32m%s\x1b[0m`, "server running");
});
