const params = new URLSearchParams(window.location.search);
const highlight = document.getElementById('highlight');
const nav = document.getElementById('nav');
const nav_spans = document.querySelectorAll('.nav-block span');
const nav_lessons = document.querySelectorAll('.nav-lesson');
const next_button = document.getElementById('next-button');
let timeOut;

nav.addEventListener('mousemove', e => {
  const size = highlight.clientWidth;
  highlight.style.left = e.pageX - size / 2 + 'px';
  highlight.style.top = e.pageY - size / 2 + 'px';
  highlight.classList.remove('hidden');
});

nav.addEventListener('mouseenter', e => {
  timeOut = setTimeout(() => {
    nav_spans.forEach(span => span.style.display = 'inline-block');
    nav_lessons.forEach(span => span.style.display = 'block');
  }, 120);
});

nav.addEventListener('mouseleave', () => {
  highlight.classList.add('hidden');
  nav_spans.forEach(span => span.style.display = 'none');
  nav_lessons.forEach(span => span.style.display = 'none');
  clearTimeout(timeOut);
});

const colors = [
  ["#ECC7F2", "#CE9DD4", "#CBAACF"],
  ["#FFADD4", "#D791B3", "#CD89AA"],
  ["#B2AFFE", "#8F8CCF", "#7D7AB5"],
  ["#97D1F9", "#70ABD1", "#6396B8"],
  ["#E8F1A0", "#C9D384", "#AAB270"],
  ["#FECF9B", "#DDB285", "#C49D76"],
  ["#FFAFB0", "#D78383", "#B86E6D"],
];

let currentBlock = null;

document.getElementById(`nav-${params.get('page')}`).classList.add('active');
document.getElementById(`nav-${params.get('lesson')}`)?.classList.add('nav-lesson-active');

const blockName = document.getElementById(`block-name`);
const blocP1 = document.getElementById(`block-p-1`);
const blocP2 = document.getElementById(`block-p-2`);

function setText() {
  blockName.textContent = meta[currentBlock - 1].header;
  blocP1.textContent = meta[currentBlock - 1].p1;
  blocP2.textContent = meta[currentBlock - 1].p2;
}


function changeState(nextState) {
  const bl = document.getElementById(`block-${nextState}`);
  if (currentBlock) {
    const block = document.getElementById(`block-${currentBlock}`);
    colors[currentBlock - 1].forEach((col, idx) => {
      block.getElementsByClassName(`col-${idx + 1}`)[0].style.fill = darker(col);
    });
    block.classList.remove('active-block');
  }
  currentBlock = nextState;
  colors[currentBlock - 1].forEach((col, idx) => {
    bl.getElementsByClassName(`col-${idx + 1}`)[0].style.fill = col;
  })
  setText();
  bl.classList.add('active-block');
}


for (let i = 1; i <= 7; ++i) {
  const bl = document.getElementById(`block-${i}`);
  bl.addEventListener('click', () => changeState(i))
}


colors.forEach((color, idx) => {
  const block = document.getElementById(`block-${idx + 1}`);
  color.forEach((col, i) => {
    block.getElementsByClassName(`col-${i + 1}`)[0].style.fill = darker(col);
  })
  block.style.zIndex = colors.length - idx + 10;
})

function darker(hex, k = 0.6, alpha = 1) {
  if (hex[0] !== '#' || (hex.length !== 7 && hex.length !== 4)) {
    return null;
  }

  if (hex.length === 4) {
    hex = '#' + [hex[1], hex[1], hex[2], hex[2], hex[3], hex[3]].join('');
  }

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r * k}, ${g * k}, ${b * k}, ${alpha})`;
}

next_button.addEventListener('click', () => {
  if (currentBlock === null) {
    changeState(7);
  } else if (currentBlock === 0) {
    changeState(7);
  } else {
    changeState(currentBlock - 1);
  }
})

const meta = [
  {
    header: '7. Прикладной уровень',
    p1: 'Прикладной уровень модели OSI напрямую взаимодействует с применениями программных обеспечений для предоставления необходимых функций связи, и он наиболее близок к конечным пользователям.',
  },
  {
    header: '6. Уровень представления',
    p1: 'Представляет данные в понятном человеку и машине виде. Например, когда одно устройство умеет отображать текст только в кодировке ASCII, а другое только в UTF-8, перевод текста из одной кодировки в другую происходит на шестом уровне.',
  },
  {
    header: '5. Сеансовый уровень',
    p1: 'Сеансовый уровень отвечает за поддержку сеанса или сессии связи. Управляет взаимодействием между приложениями, открывает возможности синхронизации задач, завершения сеанса, обмена информации.',
  },
  {
    header: '4. Транспортный уровень',
    p1: 'Посредник между Host Layers и Media Layers, относящийся скорее к первым, чем к последним, его главной задачей является транспортировка пакетов.',
    p2: 'При транспортировке возможны потери, но некоторые типы данных более чувствительны к потерям, чем другие.',
  },
  {
    header: '3. Сетевой уровень',
    p1: 'На третьем уровне появляется понятие — маршрутизация. Для этой задачи были созданы устройства третьего уровня — маршрутизаторы (роутеры).',
    p2: 'Маршрутизаторы получают MAC-адрес от коммутаторов с 2 уровня и занимаются построением маршрута от одного устройства к другому с учетом всех потенциальных неполадок в сети.',
  },
  {
    header: '2. Канальный уровень',
    p1: 'Второй уровень решает проблему адресации при передаче информации. Канальный уровень получает биты и превращает их в кадры (frame, также «фреймы»). Задача здесь — сформировать кадры с адресом отправителя и получателя, после чего отправить их по сети.',
  },
  {
    header: '1. Физический уровень',
    p1: 'Отвечает за обмен физическими сигналами между физическими устройствами, «железом».',
    p2: 'Устройства физическогоуровня оперируют битами. Онипередаются по проводам (например, через оптоволокно) или без проводов (например,через Bluetooth или IRDA, Wi-Fi, GSM, 4G и так далее).',
  },
]