import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
 
    const handleHello = () => {
        const botMessage = createChatBotMessage('Hello, Nice to meet you.');

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };
    const handleAjay = () => {
        const botMessage = createChatBotMessage('Hello Harsh Sir, Nice to meet you. How Can I help you?');

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };
    const handleAnju = () => {
        const botMessage = createChatBotMessage('Hello Anjuman Mam, Nice to meet you. How Can I help you?');

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    const handleDog = () => {
        const botMessage = createChatBotMessage(
            "Here's a nice dog picture for you!",
            {
                widget: 'dogPicture',
            }
        );

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    }

    const handleAvatar = () => {
        const botMessage = createChatBotMessage(
            "Here's a nice Avatar for you!",
            {
                widget: 'Avatar',
            }
        );

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    }

    return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleDog,
            handleAvatar,
            handleAjay,
            handleAnju,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;