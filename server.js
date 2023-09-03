const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Подключение к базе данных MongoDB
const connectionString = 'mongodb+srv://alexfrontend:AlA5E4eSVoWUV3Ki@cluster0.twr4vmt.mongodb.net/cottonbro?retryWrites=true&w=majority';
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных:'));
db.once('open', () => {
  console.log('Успешное подключение к базе данных');
});
// Создание схемы и модели для коллекции Gods
const goodsSchema = new mongoose.Schema({
  _id: Number,
  photo: String,
  photo2: String,
  photo3: String,
  name: String,
  price: Number,
  size: Array,
  colors: Array,
  category: String,
  hits: Boolean,
  date: Number
});
const good = mongoose.model('good', goodsSchema);

// Разрешение CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Заменить * на домен!!! НЕ ЗАБЫТЬ
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.static(__dirname));

app.get('/goods', async (req, res) => {
  try {
    // Получение параметров фильтрации из строки запроса
    const { sortingMethod, category, size, color, price } = req.query;
    // Создание объекта фильтрации
    console.log(size);
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (size && size !== 'null') {
      filter.size = size;
    }
    if (color) {
      filter.colors = { $in: color.split(',') };
    }
    if (price) {
      const twoPrices = JSON.parse(price),
            min = twoPrices.min,
            max = twoPrices.max;
      filter.price = {};
      if (min) {
        filter.price.$gte = Number(min);
      }
      if (max) {
        filter.price.$lte = Number(max);
      }
    };
    // Получение данных из коллекции goods с учетом фильтрации
    console.log(filter);
    let goods = await good.find(filter);
    // Сортировка данных
    goods = goods.sort((a, b) => {
      if (sortingMethod === 'ascending') {
        return a.price - b.price;
      } else if (sortingMethod === 'descending') {
        return b.price - a.price;
      } else if (sortingMethod === 'novelties') {
        return b.date - a.date;
      } else {
        return 0;
      }
    });

    // console.log(`после сортировки методом ${sortingMethod}`, goods);
    // Отправка отфильтрованных и отсортированных данных клиенту
    res.json(goods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при получении данных' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

