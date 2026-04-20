const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3008;
const phoneData = require('./data/phones.json');

app.use(express.static('public'));

app.use((req, res, next) => {
    const time = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    const log = `[${time}] ${req.method} ${req.url}\n`;
    fs.appendFileSync('access.log', log);
    next();
});

app.get('/admin', (req, res) => {
    if (req.query.code === '521') {
        res.status(200).send('Welcome to Admin (歡迎進入後台)');
    } else {
        res.status(403).send('Access Denied (暗號錯誤)');
    }
});

app.get('/product/:model.html', (req, res) => {
    const modelParam = req.params.model;
    const product = phoneData.find(item => item.model === modelParam);

    if (product) {
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${product.name}</title>
            </head>
            <body>
                <h1>${product.name}</h1>
                <p>型號: ${product.model}</p>
                <img src="/images/${product.image}" alt="${product.name}" style="width: 400px; height: 400px; object-fit: contain; display: block; margin: auto;">
                <br><br>
                <a href="/">回首頁</a>
            </body>
            </html>
        `);
    } else {
        res.status(404).send('404找不到型號');
    }
});

app.all(/.*/, (req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>404 Not Found</title>
            <style>
                body { text-align: center; padding: 50px; font-family: sans-serif; }
                h1 { color: #ff4444; }
            </style>
        </head>
        <body>
            <h1>404 Not Found (抱歉，路徑不存在)</h1>
            <a href="/">回首頁</a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});