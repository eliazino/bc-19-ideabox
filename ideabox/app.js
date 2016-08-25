var sys = require("util"),
my_http = require("http");
my_http.createServer(function(request,response){
  console.log("I got kicked");
  response.writeHeader(200, {"Content-Type": "text/plain"});
  response.write("this is a test");
  response.end();
}).listen(8080);
console.log("Server Running on 8080");
