const fs = require('fs');

const http = require('http');
const { json } = require('stream/consumers');
const url = require ('url');

//Blocking, Synchronous way

// const textIn = fs.readFileSync('./txt/input.txt' , 'utf-8');
// console.log(textIn);

// const textOut = `This is all we know about avacado: ${textIn}. \n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written');

//Non-Blocking, Asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err , data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8' , (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n ${data3}`, 'utf-8', err => {
//                 console.log("file updated");
//             });
//         });
//     });
// });
// console.log("hello");

//////////////////////////////////////////
// Server
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
   
    if(!product.oraganic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
    
    
    
const server = http.createServer((req,res) => {
    const pathName = req.url;

//Overview-page
if( pathName ==='/' ||  pathName === '/overview') {
    res.writeHead(200, {'Content-type': 'text/html'});
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
   const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardsHtml);
   res.end(output);

    res.end(tempOverview);

//Product-page    
}else if (pathName === '/product'){
    res.end('This is PRODUCT');

//API
} else if (pathName === '/api'){
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(data);

//Error
}else {
    res.writeHead(404, {
        'content-type': 'text/html',
        'my-own-header': 'hello-world'
    });
    res.end("page not found!")
}
   

});

server.listen(8000, 'localhost', ()=> {
    console.log("Server started at port 8000");
});