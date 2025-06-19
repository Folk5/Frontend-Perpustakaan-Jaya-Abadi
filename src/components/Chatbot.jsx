import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import { ChatDots, Send, X, Robot, Person } from 'react-bootstrap-icons';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Halo! Saya Pustakawan AI. Ada yang bisa saya bantu?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/chat', { message: input });
            const botMessage = { from: 'bot', text: response.data.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { from: 'bot', text: 'Maaf, saya sedang mengalami gangguan. Coba lagi nanti.' };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Chatbot error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <Card className="h-100 shadow-lg">
                    <Card.Header className="chatbot-header">
                        {/* Kolom 1: Placeholder Kiri (untuk menyeimbangkan) */}
                        <div className="header-side"></div>

                        {/* Kolom 2: Judul di Tengah */}
                        <div className="header-center">
                            <span className="fw-bold">
                                <Robot className="me-2" /> Pustakawan AI
                            </span>
                        </div>

                        {/* Kolom 3: Tombol Tutup di Kanan */}
                        <div className="header-side">
                            <Button variant="link" className="p-0 text-white chat-close-btn" onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </Button>
                        </div>
                    </Card.Header>

                    <Card.Body className="messages-list">
                        {/* --- PERUBAHAN TAMPILAN PESAN --- */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.from}`}>
                                <div className={`avatar ${msg.from}`}>
                                    {msg.from === 'bot' ? <Robot size={18} /> : <Person size={18} />}
                                </div>
                                <div className={`message-bubble ${msg.from}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {/* --- PERUBAHAN INDIKATOR MENGETIK --- */}
                        {loading && (
                            <div className="message-wrapper bot">
                                <div className="avatar bot"><Robot size={18} /></div>
                                <div className="message-bubble bot typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </Card.Body>

                    <Card.Footer className="bg-white border-top-0">
                        <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            {/* KUNCI UTAMA: Bungkus input dan tombol dengan <div className="d-flex"> */}
                            {/* 'align-items-center' ditambahkan agar tombol dan input sejajar secara vertikal */}
                            <div className="d-flex align-items-center"> 
                                <Form.Control
                                    type="text"
                                    placeholder="Ketik pertanyaanmu..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    disabled={loading}
                                    autoComplete="off"
                                    onKeyPress={e => { if (e.key === 'Enter') handleSend(); }}
                                />
                                <Button type="submit" variant="primary" disabled={loading} className="ms-2">
                                    <Send />
                                </Button>
                            </div>
                        </Form>
                    </Card.Footer>
                </Card>
            </div>

            <Button className="chatbot-toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <ChatDots size={28} />}
            </Button>
        </>
    );
}

export default Chatbot;