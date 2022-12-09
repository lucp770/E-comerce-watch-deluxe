const http = require('http');

const server = http.createServer((request,response)=>{
    response.writeHead({
        'content-type': 'text/plain',
    })

    response.write('<h1>Home Page </h1>');
    response.end();
})

server.listen(8000);
