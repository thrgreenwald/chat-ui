import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Message, Conversation } from './types';
import ConversationArea from './components/ConversationArea';
import InputArea from './components/InputArea';
import SideMenu from './components/SideMenu';

const ChatApp: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load conversations from the server when the component mounts
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/load_conversations');
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };
    loadConversations();
  }, []);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);

    // Update conversations state to include the new message
    if (currentConversationId === null) {
      const newConversationId = Date.now();
      setCurrentConversationId(newConversationId);
      setConversations([...conversations, {
        id: newConversationId,
        title: `Conversation ${conversations.length + 1}`,
        messages: [newMessage],
      }]);
    } else {
      const updatedConversations = conversations.map(conv =>
        conv.id === currentConversationId ? { ...conv, messages: [...conv.messages, newMessage] } : conv
      );
      setConversations(updatedConversations);
    }
  };

  const saveCurrentConversationAndStartNew = async () => {
    if (currentConversationId === null || messages.length === 0) {
      alert("No active conversation to save or no new messages have been added.");
      return;
    }

    // Save the current conversation
    try {
      const response = await axios.post('http://localhost:8000/save_conversation', {
        id: currentConversationId,
        title: `Conversation ${conversations.length + 1}`,
        messages,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        // Start the summarization process for the current conversation
        summarizeAndSetTitle(currentConversationId, messages);

        // Clear current conversation and start a new placeholder conversation
        const newConversationId = Date.now(); // Unique ID for the new conversation
        const newConversationPlaceholder = {
          id: newConversationId,
          title: `Conversation ${conversations.length + 1}`, // Sequential title for the new conversation
          messages: [], // No messages initially
        };

        setMessages([]);
        setCurrentConversationId(newConversationId);
        setConversations([...conversations, newConversationPlaceholder]);
      } else {
        alert("Failed to save conversation.");
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
      alert("Failed to save conversation.");
    }
  };

  const selectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
    }
  };

  // Function to make an async call to the summarization endpoint
  const summarizeAndSetTitle = async (conversationId: number, conversationMessages: Message[]) => {
    try {
      const response = await axios.post('http://localhost:8000/summarize', {
        messages: conversationMessages,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const summaryTitle = response.data.summary;
        // Use a functional update to ensure we're working with the most up-to-date state
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv.id === conversationId) {
              return { ...conv, title: summaryTitle };
            }
            return conv;
          });
        });
      } else {
        console.error("Failed to summarize conversation.");
      }
    } catch (error) {
      console.error('Error summarizing conversation:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-full min-h-screen">
      <div className="sm:flex-none w-full sm:w-1/4 lg:w-1/5 bg-gray-800 text-white">
        <SideMenu conversations={conversations} onSelectConversation={selectConversation} />
      </div>
      <div className="flex flex-col flex-1 min-w-0 relative"> {/* Make this a relative container */}
        <div className="flex-1 overflow-y-auto">
          <ConversationArea messages={messages} />
        </div>
        {/* Encapsulating InputArea and New Conversation button in a container */}
        <div className="absolute inset-x-0 bottom-0"> {/* Position this container at the bottom */}
          <InputArea onSendMessage={handleSendMessage} />
          <button onClick={saveCurrentConversationAndStartNew} className="p-2 bg-blue-500 text-white w-full">
            New Conversation
          </button>
        </div>
      </div>
    </div>
  );

};

export default ChatApp;
