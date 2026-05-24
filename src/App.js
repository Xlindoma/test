import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import ProfilePage from './pages/ProfilePage';
import { CreateModal } from './components/Modals';
import { publishItem } from './api/api';

function App() {
    const { isAuthenticated, login } = useAuth();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [refreshHome, setRefreshHome] = useState(false);
    const [selectedDorm, setSelectedDorm] = useState('Корпус 8.1');
    const [agreed, setAgreed] = useState(false);

    // Глобальный обработчик Telegram-виджета
    React.useEffect(() => {
        window.onTelegramAuth = (user) => {
            const tgId = user.id;
            const nick = user.username || user.first_name;
            login(tgId, nick, selectedDorm);
        };
    }, [login, selectedDorm]);

    const handlePublish = async (formData) => {
        const result = await publishItem(formData);
        if (result.id) {
            alert('Объявление опубликовано');
            setRefreshHome(prev => !prev);
        } else {
            alert('Ошибка публикации');
        }
    };

    const handleStart = () => {
        if (!agreed) {
            alert('Нужно принять соглашение');
            return;
        }
        const tempNick = '@сосед_' + Math.floor(Math.random() * 1000);
        login(`demo_${Date.now()}`, tempNick, selectedDorm);
    };

    if (!isAuthenticated) {
        return (
            <div className="login-overlay">
                <div className="login-card">
                    <div className="brand"><div className="brand-dot"></div><div className="logo">Тут</div></div>
                    <div className="hero-copy">«Тут» — потому что всё, что нужно, уже рядом.</div>
                    <button className="tg-btn" onClick={() => alert('Вход через Telegram пока отключён, используйте ручной вход')}>
                        <i className="fa-brands fa-telegram"></i> Войти через Telegram
                    </button>
                    <div className="field">
                        <label>Выбери общежитие</label>
                        <select className="select" value={selectedDorm} onChange={(e) => setSelectedDorm(e.target.value)}>
                            <option>Корпус 8.1</option>
                            <option>Корпус 8.2</option>
                            <option>Корпус 8.3</option>
                            <option>Корпус 8.4</option>
                        </select>
                    </div>
                    <label className="checkbox">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <span>Я принимаю пользовательское соглашение и правила соседского уважения.</span>
                    </label>
                    <button className="primary-btn" onClick={handleStart}>Начать</button>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path="/" element={<HomePage onOpenCreate={() => setCreateModalOpen(true)} refreshTrigger={refreshHome} />} />
                    <Route path="/items" element={<ItemsPage />} />
                    <Route path="/profile" element={<ProfilePage onOpenCreate={() => setCreateModalOpen(true)} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <button className="fab" onClick={() => setCreateModalOpen(true)}><i className="fa-solid fa-plus"></i></button>
                <BottomNav />
                <CreateModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onPublish={handlePublish} />
            </div>
        </BrowserRouter>
    );
}

export default App;