
var PORT = process.env.PORT || 3000

const net = require('net')
const fs = require('fs')

if( !fs.existsSync('./payloads') ) {
    fs.mkdirSync('./payloads');
}

var server = net.createServer((sock) => {
    console.log(`Connected: ${sock.remoteAddress}`)
    let filename = FileName(sock);
    let wstream = fs.createWriteStream(`./payloads/${filename}`);


    sock.on('data', wstream.write.bind(wstream));
    sock.on('end', () => {
        wstream.end();
        delete wstream;
        console.log(`Disconnected: ${sock.remoteAddress}`)
    });
    
    setTimeout(() => {
        if( !sock.destroyed ) {
            sock.write('HTTP/1.1 200 OK\r\n');
            sock.end();
        }
    }, 3000);
});

server.listen(PORT, 'localhost');



function FileName() {
    var d = new Date(),
		year = d.getFullYear(),
		month = d.getMonth(),
        date = d.getDate();
        hour = d.getHours();
        minutes = d.getMinutes();
        seconds = d.getSeconds();
    if( month < 10 ) month = '0' + month;
    if( date < 10 ) date = '0' + date;
    if( hour < 10 ) hour = '0' + hour;
    if( minutes < 10 ) minutes = '0' + minutes;
    if( seconds < 10 ) seconds = '0' + seconds;
    return `request__${year}-${month}-${date}__${hour}-${minutes}-${seconds}.http`;
}