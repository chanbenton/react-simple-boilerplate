import React, {Component} from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: ""}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  this.newMessage = this.newMessage.bind(this);
  }

  componentDidMount() {
     // Let us open a web socket
     const ws = new WebSocket("ws://localhost:3001/");

     this.socket = ws;

     ws.onopen = function()
     {
        // Web Socket is connected, send data using send()
        // ws.send("Message to send");
        // alert("Message is sent...");
     };

     ws.onmessage = event => {
        console.log(event.data);
        const messages = this.state.messages.concat(JSON.parse(event.data));
        this.setState({
          messages: messages
        });
     };

 // ws.onclose = function()
 // {
 //    // websocket is closed.
 //    alert("Connection is closed...");
 // };
  }

  newMessage (user, newMsg) {
    if (newMsg === null) {
      this.setState ({
        currentUser:user
      });
    } else {
    const nextMessage = {username: user, content: newMsg};
    this.socket.send(JSON.stringify(nextMessage));
    }
  }


  render() {
    return (<div>
      <MessageList msgList={this.state.messages}/>
      <ChatBar user={this.state.currentUser.name} callback={this.newMessage} />
      </div>
    );
  }
}

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      msg: "",
    };
  this.handleChange = this.handleChange.bind(this);
  this.handleMsgSubmit = this.handleMsgSubmit.bind(this);
  this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    if (name === "txtUser") {
      this.setState ({
        user:target.value
      });
    } else {
      this.setState ({
        msg:target.value
      });
    }
  }

  handleNameSubmit(event) {
    if (event.key === 'Enter') {
      this.props.callback(this.state.user, null);
      event.preventDefault();
    }
  }

  handleMsgSubmit(event) {
    if (event.key === 'Enter') {
      this.props.callback(this.state.user, this.state.msg);
      event.preventDefault();
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input onKeyUp={this.handleNameSubmit} className="chatbar-username" name="txtUser" placeholder="Your Name (Optional)" value={this.state.user} onChange={this.handleChange}/>
        <input onKeyUp={this.handleMsgSubmit} className="chatbar-message" name="txtMsg" placeholder="Type a message and hit ENTER" value={this.state.msg} onChange={this.handleChange}/>
      </footer>
    );
  }
}

const Message = (props) => {
  return (
    <div className="message">
      <span className="message-username">{props.curMessage.username}</span>
      <span className="message-content">{props.curMessage.content}</span>
    </div>
  );
}

const MessageList = (props) => {
  const msgBlock = props.msgList.map((Msg) =>
    <Message curMessage={Msg} key={Msg.id}/>
  );
  return (
    <main className="messages">
      {msgBlock}
    </main>
  );
}