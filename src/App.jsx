import React, {Component} from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: ""}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      usersOn: 0
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
        
    };

    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log(event.data);

      // The socket event data is encoded as a JSON string.
      // This line turns it into an object
      switch(data.type) {
        case "incomingMessage":
        case "incomingNotification":
          // handle incoming message
          let messages = this.state.messages.concat(data);
          this.setState({
            messages: messages
          });
          break;
        case "numUsers":
          console.log(data.count);
          this.setState({
            usersOn: data.count
          })
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
      }
    };
  }

  newMessage (user, newMsg) {
    if (newMsg === null) {
      const alertMessage = {
        "type": "incomingNotification",
        "content": `${this.state.currentUser.name} has changed their name to ${user}.`
      }
      this.setState ({
        currentUser: {name:user},
      });
      this.socket.send(JSON.stringify(alertMessage));

    } else {
      if (user.length === 0) {
        user = "Anonymous";
      }
      const nextMessage = {
        username: user,
        content: newMsg,
        type:"incomingMessage"
      };
      this.socket.send(JSON.stringify(nextMessage));
    }
  }

  render() {
    return (
      <div>
        <NavBar curCount={this.state.usersOn}/>
        <MessageList msgList={this.state.messages}/>
        <ChatBar user={this.state.currentUser.name} callback={this.newMessage} />
      </div>
    );
  }
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">Chatty</a>
      <span className="navbar-usersOn">{this.props.curCount} users online</span>
    </nav>
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
  if (props.curMessage.type === "incomingMessage"){
    return (
      <div className="message">
        <span className="message-username">{props.curMessage.username}</span>
        <span className="message-content">{props.curMessage.content}</span>
      </div>
    );
  } else if (props.curMessage.type === "incomingNotification") {
    return (
      <div className="message system">{props.curMessage.content}</div>
    );
  }
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