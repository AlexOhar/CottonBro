window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu_dropDown'),
          menuItem = document.querySelectorAll('.list_item'),
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

    menuItem.forEach(item => {
        item.addEventListener('click', openOrCloseCatalog);
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

});
    
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
    scrollAnimationCards(firstLine,'left');
    scrollAnimationCards(secondLine, 'right');
});

//animation selection

// function resizeSelection() {
//     if (window.innerHeight > 1200) {

//     }
// }

// window.onload = resizeSelection;
// window.onresize = resizeSelection;

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
    // if (document.documentElement.clientWidth > 1200) {
    //     defaultCards(selectionItems);
    // }
    if (document.documentElement.clientWidth > 1200) {
        // console.log(document.documentElement.clientWidth);
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
                // else if(e.type === "mouseout") {
                //     item.firstChild.style.cssText = 'width: 90%'
                // }
            });
            item.addEventListener('mouseout', (e) => {
                if(e.type === "mouseout") {
                    item.firstChild.style.cssText = 'width: 90%'
                }
            });
        });
    
    }
});


// selectionItems.forEach(item => {
//     item.addEventListener('mouseout', defaultCards(item));
// });


