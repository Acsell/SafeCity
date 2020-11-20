const { Console } = require('console');
const { read } = require('fs');
const http = require('http');
const { prependListener } = require('process');
const host = '192.168.43.115';
const port = 8000;
const { compileFunction } = require('vm');
var b = true;
const server = http.createServer();
var Left = 0;
var Right = 0;
var Up;
var Down;
var Delay = 1;
var timer = false;
var Y_L = false;
var Y_P = false;
var Key_P = false;
var Key_L = false;
var min;
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script>
      let isON = false;
      let isONR = false;
      let isONL = false;

      function buttonClick() {
            const btn = document.getElementById('btn')
            if(isON) {
                  fetch("http://192.168.43.115:8000/Right")
                  fetch("http://192.168.43.115:8000/Right")
                  fetch("http://192.168.43.115:8000/Right")
                  fetch("http://192.168.43.115:8000/Left")
                  fetch("http://192.168.43.115:8000/Left")
                  fetch("http://192.168.43.115:8000/Left")
                  isON = false
            } else {
                fetch("http://192.168.43.115:8000/red")
                  isON = true
            }

            btn.innerHTML = isON ? 'OFF' : 'ON'
        }
        function buttonClick() {
        const btn = document.getElementById('btn')
        if(isON) {
              fetch("http://192.168.43.115:8000/Right")
              fetch("http://192.168.43.115:8000/Right")
              fetch("http://192.168.43.115:8000/Right")
              fetch("http://192.168.43.115:8000/Left")
              fetch("http://192.168.43.115:8000/Left")
              fetch("http://192.168.43.115:8000/Left")
              isON = false
        } else {
            fetch("http://192.168.43.115:8000/red")
              isON = true
        }

        btn.innerHTML = isON ? 'R_L_OFF' : 'R_L_ON'
        }
        function buttonClickR() {
                const btn = document.getElementById('btnR')
                if(isON) {
                      fetch("http://192.168.43.115:8000/Right")
                      fetch("http://192.168.43.115:8000/Right")
                      fetch("http://192.168.43.115:8000/Right")
                      isON = false
                } else {
                    fetch("http://192.168.43.115:8000/redR")
                      isON = true
                }
    
                btn.innerHTML = isON ? 'R_OFF' : 'R_ON'
        }
        function buttonClickL() {
                const btn = document.getElementById('btnL')
                if(isON) {
                      fetch("http://192.168.43.115:8000/Left")
                      fetch("http://192.168.43.115:8000/Left")
                      fetch("http://192.168.43.115:8000/Left")
                      isON = false
                } else {
                    fetch("http://192.168.43.115:8000/redL")
                      isON = true
                }
    
                btn.innerHTML = isON ? 'L_OFF' : 'L_ON'
        }
    </script>
</head>

<body>
    <button id="btn" onclick="buttonClick()">R/L</button>
    <button id="btnR" onclick="buttonClickR()">R</button>
    <button id="btnL" onclick="buttonClickL()">L</button>
</body>
</html>`

server.on('request', (req, res) =>{
    //res.writeHead(200,{'Content-Type':'text/ css; charset=utf-8'});
    //console.log(req.url.endsWith('cs'));
    //Данные с камер
    if(req.url == '/Left')
    {     
          console.log('Left');
          res.writeHead(200,{'Content-Type':'text/ plain; charset=utf-8'});
          res.end('ok');
          Left ++;
          //console.log(min = new Date().getMinutes());
    }
    else if(req.url == '/Right')
    {     
          res.writeHead(200,{'Content-Type':'text/ plain; charset=utf-8'});         
          console.log('Right');
          res.end('ok');
          Right ++;
    }
    else if(req.url == '/Up')
    {
          res.writeHead(200,{'Content-Type':'text/ plain; charset=utf-8'});    
          console.log('Top');
          res.end('ok');
          Up ++;
    }
    else if(req.url == '/Down')
    {
          res.writeHead(200,{'Content-Type':'text/ plain; charset=utf-8'});
          console.log('/Down');
          res.end("ok");
          Down ++;
    }
    //Данные с камер


    //Данные с клиента
    if(req.url === '/main') {
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
      res.end(html);
    }
    if(req.url == '/on')
    {
            b = true;
            console.log('true');
            res.writeHead(200,{'Content-Type':'text/ html; charset=utf-8'});
            res.end(html);
    }
    if(req.url == '/off')
    {
            b = false;
            console.log('false');
            res.writeHead(200,{'Content-Type':'text/ html; charset=utf-8'});
            res.end(html);
    }
    if(req.url == '/red')
    {
            res.end('0');
            Y_L = false;
            Y_P = false;
            Key_L = true;
            Key_P = true;
    }
    if(req.url == '/redR')
    {
            res.end('0');
            Y_P = false;
            Key_P = true;
    }
    if(req.url == '/redL')
    {
            res.end('0');
            Y_L = false;
            Key_L = true;
    }
    //Данные с клиента


    //Запросы с светофоров
    if (b && req.url == '/P' && Key_P)
    {     
            res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
            Key_P = false;
            if(Y_P){
            res.end('1');
            Y_P = false;}
            else{
            res.end('0')
            Y_P }
            
    }
    else if (!b && req.url == '/P')
    {
            res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
            Key_P = false;
            res.end('0');
    }
    else if(req.url == '/P')
    {
            res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
            res.end('');
    }

    if (b && req.url == '/L' && Key_L)
    {
            res.writeHead(200,{'Content-Type':'text/ plain; charset=utf-8'});
            Key_L = false;
            if(Y_L){
            res.end('1'); 
            Y_L = false;}
            else{
            res.end('0');}
    }
    else if (!b && req.url == '/L')
    {
            res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
            Key_L = false;
            res.end('0')
    }
    else if (req.url == '/L')
    {
            res.writeHead(200,{'Content-Type':'text/ plain; charset=utf-8'});
            res.end("wait");
    }
    //Запросы с светофоров
    if(req.url == '/w')
    {
            let a = String(Left);
            res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
            res.end(a);
    }
    //Обработка Данных
    if(Left === MaxCar)
    {
            Left = Left - MaxCar;
            Y_L = true;
            setTimeout(() => {
                  Key_L = true;
                  console.log('OK');
            }, 5000);
    }
    if(Right === MaxCar)
    {
            Right = Right - MaxCar;
            Y_P = true
            setTimeout(() => {
                  Key_P = true;   
                  console.log('OK');
            }, 5000);
    }
    
});
server.listen(port, () => {console.log('{host}:{port}')} );