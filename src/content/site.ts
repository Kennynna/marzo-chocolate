/**
 * Контент и данные с текущей версии marzochocolate.ru.
 * Снимок от 23 августа 2026. Источник правды для новой вёрстки.
 */

export const brand = {
  name: 'MARZO',
  legalName: 'Общество с ограниченной ответственностью «Марзо»',
  shortLegalName: 'ООО «Марзо»',
  ogrn: '1252000005608',
  inn: '2015011930',
  tagline: 'Первая шоколадная фабрика в Чеченской Республике',
  style:
    'Стиль бренда MARZO — это минимализм с кавказским характером. В каждом элементе от упаковки до дизайна плитки отражены традиции, культура и эстетика Чеченской Республики.',
} as const

export const nav = [
  { id: 'collection', label: 'Коллекция', href: '#product' },
  { id: 'private-label', label: 'Фирменный шоколад', href: '#for_customers' },
  { id: 'distributors', label: 'Дистрибьюторам', href: '#distributors' },
  { id: 'contact', label: 'связаться', href: '#contact', isCta: true },
] as const

export const links = {
  catalog: '/catalog',
  privacy: '/politika-konfidencialnosti',
} as const

export const media = {
  logo: '/_____.svg',
  welcome: '/welcome.webp',
  video: '/HKo2VSkz.mp4',
  aboutHero: '/dop-1.webp',
  aboutSecondary: '/dop-2.webp',
  aboutTertiary: '/dop-3.webp',
  privateLabel: '/dop-1.webp',
  ornaments: [
    '/element_1.png.webp',
    '/element_2.png.webp',
    '/element_3.png.webp',
    '/element_4.png.webp',
  ],
} as const

export const cta = {
  contact: 'связаться →',
  contactUs: 'связаться с нами →',
  collection: 'коллекция →',
  allCollection: 'вся коллекция →',
  order: 'сделать заказ →',
  details: 'детали +',
  createBrand: 'создать свой бренд →',
} as const

export const welcome = {
  eyebrow: 'Грозный · Чеченская Республика',
  title: 'Первая шоколадная фабрика в Чеченской Республике',
  meta: ['без пальмового масла', '100% натуральный состав', 'собственное производство'],
  caption: 'MARZO — вкус традиций',
  scrollHint: 'листайте',
} as const

export const proverb = {
  original: 'Хазалла — бӀаьргашна, мерзалла — дагна.',
  translation: 'Красота — для глаз, сладость — для сердца.',
  source: 'чеченская пословица',
} as const

/** Подсказка скролла на покадровых секциях */
export const scrollCue = {
  label: 'листайте вниз',
} as const

export const hero = {
  title: 'Первая шоколадная фабрика в Чеченской Республике',
  paragraphs: [
    'Мы производим шоколад без пальмового масла, с акцентом на качество и традиции региона, и предлагаем надёжное партнёрство для оптовых поставок и инвестиций.',
    'Фабрика MARZO — это сочетание современных технологий и уникальных рецептур, разработанных нашей командой.',
  ],
} as const

export const aboutFeatures = [
  'Дизайн, отражающий культуру Чеченской Республики',
  'Ассортимент для ритейла и подарочных решений',
  '100% натуральные ингредиенты',
  'Собственное производство в Грозном',
] as const

export const bars = [
  {
    id: 'milk-hazelnut',
    number: '01',
    title: 'Молочный шоколад с цельным фундуком',
    titleEn: 'milk chocolate with funduk',
    href: '/milk-hazelnut',
    image: '/vkus-1.webp',
    ingredients:
      'сахар, масло какао, молоко сухое цельное, какао тёртое, сухая молочная сыворотка, эмульгатор лецитин соевый, порошок ванили, фундук',
  },
  {
    id: 'milk-pistachio',
    number: '02',
    title: 'Молочный шоколад с дроблеными фисташками',
    titleEn: 'milk chocolate with crushed pistachios',
    href: '/milk-pistachio',
    image: '/vkus-2.webp',
    ingredients:
      'сахар, масло какао, молоко сухое цельное, сухая молочная сыворотка, эмульгатор лецитин соевый, ароматизатор натуральный ванилин, фисташка',
  },
  {
    id: 'milk-chocolate',
    number: '03',
    title: 'Молочный шоколад',
    titleEn: 'milk chocolate',
    href: '/milk-chocolate',
    image: '/vkus-3.webp',
    ingredients:
      'сахар, масло какао, молоко сухое цельное, какао тёртое, молоко сухое обезжиренное, сухая молочная сыворотка, эмульгатор (лецитин соевый), порошок ванили',
  },
] as const

export const gifts = [
  {
    id: 'assorted-fruits-nuts',
    number: '01',
    title: 'Ассорти ручной работы с фруктами и орехами',
    href: '/assorted-fruits-nuts',
    image: '/pod-1.webp',
  },
  {
    id: 'special',
    number: '02',
    title: 'Спешл',
    href: '/chocolate-collection',
    image: '/pod-2.webp',
  },
  {
    id: 'madlen',
    number: '03',
    title: 'Мадлен',
    href: '/madlen',
    image: '/pod-3.webp',
  },
] as const

export const distributorsSection = {
  id: 'distributors',
} as const

export const collectionSection = {
  id: 'product',
  title: 'Коллекция вкусов',
  description:
    'Мы собрали самые любимые сочетания, чтобы каждая плитка стала маленьким удовольствием.',
} as const

export const giftsSection = {
  zoomTitle: 'С любовью к вам',
  title: 'Подарочные наборы',
  description:
    'Для особых случаев мы создали целую линейку подарочных решений: коробки ассорти, коллекция «спешл» и нежные мадлен, которые станут прекрасным дополнением к чашке кофе или чая.',
} as const

export const privateLabel = {
  id: 'for_customers',
  title: 'Фирменный шоколад под ваш бизнес',
  subtitle: 'Шоколад без пальмового масла под вашим собственным брендом',
  description:
    'Такой шоколад подчеркнёт стиль вашего бренда и станет приятным дополнением для гостей и клиентов. Его можно использовать в кофейнях, ресторанах, отелях и любых других бизнесах как фирменный десерт или стильный подарок.',
  facts: [
    { value: '100% натурально', label: 'натуральный состав и дизайн, который работает на ваш имидж' },
    { value: '14 дней', label: 'срок реализации' },
    { value: '1–3 дня', label: 'доставка по всей России' },
  ],
} as const

export const distributors = {
  title: 'Условия для дистрибьюторов шоколадной фабрики',
  intro:
    'Мы ценим партнёрство и стремимся выстраивать долгосрочные, взаимовыгодные отношения с нашими дистрибьюторами.',
  items: [
    {
      title: 'Индивидуальный подход',
      text: 'Ваш персональный менеджер учтёт специфику вашего рынка и решит все вопросы оперативно.',
    },
    {
      title: 'Надёжное партнёрство',
      text: 'Стабильные условия — гарантированные объёмы поставок, своевременная логистика и прозрачные цены, что обеспечивает надёжность и предсказуемость.',
    },
    {
      title: 'Гибкие условия сотрудничества',
      text: 'Выберите удобный формат работы, индивидуальный график поставок и условия под потребности вашего бизнеса.',
    },
  ],
} as const

export const contacts = {
  id: 'contact',
  title: 'свяжитесь с нами',
  lead: 'Мы будем рады ответить на ваши вопросы. Выберите удобный способ связи',
  phone: '+7 939 622-62-22',
  email: 'chocolate-marzo@yandex.ru',
  formEmail: 'marzo@mail.ru',
  hoursLabel: 'Время работы',
  hours: 'Пн–Пт: 09:00–18:00\nСб, Вс: выходной',
  addressLabel: 'Наш адрес',
  address:
    '364040, Чеченская Республика,\nг. Грозный, Байсангуровский район,\n1-й Трамвайный переулок, д. 1А.',
  maps: {
    yandex: 'https://yandex.com/maps/-/CLugnGMF',
    google: 'https://maps.google.com',
    yandexLabel: 'Посмотреть на Яндекс.Картах',
    googleLabel: 'Посмотреть на Google Maps',
  },
  socialsLabel: 'Мы в соцсетях',
  socials: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/chocolate_marzo',
    },
    { label: 'Telegram', href: '' },
    { label: 'VK', href: '' },
  ],
} as const

export const footer = {
  offerDisclaimer:
    'Информация на сайте носит справочный характер и не является публичной офертой.',
  instagramDisclaimer:
    'Instagram принадлежит компании Meta, признанной экстремистской организацией и запрещенной в РФ.',
  privacy: 'Политика конфиденциальности',
  privacyHref: '/politika-konfidencialnosti',
  credits: 'Разработка сайта',
  creditsHref: 'https://wa.me/79222803599',
} as const
