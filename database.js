const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, 'data', 'db.json');

function uid() {
  return crypto.randomBytes(8).toString('hex');
}

function hash(pw) {
  return crypto.createHash('sha256').update('akel:' + pw).digest('hex');
}

function seed() {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 'admin',
        phone: '992034392828',
        name: 'MS MIRSAIDJON',
        email: 'admin@akelcargo.app',
        language: 'ru',
        theme: 'light',
        branchId: 'dushanbe',
        isAdmin: true,
        passwordHash: hash('MS MIRSAIDJON'),
        bonusPoints: 0,
        createdAt: now
      }
    ],
    tokens: [],
    otps: [],
    parcels: [],
    news: [
      {
        id: uid(),
        title: 'Приложение Akelcargo уже доступно!',
        body: 'Мы официально запустили мобильное приложение Akelcargo. Следите за посылками, копируйте адрес склада и считайте доставку в одном месте.',
        createdAt: now
      }
    ],
    notifications: [],
    lessons: [
      {
        id: uid(),
        course: 'Pinduoduo',
        title: 'Регистрация в Pinduoduo',
        duration: '4:12',
        youtubeId: '',
        description: 'Как создать аккаунт и начать покупки.',
        createdAt: now
      },
      {
        id: uid(),
        course: 'Pinduoduo',
        title: 'Как ввести адрес склада',
        duration: '6:30',
        youtubeId: '',
        description: 'Пошаговая инструкция заполнения адреса Akelcargo.',
        createdAt: now
      },
      {
        id: uid(),
        course: 'Taobao',
        title: 'Регистрация в Taobao',
        duration: '5:00',
        youtubeId: '',
        description: 'Регистрация и первые покупки на Taobao.',
        createdAt: now
      }
    ],
    settings: {
      companyName: 'Akelcargo',
      version: '1.0.0',
      taglineRu: 'Akelcargo — быстрая и надёжная доставка из Китая в Таджикистан.',
      taglineTg: 'Akelcargo — расонидани зуд ва боэътимод аз Чин ба Тоҷикистон.',
      warehouse: {
        recipientName: 'Клиент',
        phone: '15757966666',
        address: '浙江省义乌胜利达物流石塔头88幢2号',
        city: 'Yiwu',
        country: 'China'
      },
      tariffs: {
        perM3: 240,
        perKg: 2.5,
        tiers: [
          { min: 1, max: 20, tjs: 25, usd: 2.5 },
          { min: 21, max: 30, tjs: 24, usd: 2.4 },
          { min: 31, max: 100, tjs: 23, usd: 2.3 },
          { min: 101, max: 300, tjs: 22, usd: 2.2 },
          { min: 201, max: 500, tjs: 20, usd: 2.0 }
        ]
      },
      hours: {
        timezone: 'Asia/Dushanbe',
        days: {
          mon: '8:00 – 17:30',
          tue: '8:00 – 17:30',
          wed: '8:00 – 17:30',
          thu: '8:00 – 17:30',
          fri: '8:00 – 17:30',
          sat: '8:00 – 17:30',
          sun: 'off'
        },
        noteRu: 'Иногда какой-либо день может быть выходным — следите за новостями.',
        noteTg: 'Баъзан як рӯз метавонад рӯзи истироҳат бошад — хабарҳоро пайгирӣ кунед.'
      },
      delivery: {
        daysRu: 'Стандартный срок доставки из Китая в Душанбе составляет 15–25 дней.',
        daysTg: 'Муҳлати стандартии расонидан аз Чин ба Душанбе 15–25 рӯз аст.',
        guaranteeRu: 'Мы обеспечиваем надёжную упаковку и контроль на каждом этапе маршрута.',
        guaranteeTg: 'Мо бастабандии боэътимод ва назоратро дар ҳар марҳила таъмин мекунем.',
        packRu: 'Каждая посылка проходит проверку и дополнительную упаковку при необходимости.',
        packTg: 'Ҳар як посылка дар ҳолати зарурӣ санҷида ва иловагӣ бастабандӣ мешавад.',
        freeRu: 'При весе более 30 кг доставка по Душанбе может быть бесплатной — уточняйте у оператора.',
        freeTg: 'Агар вазн зиёда аз 30 кг бошад, расонидан дар Душанбе метавонад ройгон бошад — аз оператор пурсед.'
      },
      prohibited: [
        {
          titleRu: 'Оружие и боеприпасы',
          titleTg: 'Яроқ ва аслиҳа',
          descRu: 'Огнестрельное, холодное, пневматическое оружие, патроны, порох.',
          descTg: 'Яроқи оташфишон, сард, пневматикӣ, патронҳо, барут.'
        },
        {
          titleRu: 'Наркотические вещества',
          titleTg: 'Моддаҳои нашъадор',
          descRu: 'Любые наркотики и прекурсоры.',
          descTg: 'Ҳама гуна нашъа ва прекурсорҳо.'
        },
        {
          titleRu: 'Легковоспламеняющиеся жидкости',
          titleTg: 'Моеъҳои зудсӯз',
          descRu: 'Бензин, растворители, аэрозоли под давлением.',
          descTg: 'Бензин, ҳалкунандаҳо, аэрозолҳои зери фишор.'
        },
        {
          titleRu: 'Аккумуляторы и powerbank сверх нормы',
          titleTg: 'Батарея ва пауэрбанк зиёда аз меъёр',
          descRu: 'Литиевые батареи без согласования с оператором.',
          descTg: 'Батареяҳои литийӣ бе мувофиқа бо оператор.'
        }
      ],
      support: {
        phones: ['+992 98 909 1111', '+992 80 361 1010', '+992 98 151 7777'],
        email: 'support@akelcargo.app'
      },
      socials: {
        instagram: '@akelcargo.tj',
        telegram: '@akelcargo'
      },
      banners: [
        {
          id: 'b1',
          image: '/banner1.jpg',
          titleRu: 'Быстрая и надёжная доставка',
          titleTg: 'Расонидани зуд ва боэътимод',
          subRu: 'Китай → Душанбе  ·  от 2,5 $/кг',
          subTg: 'Чин → Душанбе  ·  аз 2,5 $/кг'
        },
        {
          id: 'b2',
          image: '/banner2.jpg',
          titleRu: 'Склад в Худжанде',
          titleTg: 'Анбор дар Хуҷанд',
          subRu: 'Китай → Худжанд  ·  прозрачный тариф',
          subTg: 'Чин → Хуҷанд  ·  тарифи шаффоф'
        }
      ],
      marketplaces: [
        { id: 'pdd', name: 'Pinduoduo', url: 'https://mobile.pinduoduo.com', color: '#e02e24' },
        { id: 'tb', name: 'Taobao', url: 'https://m.taobao.com', color: '#ff5000' },
        { id: '1688', name: '1688', url: 'https://m.1688.com', color: '#ff6a00' },
        { id: 'poizon', name: 'Poizon', url: 'https://www.poizon.com', color: '#111111' }
      ],
      branches: [
        { id: 'dushanbe', nameRu: 'Головной филиал', nameTg: 'Филиали асосӣ', city: 'Dushanbe' },
        { id: 'khujand', nameRu: 'Согдийская область', nameTg: 'Вилояти Суғд', city: 'Khujand' }
      ],
      whatsapp: {
        enabled: false,
        phoneNumberId: '',
        accessToken: '',
        fromNumber: '+992 90 000 0001',
        demoMode: true
      },
      bonusRulesRu: 'Баллы начисляются за каждую доставленную посылку: 1$ = 1 балл. 100 баллов = 1$ скидки на следующую доставку.',
      bonusRulesTg: 'Холҳо барои ҳар посылкаи расонидашуда ҳисоб мешаванд: 1$ = 1 хол. 100 хол = 1$ тахфиф барои расонидани навбатӣ.',
      aboutRu: 'Akelcargo — быстрая и надёжная доставка из Китая в Душанбе и Худжанд.',
      aboutTg: 'Akelcargo — расонидани зуд ва боэътимод аз Чин ба Душанбе ва Хуҷанд.',
      privacyRu: 'Akelcargo использует данные пользователя только для корректной работы сервиса, отслеживания заказов и предоставления логистических услуг.',
      privacyTg: 'Akelcargo маълумоти корбарро танҳо барои кори дурусти хизматрасонӣ, пайгирии фармоишҳо ва хизматҳои логистикӣ истифода мебарад.',
      termsRu: 'Пользуясь приложением, вы соглашаетесь с правилами перевозки, списком запрещённых товаров и тарифами компании.',
      termsTg: 'Бо истифодаи барнома шумо бо қоидаҳои интиқол, рӯйхати молҳои манъшуда ва тарифҳои ширкат розӣ мешавед.'
    }
  };
}

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('DB load error', e);
  }
  const s = seed();
  save(s);
  return s;
}

function save(db) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

let db = load();

function get() {
  return db;
}

function persist() {
  save(db);
}

function reset() {
  db = seed();
  persist();
  return db;
}

module.exports = { get, persist, uid, hash, reset };
