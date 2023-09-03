//start upload page
function getCategory() {
    const gotCategory = localStorage.getItem('selectedCategory'),
          gotCategoryName = localStorage.getItem('selectedCategoryName'),
          blockCategory = document.querySelector('.categories_header');
    blockCategory.dataset.category = `${gotCategory}`;
    blockCategory.innerHTML = `${gotCategoryName}`;
}

window.addEventListener("DOMContentLoaded", () => {
    getCategory();
});

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
      colors = ['Красный', 'Синий','Розовый','Белый','Оранжевый','Зеленый','Желтый'],
      sizes = ['XL','XXL'];
let checkBoxSizes,
    checkBoxColors;

// button more colors in filter
btnMoreColors.addEventListener('click', () => {
    if(btnMoreColors.innerHTML === 'Еще') {
        colors.forEach((item) => {
            createElemForFilter(item, filterColors, checkBoxColors, "checkbox", "color");
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
    const lowCaseItem = items.toLowerCase();
    elem = document.createElement('label');
    elem.innerHTML = `<input type="${type}" value="${lowCaseItem}" name="${name}""><span class="checkmark"></span>${items}`;
    block.insertBefore(elem, block.lastElementChild);
    elem.classList.add('categories_filter_container');
    elem.classList.add('add');
}

const categoriesBody = document.querySelector('.categories_wrapper'),

      form = document.querySelector(".categories_filter"),
      submitButton = form.querySelector(".categories_filter_prices_btns_result"),
      resetButton = form.querySelector(".categories_filter_prices_btns_reset");
let category = localStorage.getItem('selectedCategory');

function loadingGoods(funct, ...args) {
    document.querySelector('.loading').style.display = 'block';
    return funct(...args)
            .finally(() => {
                setTimeout(() => {
                    document.querySelector('.loading').style.display = 'none';
                }, 2000);
            });
};
//get goods from dataBase and create good cards on page
async function gettingGoods(endUrl, category, hit) {
    try {
        // const filterData = filter;
        const response = await fetch(`http://localhost:3000/goods?${endUrl}`);
        const goodsData = await response.json();
        goodsData.forEach(good => {
            if(!good.hits && good.category == category) {
                createGoods(good.photo, good.name, good.price, good.hits, good._id);
            } 
        });
        if (hit) {
            goodsData.forEach(good => {
                if(good.hits && good.category== category) {
                    createGoods(good.photo, good.name, good.price, good.hits, good._id);
                } 
            });
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    clearAndCreateGoods() 
        .then(() => {
            loadingGoods(gettingGoods, `sortingMethod=novelties&category=${category}`, category, true)
                .finally(() => {
                    setTimeout(() => {
                        document.querySelector('.loading').style.display = 'none';
                    }, 2000);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

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
}

function clearGoodsPage() {
    form.classList.remove('categories_filter_openFilterWindow');
    const currentGoods = document.querySelectorAll('.categories_wrapper_item');
    btnFilterIcon.classList.remove('categories_filterBtn_icon_openFilterBtn');
    currentGoods.forEach(currentGood => {
        currentGood.remove();
    });
};

function clearAndCreateGoods() {
    return new Promise((resolve, reject) => {
      clearGoodsPage();
      resolve();
    })
};

// Submit and reset buttons in the filter
document.addEventListener("DOMContentLoaded", () => {
    
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const sortMethod = form.querySelector("input[name='sort']:checked").value,
              colorCheckboxes = form.querySelectorAll(".categories_filter_colors input[type='checkbox']"),
              selectedColors = Array.from(colorCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value),
              sizeRadios = form.querySelectorAll(".categories_filter_sizes input[type='radio']"),
              selectedSize = Array.from(sizeRadios).find(radio => radio.checked)?.value || null,
              minPrice = parseFloat(form.querySelector(".input-min").value),
              maxPrice = parseFloat(form.querySelector(".input-max").value),
              categoryData = category,
              filterData = {
                            sortingMethod: sortMethod,
                            size: selectedSize,
                            color: selectedColors,
                            price: { min: minPrice, max: maxPrice },
                            category: categoryData
              },
              endUrl = `sortingMethod=${filterData.sortingMethod}&category=${filterData.category}&size=${filterData.size}&color=${filterData.color}&price=${JSON.stringify(filterData.price)}`;
        console.log(selectedSize);
        clearAndCreateGoods()
            .then(() => {
                loadingGoods(gettingGoods, endUrl, category, false)
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
                loadingGoods(gettingGoods, `sortingMethod=novelties`, category, true)
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
})

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
