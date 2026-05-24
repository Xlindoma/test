const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Мок‑данные
let items = [
  {
    id: 1,
    title: 'Книга по React',
    description: 'Почти новая',
    category: 'Книги',
    owner_telegram_id: '123',
    owner_nick: '@student',
    owner_trust: 4,
    photo_path: 'uploads/placeholder.jpg',
    status: 'active',
    claimers: []
  }
];

app.get('/api/items', (req, res) => res.json(items));

app.post('/api/items', upload.single('photo'), (req, res) => {
  const newItem = {
    id: Date.now(),
    ...req.body,
    photo_path: req.file ? req.file.path : '',
    status: 'active',
    claimers: []
  };
  items.push(newItem);
  res.json(newItem);
});

app.post('/api/items/:id/claim', (req, res) => {
  res.json({ bot_link: 'https://t.me/YourBot?start=test' });
});

app.get('/api/items/my', (req, res) => res.json([]));
app.get('/api/requests/my', (req, res) => res.json([]));
app.get('/api/auth/telegram', (req, res) => res.json({ status: 'ok' }));

app.listen(8001, () => console.log('✅ Мок‑сервер запущен на http://localhost:8001'));