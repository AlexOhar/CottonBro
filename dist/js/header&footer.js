document.addEventListener("DOMContentLoaded", () => {
    const sectionHeader = document.querySelector('.header'),
          blockMenu = document.querySelector('.menu'),
          sectionFooter = document.querySelector('.footer');

    sectionHeader.innerHTML = `
            <div class="header_left">
            <button href="#" target="_self" class="header_left_catalog">Каталог</button>
            </div>
            <div class="header_logo">
            <a href="index.html">
                <img src="icons/logo.png" alt="logo">
            </a>
            </div>
            <div class="header_right">
                <a href="#"><img src="icons/account.png" alt="account"></a>
                <!-- <a href="#"><img src="icons/search.png" alt="search"></a> -->
                <a href="#"><img src="icons/favorites.png" alt="favorites"></a>
                <a href="myBasket.html"><span class="basketIcon_count"></span><img class="basketIcon" src="icons/basket.png" alt="basket"></a>
                <div class="header_btn">
                    <span class="header_mobileHamburger"></span>
                </div>
                <span id='counterOnHamburger' class="basketIcon_count"></span>
                <div class="header_mobileMenu">
                    <a href="#">Аккаунт</a>
                    <!-- <a href="#">Поиск</a> -->
                    <a href="#">Избранное</a>
                    <a href="myBasket.html">Корзина<span id='counterInHamburger' class="basketIcon_count"></span></a>
                </div>
            </div> `;

    blockMenu.innerHTML = `
            <div class="menu_dropDown">
                <div class="menu_dropDown_search">
                    <p>
                        <input class="srch" type="search" placeholder="Поиск по каталогу" name="s">
                        <input class="icon" type="image" src="icons/search.png">
                    </p>
                </div>
                <ul class="list">
                    <li><a class="list_item" data-category="coats" href="#">Пальто</a></li>
                    <li><a class="list_item" data-category="jackets" href="#">Куртки</a></li>
                    <li><a class="list_item" data-category="dresses" href="#">Платья</a></li>
                    <li><a class="list_item" data-category="pants" href="#">Брюки</a></li>
                    <li><a class="list_item" data-category="suits" href="#">Костюмы</a></li>
                    <li><a class="list_item" data-category="jeans" href="#">Джинсы</a></li>
                    <li><a class="list_item" data-category="sweaters" href="#">Свитера</a></li>
                    <li><a class="list_item" data-category="suitJackets" href="#">Пиджаки</a></li>
                    <li><a class="list_item" data-category="blouses" href="#">Блузы</a></li>
                    <li><a class="list_item" data-category="newCollection" href="#">New collection</a></li>
                    <li><a class="list_item" data-category="sale" href="#">Sale</a></li>
                </ul>
            </div>  `;

    const menu = document.querySelector('.menu_dropDown'),
          menuItem = menu.querySelectorAll('.list_item'),
          catalog = document.querySelector('.header_left_catalog'),
          mobileMenu = document.querySelector('.header_mobileMenu'),
          hamburger = document.querySelector('.header_mobileHamburger'),
          btnHamburger = document.querySelector('.header_btn'),
          mobileLinks = document.querySelectorAll('.header_mobileMenu a'),
          body = document.body;

    //преходы на страницы
    catalog.addEventListener('click', () => {
        openOrCloseCatalog();
        if(mobileMenu.classList.contains('mobile_active')) {
            mobileMenu.classList.remove('mobile_active');
            hamburger.classList.remove('hamburger_active');
            // offScrolling();
        }
    });

    //links in dropDown menu
    menuItem.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            const category = event.target.dataset.category;
            const categoryName = event.target.textContent;
            localStorage.setItem('selectedCategory', category);
            localStorage.setItem('selectedCategoryName', categoryName);
            window.location.href = `categories.html`;
            openOrCloseCatalog();
        });
    });
    document.addEventListener('click', (e) => {
        const isClickInsideModal = menu.contains(e.target);
        // && e.target !== btnHamburger
        if (!isClickInsideModal && e.target !== catalog) {
            menu.classList.remove('menu_dropDown_active');
            onScrolling();
        }
    });

    document.addEventListener('click', (e) => {
        const isClickInsideModalMob = mobileMenu.contains(e.target);
        
        if (!isClickInsideModalMob && e.target !== btnHamburger && e.target !== catalog) {
            mobileMenu.classList.remove('mobile_active');
            hamburger.classList.remove('hamburger_active');
            onScrolling();
        }
    });
    
    btnHamburger.addEventListener('click', (e) => {
        const counterBask = document.getElementById('counterOnHamburger');
        if(!mobileMenu.classList.contains('mobile_active')) {
            mobileMenu.classList.add('mobile_active');
            hamburger.classList.add('hamburger_active');
            counterBask.style.display = 'none';

            offScrolling();
        } else {
            mobileMenu.classList.remove('mobile_active');
            hamburger.classList.remove('hamburger_active');
            if (counterBask.innerHTML !== '0' && counterBask.innerHTML !== '') {
                counterBask.style.display = 'block';
            }
            onScrolling();
        }
    });
    
    mobileLinks.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('mobile_active');
            hamburger.classList.remove('hamburger_active');
            onScrolling();
        });
    });

    function openOrCloseCatalog() {
        if(!menu.classList.contains('menu_dropDown_active')) {
            menu.classList.add('menu_dropDown_active');
            offScrolling();
        } else {
            menu.classList.remove('menu_dropDown_active');
            onScrolling();
        }
    }

    function offScrolling() {
        let pagePosition = window.scrollY;
        body.style.overflow = 'hidden';
        body.style.height = '100vh';
        body.style.position = 'fixed';
        body.style.left = '0';
        body.style.width = '100%';
        body.dataset.position = pagePosition;
        body.style.top = `-${pagePosition}px`;
    }
    
    function onScrolling() {
        let pagePosition = parseInt(body.dataset.position, 10);
        // console.log(pagePosition);
        body.style.top = 'auto';
        body.style = '';
        window.scrollBy(pagePosition, 0);
        body.removeAttribute('data-position');
    }

    sectionFooter.innerHTML = `
                <span></span>
                <h3 class="footer_header">CottonBro</h3>
                <div class="footer_wrapper">
                <div class="footer_wrapper_left">
                    <div class="footer_wrapper_left_subheader">Подпишись на новости и скидки и получи -15% скидки</div>
                    <input type="email" name="" id="" placeholder="E-mail" pattern=".+@google\.com" size="32" required>
                    <button class="footer_wrapper_left_button">Подписаться</button>
                </div>
                <div class="footer_wrapper_center">
                    <div class="footer_wrapper_center_lists footer_wrapper_center_lists_first">
                        <ul>
                            <li><a class="footer_category" data-category="coats" href="#">Пальто</a></li>
                            <li><a class="footer_category" data-category="jackets" href="#">Куртки</a></li>
                            <li><a class="footer_category" data-category="dresses" href="#">Платья</a></li>
                            <li><a class="footer_category" data-category="pants" href="#">Брюки</a></li>
                            <li><a class="footer_category" data-category="suits" href="#">Костюмы</a></li>
                        </ul>
                    </div>
                    <div class="footer_wrapper_center_lists footer_wrapper_center_lists_second">
                        <ul>
                            <li><a class="footer_category" data-category="jeans" href="#">Джинсы</a></li>
                            <li><a class="footer_category" data-category="sweaters" href="#">Свитера</a></li>
                            <li><a class="footer_category" data-category="suitJackets" href="#">Пиджаки</a></li>
                            <li><a class="footer_category" data-category="blouses" href="#">Блузы</a></li>
                        </ul>
                    </div>
                    <div class="footer_wrapper_center_lists footer_wrapper_center_lists_third">
                        <ul>
                            <li><a href="#">Доставка</a></li>
                            <li><a href="#">Способ оплаты</a></li>
                            <li><a href="#">Примерка и уход</a></li>
                            <li><a href="#">Возврат и обмен</a></li>
                            <li><a href="contacts.html">Магазины</a></li>
                            <li><a href="aboutUs.html">О Бренде</a></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
                <div class="footer_wrapper_right">
                    <div class="footer_wrapper_right_pay">
                    <img src="icons/footer/visa.png" alt="visa">
                    <img src="icons/footer/mc.png" alt="master card">
                    <img src="icons/footer/applePay.png" alt="apple pay">
                    </div>
                    <div class="footer_wrapper_right_connect">
                    <a href="#"><img src="icons/footer/Messenger_white.png" alt="messenger"></a>
                    <a href="#"><img src="icons/footer/Facebook_white.png" alt="facebook"></a>
                    <a href="#"><img src="icons/footer/Telegram_white.png" alt="telegram"></a>
                    <a href="#"><img src="icons/footer/Instagram_white.png" alt="instagram"></a>
                    <a href="#"><img src="icons/footer/Viber_white.png" alt="viber"></a>
                    </div>
                </div>
                </div>`;
});

document.addEventListener('DOMContentLoaded', () => {
    const basketIconCount = document.querySelectorAll('.basketIcon_count');
    function checkBasketCounter() {
        if (!localStorage.getItem('basketCounter') || localStorage.getItem('basketCounter') == '0') {
            localStorage.setItem('basketCounter', "0");
        } else {
            basketIconCount.forEach(item => {
                item.innerHTML = localStorage.getItem('basketCounter');
                item.style.display = "block"; 
            });
            // basketIconCount.innerHTML = localStorage.getItem('basketCounter');
            // basketIconCount.style.display = "block";
        };
        // console.log(localStorage.getItem('basketCounter'));
    };
    checkBasketCounter();
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            basketIconCount.forEach(item => {
                if (item.innerText !== "0") {
                    item.style.display = "block";
                } else if (item.innerText == "0") {
                    item.style.display = "none";
                }
            });
        });
    });

    let config = { childList: true, characterData: true, subtree: true };
    observer.observe(basketIconCount[0], config);
});