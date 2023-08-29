//filter
const btnFilter = document.querySelector('.categories_filterBtn'),
      btnFilterIcon = btnFilter.querySelector('.categories_filterBtn_icon'),
      windowFilter = document.querySelector('.categories_filter'),
      rangeInput = document.querySelectorAll('.categories_filter_prices_range-input input'),
      priceInput = document.querySelectorAll('.categories_filter_prices_input input'),
      range = document.querySelector('.categories_filter_prices_slider_progress');
let priceGap = 1000;

// button open filter
btnFilter.addEventListener('click', () => {
    if(!windowFilter.classList.contains('categories_filter_openFilterWindow')) {
        windowFilter.classList.add('categories_filter_openFilterWindow');
        btnFilterIcon.classList.add('categories_filterBtn_icon_openFilterBtn');
    } else {
        windowFilter.classList.remove('categories_filter_openFilterWindow');
        btnFilterIcon.classList.remove('categories_filterBtn_icon_openFilterBtn');
    }
});

// range price in filter
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


const filterColors = document.querySelector('.categories_filter_colors'),
      btnMoreColors = document.querySelector('.categories_filter_colors_more'),
      lastElColor = filterColors.lastElementChild,
      filterSizes = document.querySelector('.categories_filter_sizes'),
      btnMoreSizes = document.querySelector('.categories_filter_sizes_more'),
      colors = ['Красный', 'Синий','Розовый','Белый','Красный','Оранжевый','Зеленый','Желтый'],
      sizes = ['XL','XXL'];
let checkBoxSizes,
    checkBoxColors;

// button more colors in filter
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

// button more sizes in filter
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
    elem.innerHTML = `<input type="${type}" value="${items}" name="${name}"><span class="checkmark"></span>${items}`;
    block.insertBefore(elem, block.lastElementChild);
    elem.classList.add('categories_filter_container');
    elem.classList.add('add');
};


const categoriesBody = document.querySelector('.categories_wrapper'),
      category = document.querySelector('.categories_header'),
      form = document.querySelector(".categories_filter"),
      submitButton = form.querySelector(".categories_filter_prices_btns_result"),
      resetButton = form.querySelector(".categories_filter_prices_btns_reset");

let tryDataBase; //  для исключения повторного подключения к бд


//get goods from dataBase and create good cards on page
function getData(category) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", async () => {
            try {
                const response = await fetch("http://localhost:3000/goods?sortingMethod=novelties");
                const goodsData = await response.json();
                tryDataBase = goodsData;
                //add all cards
                goodsData.forEach(good => {
                    if(!good.hits && good.category == category) {
                        createGoods(good.photo, good.name, good.price, good.hits, good._id);
                    } 
                });
                //add hit card
                goodsData.forEach(good => {
                    if(good.hits && good.category == category) {
                        createGoods(good.photo, good.name, good.price, good.hits, good._id);
                    } 
                });
            } catch (error) {
            console.error("Ошибка при получении данных:", error);
            }
        });
    } else {
        console.log('загружен сайт, обработчик не нужен');
        async () => {
            try {
                const response = await fetch("http://localhost:3000/goods?sortingMethod=novelties");
                const goodsData = await response.json();
                console.log(goodsData);
                goodsData.forEach(good => {
                    if(!good.hits && good.category == category) {
                        console.log('готово');
                        createGoods(good.photo, good.name, good.price, good.hits, good._id);
                    } 
                });
                goodsData.forEach(good => {
                    console.log('добавляю карточку хит');
                    if(good.hits && good.category == category) {
                        createGoods(good.photo, good.name, good.price, good.hits, good._id);
                    } 
                });
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };
    }
};

function createGoods(photo, name, price, hit, id) {
    const item = document.createElement('div');
    item.classList.add('categories_wrapper_item');
    item.setAttribute('id', `${id}`);
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
};

let dataCategory = category.getAttribute("data-category");

function createDefaultGoods() {
    dataCategory = category.getAttribute("data-category");
    console.log(dataCategory);
    getData(dataCategory);
};

