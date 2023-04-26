window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu_dropDown'),
    menuItem = document.querySelectorAll('.list_item'),
    catalog = document.querySelector('.header_left_catalog'),
    cross = document.querySelector('.menu_dropDown_cross'),
    mobileMenu = document.querySelector('.header_mobileMenu'),
    hamburger = document.querySelector('.header_mobileHamburger'),
    mobileLinks = document.querySelectorAll('.header_mobileMenu a');


    catalog.addEventListener('click', openOrCloseCatalog);

    menuItem.forEach(item => {
        item.addEventListener('click', openOrCloseCatalog);
    });

    document.querySelector('.header_btn').addEventListener('click', () => {
        if(!mobileMenu.classList.contains('mobile_active')) {
            mobileMenu.classList.add('mobile_active');
            hamburger.classList.add('hamburger_active');
            offScrolling();
        } else {
            mobileMenu.classList.remove('mobile_active');
            hamburger.classList.remove('hamburger_active');
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
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";
    }
    
    function onScrolling() {
        document.body.style.overflow = "";
        document.body.style.height = "";
    }

});
    
//Scroll season cadrs
    
function offset(el) {
    const rect = el.getBoundingClientRect(),
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {top: rect.top + scrollTop};
}

const firstLine = document.querySelector(".season_wrapp_firstLine"),
    secondLine = document.querySelector('.season_wrapp_secondLine');
let firstLinePoition = offset(firstLine).top + window.pageYOffset,
    secondLinePoition = offset(secondLine).top + window.pageYOffset;

function updateInitialPosition() {
    initialPosition = firstLine.offsetTop;
}

// DOMContentLoaded для установки начальной позиции элемента после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    updateInitialPosition();
});

// Обновление начальной позиции при изменении размера окна
window.addEventListener("resize", () => {
    updateInitialPosition();
});

// window.addEventListener("scroll", () => {
function updatePosition() {
    const firstLineScrollTop = window.pageYOffset;
    const firstLineDistance = firstLineScrollTop - firstLinePoition;
    
    if (firstLineDistance >= 0) {
        firstLine.style.left = firstLineDistance + "px";
    } else {
        firstLine.style.left = "0px";
    }

    const secondLineScrollTop = window.pageYOffset;
    const secondLineDistance = secondLineScrollTop - secondLinePoition;

    if (secondLineDistance >= 0) {
        secondLine.style.left = '-' + secondLineDistance + 'px';
    } else {
        secondLine.style.left = "0px";
    }

    requestAnimationFrame(updatePosition);
};

requestAnimationFrame(updatePosition);
// });


