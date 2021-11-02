import React from 'react';
import axios from 'axios';
import makeToast from '../../Toaster';


function Register(props) {

    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const re_passRef = React.createRef();

    const register = () => {
        let name = nameRef.current.value;
        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        let re_pass = re_passRef.current.value;

        if (password !== re_pass)
            return makeToast('warning', "Password must match");

        axios.post('http://localhost:5000/user/register', {
            name, email, password
        })
            .then(res => { makeToast('success', res.data.msg); props.history.push("/login"); })
            .catch(error => makeToast("error", error.message));


    };


    return (
        <div className="card">
            <div className="cardHeader">
                Registration:
            </div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name='email' id='email' placeholder="email" ref={emailRef} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name='password' id='password' ref={passwordRef} placeholder="password" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password again:</label>
                    <input type="password" name='re_password' id='re_password' ref={re_passRef} placeholder="password once again" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Your name:</label>
                    <input type="text" name='name' id='name' ref={nameRef} placeholder="Your name" />
                </div>
                <button onClick={register}>Register</button>
            </div>
        </div>
    );
}

export default Register;