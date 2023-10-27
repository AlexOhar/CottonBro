const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer();
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
  photo: Object,
  name: String,
  price: Number,
  size: [String],
  colors: [String],
  category: String,
  date: String,
  photoHit: String,
  hits: Boolean,
  infoSize: String,
  compositionAndCare: String,
  desription: String,
  parametrs: String,
  delivery: String
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
    const { sortingMethod, category, size, color, price, id } = req.query;
    // Создание объекта фильтрации
    const filter = {};
    if (id) {
      filter._id = Number(id);
    }
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
    
    res.json(goods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при получении данных' });
  }
});


// Создание схемы и модели для коллекции Orders
const ordersSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString() },
  name: String,
  mail: String,
  phone: String,
  country: String,
  city: String,
  street: String,
  houseNumber: String,
  building: String,
  apartment: String,
  goods: Array,
  totalPrice: Number,
  date: { type: String, default: () => new Date().toISOString().slice(0,10) }
});

const Order = mongoose.model('Order', ordersSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/order_form', upload.none(), async (req, res) => {
    const orderData = {
        name: req.body.name,
        mail: req.body.mail,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        building: req.body.building,
        apartment: req.body.apartment,
        totalPrice: req.body.totalPrice
    };

    // Обработка дополнительных товаров
    let goods = [];
    let i = 0;
    while (req.body['good' + i]) {
        goods.push(req.body['good' + i]);
        i++;
    }
    orderData.goods = goods;

    console.log(orderData.name);

    const order = new Order(orderData);
    try {
        await order.save();
        res.send(JSON.stringify("Форма успешно обработана!"));
    } catch (err) {
        console.log(err);
        res.status(500).send('Ошибка при сохранении данных.');
    }
});

app.use(express.json());

app.post('/promo', (req, res) => {
    const promoCode = req.body.promoCode;
    let response;

    switch(promoCode) {
        case 'MOLY':
            response = { code: 'MOLY', discount: '12%' };
            break;
        case 'Friendly24':
            response = { code: 'Friendly24', discount: '20%' };
            break;
        default:
            response = { message: 'Промокод не действителен!' };
    }

    res.json(response);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});





// const product = new good({
//   "_id": 130038,
//   "photo": {
//     "Белый": [
//       "img/goods/jeans/1003white.png",
//       "img/goods/jeans/1003white2.png",
//       "img/goods/jeans/1003white3.png",
//       "img/goods/jeans/1003white4.png"
//     ], 
//     "Голубой": [
//       "img/goods/jeans/1003blue.png",
//       "img/goods/jeans/1003blue2.png",
//       "img/goods/jeans/1003blue3.png",
//       "img/goods/jeans/1003blue4.png"
//     ],
//     "Серый": [
//       "img/goods/jeans/1003gray.png",
//       "img/goods/jeans/1003gray2.png",
//       "img/goods/jeans/1003gray3.png",
//       "img/goods/jeans/1003gray4.png"
//     ]  
//   },
//   "name": "Джинсы Bestyle",
//   "price": 1800,
//   "size": ["S", "XS", "M", "L"],
//   "colors": ["Белый", "Голубой", "Серый"],
//   "category": "jeans",
//   "hits": false,
//   "date": "1693081259700",
//   "infoSize": "<h4>НЕОБХОДИМЫЙ ВАМ РАЗМЕР ВЫ МОЖЕТЕ ПОДОБРАТЬ ИСХОДЯ ИЗ ИНФОРМАЦИИ ВО ВКЛАДКЕ ОБМЕРЫ НА СТРАНИЦЕ ТОВАРА</h4>\n        Как определить подходящий размер\n        <ul>\n            <li>Измерьте обхват груди по самой выпуклой точки бюста.</li>\n            <li>Измерьте обхват талии по самой узкой части талии.</li>\n            <li>Измерьте обхват бедер по линии максимальной ширины бедер.</li>\n        </ul>\n        Размер Onesize предполагает универсальную посадку, рассчитанную на параметры размеров XS, S, M.<br>\n        Если возникнут сложности, мы с радостью поможем Вам с выбором размера. Свяжитесь с нами в онлайн-чате, или позвоните\n        по бесплатному номеру +380 954 88 ** **",
//   "compositionAndCare": "Наружная часть: полиэстер 61%, вискоза 34%, эластан 5%<br><br>\nПодкладка: полиэстер 100%<br>\n<ul>\n    <li>деликатная машинная или ручная стирка до 30°С;</li>\n    <li>не отбеливать;</li>\n    <li>стирку выполнять отдельно от других вещей, возможно окрашивание;</li>\n    <li>барабанная сушка запрещена;</li>\n    <li>вертикальная сушка без отжима;</li>\n    <li>утюжить при температуре до 110°C или отпаривание;</li>\n    <li>избегать механического воздействия (интенсивное трение о какую-либо поверхность, жесткие ремни сумок, рюкзаков и т.д.).</li>\n</ul>",
//   "desription": "Двубортное пальто в черном оттенке уже не первый год является моделью-бестселлером. Для пошива изделия мы выбрали плотную суконную ткань с добавлением полиэстера. Ткань отличается своей прочностью, плотностью и согревающими свойствами, а крой не сковывает движения. С помощью пальто можно воссоздать образы, где оно продемонстрирует элегантные, или, наоборот, уличные луки.<br><br>Сделано в Украине<br><br>Температурный режим до -5...-10.",
//   "parametrs": "Onesize Длина изделия (по спинке): 126 см;<br>\n                    Ширина плеча: 15,5 см;<br>\n                    Длина рукава: 64,5 см;<br>\n                    Обхват груди: 105 см;<br>\n                    Обхват талии: 107 см;<br>\n                    Обхват бедер: 109 см;<br>\n                    Рекомендуем на рост: 167-176 см.<br><br>\n                    \n                    * Посадка может отличаться даже для товаров одного размера.<br>Допустимые отклонения в пределах размера +/-1-2 с",
//   "delivery": "Сроки доставки могут быть увеличены<br>\n                    <ul>\n                        <li>Оплатить заказ можно только на сайте</li>\n                        <li>Мы принимаем к оплате банковские карты платежных систем Visa, Master Card и AppelPay</li>\n                    </ul>\n                    Доставка по Киеву\n                    <ul>\n                        <li>Бесплатно</li>\n                    </ul>\n                    Доставка в другие области\n                    <ul>\n                        <li>Новой почтой</li>\n                        <li>Укр почта</li>\n                    </ul>\n                    <h6>Цену доставки зависит от города доставки</h6>"
//   }
 
// )
// product.save();
