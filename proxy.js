var http = require('http'),
    querystring = require('querystring'),
    express = require('express'),
    url = require('url'),
    httpProxy = require('http-proxy'),
    transformerProxy = require('transformer-proxy'),
    util = require('util');

var bin2String = function(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
}

var transformerFunction = function (data, req, res) {
    return data;
}

var app = express();

var proxy = httpProxy.createProxyServer({ });
proxy.on('error', function (err, req, res) {
    res.writeHead(500);
    res.end();
});
 
app.use(transformerProxy(transformerFunction));

app.use(function (req, res, next) {
    console.log("From proxy - MD 1 :: URL : " + req.url);
    console.log("From proxy - MD 1 :: query : " + req.query.u);

    var forward_url = req.query.u;
    var url_obj = url.parse(forward_url);
    console.log("From proxy - MD 1 :" + util.inspect(url_obj));

    req.url = url_obj.path;
    req.forwarUrl = url_obj.protocol + '//' + url_obj.host;
    next();
});

app.use(function (req, res, next) {
    console.log("From proxy - MD 2 :: URL : " + req.url);
    console.log("From proxy - MD 2 :: forward url : " + req.forwarUrl);
    proxy.web(req, res, {
        target: req.forwarUrl
    });
});

http.createServer(app).listen(8000);

/*
http.createServer(function (request, response) {
    console.log(request.url);
    response.write('Hello');
    response.end();
}).listen(8123);
*/
