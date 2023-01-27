window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu_dropDown'),
    menuItem = document.querySelectorAll('.list_item'),
    hamburger = document.querySelector('.header_left_catalog'),
    cross = document.querySelector('.menu_dropDown_cross');

    hamburger.addEventListener('click', () => {
        menu.classList.toggle('menu_dropDown_active');
    });

    cross.addEventListener('click', () => {
        menu.classList.toggle('menu_dropDown_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.toggle('menu_dropDown_active');
        });
    });
});