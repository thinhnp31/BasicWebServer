"use strict";

//Include neccessary modules
const http = require("http");
const fs = require("fs");
const url = require("url");
var hljs = require('highlight.js');

//Listen port
const port = 3000;

const server = http.createServer();

let handleGETRequest = function(res, url_parsed) {
    let path = url_parsed.path;
    if (path === "/") {
        res.writeHead(200,{"Content-Type": "text/html"});
        fs.readdir(".", function (err, fileList) {
            fileList.forEach(function(element) {
                res.write("<a href = '/" + element + "'>" + element + "</a><br>");
            });
            res.end();
        });
    } else {
        //let extension = path.split('.').pop();
        let filePath = "." + path;
        fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
            res.writeHead(200,{"Content-Type": "text/html"});
            let highlighted_data = hljs.highlight('javascript',data);
            let head = "<link rel=\"stylesheet\" href=\"node_modules/highlight.js/styles/default.css\">\n" +
                "<script>hljs.initHighlightingOnLoad();</script>";
            highlighted_data.value = head + highlighted_data.value;
            highlighted_data.value = "<pre><code class=\"html\">" + highlighted_data.value + "</code></pre>";
            res.write(highlighted_data.value);
            console.log(highlighted_data);
            res.end();
        })
    }
};

//Process the request
server.on("request", function(req, res) {
    let url_parsed = url.parse(req.url, true);
    console.log(url_parsed);
    if (req.method === 'GET') {
        if (url_parsed.path === "/favicon.ico") {
            res.writeHead(204);
        } else {
            handleGETRequest(res, url_parsed);
        }
    }
});

//Start the server
server.listen(port);
console.log("Server is running at http://127.0.0.1:" + port);