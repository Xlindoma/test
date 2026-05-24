const API_BASE = 'http://localhost:8001';

export async function registerUser(nickname, tag, dorm, telegramId = null) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, tag, dorm, telegram_id: telegramId })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Ошибка регистрации');
    }
    const data = await res.json();
    return data.user;
}

export async function fetchItems() {
    const res = await fetch(`${API_BASE}/api/items`);
    if (!res.ok) throw new Error('Не удалось загрузить объявления');
    return res.json();
}

export async function claimItem(itemId, userTelegramId) {
    const res = await fetch(`${API_BASE}/api/items/${itemId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_telegram_id: userTelegramId })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Не удалось оставить заявку');
    }
    return res.json();
}

export async function publishItem(formData) {
    const res = await fetch(`${API_BASE}/api/items`, { method: 'POST', body: formData });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Ошибка публикации');
    }
    return res.json();
}

export async function fetchMyItems(telegramId) {
    const res = await fetch(`${API_BASE}/api/items/my?telegram_id=${telegramId}`);
    if (!res.ok) return [];
    return res.json();
}

export async function fetchMyRequests(telegramId) {
    const res = await fetch(`${API_BASE}/api/requests/my?telegram_id=${telegramId}`);
    if (!res.ok) return [];
    return res.json();
}