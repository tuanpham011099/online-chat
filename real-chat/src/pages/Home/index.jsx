import React, { useEffect } from 'react';

function Home(props) {

    useEffect(() => {
        let token = localStorage.getItem('chatToken');
        if (!token)
            props.history.push('/login');
        else
            props.history.push('/dashboard');
    }, [props.history]);


    return (
        <div>
            Home
        </div>
    );
}

export default Home;