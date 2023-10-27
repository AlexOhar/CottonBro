// const { create } = require("browser-sync");
const arrBasket = JSON.parse(localStorage.getItem('basket')),
      blockGoods = document.querySelector('.basket_main_goods');
localStorage.setItem('discount', 0);
document.addEventListener('DOMContentLoaded', () => {
    if (arrBasket) {
        const emptyBasket = document.querySelector('.basket_main_goods_empty');
        emptyBasket.style.display = 'none';
        for (let i = 0; i < arrBasket.length; i++) {
            const good = arrBasket[i];
            const item = document.createElement('div');
            item.classList.add('basket_main_goods_item');
            item.setAttribute('id', `${good.id}`);
            item.setAttribute('data-size', `${good.size}`);
            item.setAttribute('data-color', `${good.color}`);
            item.setAttribute('data-quantity', `${good.quantity}`);
            item.innerHTML = `
                <svg class="basket_main_goods_item_cross" xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                    <path d="M25.1934 1L1.00007 25.1933" stroke="black" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
                    <path d="M25.496 25.496L1.30273 1.30273" stroke="black" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <img src="${good.photo} "alt="">
                <div class="basket_main_goods_item_info">
                    <h4 class="basket_main_goods_item_info_name">${good.name}</h4>
                    <h4 class="basket_main_goods_item_info_param">Цвет ${good.color}, размер ${good.size}</h4>
                    <div class="basket_main_goods_item_info_price">
                        <h3>${good.price}</h3>
                        <div class="basket_main_goods_item_info_price_amount">
                            <div class="basket_main_goods_item_info_price_amount_blockMin">
                                <span class="basket_main_goods_item_info_price_amount_blockMin_minus"></span>
                            </div>
                            <h4 class="amountText">${good.quantity} шт</h4>
                            <div class="basket_main_goods_item_info_price_amount_blockPlus">
                                <span class="basket_main_goods_item_info_price_amount_blockPlus_plus"></span>
                            </div>
                        </div>
                    </div>
                </div>`;
            blockGoods.append(item);
        };
    };

    basketEmpty();
    totalCounter();

    const deleteCroses = document.querySelectorAll('.basket_main_goods_item_cross');
    deleteCroses.forEach(cross => {
        cross.addEventListener('click', (e) => {
            const item = e.target.closest('.basket_main_goods_item');
            changesIntoBasket(item, 'delete');
        });
    });
    //buttons plus and minus
    const minuses = document.querySelectorAll('.basket_main_goods_item_info_price_amount_blockMin'),
          pluses = document.querySelectorAll('.basket_main_goods_item_info_price_amount_blockPlus');
    minuses.forEach((btn, i) => {
        btn.addEventListener('click', (e)  => {
            const item = e.target.closest('.basket_main_goods_item'),
                  amounts = document.querySelectorAll('.amountText');
            let amount = amounts[i];
            if (amount) {
                const amountText = amount.innerHTML;
                let num = Number(amountText.slice(0,-2));
                if (num > 1) {
                    num = num - 1;
                    amount.innerHTML = `${num} шт`;
                };
            } else console.log('Element not found');
            changesIntoBasket(item, 'change', 'minus');
        });
    });

    pluses.forEach((btn, i) => {
        btn.addEventListener('click', (e)  => {
            const item = e.target.closest('.basket_main_goods_item'),
                  amounts = document.querySelectorAll('.amountText');
            let amount = amounts[i];
            if (amount) {
                const amountText = amount.innerHTML;
                let num = Number(amountText.slice(0,-2));
                num = num + 1;
                amount.innerHTML = `${num} шт`;
            } else console.log('Element not found');
            changesIntoBasket(item, 'change', 'plus');
        });
    });
    
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            totalCounter();
            basketEmpty();
        });
    });

    let config = { childList: true, characterData: true, subtree: true };
    observer.observe(blockGoods, config);

    const btnPromo = document.querySelector('.basket_main_info_card_formPromo_btn');
    btnPromo.addEventListener('click', (e) => {
        e.preventDefault();
        const formPromo = document.querySelector('.basket_main_info_card_formPromo');
        const promoCodeInput = formPromo.querySelector('input[name="promoCode"]');
        const promoCode = promoCodeInput.value;
        console.log(promoCode.value);

        fetch('http://localhost:3000/promo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ promoCode })
        })
        .then(response => response.json())
        .then(data => {
            if (data.code) {
                console.log(`Промокод ${data.code} действителен! Скидка: ${data.discount}`);
                promoCodeInput.value = `Скидка по промокоду ${data.discount}`;
                localStorage.setItem('discount', `${data.discount}`);
                totalCounter();
            } else {
                promoCodeInput.value = `${data.message}`;
                localStorage.setItem('discount', 0);
                totalCounter();
                setTimeout(() => {
                    promoCodeInput.value = `Промокод`;
                }, 2000);
            }
        })
        .catch((error) => {
            console.error('Ошибка:', error);
        });


    });
});

