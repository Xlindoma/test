import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [telegramId, setTelegramId] = useState(null);
    const [nickname, setNickname] = useState('');
    const [dorm, setDorm] = useState('Корпус 8.1');

    // Восстановление сессии из localStorage
    useEffect(() => {
        const storedId = localStorage.getItem('telegram_id');
        const storedNick = localStorage.getItem('nickname');
        const storedDorm = localStorage.getItem('dorm');
        if (storedId && storedNick) {
            setTelegramId(storedId);
            setNickname(storedNick);
            setDorm(storedDorm || 'Корпус 8.1');
            setIsAuthenticated(true);
        }
    }, []);

    const login = (tgId, nick, selectedDorm) => {
        setTelegramId(tgId);
        setNickname(nick);
        setDorm(selectedDorm);
        setIsAuthenticated(true);
        localStorage.setItem('telegram_id', tgId);
        localStorage.setItem('nickname', nick);
        localStorage.setItem('dorm', selectedDorm);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setTelegramId(null);
        setNickname('');
        setDorm('');
        localStorage.clear();
    };

    const updateNickname = async (newNick) => {
        if (telegramId) {
            // здесь можно вызвать API, но для демо просто меняем локально
            setNickname(newNick);
            localStorage.setItem('nickname', newNick);
            alert('Ник изменён');
        }
    };

    const value = {
        isAuthenticated,
        telegramId,
        nickname,
        dorm,
        login,
        logout,
        updateNickname
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};