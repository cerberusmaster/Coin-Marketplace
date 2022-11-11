import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default () => {
    const [text, setText] = useState('Socket IO response...');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetch('/api/socketio').finally(() => {
            const socket = io();
            setSocket(socket);

            socket.on('connect', () => {
                console.log('connect')
                socket.emit('hello')
            })

            socket.on('hello', data => {
                console.log('hello', data)
            })

            socket.on('a user connected', () => {
                console.log('a user connected')
            })

            socket.on('disconnect', () => {
                console.log('disconnect')
            })

            socket.on('broadcast', msg => {
                setText(msg);
            })

            socket.on('refresh', (res) => {
                console.log(res)
            });
        })
    }, []) // Added [] as useEffect filter so it will be executed only once, when component is mounted

    return (
        <div className='text-center'>
            <button
                className='
                    flex justify-center
                    p-2 rounded-md w-1/2 self-center
                    bg-blue-900  text-white 
                    hover:bg-blue-800 m-auto'
                onClick={() => { socket?.emit('fetch'); }}>click!</button>
            <h1>{text}</h1>
            <table>
                <thead>
                    <th>
                        <td>#</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Market Cap</td>
                        <td>Volume</td>
                    </th>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
