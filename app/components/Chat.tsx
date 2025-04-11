'use client';

import { useState, useRef, useEffect } from 'react';
import { fetchOpenAIResponse } from '../utils/fetchOpenAIResponse';
import Image from 'next/image';
import { Send } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { useUser, useClerk } from '@clerk/nextjs';

type ChatProps = {
  pdfText: string;
};

type Message = {
  author: {
    username: string;
    id: number;
    avatarUrl: string;
  }
  text: string;
  type: string;
  timestamp: number;
}

type aiMessage = {
  role: string;
  content: string;
}

const userAuthor = {
  username: 'User',
  id: 1,
  avatarUrl: '/user.png',
};

const aiAuthor = {
  username: 'Bob The Interviewer',
  id: 2,
  avatarUrl: '/bobby.png',
};

const MAX_MESSAGES_PER_DAY = 50;

const Chat: React.FC<ChatProps> = ({ pdfText }) => {
  console.log('pdfText:', pdfText);
  const [input, setInput] = useState('');

  const initialMessage = {
    author: aiAuthor,
    text: 'Hello, I am Bobby the PDF AI Chatter. How can I help you today?',
    type: 'text',
    timestamp: +new Date(),
  };

  const initialAiMessage = {
    role: 'assistant',
    content: 'Hello, I am Bobby the PDF AI Chatter. How can I help you today?',
  };

  // for displaying messages in the UI
  const [chatMessages, setChatMessages] = useState<Message[]>([initialMessage]);

  // for sending to the AI(openAI format)
  const [aiMessages, setAiMessages] = useState<aiMessage[]>([]);
  const chatContainer = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const { openSignUp } = useClerk();

  const scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } = chatContainer.current as HTMLDivElement
    if (scrollHeight >= scrollTop + offsetHeight) {
      chatContainer.current?.scrollTo(0, scrollHeight + 200)
    }
  }

  useEffect(() => {
    scroll();
  }, [chatMessages]);

  // checks if user is signed in, if not, opens sign up modal
  // capture the user's message from the input field
  // clears the input field
  // check daily message limit
  // adds user message to chat history and updates UI
  // adds placeholder for AI response
  // packs the conversation history, user message and instructions for AI into a message to send to the AI
  // sends the message to the AI
  // updates the last placeholder AI response with actual AI response
  // update the aiMessage state
  // increment messageCount in localStorage by 1
  const handleOnSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user){
      openSignUp();
      return;
    }

    // grab the user's question
    const message = e.currentTarget['input-field'].value;
    setInput('');

    // Get today's date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Get the last message date from localStorage
    const storedDate = localStorage.getItem('lastMessageDate');

    // Get the number of messages sent today from localStorage
    const messageCount = parseInt(localStorage.getItem('messageCount') || '0');

    // If it's a new day (stored date is different from today) or the first time the user is using the app
    if (storedDate !== currentDate) {
       // Reset: save today's date 
      localStorage.setItem('lastMessageDate', currentDate);
      // Reset: save today's date 
      localStorage.setItem('messageCount', '0');
    } 
    // if user has reached their daily limit
    else if (messageCount >= MAX_MESSAGES_PER_DAY) {
      alert('Sorry, you have reached the maximum number of messages for today.');
      return;
    }

    // take all the old messages and add the new user message
    // and add a placeholder for the AI response
    setChatMessages(messages => [...messages, {
      author: userAuthor,
      text: message,
      type: 'text',
      timestamp: +new Date()
    }, {
      author: aiAuthor,
      text: '...',
      type: 'text',
      timestamp: +new Date()
    }]);

    const messageToSend = [...aiMessages, {
      role: 'user',
      content: `ROLE: You are an expert at analyzing text and answering questions on it.
-------
TASK:
1. The user will provide a text from a PDF. Take the personality of the character that
would be the most fiting to be an expert on the material of the text.
(e.g. if you get a text about chemistry, your personality should be that of a chemistry teacher.)
2. Answer to the user's questions based on it. Your replies are short (less than 150 characters) and to the point, unless
specified otherwise.
-------
PDF TEXT: ${pdfText}
-------
USER MESSAGE: ${message}` 
    }];

    const response = await fetchOpenAIResponse({
      messages: messageToSend, 
      setMessage: (msg) => setChatMessages(messages => 
        [...messages.slice(0, messages.length-1), {
          // keep all the messages in the UI chat history, except the last one
          // replace the "..." with actual AI response
          author: aiAuthor,
          text: msg,
          type: 'text',
          timestamp: +new Date()
        }]
      ),
      setError: (error) => {
        if (error.status === 401) {
          openSignUp();
        }
      }
    });
    setAiMessages(messages => [...messages, {role: 'user', content: message }, {role: 'assistant', content: response }]);

    localStorage.setItem('messageCount', (messageCount + 1).toString());
  }

   // chat container
  const renderResponse = () => {
    return (
     
      <div ref={chatContainer} className="flex-1 overflow-y-auto">
        {/* map over the chatMessages array and render each message */}
        {chatMessages.map((message, index) => (
          // chat message
          <div 
          key={index} 
          className={`
          flex items-start gap-3
          ${message.author.username === 'User' ? 'text-stone-200/70 text-sm' : 'text-green-200/70 text-sm'}
          `}>
            {/* chat message author avatar */}
            <Image 
            className="rounded-full flex-shrink-0 shadow-lg" 
            alt="avatar" 
            src={message.author.avatarUrl} 
            width={40} 
            height={40} 
            />
            {/* chat message text */}
            <div className="flex-1 min-w-0">
              <div className="message">
                <MarkdownRenderer>{message.text}</MarkdownRenderer>
              </div>
              {index < chatMessages.length-1 && <div className="border-b border-orange-200/20 w-full mt-5 mb-5"/>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className=" p-2 flex flex-col h-full w-full justify-between mt-5">
      {/* chat container */}
      {renderResponse()}

      {/* input field */}
      <form 
      onSubmit={handleOnSendMessage} 
      className="border border-orange-100/30 flex items-center gap-4 p-2 rounded-2xl w-full mt-4">
        <input 
        className="flex-1 bg-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500  transition-colors duration-200 text-stone-200"
        name="input-field" 
        type="text" 
        placeholder="Ask anything" 
        onChange={(e) => setInput(e.target.value)} value={input} />

        <div className="relative cursor-pointer hover:bg-green-300/30 rounded-full transition-colors duration-200">
        <button 
        type="submit" 
        className="w-10 h-10 rounded-full bg-orange-100/50 flex items-center justify-center transition-colors duration-200 hover:bg-green-300/30" 
        />
        <Send className="w-5 h-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        
        </div>
      </form>
    </div>
  );
}

export default Chat;