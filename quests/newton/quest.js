(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NewtonQuest = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const missions = [
    {
      id: 'shuttle', title: 'Шатл у польоті', place: 'Орбітальний порт', law: 1, icon: 'shuttle',
      tag: 'Рівномірний рух', type: 'number',
      story: 'Шатл летить прямолінійно з незмінною швидкістю. Бортовий комп’ютер просить перевірити рівнодійну всіх сил, що діють на нього.',
      question: 'Чому дорівнює рівнодійна сил?',
      fields: [{ label: 'Рівнодійна сил', unit: 'Н', answer: 0 }],
      hint: 'Незмінні значення швидкості та її напрямку означають, що прискорення дорівнює нулю. Скористайся F = ma.',
      explanation: 'Швидкість не змінюється, тому a = 0. Отже, F = ma = 0 Н. Окремі сили можуть діяти на шатл, але їхня рівнодійна дорівнює нулю.'
    },
    {
      id: 'backpack', title: 'Рюкзак у транспорті', place: 'Дорога до космопорту', law: 1, icon: 'backpack',
      tag: 'Інерція', type: 'choice',
      story: 'Автобус їде вперед і раптово гальмує. На гладкій підлозі лежить незакріплений рюкзак.',
      question: 'У який бік відносно автобуса почне зміщуватися рюкзак одразу після початку гальмування?',
      choices: ['Уперед: він зберігає попередню швидкість.', 'Назад: він одразу змінює напрямок руху.', 'Угору: гальмування піднімає його.', 'Він миттєво зупиниться разом з автобусом.'], answer: 0,
      hint: 'Автобус сповільнюється. Чи може незакріплений рюкзак миттєво зменшити свою швидкість так само?',
      explanation: 'За інерцією рюкзак зберігає попередню швидкість, поки автобус сповільнюється. Тому відносно автобуса рюкзак зміщується вперед. Ремінь безпеки допомагає втримати пасажира під час гальмування.'
    },
    {
      id: 'cargo', title: 'Вантажна платформа', place: 'Льодова станція', law: 1, icon: 'cargo',
      tag: 'Перший закон', type: 'choice',
      story: 'Робот розігнав платформу на ідеально гладкій горизонтальній поверхні й відпустив її. Тертя та опору немає, інші сили у горизонтальному напрямку не діють. Вертикальні сили урівноважені.',
      question: 'Як рухатиметься платформа після того, як робот її відпустив?',
      choices: ['Поступово сповільнюватиметься без дії сил.', 'Одразу зупиниться.', 'Прямолінійно з незмінною швидкістю.', 'Дедалі швидше, бо її вже розігнали.'], answer: 2,
      hint: 'Щоб змінити швидкість тіла, потрібна ненульова рівнодійна сил. Чи є вона тут?',
      explanation: 'Рівнодійна всіх сил дорівнює нулю. За першим законом Ньютона платформа зберігає прямолінійний рівномірний рух. У реальних умовах її сповільнюють тертя й опір.'
    },
    {
      id: 'cart', title: 'Розгін візка', place: 'Інженерний ангар', law: 2, icon: 'cart',
      tag: 'Знайди прискорення', type: 'number',
      story: 'Візок з обладнанням має масу 6 кг. Рівнодійна горизонтальних сил, що діють на нього, дорівнює 18 Н.',
      question: 'Яке прискорення отримає візок?',
      fields: [{ label: 'Прискорення', unit: 'м/с²', answer: 3 }],
      hint: 'Другий закон Ньютона: F = ma. Щоб знайти прискорення, поділи рівнодійну сил на масу: a = F : m.',
      explanation: 'a = F : m = 18 : 6 = 3 м/с². Прискорення напрямлене в бік рівнодійної сил.'
    },
    {
      id: 'rover', title: 'Двигун марсохода', place: 'Червона рівнина', law: 2, icon: 'rover',
      tag: 'Знайди силу', type: 'number',
      story: 'Марсохід масою 12 кг має рухатися з прискоренням 0,5 м/с². Інженеру потрібно визначити необхідну рівнодійну сил.',
      question: 'Якою має бути рівнодійна сил?',
      fields: [{ label: 'Рівнодійна сил', unit: 'Н', answer: 6 }],
      hint: 'Використай F = ma. Помнож масу на прискорення. 0,5 — це половина одиниці.',
      explanation: 'F = ma = 12 · 0,5 = 6 Н. Саме такою має бути рівнодійна, а не обов’язково одна окрема сила двигуна.'
    },
    {
      id: 'robot', title: 'Таємна маса робота', place: 'Лабораторія механіки', law: 2, icon: 'robot',
      tag: 'Знайди масу', type: 'number',
      story: 'Етикетка на роботі стерлася. Під дією рівнодійної сил 30 Н він рухається з прискоренням 2 м/с².',
      question: 'Яка маса робота?',
      fields: [{ label: 'Маса', unit: 'кг', answer: 15 }],
      hint: 'З рівняння F = ma вирази масу: m = F : a.',
      explanation: 'm = F : a = 30 : 2 = 15 кг.'
    },
    {
      id: 'sled', title: 'Опір на маршруті', place: 'Крижаний перевал', law: 2, icon: 'sled',
      tag: 'Дві протилежні сили', type: 'number',
      story: 'Двигун тягне сани вперед із силою 60 Н. Сила опору 24 Н напрямлена назад. Маса саней із вантажем — 12 кг. Вертикальні сили урівноважені.',
      question: 'Знайди модуль прискорення саней.',
      fields: [{ label: 'Прискорення', unit: 'м/с²', answer: 3 }],
      hint: 'Спочатку знайди рівнодійну протилежно напрямлених сил: F = 60 − 24. Потім використай a = F : m.',
      explanation: 'F = 60 − 24 = 36 Н. a = 36 : 12 = 3 м/с². Прискорення напрямлене вперед.'
    },
    {
      id: 'wall', title: 'Поштовх від станції', place: 'Модуль невагомості', law: 3, icon: 'astronaut',
      tag: 'Дія і протидія', type: 'number',
      story: 'Космонавт тисне рукою на стінку станції із силою 80 Н, щоб відштовхнутися від неї.',
      question: 'З якою за модулем силою стінка діє на космонавта?',
      fields: [{ label: 'Сила з боку стінки', unit: 'Н', answer: 80 }],
      hint: 'За третім законом Ньютона сили взаємодії двох тіл однакові за модулем і протилежні за напрямком.',
      explanation: 'Стінка діє на космонавта із силою 80 Н у протилежному напрямку. Сили прикладені до різних тіл, тому не врівноважують одна одну на космонавті.'
    },
    {
      id: 'skaters', title: 'Двоє на льоду', place: 'Тренувальна арена', law: 3, icon: 'skaters',
      tag: 'Однакові сили, різні маси', type: 'choice',
      story: 'Двоє ковзанярів масами 40 кг і 60 кг відштовхуються один від одного. Тертям нехтуємо.',
      question: 'У кого модуль прискорення під час поштовху більший?',
      choices: ['У ковзаняра масою 60 кг.', 'В обох однаковий.', 'В обох дорівнює нулю.', 'У ковзаняра масою 40 кг.'], answer: 3,
      hint: 'Сили їхньої взаємодії однакові за модулем. Порівняй a = F : m для меншої та більшої маси.',
      explanation: 'За третім законом Ньютона модулі сил однакові. За другим законом a = F : m, тому більший модуль прискорення має ковзаняр масою 40 кг. У нього прискорення в 1,5 раза більше: 60 : 40 = 1,5.'
    },
    {
      id: 'rescue', title: 'Фінал: рятувальна місія', place: 'Шлюз «Надія»', law: 0, icon: 'rescue',
      tag: 'Поєднай два закони', type: 'number',
      story: 'Рятувальний візок масою 20 кг тягнуть тросом із силою 80 Н. Сила опору 20 Н напрямлена проти руху. Вертикальні сили урівноважені.',
      question: 'Знайди модуль прискорення візка та модуль сили, з якою візок діє на трос.',
      fields: [{ label: 'Прискорення візка', unit: 'м/с²', answer: 3 }, { label: 'Сила візка на трос', unit: 'Н', answer: 80 }],
      hint: 'Для прискорення використай рівнодійну: F = 80 − 20. Для сили на трос застосуй третій закон Ньютона до пари «трос — візок».',
      explanation: 'F = 80 − 20 = 60 Н. a = 60 : 20 = 3 м/с². Візок діє на трос із силою 80 Н — такою самою за модулем, як сила троса на візок. 60 Н — рівнодійна сил на візку, а не сила взаємодії з тросом.'
    }
  ];
  const STORAGE_KEY = 'orbita-newton-quest-v1';
  function parseNumber(raw) {
    if (typeof raw !== 'string') return null;
    const value = raw.trim().replace(/\u2212/g, '-').replace(',', '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  function checkAnswer(mission, values) {
    if (mission.type === 'choice') {
      if (!Number.isInteger(values) || values < 0 || values >= mission.choices.length) return { valid: false, correct: false, message: 'Спочатку обери один варіант відповіді.' };
      return { valid: true, correct: values === mission.answer };
    }
    const numbers = mission.fields.map((_, i) => parseNumber(values?.[i]));
    if (numbers.some(n => n === null)) return { valid: false, correct: false, message: 'Заповни всі поля числами. Одиниці вже вказано праворуч; десяткові дроби можна вводити з комою або крапкою.' };
    const fieldResults = numbers.map((n, i) => Math.abs(n - mission.fields[i].answer) <= 1e-9);
    return { valid: true, correct: fieldResults.every(Boolean), fieldResults };
  }
  function freshState() { return { version: 1, started: false, active: 0, completed: [], hinted: [], answers: {}, mistakes: {}, finished: false }; }
  function normalizeState(raw) {
    const state = freshState();
    if (!raw || raw.version !== 1) return state;
    state.completed = [...new Set(Array.isArray(raw.completed) ? raw.completed.filter(n => Number.isInteger(n) && n >= 0 && n < missions.length) : [])].sort((a,b) => a-b);
    // Progress is sequential. Corrupt or stale state must not unlock later missions.
    let prefix = 0; while (state.completed.includes(prefix)) prefix++;
    state.completed = state.completed.filter(n => n < prefix);
    state.started = raw.started === true || prefix > 0;
    state.active = Number.isInteger(raw.active) ? Math.max(0, Math.min(raw.active, prefix, missions.length - 1)) : Math.min(prefix, missions.length - 1);
    state.hinted = Array.isArray(raw.hinted) ? [...new Set(raw.hinted.filter(n => Number.isInteger(n) && n >= 0 && n < missions.length))] : [];
    state.answers = raw.answers && typeof raw.answers === 'object' && !Array.isArray(raw.answers) ? raw.answers : {};
    state.mistakes = raw.mistakes && typeof raw.mistakes === 'object' && !Array.isArray(raw.mistakes) ? raw.mistakes : {};
    state.finished = raw.finished === true && prefix === missions.length;
    return state;
  }
  function award(state, index, answer) {
    if (!state.completed.includes(index)) state.completed.push(index);
    state.completed.sort((a,b) => a-b); state.answers[index] = answer;
  }
  function xp(state) { return state.completed.length * 100; }
  function rank(state) { return state.completed.length >= 10 ? 'Майстер механіки' : state.completed.length >= 7 ? 'Капітан експедиції' : state.completed.length >= 4 ? 'Дослідник руху' : 'Космічний новачок'; }
  return { missions, STORAGE_KEY, parseNumber, checkAnswer, freshState, normalizeState, award, xp, rank };
});
