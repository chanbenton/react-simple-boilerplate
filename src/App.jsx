import React, {Component} from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
          id: 1
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good.",
          id: 2
        }
      ]
    };
  this.newMessage = this.newMessage.bind(this);
  }
  newMessage (user, newMsg) {
    const nextMessage = {id: this.state.messages.length+1, username: user, content: newMsg};
    const messages = this.state.messages.concat(nextMessage);
    this.setState({
      messages: messages
    });
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
  this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(event) {
    this.props.callback(this.state.user, this.state.msg);
    event.preventDefault();
  }

  render() {
    return (
      <footer>
      <form onSubmit={this.handleSubmit} className="chatbar">
          <input name="txtUser" className="chatbar-username" placeholder="Your Name (Optional)" value={this.state.user} onChange={this.handleChange}/>
          <input name="txtMsg" className="chatbar-message" placeholder="Type a message and hit ENTER" value={this.state.msg} onChange={this.handleChange}/>
          <input type="submit" value="Submit" />
        </form>

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


  // <div className="message system">
  //   Anonymous1 changed their name to nomnom.
  // </div>