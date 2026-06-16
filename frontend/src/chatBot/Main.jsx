import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './Main.css';
import config from './Components/config';
import MessageParser from './Components/MessageParser';
import ActionProvider from './Components/ActionProvider';
import { useState } from 'react';
import chatboat_icon1 from './chatboat_icon1.png'

const Main = () => {

  // const [showBot, toggleBot] = useState(false);
  const [showBot, setBot] = useState(false);
  function handleBot() {
    const botState = !showBot;
    setBot(botState);
  }

  return (
    <div className="App">
      {showBot && (
        <Chatbot 
        config={config}
        actionProvider={ActionProvider}
        messageParser={MessageParser}
        disableScrollToBottom
        headerText='Talk to CDL'
        placeholderText='Write your message here.'
        />
      )}
      <button className="app-chatbot-button" onClick={handleBot}>
        <img src={chatboat_icon1} className="botIcon"/>
     </button>

     {/* <button onClick={() => toggleBot((prev) => !prev)}>Bot</button> */}
    </div>
  );
}

export default Main;
