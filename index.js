const http = require('http');
const url = require('url');
require('dotenv').config();

const stripe = require('stripe')('sk_test_...');

const createSecret = (param) => {
  return {a:"aaa"};
}

const httpServer = http.createServer(async (request, response) => {


const getBody = async req => {
    return new Promise((resolve, reject) => {
       try {
           let body = '';
           req.on('data', chunk => {
               body += chunk.toString(); // convert Buffer to string
           });

           req.on('end', () => {
               //resolve(parse(body));
               resolve(body);
           });
       }
       catch (e) {
           reject(e);
       }
    });
}

  const parsedUrl = url.parse(request.url, true);
  response.setHeader('Content-Type', "application/json");
  response.writeHead(200);

  switch (parsedUrl.path) {
    case '/stripe/oneoff':
       const body = await getBody(request);
       let data = null;
      try {
        data=JSON.parse(body);  
      } catch (e) {
        return response.end(JSON.stringify({error:true,message:"no-json",received:body}));
      }
      console.log(data);

       response.end(JSON.stringify(createSecret(data)));
      break;
    default:
      response.writeHead(404);
      response.end('404 - File Not Found');
  }
  console.log(parsedUrl);

});


httpServer.listen(process.env.PORT || 8888, () => {
    console.log(`\x1b[32m%s\x1b[0m`, "server running");
  });


