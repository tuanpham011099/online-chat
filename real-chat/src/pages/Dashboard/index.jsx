import React, { useEffect, useState } from 'react';
import axios from 'axios';
import makeToast from '../../Toaster';
import { Link, useHistory, withRouter } from 'react-router-dom';


const Dashboard = (props) => {

    const [user, setUser] = useState();
    const [rooms, setRooms] = useState([]);
    const history = useHistory();

    const nameRef = React.createRef();

    useEffect(() => {
        let token = localStorage.getItem('chatToken');
        if (!token)
            history.push("/login");
        let temp = localStorage.getItem('userName');
        if (temp)
            setUser(temp);
    }, [history]);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getRooms = () => {
        axios.get("http://localhost:5000/chatroom", {
            headers: {
                authorization: `Bearer ${localStorage.getItem('chatToken')}`
            }
        })
            .then(res => setRooms(res.data))
            .catch(error => {
                let token = localStorage.getItem('chatToken');
                if (token) {
                    makeToast('warning', error + "\nTrying to get chat rooms again");
                    setTimeout(getRooms, 3000);
                }
            });
    };

    const createRoom = () => {
        let name = nameRef.current.value;

        axios("http://localhost:5000/chatroom", {
            headers: { authorization: `Bearer ${localStorage.getItem('chatToken')}` },
            method: "POST",
            data: {
                name
            }
        }).then((res) => {
            makeToast("success", res.data.msg);
        }).catch(error => makeToast("error", error));
    };



    useEffect(() => {
        getRooms();

    }, [getRooms]);






    const logout = () => {
        localStorage.clear();
        history.push("/login");
    };

    return (
        <div className="card">
            <div className="cardHeader">
                {user}
            </div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="chatroom">Chat room:</label>
                    <input type="text" ref={nameRef} name="chatroom" id='chatroom' placeholder="create new chatroom" />
                </div>
                <button onClick={createRoom}>Create chat room</button>
                <div className="chatrooms">
                    {
                        rooms ? rooms.map(room => (
                            <div className="chatroom" key={room._id}>
                                <div>
                                    {room.name}
                                </div>
                                <div className="join">
                                    <Link to={`/chat/${room._id}`}><button>Join</button></Link>
                                </div>
                            </div>
                        )) : ""
                    }
                </div>
                <div className="join">
                    <button onClick={logout}>Log out</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;