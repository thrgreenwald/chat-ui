import React from 'react';
import { Conversation } from '../types';

const SideMenu: React.FC<{ conversations: Conversation[]; onSelectConversation: (conversationId: number) => void }> = ({
    conversations,
    onSelectConversation,
}) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold whitespace-normal">Past Conversations</h2>
            <div className="mt-2">
                {conversations.map((conversation) => (
                    <div key={conversation.id} className="cursor-pointer p-2 hover:bg-gray-100 hover:text-gray-800" onClick={() => onSelectConversation(conversation.id)}>
                        {conversation.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideMenu;
