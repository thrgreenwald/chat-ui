import React, { useState } from 'react';
import { IoMdSend } from 'react-icons/io';

const InputArea: React.FC<{ onSendMessage: (text: string) => void }> = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            handleSend();
        }
    };

    return (
        <div className="bg-white p-4 border-t">
            <div className="flex items-center border rounded-lg overflow-hidden">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 p-2 focus:outline-none"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="text-white focus:outline-none p-2"
                    style={{
                        margin: '0px',
                        height: '100%',
                        width: '40px',
                    }}
                >
                    <IoMdSend className="bg-blue-500 hover:bg-blue-700 p-1 rounded" size={24} />
                </button>
            </div>
        </div>
    );
};

export default InputArea;
