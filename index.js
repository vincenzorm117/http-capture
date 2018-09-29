

const express = require('express')
const app = express()
const fs = require('fs')



app.use((req, res, next) => {
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {  req.rawBody += chunk; });
    req.on('end', () => { next(); });
});


app.all('*', async (req, res) => {
    var d = new Date(),
		year = d.getFullYear(),
		month = d.getMonth(),
        date = d.getDate();
        hour = d.getHours();
        minutes = d.getMinutes();
        seconds = d.getSeconds();
    if( month < 10 ) month = '0' + month;
    if( date < 10 ) date = '0' + date;

    let folderName = `${year}_${month}_${date}_${hour}_${minutes}_${seconds}`;
    let params_filename = `${folderName}/params.json`;
    let body_filename = `${folderName}/body.txt`;
    let headers_filename = `${folderName}/headers.json`;
    let other_filename = `${folderName}/other.json`;

    if( !fs.existsSync(`./payloads/${folderName}`) ) {
        fs.mkdirSync(`./payloads/${folderName}`);
    }

    let promises = [];

    promises.push(new Promise((resolve,reject) => {
        fs.writeFile(`./payloads/${body_filename}`, req.rawBody, (err) => {
            if( err ) reject(err);
            return resolve();
        });
    }));

    promises.push(new Promise((resolve,reject) => {
        let headers = JSON.stringify(req.headers);
        fs.writeFile(`./payloads/${headers_filename}`, headers, (err) => {
            if( err ) reject(err);
            return resolve();
        });
    }));

    promises.push(new Promise((resolve,reject) => {
        let obj = {
            method: req.method,
            protocol: req.protocol,
            host: req.host,
            hostname: req.hostname,
            path: req.path,
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl,
            url: req.url,
            ip: req.ip,
            ips: req.ips,
            httpVersion: req.httpVersion,
            query: req.query,
            params: req.params
        };
        fs.writeFile(`./payloads/${other_filename}`, JSON.stringify(obj), (err) => {
            if( err ) reject(err);
            return resolve();
        });
    }));

    Promise.all(promises)
        .then(() => {
            return res.status(200).send();
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ message: "Server error contact Admin." })
        })
});



app.listen(3000, () => console.log('Gator app listening on port 3000!'));
