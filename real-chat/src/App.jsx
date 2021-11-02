import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Register from './pages/Register';
import io from 'socket.io-client';
import makeToast from './Toaster';

function App(props) {

    const [socket, setSocket] = useState(null);

    const setupSocket = () => {
        let token = localStorage.getItem("chatToken");
        if (token && !socket) {

            let newSocket = io('http://localhost:5000', {
                query: {
                    token
                },
                withCredentials: true,
                extraHeaders: {
                    "Access-Control-Allow-Origin": "http://localhost:5000"
                }
            });

            //     console.log(newSocket);
            newSocket.on("disconnect", () => {
                setSocket(null);
                // eslint-disable-next-line
                setTimeout(setupSocket, 3000);
                makeToast("error", "Socket disconnected");
            });

            newSocket.on("connect", () => {
                makeToast("success", "Socket connected");
            });

            setSocket(newSocket);

        }
    };

    useEffect(() => {
        setupSocket();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);



    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route
                    path='/login'
                    render={() => <Login setupSocket={setupSocket} />}
                    exact />
                <Route
                    path='/register'
                    component={Register}
                    exact />
                <Route
                    path='/dashboard'
                    render={() => <Dashboard socket={socket} />}
                    exact />
                <Route
                    path='/chat/:id'
                    render={() => <Chat socket={socket} />}
                    exact />
            </Switch>
        </BrowserRouter>
    );
}

export default App;