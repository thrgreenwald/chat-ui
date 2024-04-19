import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';

const ConversationArea: React.FC<{ messages: MessageType[] }> = ({ messages }) => {
    const conversationEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: '80px' }}>
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            <div ref={conversationEndRef} />
        </div>
    );
};

export default ConversationArea;
