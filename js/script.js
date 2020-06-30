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
    // Текущий урл
    const url = document.location.href;
    const slidesLength = slides.length;
    const slidesBox = parseInt(slidesLength / 3, 10);
    // const ost = slidesLength % 3;
    
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
        const slide = `<div class="slider__img${ i === 0 ? ' active' : '' }">
            <img src="./img/${ el.img }.png" alt="${ el.city }" title="${ el.city }">
        </div>`;
        $('.bg-shadow').before(slide);

        // Основная информация
        if (i === 0) {
            changeInfo(el);
        }

        // Миниатюры
        const minSlide = `<div data-num="${ i }" ontouchend="changeSlide(this, event, ${ i })" class="image__min${ i === 0 ? ' active' : '' }">
            <img src="./img/${ el.img }-min.png" alt="${ el.city }">
            <div class="image__min_title">${ el.city }</div>
        </div>`;
        $('.slider__images-min').append(minSlide);

        // Точки
        const dot = `<div class="slider__dot${ i === 0 ? ' active' : '' }"></div>`;
        $('.slider__dots').append(dot);

        $('.city__info').data('code', '');
    });

    $('.slider__images-wrap').swipe( {
        swipeRight: function(event, direction) {
            event.stopPropagation();
            const wraperWidth = $('.slider__images-min').width();
            const currentState = $('.slider__images-min').css('transform'); 
            const currentStatePX = currentState === 'none' ? 'none' : 
                parseFloat(currentState.split(',')[4]);
            if (currentStatePX === 'none' || currentStatePX === 0) {
                return;
            }
            $('.slider__images-min').css('transform', `matrix(1, 0, 0, 1, ${ currentStatePX + wraperWidth}, 0)`);
        },
        swipeLeft: function(event, direction) {
            event.stopPropagation();
            const wraperWidth = $('.slider__images-min').width();
            const currentState = $('.slider__images-min').css('transform'); 
            const currentStatePX = currentState === 'none' ? 0 : 
                parseFloat(currentState.split(',')[4]);
            if (currentStatePX === -$('.slider__images-min').width() * slidesBox) {
                return;
            }
            $('.slider__images-min').css('transform', `matrix(1, 0, 0, 1, ${ currentStatePX - wraperWidth}, 0)`);
        },
        triggerOnTouchLeave: true,
        threshold: 0, // сработает через 80 пикселей
    });
});

function changeInfo(el) {
    $('.slider__city').html(el.city);
    $('.slider__info').html(el.text);
    $('.slider__link').attr('href', el.whatsAppHref);
}

function changeSlide(selector, event ,i) {
    if ($(selector).hasClass('active')) {
        return;
    }
    const left = $(window).width() * i;
    $('.slider__images').css('transform', `translate(-${ left }px)`);
    $('.image__min').each((index, el) => {
        if ($(el).hasClass('active')) {
            $(`.slider__img:nth-child(${ index + 1 })`).removeClass('active');
            $(`.slider__dot:nth-child(${ index + 1 })`).removeClass('active');
            $(el).removeClass('active')
        }
    });
    $(selector).addClass('active');
    $(`.slider__img:nth-child(${ i + 1 })`).addClass('active');
    $(`.slider__dot:nth-child(${ i + 1 })`).addClass('active');
}
