    
//Scroll season cadrs
const firstLine = document.querySelector(".season_wrapp_firstLine"),
      secondLine = document.querySelector('.season_wrapp_secondLine');

function scrollAnimationCards(line, side) {
    let startPosition,
    positionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startPosition = window.scrollY;
                observer.unobserve(entry.target);
            }
        });
    }),

    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {          
                window.addEventListener("scroll", () => {
                    let  movePosition = window.scrollY - startPosition;
                    if (movePosition >= 0) {
                        entry.target.style.cssText = `${side}: ${movePosition}px`;
                    } else {
                        entry.target.style.cssText = `${side}: 0px`;
                    }
                });          
            }
        });
    });
    positionObserver.observe(line);
    observer.observe(line);
}

window.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('title');
    if (page.innerHTML === "CottonBro") {
        scrollAnimationCards(firstLine,'left');
        scrollAnimationCards(secondLine, 'right');
    }
});

function showCard(item) {
    item.lastElementChild.style.cssText = 'display: none';
    item.firstElementChild.classList.add('anim');
}

function defaultCards(items) {
    removeAllCards(items);
    items[0].lastElementChild.style.cssText = 'display: none';
    items[0].firstElementChild.classList.add('anim');
}

function removeAllCards(items) {
    items.forEach(i => {
        i.lastElementChild.style.cssText = 'display: block';
        if (i.firstElementChild.classList.contains('anim')) {
            i.firstElementChild.classList.remove('anim');
        }
    });
}

let selectionItems = document.querySelectorAll('.selection_wrapper_item');
window.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('title');
    if (page.innerHTML === "CottonBro") {
        if (document.documentElement.clientWidth > 1200) {
            defaultCards(selectionItems);
            selectionItems.forEach(item => {
                item.addEventListener('mouseover', (e) => {
                    if(e.type==="mouseover") {
                        removeAllCards(selectionItems);
                        showCard(item);
                    } else if(e.type==="mouseout") {
                        defaultCards(item);
                    }
                });
            });
        } else if (document.documentElement.clientWidth < 1200 && document.documentElement.clientWidth > 700) {
            selectionItems.forEach(item => {
                item.addEventListener('mouseover', (e) => {
                    if(e.type === "mouseover") {
                        item.firstChild.style.cssText = 'width: 130%'
                    } 
                });
                item.addEventListener('mouseout', (e) => {
                    if(e.type === "mouseout") {
                        item.firstChild.style.cssText = 'width: 90%'
                    }
                });
            });
        }
    }
});


window.addEventListener("DOMContentLoaded", async () => {
    //links in selection
    const selectionItem = document.querySelectorAll('.selection_wrapper_item');

    selectionItem.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            console.log(event);
            const category = item.dataset.category;
            const categoryName = item.getAttribute('name');
            localStorage.setItem('selectedCategory', category);
            localStorage.setItem('selectedCategoryName', categoryName);
            window.location.href = `categories.html`;
        });
    });

    //links in third block
    const blockThirdItem = document.querySelectorAll('.flyCard');

    blockThirdItem.forEach(item => {
            item.addEventListener('click', event => {
            event.preventDefault();
            const category = item.dataset.category;
            const categoryName = item.getAttribute('name');
            localStorage.setItem('selectedCategory', category);
            localStorage.setItem('selectedCategoryName', categoryName);
            window.location.href = `categories.html`;
        });
    });

    //links in footer
    const blockFooterItem = document.querySelectorAll('.footer_category');
    
    blockFooterItem.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            const category = event.target.dataset.category;
            const categoryName = event.target.textContent;
            localStorage.setItem('selectedCategory', category);
            localStorage.setItem('selectedCategoryName', categoryName);
            window.location.href = `categories.html`;
        });
    });
    const categoryForYou = localStorage.getItem('selectedCategory');
    await createSpecialBlock('Для Тебя', 0, categoryForYou);
    const autumnBtn = document.getElementById('autumnBtn');
    const newCollectionBtn = document.getElementById('newCollectionBtn');
    autumnBtn.addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'jackets');
        localStorage.setItem('selectedCategoryName', 'Куртки');
        window.location.href = `categories.html`;
    });
    newCollectionBtn.addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'newCollection');
        localStorage.setItem('selectedCategoryName', 'New collection');
        window.location.href = `categories.html`;
    });
});



async function createSpecialBlock(blockName, numberSpecialBlock, category) {
    const specialBlock = document.querySelector(`#specialBlock${numberSpecialBlock}`);
    specialBlock.innerHTML = `<h2>${blockName}</h2>`;
    const wrapp = document.createElement('div');
    wrapp.classList.add('specialBlock_wrapp');
    specialBlock.append(wrapp);
    let categoryChoosed;
    if (!category) {
        categoryChoosed = 'coats';
    } else {
        categoryChoosed = category;
    };
    const response = await fetch(`http://localhost:3000/goods?sortingMethod=novelties&category=${categoryChoosed}`);
    const goodsData = await response.json();
    const firstFourGoods = goodsData.slice(0, 4);
    firstFourGoods.forEach(good => {
        const firstColor = Object.keys(good.photo)[0];
        const firstPhotos = good.photo[firstColor][0];
        const card = document.createElement('div');
        card.classList.add('specialBlock_wrapp_item');
        card.setAttribute('id', `${good._id}`);
        card.innerHTML = `  <img class="specialBlock_wrapp_photo" src="${firstPhotos}" alt="goodPhoto">
                            <div class="specialBlock_wrapp_descr">
                                <h5>${good.name}</h5>
                                <h4>${good.price}грн</h4>
                            </div>`
        wrapp.append(card);
        card.addEventListener('click', () => {
            let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
            let productExists = viewedProducts.find(item => item._id === good._id);
            if (!productExists) {
                if (viewedProducts.length >= 10) {
                    viewedProducts.pop();
                }
                viewedProducts.unshift(good);
                localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
            };
            const id = card.getAttribute('id');
            localStorage.setItem('cardProductId', id);
            window.location.href = 'cardProduct.html';
        });
    });
};