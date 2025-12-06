import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const useChatMentor = (roadmapData) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load initial history
    useEffect(() => {
        let isMounted = true;
        const loadHistory = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/chat/${roadmapData._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to load chat.');

                const history = await response.json();
                if (isMounted) {
                    if (history.length === 0) {
                        setMessages([{
                            sender: 'ai',
                            text: `Hello! I'm your AI mentor. Ask me anything about **${roadmapData.topic}**!`
                        }]);
                    } else {
                        setMessages(history);
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setMessages([{ sender: 'ai', text: "Connection error. Please try refreshing." }]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (roadmapData?._id) loadHistory();
        return () => { isMounted = false; };
    }, [roadmapData]);

    // Handle sending messages
    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        // Optimistic update
        setMessages(prev => [...prev, { sender: 'user', text }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/chat/${roadmapData._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userQuestion: text }),
            });

            if (!response.ok) throw new Error('API Error');
            const aiMessage = await response.json();
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble responding right now." }]);
        } finally {
            setIsLoading(false);
        }
    }, [roadmapData]);

    return { messages, isLoading, sendMessage };
};

export default useChatMentor;
