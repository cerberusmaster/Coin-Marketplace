import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client'
import Layout from '../components/Layout';

export default function Ranking() {
    const [text, setText] = useState('Socket IO response...');
    const [socket, setSocket] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/socketio').finally(() => {
            const socket = io();
            setSocket(socket);

            socket.on('connect', () => {
                socket.emit('hello')
            })

            socket.on('broadcast', msg => {
                setText(msg);
            })

            socket.on('refresh', (res) => {
                setData(res);
            });
        })
    }, [])

    return (
        <Layout>
            <div className='text-center content-center'>
                <h1 className='m-8'>Crypto Currency Updates ({text})</h1>
                <table className='divide-y divide-gray-200 m-auto text-center w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th scope='col' className="px-6 py-3 text-xs font-bold text-gray-500 uppercase ">#</th>
                            <th scope='col' className="px-6 py-3 text-xs font-bold text-gray-500 uppercase ">Name</th>
                            <th scope='col' className="px-6 py-3 text-xs font-bold text-gray-500 uppercase ">Symbol</th>
                            <th scope='col' className="px-6 py-3 text-xs font-bold text-gray-500 uppercase ">Price</th>
                            <th scope='col' className="px-6 py-3 text-xs font-bold text-gray-500 uppercase ">Volume</th>
                            <th scope='col' className="px-6 py-3 text-xs font-bold text-gray-500 uppercase ">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, key) => {
                                return (
                                    <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.symbol}</td>
                                        <td>{item.price}</td>
                                        <td>{item.volume}</td>
                                        <td>{item.market_cap}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <button class="h-10 px-6 font-semibold rounded-md text-white bg-blue-900 
                        hover:bg-blue-800 m-8"
                    type="submit"
                    onClick={() => { socket?.emit('fetch'); }}>
                    refresh
                </button>
            </div>
        </Layout>
    )
}
