let orderPrice;
function totalCounter() {
    const totalQuantity = document.querySelector('.basket_main_info_card_quantityGoods_quantity'),
        //   priceWithoutPromo = document.querySelector('.basket_main_info_card_coast_price'),
          totalPrice = document.querySelector('.basket_main_info_card_total_summ');
    let priceCounter = 0,
        qnt = 0;
    const arrBasket = JSON.parse(localStorage.getItem('basket'));
    arrBasket.forEach(obj => {
        const cut = obj.price.slice(0, 4);
        const summ = Number(cut) * obj.quantity;
        // console.log(summ);
        priceCounter += Number(summ);
        qnt = qnt + obj.quantity;
    });
    totalQuantity.innerHTML = `${qnt} шт`;
    // priceWithoutPromo.innerHTML = `${priceCounter} грн`;
    const discount = localStorage.getItem('discount');
    if (discount) {
        // const num = discount.slice(0,1);
        const numDisc = parseFloat(discount);
        console.log(numDisc);
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
    document.getElementById('cardData').addEventListener('input', function (e) {
        const target = e.target, position = target.selectionEnd, length = target.value.length;
        
        target.value = target.value.replace(/[^\d]/g, '').replace(/(\d{2})/, '$1/');
        
        if(position !== length && (position !== length - 1 || isNaN(parseInt(target.value.charAt(position),10)))){
            target.selectionEnd = position;
        }
    });
    const paymentMethodBtns = document.querySelectorAll('.payment_main_form_method_options');
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {

            paymentMethodBtns.forEach(item => {
                item.firstChild.removeAttribute('checked');
            });
            const nearestInput = e.target.firstChild;
            if (nearestInput) {
                nearestInput.setAttribute('checked', '')
            };
        });
    });
});

