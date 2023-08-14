//filter
const btnFilter = document.querySelector('.categories_filterBtn'),
      btnFilterIcon = btnFilter.querySelector('.categories_filterBtn_icon'),
      windowFilter = document.querySelector('.categories_filter'),
      rangeInput = document.querySelectorAll('.categories_filter_prices_range-input input'),
      priceInput = document.querySelectorAll('.categories_filter_prices_input input'),
      range = document.querySelector('.categories_filter_prices_slider_progress');
let priceGap = 1000;

btnFilter.addEventListener('click', () => {
    if(!windowFilter.classList.contains('categories_filter_openFilterWindow')) {
        windowFilter.classList.add('categories_filter_openFilterWindow');
        btnFilterIcon.classList.add('categories_filterBtn_icon_openFilterBtn');
    } else {
        windowFilter.classList.remove('categories_filter_openFilterWindow');
        btnFilterIcon.classList.remove('categories_filterBtn_icon_openFilterBtn');
    }
});

priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});

//filter colors
const filterColors = document.querySelector('.categories_filter_colors'),
      btnMoreColors = document.querySelector('.categories_filter_colors_more'),
      lastElColor = filterColors.lastElementChild,
      filterSizes = document.querySelector('.categories_filter_sizes'),
      btnMoreSizes = document.querySelector('.categories_filter_sizes_more');

const colors = ['Красный', 'Синий','Розовый','Коричневый','Зеленый','Желтый'],
      sizes = ['XL','XXL'];
let checkBoxSizes,
    checkBoxColors;
btnMoreColors.addEventListener('click', () => {
    if(btnMoreColors.innerHTML === 'Еще') {
        colors.forEach((item) => {
            createElemForFilter(item, filterColors, checkBoxColors, "checkbox");
        });
        btnMoreColors.innerHTML = 'Меньше';
    } else {
        filterColors.querySelectorAll('.add').forEach((item) => {
            item.remove();
        })
        btnMoreColors.innerHTML = 'Еще';
    }
});

btnMoreSizes.addEventListener('click', () => {
    if(btnMoreSizes.innerHTML === 'Еще') {
        sizes.forEach((item) => {
            createElemForFilter(item, filterSizes, checkBoxSizes, "radio", "size");
        });
        btnMoreSizes.innerHTML = 'Меньше';
    } else {
        filterSizes.querySelectorAll('.add').forEach((item) => {
            item.remove();
        })
        btnMoreSizes.innerHTML = 'Еще';
    }
});

function createElemForFilter(items, block, elem, type, name) {
    elem = document.createElement('label');
    elem.innerHTML = `<input type="${type}" name="${name}"><span class="checkmark"></span>${items}`;
    block.insertBefore(elem, block.lastElementChild);
    elem.classList.add('categories_filter_container');
    elem.classList.add('add');
}

//upload gods
const categoriesBody = document.querySelector('.categories_wrapper');
function createGods(photo, name, price, hit) {
    const item = document.createElement('div');
    item.classList.add('categories_wrapper_item');
    if(hit) {
        let elBeforeHit = categoriesBody.children[3];
        item.classList.add('categories_wrapper_item_hits');
        item.innerHTML = `<img class="categories_wrapper_photo" src="${photo}" alt="">
                          <div class="categories_wrapper_descr">
                          <div>
                              <h5 class="categories_wrapper_name">${name}</h5>
                              <h4 class="categories_wrapper_price">${price}грн</h4>
                          </div>
                          <h5 class="categories_wrapper_descr_hit">Хит продаж</h5>
                          </div>`
        elBeforeHit.insertAdjacentElement('afterend', item);
    }
    if(!hit) {
        item.innerHTML = `<img class="categories_wrapper_photo" src="${photo}" alt="">
                          <h5 class="categories_wrapper_name">${name}</h5>
                          <h4 class="categories_wrapper_price">${price}грн</h4>`;
        categoriesBody.append(item);
    }
    
}
// createGods('img/coat.png', 'Кожаная куртка', 4000);

godsArray = [
                {
                    photo: 'img/coat.png',
                    name: 'Кожаная куртка',
                    price: 3500,
                    size: ['S', 'M', 'XS', 'L'],
                    colors: ['red', 'brown', 'black', 'white'],
                    id: 130001
                },
                {
                    photo: 'img/coat.png',
                    name: 'Джинсовая куртка',
                    price: 4500,
                    size: ['S', 'M', 'XS', 'L'],
                    colors: ['red', 'brown', 'black', 'white'],
                    id: 130002
                },
                {
                    photo: 'img/coat.png',
                    name: 'Куртка',
                    price: 2500,
                    size: ['S', 'M', 'XS', 'L'],
                    colors: ['red', 'brown', 'black', 'white'],
                    id: 130003
                },
                {
                    photo: 'img/hitSalle.png',
                    name: 'Кожаная куртка',
                    price: 5500,
                    hit: true,
                    size: ['S', 'M', 'XS', 'L'],
                    colors: ['red', 'brown', 'black', 'white'],
                    id: 130004
                },
                {
                    photo: 'img/coat.png',
                    name: 'Пальто',
                    price: 3000,
                    size: ['M', 'XS', 'L'],
                    colors: ['red', 'brown', 'black'],
                    id: 130005
                },  
                {
                    photo: 'img/coat.png',
                    name: 'Santa Marinella',
                    price: 1500,
                    size: ['S', 'M', 'XS'],
                    colors: ['brown', 'black', 'white'],
                    id: 130006
                },
                {
                    photo: 'img/coat.png',
                    name: 'Куртка',
                    price: 2500,
                    size: ['S', 'M', 'XS', 'L'],
                    colors: ['brown', 'white'],
                    id: 130007
                },
                {
                    photo: 'img/coat.png',
                    name: 'Пальто',
                    price: 3000,
                    size: ['S', 'M', 'L'],
                    colors: ['red', 'black', 'white'],
                    id: 130008
                }
            ];

godsArray.forEach((god) => {
    if(!god.hit) {
        createGods(god.photo, god.name, god.price, false);
    } 
});
godsArray.forEach((god) => {
    if(god.hit) {
        createGods(god.photo, god.name, god.price, true);
    }
});