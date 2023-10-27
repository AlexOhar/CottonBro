const btnCategory = document.querySelector('.good_details_navigation_category'),
      btnHomePage =document.querySelector('.good_details_navigation_main');

btnCategory.addEventListener('click', () => {
    window.location.href = `categories.html`;
});
btnHomePage.addEventListener('click', () => {
    window.location.href = `index.html`;
});

function loadingGoods(funct, ...args) {
    document.querySelector('.loading').style.display = 'block';
    return funct(...args)
            .finally(() => {
                setTimeout(() => {
                    document.querySelector('.loading').style.display = 'none';
                }, 2000);
            });
};

let goodsColors; 
async function gettingGoods(endUrl) {
    try {
        const response = await fetch(`http://localhost:3000/goods?${endUrl}`);
        const goodsData = await response.json();
        goodsData.forEach(good => {
            localStorage.setItem('currentGood', JSON.stringify(good));
            goodsColors = good.photo;
            createProduct(good.photo, good.name, good.price, good._id, good.size, good.colors);
        });

    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    };
};

window.addEventListener('DOMContentLoaded', async () => {
    const getId = localStorage.getItem('cardProductId');
    const urlCardProduct = `&id=${getId}`;
    loadingGoods(gettingGoods, urlCardProduct);
});

function addPhotosProduct(collection, color) {
    const mainPhoto = document.querySelector('.good_slider_photo.full'),
          blockPreview = document.querySelector('.good_slider_preview'),
          itemsPreview = blockPreview.querySelectorAll('.good_slider_photo'),
          colorNameOnScreen = document.querySelector('.good_details_color_header_choosed');

    colorNameOnScreen.innerHTML = `Цвет: ${color}`;
    itemsPreview.forEach(item => {
        item.remove();
    });
    for (let i = 1; i < collection[color].length; i++ ) {
        const img = document.createElement('img');
        img.classList.add('good_slider_photo');
        img.classList.add('min');
        img.src = `${collection[color][i]}`;
        img.setAttribute('alt', 'photoGood');
        blockPreview.append(img);
    };
    mainPhoto.src = `${collection[color][0]}`;
};

function createProduct(photoColection, name, price, id, sizes, colors) {
    const nameProduct = document.querySelector('.good_details_name'),
          priceProduct = document.querySelector('.good_details_price'),
          idProduct = document.querySelector('.idProduct');
    let colorName = `${localStorage.getItem("chooseColor")}`;
    
    if (colorName === 'none') {
        colorName = Object.keys(photoColection)[0];
    }
    addPhotosProduct(photoColection, colorName);
    
    nameProduct.innerHTML = `${name}`;
    priceProduct.innerHTML = `${price} грн`;
    idProduct.innerHTML = `Артикул: ${id}`;

    //create buttons size
    if (!localStorage.getItem("clothesSize")) {
        localStorage.setItem("clothesSize", `S`);
    };
    const sizeBtns = document.querySelector('.good_details_size_btns');
    sizes.forEach(size => {
        const  sizeBtn = document.createElement('div');
        sizeBtn.classList.add('good_details_size_btns_item');
        sizeBtn.innerHTML = `${size}`;
        if (size === localStorage.getItem("clothesSize")) {
            sizeBtn.classList.add('choosed');
        };
        sizeBtns.append(sizeBtn);
    });
    //choosing size
    const sizeButtons = document.querySelectorAll('.good_details_size_btns_item');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.innerHTML;
            localStorage.setItem("clothesSize", text);
            sizeButtons.forEach(btn => {
                btn.classList.remove('choosed');
            });
            btn.classList.add('choosed');
        });
    });
    const colorCollection = {
        'черный': '#000',
        'серый': '#949494',
        'светлосерый': '#c6c6c6',
        'бежевый': '#eec08b',
        'коричневый': '#522403',
        'белый': '#fff',
        'красный': '#ff0000', 
        'синий': '#0300de',
        'розовый': '#f3038c', 
        'голубой': '#0393f3', 
        'оранжевый': '#fe9203',
        'зеленый': '#008c13',
        'желтый': '#f1f807'
    };
    const colorNameOnScreen = document.querySelector('.good_details_color_header_choosed'),
          colorBtns = document.querySelector('.good_details_color_btns');
          colorNameOnScreen.innerHTML = `Цвет: ${colorName}`;
    colors.forEach(color => {
        const colorBtn = document.createElement('div'),
              lowerCaseColor = color.toLowerCase();
        colorBtn.classList.add('good_details_color_btns_item');
        colorBtn.setAttribute('data-color', `${lowerCaseColor}`);
        colorBtn.style.background = `${colorCollection[lowerCaseColor]}`;
        const currColorLowerCase = colorName.toLowerCase();
        if (lowerCaseColor === currColorLowerCase) {
            colorBtn.classList.add('active');
            localStorage.setItem('clothesColor', currColorLowerCase);
        };
        colorBtns.append(colorBtn);
        
    });

    const colorButtons = document.querySelectorAll('.good_details_color_btns_item');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentColor = e.target.getAttribute('data-color'),
                  currentGood = JSON.parse(localStorage.getItem('currentGood'));
            let strColor = currentColor.toString();
            localStorage.setItem('clothesColor', currentColor);
            removeListeners();
            addPhotosProduct(currentGood.photo, strColor);
            addListeners();
            colorButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            btn.classList.add('active');
        });
    });
    if (!localStorage.getItem('basket')) {
        const arr = [];
        localStorage.setItem('basket', JSON.stringify(arr));
    };
    
    addListeners();
    addToBasket();
};
//add to basket
function addToBasket() {
    const btnAdd = document.querySelector('.good_details_buttons_basket');
   
    function updateBasket(array, newObject) {
        let existingObject = array.find(obj => obj.id === newObject.id && obj.size === newObject.size && obj.color === newObject.color);
        if (existingObject) {
            existingObject.quantity += newObject.quantity;
        } else {
            array.push(newObject);
        }
    };
    
    btnAdd.addEventListener('click', () => {
        const basket = localStorage.getItem('basket');
        const arrBasket = JSON.parse(basket),
              choosedSize = localStorage.getItem('clothesSize'),
              choosedColor = localStorage.getItem('clothesColor'),
              choosePrice = document.querySelector('.good_details_price').innerHTML,
              choosedPhoto = document.querySelector('.good_slider_photo.full').getAttribute('src'),
              chooseName = document.querySelector('.good_details_name').innerHTML,
              choosedProduct = localStorage.getItem('cardProductId');
        let product = {
            id: choosedProduct,
            photo: choosedPhoto,
            price: choosePrice,
            size: choosedSize,
            color: choosedColor,
            name: chooseName,
            quantity: 1
        };
        // arrBasket.push(product);
        updateBasket(arrBasket, product);
        const arrString = JSON.stringify(arrBasket);
        localStorage.setItem('basket', arrString);
        const basketIconCounter = document.querySelector('.basketIcon_count');
        const currAmount = Number(basketIconCounter.innerHTML);
        const quantity = currAmount + 1;
        basketIconCounter.innerHTML = `${quantity}`;
        localStorage.setItem('basketCounter', quantity);
        const goodAdd = document.querySelector('.good_details_buttons_basket');
        goodAdd.innerHTML = 'Добавлено &#10003;';
  
        setTimeout(function() {
            goodAdd.innerHTML = 'Добавить в корзину';
        }, 2000);
        const basketCounters = document.querySelectorAll('.basketIcon_count');
        basketCounters.forEach(icon => {
            icon.innerHTML = `${quantity}`;
        });
    });
}

// click on arrows
function showPrevPhoto() {
    const allPhotos = document.querySelectorAll('.good_slider_photo');
    let arrPhotos = [];
    allPhotos.forEach(photo => {
        arrPhotos.push(photo.getAttribute('src'));
    });
    // console.log(arrPhotos);
    let lastElement = arrPhotos.pop();
    arrPhotos.unshift(lastElement);
    allPhotos.forEach(photo => {
        photo.setAttribute('src', arrPhotos.shift());
    });
};

function showNextPhoto() {
    const allPhotos = document.querySelectorAll('.good_slider_photo');
    let arrPhotos = [];
    allPhotos.forEach(photo => {
        arrPhotos.push(photo.getAttribute('src'));
    });
    let firstElement = arrPhotos.shift();
    arrPhotos.push(firstElement);
    allPhotos.forEach(photo => {
        photo.setAttribute('src', arrPhotos.shift());
    });
};

function changeMainPhoto(event) {
    const fullPhoto = document.querySelector('.good_slider_photo.full');
    const photo = event.target;
    const newAtr = photo.getAttribute('src'),
          currAtr = fullPhoto.getAttribute("src");
    photo.setAttribute('src', currAtr);
    fullPhoto.setAttribute('src', newAtr); 
}

function addListeners() {
    const minPhotos = document.querySelectorAll('.good_slider_photo.min'),
        leftBtn = document.querySelector('.good_slider_screening_leftBtn'),
        rightBtn = document.querySelector('.good_slider_screening_rightBtn');
    minPhotos.forEach(photo => {
        photo.addEventListener('click', changeMainPhoto);
    });
    leftBtn.addEventListener('click', showPrevPhoto);
    rightBtn.addEventListener('click', showNextPhoto);
};

function removeListeners() {
    const minPhotos = document.querySelectorAll('.good_slider_photo.min'),
        leftBtn = document.querySelector('.good_slider_screening_leftBtn'),
        rightBtn = document.querySelector('.good_slider_screening_rightBtn');
    leftBtn.removeEventListener('click', showPrevPhoto);
    rightBtn.removeEventListener('click', showNextPhoto);
    minPhotos.forEach(photo => {
        photo.addEventListener('click', changeMainPhoto);
    });
};

