window.addEventListener('DOMContentLoaded', function() {

    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }

    });

    // timer

    let deadLine = "2020-10-21";

    // разница в датах
    function getTime(time) {
        let t = Date.parse(time) - Date.parse(new Date());
        let seconds = Math.floor( (t / 1000 ) % 60 );
        let minutes = Math.floor( (t / 1000 / 60) % 60 );
        let hours = Math.floor((t / (1000 * 60 * 60)));


        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    };

    // из статиеской верстки в динамическую 

    function setupTimer (id, time) {

        let timer = document.getElementById(id);
        let hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds');
        let timeInterval = setInterval(updateTime, 1000);
        
        function updateTime(){
            let t = getTime(time);

            function addZero(num) {
                if(num <= 9) {
                    return '0' + num;
                } else return num;
            };

    hours.textContent = addZero(t.hours);
    minutes.textContent = addZero(t.minutes);
    seconds.textContent = addZero(t.seconds);

            if (t.total <= 0 ) {
                clearInterval(timeInterval);
            }
        };
        

    };

    setupTimer('timer' , deadLine);




    // modal window

    let more = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let close = document.querySelector('.popup-close');


    more.addEventListener('click', function() {

        overlay.style.display = 'block';
        this.classList.add('more-splash');

        document.body.style.overflow = 'hidden'; // чтобы не прокручивалось

    })

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        this.classList.remove('more-splash');
        document.body.style.overflow = '';
    })


    // FORM

    // FORM state

    let message = {
        loading : 'Loading....',
        succsess : 'Thanks!',
        fail : 'Errore!'
    };

    let form = document.querySelector('.main-form'),
        input = document.getElementsByTagName('input'),
        statusMsg = document.createElement('div');

    statusMsg.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        form.appendChild(statusMsg)
    })
    
    let request = new XMLHttpRequest();
    request.open('POST', 'server.php');
    request.setRequestHeader('Content-Type', 'aplication/json; charset=utf-8');

    let formData = new FormData(form);


    // Алгоритм
    // сначала при помощи форм дата получаем все что ответил пользователь в форме
    // потом создаем новый обхект для новых данных. через фор ич берем объект форм дата, 
    //помещаем его в obj и преобразуем его в json
    // получаем все данные в формате json в котором уже лежат все данные юзера и его же отправляем на сервер
    //все данные пользователя в пустой объект
    let obj = {};

    formData.forEach(function(value, key){
        obj[key] = value;
    });
    let json = JSON.stringify(obj);

    request.send( json) // оптправляет на сервер

    request.addEventListener('readystatechange' , function() {
        if ( request.readyState < 4) {
            statusMsg.innerHTML = message.loading;
        } else if (request.readyState === 4 && request.status == 200) {
            statusMsg.innerHTML = message.succsess;
        } else {
            statusMsg.innerHTML = message.fail;
        }

        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    })




    /// slider
    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);
    // спрятать все не активные и показать только 1
    // при изменении нумерации слайда изменить точку 
    // при клике на стрелки slideIndex меняется в + или в -

    showSlides(slideIndex);

    function showSlides(n) {

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        // for (let i = 0; i < slides.length; i++) {
        //     slides[i].style.display = 'none';
        // }
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }
    function plusSlides(n) {
        showSlides(slideIndex += n); 
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function() {
        plusSlides(-1);
    });

    next.addEventListener('click', function() {
        plusSlides(1);
    });
 
    dotsWrap.addEventListener('click', function(event) {
        for (let i = 0; i < dots.length + 1; i++) {
            // проверим что на какой элемент кликнули есть класс дот
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });

    // calc
    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDayes = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

        totalValue.innerHTML = 0;


        persons.addEventListener('change', function(){
            personsSum = +this.value;
            total = (daysSum + personsSum) * 4000;

            if (restDayes.value == ''){
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            };
        });


        restDayes.addEventListener('change', function(){
            daysSum = +this.value;
            total = (daysSum + personsSum) * 4000;

            if (persons.value == ''){
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            };
        });

        place.addEventListener('change' , function() {
            if (restDayes.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                let a = total;
                // this.selectedIndex] обращение к тому элементу который был выбран
                totalValue.innerHTML = a * this.options[this.selectedIndex].value;
            }
        })
});