import { Server } from 'socket.io'
import axios from 'axios';
import { CRYPTO_API_CALL_PERIOD, CRYPTO_API_TOKEN_COUNT } from '../../utils/constants';

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
                let response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${CRYPTO_API_TOKEN_COUNT}`, {
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

const refreshCurrencyListLatest = (io) => {
    COINMARKETCAP_API.cryptocurrencyListingsLatest().then((res) => {
        const ret = []
        res.data?.map(item => {
            ret.push({
                id: item.id,
                name: item.name,
                symbol: item.symbol,
                price: item.quote.USD.price.toFixed(2),
                volume: item.quote.USD.volume_24h.toFixed(0),
                market_cap: item.quote.USD.market_cap.toFixed(0)
            })
        })
        io.emit('refresh', ret);
    }).catch(console.log);
}

const ioHandler = (req, res) => {
    // socketio api ...
    if (!res.socket.server.io) {
        // socket.io initialized...
        const io = new Server(res.socket.server)

        setInterval(() => {
            io.emit('broadcast', (Math.random() * 1000000).toFixed(0).toString());
            refreshCurrencyListLatest(io);
        }, CRYPTO_API_CALL_PERIOD)

        io.on('connection', socket => {
            socket.on('fetch', () => {
                refreshCurrencyListLatest(io);
            })
        });
        res.socket.server.io = io
    } else {
        // socket.io already running
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler
