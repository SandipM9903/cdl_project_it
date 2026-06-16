import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    
    // Saving all messages
    let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];
    let chatObj = {message: message}
    messages.push(chatObj)
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    
    // Find keyword froom users
    if(message.includes('hello')) {
    actions.handleHello();
    }

    if(message.includes('dog')) {
        actions.handleDog();
    }
    
    if(message.includes('avatar')) {
        actions.handleAvatar();
    }
    if(message.includes('anju')) {
      actions.handleAnju();
      }
    if(message.includes('harsh')) {
      actions.handleAjay();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;