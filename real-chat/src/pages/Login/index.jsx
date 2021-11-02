import React, { useEffect } from 'react';
import axios from 'axios';
import makeToast from '../../Toaster';
import { withRouter, useHistory } from 'react-router-dom';

function Login(props) {

    const history = useHistory();

    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    useEffect(() => {
        let token = localStorage.getItem('chatToken');
        if (token)
            history.push("/dashboard");
    }, [history]);


    const login = () => {
        let email = emailRef.current.value;
        let password = passwordRef.current.value;

        axios.post("http://localhost:5000/user/login", {
            email, password
        }).then((res) => {
            makeToast('success', "Logged in");
            localStorage.setItem('chatToken', res.data.token);
            localStorage.setItem('userName', res.data.user);
            history.push('/dashboard');
            props.setupSocket();
        }).catch(error => makeToast('error', "Wrong email or password"));

    };

    return (
        <div className="card">
            <div className="cardHeader">
                Login
            </div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name='email' id='email' ref={emailRef} placeholder="email" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name='password' id='password' ref={passwordRef} placeholder="password" />
                </div>
                <button onClick={login}>Login</button>
            </div>
        </div>
    );
}

export default withRouter(Login);