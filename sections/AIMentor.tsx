import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import useLocalStorage from '../hooks/useLocalStorage';
import type { ChatMessage } from '../types';
import { BrainIcon, SparklesIcon } from '../components/Icons';

const AIMentor: React.FC = () => {
    const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('aiChatHistory', [
        { role: 'model', content: 'Welcome! I am your personal AI Mentor. Ask me anything about SAT/ACT prep or Ivy League admissions.' }
    ]);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [chatHistory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        const userPrompt = prompt;
        setPrompt('');
        setIsLoading(true);
        setError(null);

        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userPrompt }];
        setChatHistory(newHistory);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // FIX: Use `generateContentStream` for a stateless chat that persists history via localStorage.
            // The previous method of creating a new chat session with `ai.chats.create` on every message was incorrect as it does not accept a `history` parameter.
            const resultStream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: newHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }]
                })),
                config: {
                    systemInstruction: 'You are an expert AI mentor specializing in achieving perfect scores on the SAT and ACT, and guiding students for admission into Ivy League universities. Provide concise, actionable advice and strategies. Format your responses using markdown for readability.'
                }
            });

            // Add placeholder for model response
            setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of resultStream) {
                setChatHistory(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.role === 'model') {
                        const updatedMessage = { ...lastMessage, content: lastMessage.content + chunk.text };
                        return [...prev.slice(0, -1), updatedMessage];
                    }
                    return prev;
                });
            }

        } catch (err) {
            console.error(err);
            const errorMessage = "Sorry, I couldn't connect to the AI. Please check your setup and API key.";
            setError(errorMessage);
            setChatHistory(prev => [...prev, { role: 'model', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 flex flex-col h-[calc(100vh-10rem)]">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
                {chatHistory.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'model' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <SparklesIcon />
                            </div>
                        )}
                        <div className={`max-w-xl p-3 rounded-lg ${message.role === 'user' ? 'bg-gray-700' : 'bg-gray-700/50'}`}>
                            <p className="text-white whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>{message.content}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && chatHistory[chatHistory.length - 1].role === 'user' && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <SparklesIcon />
                        </div>
                        <div className="max-w-xl p-3 rounded-lg bg-gray-700/50">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                 )}
            </div>

            {error && <div className="text-red-400 text-center my-2">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-700">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Ask for SAT essay tips, ACT math strategies, etc..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pr-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !prompt.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIMentor;
