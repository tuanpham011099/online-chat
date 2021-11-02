import React, { useEffect, useState } from 'react';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';

function Chat({ socket }) {

    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState();


    const history = useHistory();
    const messageRef = React.createRef();

    let { id } = useParams();





    const sendMessage = () => {
        if (socket && messageRef.current.value) {
            socket.emit("chatroom_message", {
                chatroomId: id,
                message: messageRef.current.value
            });
        }
    };




    useEffect(() => {

        let token = localStorage.getItem('chatToken');
        if (!token)
            history.push("/login");


        socket?.emit("joined_room", {
            chatroomId: id
        });


        return () => {
            // Execute when component unmount
            socket?.emit("leave_room", {
                chatroomId: id
            });
        };


    }, []);

    useEffect(() => {

        let token = localStorage.getItem("chatToken");

        if (token) {
            let payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }


        socket?.on("new_message", (message) => {
            const newMessage = [...messages, message];

            setMessages(newMessage);
            // thêm các tin nhắn được gửi lên vào mảng bằng spread operator
        });

    }, [messages, socket]);


    return (
        <div className="chatroomPage">
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                <div className="chatroomContent" >
                    {messages?.map((message, index) => (
                        <div key={index} className="message">
                            <span className={userId === message.userId ? "ownMessage" : "otherMessage"}>
                                {message.name}:
                            </span>{" "}
                            {message.message}
                        </div>
                    ))}
                    {/* {messages} */}
                    {/* <div className="message">
                        <span className="otherMessage">
                            vcbcvb
                        </span>
                        :
                        <span>
                            asdas
                        </span>
                    </div>
                    <div className="message">
                        <span className="ownMessage">
                            asdasd
                        </span>asdasd
                    </div> */}
                </div>
                <div className="chatroomActions">
                    <div>
                        <input
                            type="text"
                            name="message"
                            placeholder="Say something!"
                            ref={messageRef}
                        />
                    </div>
                    <div>
                        <button className="join" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Chat);