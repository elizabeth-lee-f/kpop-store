import { useState } from 'react';

const ChatWidget = ({ isOpen, setIsOpen }) => {
    return (
        <>
            {/* Окно чата */}
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
                        {/* Заголовок чата */}
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
                                    💜 Наша поддержка
                                </h3>
                                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                                    Онлайн-консультант
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

                        {/* Область сообщений */}
                        <div style={{
                            flex: 1,
                            padding: '20px',
                            overflowY: 'auto',
                            background: '#f8f9fa',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {/* Примеры сообщений (как в прошлом коде) */}
                            <div style={{
                                alignSelf: 'flex-start',
                                background: 'white',
                                padding: '12px 16px',
                                borderRadius: '15px 15px 15px 5px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                maxWidth: '85%'
                            }}>
                                <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
                                    Здравствуйте! 👋<br/>
                                    Чем можем вам помочь?
                                </p>
                                <span style={{ fontSize: '11px', color: '#999', marginTop: '5px', display: 'block' }}>
                                    10:30
                                </span>
                            </div>
                        </div>

                        {/* Поле ввода */}
                        <div style={{
                            padding: '15px',
                            background: 'white',
                            borderTop: '1px solid #e0e0e0',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <input
                                type="text"
                                placeholder="Введите сообщение..."
                                readOnly
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
                                style={{
                                    background: '#9b59b6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '45px',
                                    height: '45px',
                                    fontSize: '18px'
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;