function totalCounter() {
    const totalQuantity = document.querySelector('.basket_main_info_card_quantityGoods_quantity'),
          priceWithoutPromo = document.querySelector('.basket_main_info_card_coast_price'),
          totalPrice = document.querySelector('.basket_main_info_card_total_summ');
    let priceCounter = 0,
        qnt = 0;
    const arrBasket = JSON.parse(localStorage.getItem('basket'));
    arrBasket.forEach(obj => {
        const cut = obj.price.slice(0, 4);
        const summ = Number(cut) * obj.quantity;
        priceCounter += Number(summ);
        qnt = qnt + obj.quantity;
    });
    totalQuantity.innerHTML = `${qnt} шт`;
    priceWithoutPromo.innerHTML = `${priceCounter} грн`;
    const discount = localStorage.getItem('discount');
    if (discount) {
        // const num = discount.slice(0,1);
        const numDisc = parseFloat(discount);
        console.log(numDisc);
        const afterDiscount = priceCounter - (priceCounter * (numDisc / 100));
        totalPrice.innerHTML = `${afterDiscount} грн`;
    } else {
        totalPrice.innerHTML = `${priceCounter} грн`;
    }
    
};

function changesIntoBasket(item, act, side) {
    const arrBasket = JSON.parse(localStorage.getItem('basket'));
    const id = item.getAttribute('id'),
          size = item.getAttribute('data-size'),
          color = item.getAttribute('data-color');
    if (act === 'delete') {
        const deleteQuantity = item.getAttribute('data-quantity'),
            currQuantity = localStorage.getItem('basketCounter'),
            newQuantity = currQuantity - deleteQuantity;
        if (newQuantity < 0) {
            localStorage.setItem('basketCounter', 0);
        } else {
            localStorage.setItem('basketCounter', newQuantity);
            const basketCounters = document.querySelectorAll('.basketIcon_count');
            basketCounters.forEach(icon => {
                icon.innerHTML = `${newQuantity}`;
            });
        }
        item.remove();
        const newArrBasket = arrBasket.filter(obj => {
            return !(obj.id === id && obj.size === size && obj.color === color);
        });
        localStorage.setItem('basket', JSON.stringify(newArrBasket));
        totalCounter();
    }
    if (act === 'change') {
        const basketCounter = document.querySelector('.basketIcon_count');
        const newArray = [];
        if (side === 'minus') {
            const currQuantity = Number(item.getAttribute('data-quantity'));
            if (currQuantity <= 1) {
                item.setAttribute('data-quantity', 1);
                arrBasket.forEach(obj => {
                    newArray.push(obj);
                });
            } else {
                item.setAttribute('data-quantity', `${currQuantity - 1}`);
                arrBasket.forEach(obj => {
                    let a = obj;
                    if (obj.id === id && obj.size === size && obj.color === color) {
                        a.quantity = currQuantity - 1;
                    }
                    newArray.push(a);
                });
            }
        } else if (side === 'plus') {
            const currQuantity = Number(item.getAttribute('data-quantity'));
            item.setAttribute('data-quantity', `${currQuantity + 1}`);
            arrBasket.forEach(obj => {
                let a = obj;
                if (obj.id === id && obj.size === size && obj.color === color) {
                    a.quantity = currQuantity + 1;
                }
                newArray.push(a);
            });
        }
        localStorage.setItem('basket', JSON.stringify(newArray));
        totalCounter();
        const amount = document.querySelector('.basket_main_info_card_quantityGoods_quantity').innerHTML;
        const newAmount = Number(amount.slice(0,-3));
        localStorage.setItem('basketCounter', newAmount);
        basketCounter.innerHTML = `${newAmount}`;
        const basketCounters = document.querySelectorAll('.basketIcon_count');
        basketCounters.forEach(icon => {
            icon.innerHTML = `${newAmount}`;
        });
    };
};

function basketEmpty() {
    if (!document.querySelector('.basket_main_goods_item')) {
        const emptyBasket = document.querySelector('.basket_main_goods_empty');
        emptyBasket.style.display = 'block';
    };
};



