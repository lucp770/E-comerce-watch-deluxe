const express = require('express');
const app = express()
const path = require('path');

var port = 5000;

// let vartype = express.static(path.join(__dirname,'./styles'));
// app.use(express.static(path.join(__dirname,'/styles')));
app.use(express.static('./public'));

// app.get('/', (req,res) =>{
// 	console.log(path.join(__dirname,'/styles'));
// 	res.sendFile(path.join(__dirname, 'index.html'));
// })
app.listen(port, ()=>{
	console.log('server online on http://localhost:%s',port);

})