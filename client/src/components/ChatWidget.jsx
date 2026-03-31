import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Подключение к серверу
const socket = io.connect('http://localhost:5001');

const ChatWidget = ({ isOpen, setIsOpen }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Автопрокрутка вниз
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Получение истории
        socket.on('chat_history', (history) => {
            setMessages(history);
        });

        // Получение новых сообщений
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // Очистка
        return () => {
            socket.off('chat_history');
            socket.off('receive_message');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            const messageData = {
                text: message,
                user: user ? user.email : 'Гость',
                isAdmin: user?.role === 'admin',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            socket.emit('send_message', messageData);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '70px',
                    left: '20px',
                    zIndex: 1000
                }}>
                    <div style={{
                        width: '350px',
                        height: '450px',
                        background: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 5px 25px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0'
                    }}>
                        {/* Заголовок */}
                        <div style={{
                            background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                            color: 'white',
                            padding: '15px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                    💜 Поддержка
                                </h3>
                                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                                    {user?.role === 'admin' ? 'Режим администратора' : 'Онлайн-консультант'}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                style={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    border: 'none', 
                                    color: 'white', 
                                    cursor: 'pointer', 
                                    fontSize: '20px',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Сообщения */}
                        <div style={{
                            flex: 1,
                            padding: '20px',
                            overflowY: 'auto',
                            background: '#f8f9fa',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {messages.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                                    Нет сообщений.<br/>Напишите нам! 💬
                                </p>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.user === (user ? user.email : 'Гость');
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                                background: isMe 
                                                    ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' 
                                                    : 'white',
                                                color: isMe ? 'white' : '#333',
                                                padding: '12px 16px',
                                                borderRadius: isMe 
                                                    ? '15px 15px 5px 15px' 
                                                    : '15px 15px 15px 5px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                maxWidth: '85%'
                                            }}
                                        >
                                            <p style={{ margin: 0, fontSize: '14px' }}>
                                                {msg.text}
                                            </p>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                marginTop: '5px',
                                                gap: '10px'
                                            }}>
                                                <span style={{ fontSize: '10px', opacity: isMe ? 0.9 : 0.7 }}>
                                                    {msg.time}
                                                </span>
                                                <span style={{ fontSize: '10px', opacity: isMe ? 0.9 : 0.7, fontStyle: 'italic' }}>
                                                    {msg.user}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Ввод */}
                        <div style={{
                            padding: '15px',
                            background: 'white',
                            borderTop: '1px solid #e0e0e0',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Введите сообщение..."
                                style={{
                                    flex: 1,
                                    padding: '12px 18px',
                                    borderRadius: '25px',
                                    border: '2px solid #e0e0e0',
                                    outline: 'none',
                                    fontSize: '14px',
                                    background: '#f8f9fa'
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={message.trim() === ''}
                                style={{
                                    background: message.trim() === '' ? '#ccc' : '#9b59b6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '45px',
                                    height: '45px',
                                    cursor: message.trim() === '' ? 'not-allowed' : 'pointer',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ➤
                            </button>
                        </div>

                        {/* Подвал */}
                        <div style={{
                            padding: '8px',
                            background: '#f8f9fa',
                            textAlign: 'center',
                            fontSize: '11px',
                            color: '#999',
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            💬 Чат в реальном времени
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;