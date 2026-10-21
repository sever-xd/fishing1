const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const srv=http.createServer((q,r)=>{fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{r.writeHead(e?500:200,{'Content-Type':'text/html; charset=utf-8'});r.end(d||'error')})});
const wss=new WebSocketServer({server:srv,maxPayload:2048});let nid=1;
wss.on('connection',ws=>{ws.id=nid++;ws.send(JSON.stringify({t:'id',id:ws.id}));
 ws.on('message',m=>{let d;try{d=JSON.parse(m)}catch(e){return}if(d.t!='s'&&d.t!='c')return;d.id=ws.id;const out=JSON.stringify(d);
  wss.clients.forEach(c=>{if(c!==ws&&c.readyState===1)c.send(out)})});
 ws.on('close',()=>{const out=JSON.stringify({t:'l',id:ws.id});wss.clients.forEach(c=>c.readyState===1&&c.send(out))})});
srv.listen(process.env.PORT||3000,()=>console.log('Fishing server on',process.env.PORT||3000));