function clearGoodsPage() {
    form.classList.remove('categories_filter_openFilterWindow');
    const currentGoods = document.querySelectorAll('.categories_wrapper_item');
    btnFilterIcon.classList.remove('categories_filterBtn_icon_openFilterBtn');
    currentGoods.forEach(currentGood => {
        currentGood.remove();
    });
};

function loadDataFromDatabase(funct, arg) {
    document.querySelector('.loading').style.display = 'block';
    return new Promise((resolve, reject) => {
        // addGoodsAfterFilter(filterData)
        funct(arg);
        console.log('создал!!!');
      // Если данные были успешно выгружены, вызываем resolve с данными в качестве аргумента
      resolve();
      // Если произошла ошибка при выгрузке данных, вызываем reject с ошибкой в качестве аргумента
      reject(error);
    });
};

// Вызов функции, которая возвращает промис


async function addGoodsAfterFilter(filterData) {
    try {
        const response = await fetch(`http://localhost:3000/goods?category=${filterData.category}&size=${filterData.size}&color=${filterData.color}&price=${JSON.stringify(filterData.price)}&sortingMethod=${filterData.sortingMethod}`);
        const goodsData = await response.json();

        goodsData.forEach(good => {
            if(!good.hits) {
                createGoods(good.photo, good.name, good.price, false, good._id);
            }
            // if(!good.hits && good.category == filterData.category && good.size.includes(filterData.size) && filterData.price.min <= good.price && good.price <= filterData.price.max && (filterData.color.some(item => good.colors.includes(item)) || filterData.color.length == 0)) {
            //     createGoods(good.photo, good.name, good.price, good.hits, good._id);
            // } 
        });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
};

//при добавлении новых товаров нужно добавлять дату в милисекундах
// const newTime = new Date;
// console.log(newTime.getTime());


// createDefaultGoods();
loadDataFromDatabase(createDefaultGoods)
    .finally(() => {
        // document.querySelector('.loading').style.display = 'none';
        setTimeout(() => {
            document.querySelector('.loading').style.display = 'none';
        }, 2000);
    });

// Submit and reset buttons fin the filter
document.addEventListener("DOMContentLoaded", () => {
    // Submit and reset buttons
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const sortMethod = form.querySelector("input[name='sort']:checked").value,
              colorCheckboxes = form.querySelectorAll(".categories_filter_colors input[type='checkbox']"),
              selectedColors = Array.from(colorCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value),
              sizeRadios = form.querySelectorAll(".categories_filter_sizes input[type='radio']"),
              selectedSize = Array.from(sizeRadios).find(radio => radio.checked).value,
              minPrice = parseFloat(form.querySelector(".input-min").value),
              maxPrice = parseFloat(form.querySelector(".input-max").value);

        let filterData = {
                            sortingMethod: sortMethod,
                            size: selectedSize,
                            color: selectedColors,
                            price: { min: minPrice, max: maxPrice },
                            category: dataCategory
        };

        clearAndCreateGoods()
            .then(() => {
                loadDataFromDatabase(addGoodsAfterFilter, filterData)
                    .finally(() => {
                        setTimeout(() => {
                            document.querySelector('.loading').style.display = 'none';
                        }, 2000);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        form.reset();
        clearAndCreateGoods()
            .then(() => {
                loadDataFromDatabase(createDefaultGoods)
                    .finally(() => {
                        setTimeout(() => {
                            document.querySelector('.loading').style.display = 'none';
                        }, 2000);
                    });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    function clearAndCreateGoods() {
        return new Promise((resolve, reject) => {
          clearGoodsPage();
          resolve();
        });
    };
});



//пример товара
// {
// "_id": 130010,
// "photo": "img/coats/wearing-long-gray-coat.jpg",
// "name": "Кожаный тренч",
// "price": 8400,
// "size": ["S","M", "XS"],
// "colors": ["серый", "бежевый", "черный"],
// "category": "coats",
// "date": "1693081256000"
// }
