import { Server } from 'socket.io'
import axios from 'axios';

const COINMARKETCAP_API = {
    cryptocurrencyCategories: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories', {
                    headers: {
                        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
                    },
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        })
    },
    cryptocurrencyListingsLatest: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const limit = 10;
                let response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${10}`, {
                    headers: {
                        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
                    },
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        })
    },
}

const ioHandler = (req, res) => {
    console.log("socketio api ...");
    if (!res.socket.server.io) {
        console.log('socket.io initialized...')
        const io = new Server(res.socket.server)

        // setInterval(() => {
        //     io.emit('broadcast', Math.random().toString());
        // }, 1000)

        io.on('connection', socket => {
            // socket.broadcast.emit('a user connected')
            // socket.emit('request', /* … */); // emit an event to the socket
            // io.emit('broadcast', /* … */); // emit an event to all connected sockets
            // socket.on('reply', () => { /* … */ }); // listen to the event

            // socket.on('hello', msg => {
            //     socket.emit('hello', 'world!')
            // })
            // socket.on('event', data => { /* … */ });
            // socket.on('disconnect', () => { /* … */ });

            socket.on('fetch', () => {
                console.log("fetching...");
                // COINMARKETCAP_API.cryptocurrencyCategories().then((res) => {
                //     console.log(res)
                // }).catch(console.log);
                COINMARKETCAP_API.cryptocurrencyListingsLatest().then((res) => {
                    socket.emit('refresh', res);
                }).catch(console.log);
            })
        });
        res.socket.server.io = io
    } else {
        console.log('socket.io already running')
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler
