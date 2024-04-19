import React from 'react';
import { FaUserCircle, FaRobot } from 'react-icons/fa';
import { Message as MessageType } from '../types';

const Message: React.FC<{ message: MessageType }> = ({ message }) => {
    // Ensure timestamp is a Date object
    const timestamp = new Date(message.timestamp);

    // Check if the timestamp is valid
    const isValidTimestamp = !isNaN(timestamp.getTime());

    return (
        <div className={`flex flex-col mt-4 ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.sender === 'user' ? (
                    <FaUserCircle className="ml-4" size={24} />
                ) : (
                    <FaRobot className="mr-4" size={24} />
                )}
                <span className={`inline-block py-2 px-4 rounded-lg max-w-sm lg:max-w-xl ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    {message.text}
                </span>
            </div>

            {isValidTimestamp && (
                <span className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    {timestamp.toLocaleTimeString()}
                </span>
            )}
        </div>
    );
};


export default Message;