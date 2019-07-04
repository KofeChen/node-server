var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

var routes = {
    '/login': function(req, res){
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.writeHead(200, 'OK')
        res.write('<html><head><meta charset="gdk"></head>')
        res.write('<body><h1>Login</h1><form method="GET"><input type="text" value="username">')
        res.write('</br></br><input type="text" value="password"></br></br><input type="submit">')
        res.write('</form></body></html>')
        res.end()
    },
    '/register': function(req, res){
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.writeHead(200, 'OK')
        res.write('<html><head><meta charset="gdk"></head>')
        res.write('<body><h1>Register</h1><form method="GET"><input type="text" value="username">')
        res.write('</br></br><input type="text" value="password"></br></br><input type="text" value="password again">')
        res.write('</br></br><input type="submit"></form></body></html>')
        res.end()
    },
    '/info': function(req, res){
        res.end('Information')
    }
}

var server = http.createServer(function(req, res){
    routePath(req, res)
})

server.listen(8080)
console.log('visit http://localhost:8080')

function routePath(req, res){
    var pathObj = url.parse(req.url, true) //解析url
    var handleFn = routes[pathObj.pathname] //获取指定路由
    if(handleFn){
        req.query = pathObj.query
        var body = ''
        req.on('data', function(chunk){
            body += chunk
        }).on('end', function(){
            req.body = parseBody(body)
            handleFn(req, res)
        })
    }else{
        staticRoot(path.resolve(__dirname, 'sample'), req, res)
    }
}

function staticRoot(staticPath, req, res){
    var pathObj = url.parse(req.url, true)
    
    if (pathObj.pathname === '/'){
        pathObj.pathname += 'nodejs.html'
    }

    var filePath = path.join(staticPath, pathObj.pathname)
    
    fs.readFile(filePath, 'binary', function(err, content){
        if(err){
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.writeHead(404, 'Not Found')
            res.write('<h1>404 Not Found</h1>')
            return res.end()
        }

        res.writeHead(200, 'OK')
        res.write(content, 'binary')
        res.end()
    })
}

function parseBody(body){
    console.log(body)
    var obj = {}
    body.split('&').forEach(function(str){
        obj[str.split('=')[0]] = str.split('=')[1]
    })
    return obj
}