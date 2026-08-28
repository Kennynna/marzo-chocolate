/**
 * Английский словарь. Структура обязана совпадать с ru — это гарантирует тип SiteContent.
 * Якоря (id, href) и пути к медиа не переводятся.
 */

import type { SiteContent } from './ru'

export const en: SiteContent = {
  htmlLang: 'en',

  brand: {
    name: 'MARZO',
    legalName: 'Marzo Limited Liability Company',
    shortLegalName: 'Marzo LLC',
    ogrnLabel: 'OGRN',
    ogrn: '1252000005608',
    innLabel: 'INN',
    inn: '2015011930',
    tagline: 'The first chocolate factory in the Chechen Republic',
    style:
      'The MARZO style is minimalism with a Caucasian character. Every detail, from the packaging to the design of the bar, reflects the traditions, culture and aesthetics of the Chechen Republic.',
  },

  nav: [
    { id: 'collection', label: 'Collection', href: '#product' },
    { id: 'private-label', label: 'Private Label', href: '#for_customers' },
    { id: 'distributors', label: 'For Distributors', href: '#distributors' },
  ],

  links: {
    catalog: '/catalog',
    privacy: '/politika-konfidencialnosti',
  },

  media: {
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
  },

  cta: {
    contact: 'get in touch →',
    contactUs: 'contact us →',
    collection: 'collection →',
    allCollection: 'full collection →',
    order: 'place an order →',
    createBrand: 'create your own brand →',
  },

  welcome: {
    eyebrow: 'Grozny · Chechen Republic',
    title: 'The first chocolate factory in the Chechen Republic',
    meta: ['no palm oil', '100% natural ingredients', 'our own production'],
    caption: 'MARZO — the taste of tradition',
    scrollHint: 'scroll',
  },

  proverb: {
    original: 'Хазалла — бӀаьргашна, мерзалла — дагна.',
    translation: 'Beauty is for the eyes, sweetness is for the heart.',
    source: 'chechen proverb',
  },

  scrollCue: {
    label: 'scroll down',
  },

  hero: {
    title: 'The first chocolate factory in the Chechen Republic',
    paragraphs: [
      'We make chocolate without palm oil, focusing on quality and the traditions of our region, and we offer reliable partnership for wholesale supply and investment.',
      'The MARZO factory brings together modern technology and unique recipes developed by our own team.',
    ],
  },

  aboutFeatures: [
    'Design that reflects the culture of the Chechen Republic',
    'A range built for retail and for gifting',
    '100% natural ingredients',
    'Our own production in Grozny',
  ],

  bars: [
    {
      id: 'milk-hazelnut',
      number: '01',
      title: 'Milk chocolate with whole hazelnuts',
      titleEn: 'молочный шоколад с фундуком',
      image: '/vkus-1.webp',
      ingredients:
        'sugar, cocoa butter, whole milk powder, cocoa mass, dry whey, soy lecithin emulsifier, vanilla powder, hazelnuts',
    },
    {
      id: 'milk-pistachio',
      number: '02',
      title: 'Milk chocolate with crushed pistachios',
      titleEn: 'молочный шоколад с фисташками',
      image: '/vkus-2.webp',
      ingredients:
        'sugar, cocoa butter, whole milk powder, dry whey, soy lecithin emulsifier, natural vanillin flavouring, pistachios',
    },
    {
      id: 'milk-chocolate',
      number: '03',
      title: 'Milk chocolate',
      titleEn: 'молочный шоколад',
      image: '/vkus-3.webp',
      ingredients:
        'sugar, cocoa butter, whole milk powder, cocoa mass, skimmed milk powder, dry whey, emulsifier (soy lecithin), vanilla powder',
    },
  ],

  gifts: [
    {
      id: 'assorted-fruits-nuts',
      number: '01',
      title: 'Handmade assortment with fruits and nuts',
      image: '/pod-1.webp',
    },
    {
      id: 'special',
      number: '02',
      title: 'Special',
      image: '/pod-2.webp',
    },
    {
      id: 'madlen',
      number: '03',
      title: 'Madeleine',
      image: '/pod-3.webp',
    },
  ],

  distributorsSection: {
    id: 'distributors',
  },

  collectionSection: {
    id: 'product',
    title: 'A collection of flavours',
    description:
      'We have gathered our most loved combinations so that every bar becomes a small pleasure.',
  },

  giftsSection: {
    zoomTitle: 'With love for you',
    title: 'Gift sets',
    description:
      'For special occasions we created a whole line of gift solutions: assorted boxes, the “special” collection and delicate madeleines that make a perfect companion to a cup of coffee or tea.',
  },

  privateLabel: {
    id: 'for_customers',
    title: 'Private label chocolate for your business',
    subtitle: 'Chocolate without palm oil under your own brand',
    description:
      'This chocolate underlines the style of your brand and becomes a thoughtful touch for guests and clients. Use it in coffee shops, restaurants, hotels and any other business as a signature dessert or an elegant gift.',
    stamp: 'your brand',
    facts: [
      { value: '100% natural', label: 'natural ingredients and a design that works for your image' },
      { value: '14 days', label: 'shelf life' },
      { value: '1–3 days', label: 'delivery across Russia' },
    ],
  },

  distributors: {
    title: 'Terms for distributors of the chocolate factory',
    intro:
      'We value partnership and aim to build long-term, mutually beneficial relationships with our distributors.',
    items: [
      {
        title: 'Individual approach',
        text: 'Your personal manager takes the specifics of your market into account and resolves every question promptly.',
      },
      {
        title: 'Reliable partnership',
        text: 'Stable terms — guaranteed supply volumes, timely logistics and transparent pricing that keep cooperation predictable.',
      },
      {
        title: 'Flexible cooperation terms',
        text: 'Choose a convenient format of work, an individual delivery schedule and terms tailored to your business.',
      },
    ],
  },

  contacts: {
    id: 'contact',
    title: 'get in touch',
    lead: 'We will be glad to answer your questions. Choose whichever way suits you',
    phone: '+7 939 622-62-22',
    email: 'chocolate-marzo@yandex.ru',
    formEmail: 'marzo@mail.ru',
    hoursLabel: 'Opening hours',
    hours: 'Mon–Fri: 09:00–18:00\nSat, Sun: closed',
    addressLabel: 'Our address',
    address:
      '1A, 1st Tramvayny Lane,\nBaysangurovsky District, Grozny,\nChechen Republic, 364040',
    maps: {
      yandex: 'https://yandex.com/maps/-/CLugnGMF',
      google: 'https://maps.google.com',
      yandexLabel: 'View on Yandex Maps',
      googleLabel: 'View on Google Maps',
    },
    socialsLabel: 'Follow us',
    socials: [
      { label: 'Instagram', href: 'https://www.instagram.com/chocolate_marzo' },
      { label: 'Telegram', href: '' },
      { label: 'VK', href: '' },
    ],
  },

  footer: {
    offerDisclaimer:
      'The information on this site is provided for reference only and does not constitute a public offer.',
    instagramDisclaimer:
      'Instagram is owned by Meta, an organisation recognised as extremist and banned in the Russian Federation.',
    privacy: 'Privacy policy',
    privacyHref: '/politika-konfidencialnosti',
    credits: 'Website development',
    creditsHref: 'https://wa.me/79222803599',
  },

  marquee: {
    brand: [
      'MARZO',
      'Grozny',
      'no palm oil',
      '100% natural',
      'caucasian character',
      'chocolate factory',
    ],
    collection: ['milk', 'hazelnut', 'pistachio', 'assorted', 'madeleine', 'special'],
  },

  ui: {
    languageLabel: 'Site language',
    rails: {
      about: '01 · the factory',
      collection: '02 · collection',
      gifts: '03 · gifts',
      privateLabel: '04 · b2b',
      distributors: '05 · partners',
    },
    eyebrows: {
      collection: 'collection',
      gifts: 'the gift line',
      privateLabel: 'for business',
      distributors: 'distributors',
    },
    ingredientsLabel: 'Ingredients',
    contactsLabel: 'contacts',
    closeModal: 'Close window',
    videoCaption: 'production · Grozny · Chechen Republic',
    aria: {
      welcome: 'MARZO welcome screen',
      hero: 'Main screen',
      giftsScroll: 'Gift sets — video',
      video: 'Video about the MARZO factory',
    },
    alt: {
      aboutHero: 'The MARZO factory',
      aboutSecondary: 'MARZO chocolate production',
      aboutTertiary: 'MARZO chocolate',
    },
  },
}
