//let countdownDate = new Date("May 11, 2026 00:00:00").getTime();
let flagSmena = false // пусть True будет день, false - ночь
let smenaElement = document.getElementById("smena");
var zalupa_link = document.getElementById("preparedLink");
let goal = 1; // будет высчитываться в зависимости от показетелй ссылки
const period = 7200000; // 2 часа в миллисекундах 7200000
let starter = true; // для первой установки смены при входе в программу

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('t') && urlParams.has('sm')) { //если параметры есть, делаем таймер
    console.log('Параметры существуют');




    let x = document.getElementById("linkCreator");
    x.style.display = "none";

    //обработка параметров ссылки
    console.log(urlParams.get('t')); // t - сколько прошло времени в секундах до наступления первой смены после 00:00
    console.log(urlParams.get('sm')); // sm - смена, которая первая наступила после 00:00, 'd' - день, 'n' - ночь 
    let timeAfter = urlParams.get('t');
    let typeAfter = urlParams.get('sm');
    if (typeAfter == "d") typeAfter = true;
    if (typeAfter == "n") typeAfter = false;

    let formatter = new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    });
    let timeNow = formatter.format(new Date()); //текущее время строка, slice 0,2 - часы, slice 3,5 - минуты
    let huy = timeNow.slice(0, 2) * 60 + timeNow.slice(3, 5) * 1;
    flagSmena = (Math.floor((huy % 120 + timeAfter) / 120) % 2 == 0) ? typeAfter : !typeAfter;
    console.log(flagSmena);
    console.log((Math.floor((huy % 120 + timeAfter) / 120) % 2));
    goal = ((huy - timeAfter) % 120) * 60 * 1000;// надо вычислить в нём сколько времени прошло от начала смены
    console.log(goal);
    let interval = setInterval(() => {

        if (starter) {
            changeSmena(flagSmena);
            starter = !starter;
        }

        let distance = period - goal;
        // console.log(distance); console.log(goal);

        //let days = Math.floor(distance / (24 * 60 * 60 * 1000));
        let hours = Math.floor((distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
        let seconds = Math.floor((distance % (60 * 1000)) / (1000));
        goal = goal + 1000;

        //проверка настало ли событие
        if (distance <= 0) {
            goal = 1;
            distance = 0;
            flagSmena = !flagSmena;
            changeSmena(flagSmena);

            //document.querySelector('.days').textContent = format(0);
            document.querySelector('.hours').textContent = format(2);
            document.querySelector('.minutes').textContent = format(0);
            document.querySelector('.seconds').textContent = format(0);

            //document.querySelector('.days-text').textContent = pluralise(days, 'day', 'days');
            document.querySelector('.hours-text').textContent = pluralise(hours, 'hour', 'hours');
            document.querySelector('.minutes-text').textContent = pluralise(minutes, 'minute', 'minutes');
            document.querySelector('.seconds-text').textContent = pluralise(seconds, 'second', 'seconds');

            return;


        }
        //goal = goal + 1000; // хз мб лучше сюда а не сверху, надо подумать

        //document.querySelector('.days').textContent = format(days);
        document.querySelector('.hours').textContent = format(hours);
        document.querySelector('.minutes').textContent = format(minutes);
        document.querySelector('.seconds').textContent = format(seconds);

        //document.querySelector('.days-text').textContent = pluralise(days, 'day', 'days');
        document.querySelector('.hours-text').textContent = pluralise(hours, 'hour', 'hours');
        document.querySelector('.minutes-text').textContent = pluralise(minutes, 'minute', 'minutes');
        document.querySelector('.seconds-text').textContent = pluralise(seconds, 'second', 'seconds');
    }, 1000);


} else  // если параметров нет - надо сгенерировать ссылку
{
    console.log("Параметры t и sn нарушены!");

    let x = document.getElementById("smenaCalc");
    x.style.display = "none";

}

//обработчик кнопки создания ссылки
const button = document.getElementById('myButton');
button.addEventListener('click', function () {
    console.log("нажали кнопку"); // Проверка в консоли
    const elementSelectSmena = document.getElementById('smena_input');
    const spisokSmena = elementSelectSmena.value; // текущая смена, ввод данных
    flagSmena = spisokSmena == "d"; // true - день, ночь - false
    console.log(spisokSmena); // Выведет value выбранного option

    const elementInputTime = document.getElementById("userdata");
    const inputTime = elementInputTime.value; // время до смены в минутах, из поля ввода данных
    console.log(inputTime); // Выведет value выбранного option

    let formatter = new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    });
    let timeNow = formatter.format(new Date()); //текущее время строка, slice 0,2 - часы, slice 3,5 - минуты
    console.log(timeNow.slice(0, 2) + " " + timeNow.slice(3, 5));
    let minutesNow = timeNow.slice(0, 2) * 60 + timeNow.slice(3, 5) * 1; // прошло минут с 00:00 по мск до текущего времени
    let tParam = Math.abs((minutesNow % 120) - (120 - inputTime * 1));
    let smFlag = (Math.floor((minutesNow / 120)) % 2 == 0) ? flagSmena : !flagSmena;
    let smParam = smFlag ? "d" : "n";



    let result = "?t=" + tParam + "&sm=" + smParam;
    console.log(result);
    let cleanUrl = window.location.origin + window.location.pathname;
    console.log(cleanUrl + result);
    zalupa_link.href = cleanUrl + result;
    zalupa_link.textContent = cleanUrl + result;
    let comment = document.getElementById("comment");
    comment.textContent = "Данная ссылка будет актуальна до перезагрузки сервера.\n Обратите внимание: погрешность вычисления может составлять до 2-х минут. ";
    return;
});

function format(value) {
    return value < 10 ? '0' + value : value;
}

function pluralise(value, singular, plural) {
    return value === 1 ? singular : plural;
}

function changeSmena(flag) {
    smenaElement.textContent = flag ? "День" : "Ночь";
}
