export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface Conversation {
    id: number;
    title: string;
    messages: Message[];
}