async function createSpecialBlocks(blockName, numberSpecialBlock, category) {
    
    const specialBlock = document.querySelector(`#specialBlock${numberSpecialBlock}`);
    specialBlock.innerHTML = `<h2>${blockName}</h2>`;
    const wrapp = document.createElement('div');
    wrapp.classList.add('specialBlock_wrapp');
    specialBlock.append(wrapp);
    const response = await fetch(`http://localhost:3000/goods?sortingMethod=novelties&category=${category}`);
    const goodsData = await response.json();
    const firstFourGoods = goodsData.slice(0, 7);
    firstFourGoods.forEach(good => {
        if (good.photo) {
            // const wrapp = document.querySelector('.specialBlock_wrapp');
            const firstColor = Object.keys(good.photo)[0];
            const firstPhotos = good.photo[firstColor][0];
            const card = document.createElement('div');
            card.classList.add('specialBlock_wrapp_item');
            card.setAttribute('id', `${good._id}`);
            card.innerHTML = `  <img class="specialBlock_wrapp_photo" src="${firstPhotos}" alt="goodPhoto">
                                <div class="specialBlock_wrapp_descr">
                                    <h5>${good.name}</h5>
                                    <h4>${good.price}грн</h4>
                                </div>`;
            wrapp.append(card);
        };
    });
    
    eventsForSpecialBlock(1);

};

//Events for specialBlocks
function eventsForSpecialBlock(number) {
    //move card in specialBlock and open cardProduct
    const specialBlock = document.querySelector(`.specialBlock${number}`);
    const container = specialBlock.querySelector('.specialBlock_wrapp');
    const cards = specialBlock.querySelectorAll('.specialBlock_wrapp_item');
    // console.log(container);
    // console.log(cards);
    let isMouseDown = false;
    let isDragging = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', function() {
        isMouseDown = false;
    });

    container.addEventListener('mouseup', function() {
        isMouseDown = false;
    });

    container.addEventListener('mousemove', function(e) {
        if(!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const scroll = x - startX;
        container.scrollLeft = scrollLeft - scroll;
        isDragging = true;
    });

    cards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            if(isDragging) {
                e.preventDefault();
                e.stopPropagation();
                isDragging = false;
            } else {
                addToViewedProducts(card);
                const id = card.getAttribute('id');
                localStorage.setItem('cardProductId', id);
                window.location.href = 'cardProduct.html';
            }
        });
    });
}

//create cards goods in blocks: forYou and viewed
window.addEventListener('DOMContentLoaded', async () => {
    const categoryForYou = localStorage.getItem('selectedCategory');
    await createSpecialBlocks('Для Тебя', 1, categoryForYou);
    // await createSpecialBlocks('Просмотрели', 2, "coats");
   
});

// fix functional dropdown info menu in the block details
const buttons = document.querySelectorAll('.good_details_info_btn'),
      infoBlocks = document.querySelectorAll('.info'),
      lineOfPlus = document.querySelectorAll('.gorizontLine');

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        infoBlocks.forEach((infoBlock, i) => {
            if(index === i) {
                infoBlock.classList.toggle('open');
            } else {
                infoBlock.classList.remove('open');
            }
        });
        lineOfPlus.forEach((line, i) => {
            if(index === i) {
                line.classList.toggle('deleteGorizontLine');
            } else {
                line.classList.remove('deleteGorizontLine');
            }
        });
    });
});

function addToViewedProducts(product) {
    // console.log(!product);
    if(!product === 'default') {
        let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
        let productExists = viewedProducts.find(item => item._id === product._id);
        if (!productExists) {
            if (viewedProducts.length >= 10) {
                viewedProducts.pop();
            }
            viewedProducts.unshift(product);
            localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
        }
    }
    const viewedCard = document.querySelectorAll('.specialBlock_wrapp_item');
    viewedCard.forEach(card => {
        card.remove();
    })
    let arrProducts = JSON.parse(localStorage.getItem('viewedProducts'));
    const block = document.querySelector('#specialBlock2');
    block.innerHTML = `<h2>Просмотрели</h2>`;
    const wrapp = document.createElement('div');
          wrapp.classList.add('specialBlock_wrapp');
    block.append(wrapp);
    // console.log(arrProducts);
    arrProducts.forEach(good => {
        if (good.photo) {
            const firstColor = Object.keys(good.photo)[0];
            const firstPhotos = good.photo[firstColor][0];
            const card = document.createElement('div');
            card.classList.add('specialBlock_wrapp_item');
            card.setAttribute('id', `${good._id}`);
            // console.log('добавил');
            card.innerHTML = `  <img class="specialBlock_wrapp_photo" src="${firstPhotos}" alt="goodPhoto">
                                <div class="specialBlock_wrapp_descr">
                                    <h5>${good.name}</h5>
                                    <h4>${good.price}грн</h4>
                                </div>`
            wrapp.append(card);
        };
    });
    eventsForSpecialBlock(2);
};
addToViewedProducts('default');
//modal size
const btnOpenModalSize = document.querySelector('.chooseSize'),
      btnCloseModalSize = document.querySelector('.modalChooseSize_crossBlock_cross'),
      modalSize = document.querySelector('.modalChooseSize');
btnOpenModalSize.addEventListener('click', () => {
    modalSize.style.display = 'block';
});
btnCloseModalSize.addEventListener('click', () => {
    modalSize.style.display = 'none';
});
