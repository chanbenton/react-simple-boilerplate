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

  }

  render() {
    return (<div>
      <MessageList msgList={this.state.messages} />
      <ChatBar user={this.state.currentUser.name} />
      </div>
    );
  }
}

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    };

  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.state.user}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curMsg: props.curMessage
    };

  }

  render() {
    return (
      <div className="message">
        <span className="message-username">{this.state.curMsg.username}</span>
        <span className="message-content">{this.state.curMsg.content}</span>
      </div>
    );
  }
  // return <h1>Hello, {props.name}</h1>;
}

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgArray: props.msgList
    };


  }

  render() {
    const msgBlock = this.state.msgArray.map((Msg) =>
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
}



// export default App;

/*
function Header(props) {
  return (
    <div className="header">
      <h1>{props.title}</h1>
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
};

var Counter = React.createClass({
  propTypes: {},

  },

  render: function() {
    return (
      <div className="counter">
        <button className="counter-action decrement"> - </button>
        <div className="counter-score"> {this.state.score} </div>
        <button className="counter-action increment"> + </button>
      </div>
    );
  }
});


function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        {props.name}
      </div>
      <div className="player-score">
        <Counter />
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
};

function Application(props) {
  return (
    <div className="scoreboard">
      <Header title={props.title} />

      <div className="players">
        {props.players.map(function(player) {
          return <Player name={player.name} score={player.score} key={player.id} />
        })}
      </div>
    </div>
  );
}

Application.propTypes = {
  title: React.PropTypes.string,
  players: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    id: React.PropTypes.number.isRequired,
  })).isRequired,
};

Application.defaultProps = {
  title: "Scoreboard",
}
*/