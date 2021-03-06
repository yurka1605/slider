const slides = [
    {
        city: 'Санкт-Петербург',
        text: 'от 35’000 рублей<br><br>6 дней/5 ночей<br>название отеля',
        code: 'spb',
        img: 'piter',
        whatsAppHref: '#spb'
    },
    {
        city: 'Крым',
        text: 'от 35’000 рублей<br><br>6 дней/5 ночей<br>название отеля',
        code: 'krum',
        img: 'krum',
        whatsAppHref: '#krum'
    },
    {
        city: 'Карелия',
        text: 'от 35’000 рублей<br><br>6 дней/5 ночей<br>название отеля',
        code: 'karelia',
        img: 'karelia',
        whatsAppHref: '#karelia'
    },
    {
        city: 'Москва',
        text: 'от 35’000 рублей<br><br>6 дней/5 ночей<br>название отеля',
        code: 'moscow',
        img: 'moscow',
        whatsAppHref: '#moscow'
    },
    {
        city: 'Байкал',
        text: 'от 35’000 рублей<br><br>6 дней/5 ночей<br>название отеля',
        code: 'baikal',
        img: 'baikal',
        whatsAppHref: '#baikal'
    }
];

$( document ).ready(function() {
    let vh = $(window).innerHeight() * 0.01;
    $('.slider, body, html').attr('style', `--vh: ${ vh }px`);
    // Текущий урл
    const url = document.location.href;
    const slidesLength = slides.length;
    const slidesBox = parseInt(slidesLength / 3, 10);
    const wrapper = $('.slider__images-wrap');
    
    // Сотрировка слайдов по текущему городу
    slides.forEach((el, i) => {
        const regExp = new RegExp(el.code);
        if (regExp.test(url)) {
            const currentCity = slides[i];
            slides.splice(i, 1);
            slides.unshift(currentCity);
        }
    });

    // наполняем слайдер
    slides.forEach((el, i) => {
        // Слайды
        const slide = `<div data-num="${ i }" class="slider__img${ i === 0 ? ' active' : '' }">
            <img src="./img/${ el.img }.png" alt="${ el.city }" title="${ el.city }">
        </div>`;
        $('.bg-shadow').before(slide);

        // Основная информация
        if (i === 0) {
            changeInfo(el);
        }

        // Миниатюры
        const minSlide = `<div data-num="${ i }" ontouchstart="startToush(event)" ontouchend="changeSlide(this, ${ i }, event)" class="image__min${ i === 0 ? ' active' : '' }">
            <img src="./img/${ el.img }.png" alt="${ el.city }">
            <div class="image__min_title">${ el.city }</div>
        </div>`;
        $('.slider__images-min').append(minSlide);

        // Точки
        const dot = `<div class="slider__dot${ i === 0 ? ' active' : '' }"></div>`;
        $('.slider__dots').append(dot);

        $('.city__info').data('code', '');
    });

    $('.wrapper').swipe({
        swipeRight: function(e) {
            e.stopPropagation();
            const num = $('.slider__img.active').data('num') - 1;
            if (num < 0) {
                return;
            }
            changeSlide($('.slider__img.active').prev(), num, undefined);
        },
        swipeLeft: function(e) {
            e.stopPropagation();
            const num = $('.slider__img.active').data('num') + 1;
            if (num === slidesLength) {
                return;
            }
            changeSlide($('.slider__img.active').next(), num, undefined);
        },
        triggerOnTouchLeave: true,
        threshold: 40,
    });

    $('.slider__images-wrap').swipe( {
        swipeRight: function() {
            const currentState = $('.slider__images-min').css('transform');
            const currentStatePX = currentState === 'none' ? 'none' : parseFloat(currentState.split(',')[4]);
            const currentBox = parseInt(wrapper.data('box'));
            if (currentBox === 0) {
                return;
            }

            $('.slider__images-min').css('transform', `matrix(1, 0, 0, 1, ${ currentStatePX + wrapper.width() + 20}, 0)`);
            wrapper.data('box', `${ currentBox - 1 }`);
        },
        swipeLeft: function() {
            const currentState = $('.slider__images-min').css('transform'); 
            const currentStatePX = currentState === 'none' ? 0 : parseFloat(currentState.split(',')[4]);
            const currentBox = parseInt(wrapper.data('box'));
            if (currentBox === slidesBox) {
                return;
            }

            $('.slider__images-min').css('transform', `matrix(1, 0, 0, 1, ${ currentStatePX - wrapper.width() - 20}, 0)`);
            wrapper.data('box', `${ currentBox + 1 }`);
        },
        triggerOnTouchLeave: true,
        threshold: 20, // сработает через 20 пикселей
    });
});

function changeInfo(el) {
    $('.slider__city').html(el.city);
    $('.slider__info').html(el.text);
    $('.slider__link').attr('href', el.whatsAppHref);
}

let toushStart = 0;

function changeSlide(selector, i, e) {
    if (e !== undefined) {
        const tousheEnd = e.changedTouches[0].clientX;
        const changeThouch = toushStart - tousheEnd;
        if ($(selector).hasClass('active') || changeThouch !== 0 ) {
            return;
        }
    }

    const left = $(window).width() * i;
    $('.slider__images').css('transform', `translate(-${ left }px)`);
    $('.image__min').each((index, el) => {
        if ($(el).hasClass('active')) {
            $(`.slider__img:nth-child(${ index + 1 })`).removeClass('active');
            $(`.slider__dot:nth-child(${ index + 1 })`).removeClass('active');
            $(`.image__min:nth-child(${ index + 1 })`).removeClass('active');
        }
    });
    $(`.image__min:nth-child(${ i + 1 })`).addClass('active');
    $(`.slider__img:nth-child(${ i + 1 })`).addClass('active');
    $(`.slider__dot:nth-child(${ i + 1 })`).addClass('active');
    $('.city__info').css('transform', 'translateX(-130%)');
    setTimeout(() => {
        changeInfo(slides[i]);
        $('.city__info').css('transform', 'translateX(0)');
    }, 300);
}

function startToush(e) {
    toushStart = e.changedTouches[0].clientX;
}