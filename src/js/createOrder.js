let orderPrice;
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
        const numDisc = parseFloat(discount);
        const afterDiscount = priceCounter - (priceCounter * (numDisc / 100));
        totalPrice.innerHTML = `${afterDiscount} грн`;
        orderPrice = afterDiscount;
    } else {
        totalPrice.innerHTML = `${priceCounter} грн`;
        orderPrice = priceCounter;
    }
    
};

document.addEventListener('DOMContentLoaded', () => {
    totalCounter();

    document.getElementById("btnSubmitformCreateOrder").addEventListener("click", function(e) {
        const form = document.getElementById("formCreateOrder");
        // Проверка, заполнены ли обязательные поля
        if (!form.checkValidity()) {
            const modal = document.querySelector('.order_modal'),
                  modalText = document.querySelector('.order_modal_text');
            modalText.innerHTML = 'Пожалуйста, заполните все поля!';
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 2000);
            console.error('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        e.preventDefault();
        
        const formData = new FormData(form);

        const arrBasket = JSON.parse(localStorage.getItem('basket'));
        arrBasket.forEach((obj, i) => {
            const item = [obj.id, obj.name, obj.size, obj.color, obj.price];
            formData.append(`good${i}`, item);
        });
        formData.append(`totalPrice`, orderPrice);
        const discount = localStorage.getItem('discount');
        formData.append(`discount`, `${discount}%`);

        fetch('http://localhost:3000/order_form', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // код для отображения модального окна
            const modal = document.querySelector('.order_modal'),
                  modalText = document.querySelector('.order_modal_text');
            modalText.innerHTML = 'Загрузка платежной системы';
            modal.style.display = 'flex'
            setTimeout(() => {
                modal.style.display = 'none';
                window.location.href = 'paymentForm.html';
            }, 1000);
            console.log('Форма успешно отправлена!');
            form.reset();
        })
        .catch((error) => {
            console.error('Ошибка:', error);
        });
    });

    // const btnPromo = document.querySelector('.basket_main_info_card_formPromo_btn');
    // btnPromo.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const formPromo = document.querySelector('.basket_main_info_card_formPromo');
    //     const promoCodeInput = formPromo.querySelector('input[name="promoCode"]');
    //     const promoCode = promoCodeInput.value;
    //     console.log(promoCode.value);

    //     fetch('http://localhost:3000/promo', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ promoCode })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.code) {
    //             console.log(`Промокод ${data.code} действителен! Скидка: ${data.discount}`);
    //             promoCodeInput.value = `Скидка по промокоду ${data.discount}`;
    //             localStorage.setItem('discount', `${data.discount}`);
    //             totalCounter();
    //         } else {
    //             promoCodeInput.value = `${data.message}`;
    //             localStorage.setItem('discount', 0);
    //             totalCounter();
    //             setTimeout(() => {
    //                 promoCodeInput.value = `Промокод`;
    //             }, 2000);
    //         }
    //     })
    //     .catch((error) => {
    //         console.error('Ошибка:', error);
    //     });


    // });
});


