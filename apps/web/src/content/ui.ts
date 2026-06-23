/** Подписи статусов наличия на витрине. */
export const STOCK_LABELS = {
  outofstock: "Нет в наличии",
  onbackorder: "Под заказ",
  instock: "В наличии",
} as const;

export const CMS_UNAVAILABLE = "Раздел временно недоступен.";

/** Навигация и шапка. */
export const NAV = {
  services: "Услуги",
  about: "О компании",
  contacts: "Контакты",
  search: "Поиск",
  account: "Кабинет",
  cart: "Корзина",
  catalog: "Каталог",
  categories: "Категории",
  allProducts: "Все товары →",
  homeAria: "AVANT AQUA — на главную",
  mainMenuAria: "Основное меню",
  mobileMenuAria: "Мобильное меню",
  openMenu: "Открыть меню",
  closeMenu: "Закрыть меню",
  cartWithCount: (n: number) => `Корзина, ${n} поз.`,
  since1998: "с 1998 года",
} as const;

/** Верхняя полоса. */
export const TOPBAR = {
  deliveryRf: "Доставка по РФ",
  moscowTagline: "Москва · доставка по России",
} as const;

/** Подвал. */
export const FOOTER = {
  logo: "ООО «Авант» · AVANT AQUA",
  about:
    "Поставка оборудования для бассейнов, SPA и водоподготовки. Подбор, комплектация и сервис с 1998 года.",
  catalogTitle: "Каталог",
  allSections: "Все разделы",
  searchBySku: "Поиск по артикулу",
  contactsTitle: "Контакты",
  infoTitle: "Информация",
  forInstallers: "Для монтажников",
  faq: "Вопросы и ответы",
  delivery: "Оплата и доставка",
  offer: "Публичная оферта",
  privacy: "Политика конфиденциальности",
  copyright: (year: number) =>
    `© ООО «Авант» ${year}. Все права защищены. Стоимость на сайте не является публичной офертой.`,
} as const;

/** Корзина. */
export const CART = {
  title: "Корзина",
  lead: "Проверьте состав заказа перед оформлением.",
  empty: "Пока пусто.",
  toCatalog: "В каталог",
  needHelp: "Нужна помощь с подбором →",
  unavailable: "Товар недоступен (нет в каталоге)",
  loading: "Загрузка…",
  decreaseQty: "Уменьшить",
  increaseQty: "Увеличить",
  remove: "Удалить",
  total: "Итого",
  checkout: "Оформить",
  removeBlocked: "Удалите недоступные позиции перед оформлением.",
  openCart: "Открыть корзину",
  drawerTitle: "Корзина",
  closeCart: "Закрыть корзину",
  titleWithCount: (n: number) => `Корзина · ${n}`,
  totalPrefix: "Итого:",
} as const;

/** Карточка и страница товара. */
export const PRODUCT = {
  notFound: "Товар не найден",
  notFoundMeta: "Товар не найден — AVANT AQUA",
  toCatalog: "В каталог",
  sku: "Артикул",
  description: "Описание",
  specs: "Технические характеристики",
  requestKitQuote: "Запросить КП на комплект",
  boughtTogether: "Часто берут вместе",
  descriptionFallback: "Подробное описание можно запросить у менеджера.",
  hit: "Хит",
  discountBadge: (pct: number) => `−${pct}\u00a0%`,
  skuShort: "Арт.",
  details: "Подробнее",
  noPhoto: "Нет фото",
  galleryAria: "Фотографии товара",
  prevPhoto: "Предыдущее фото",
  nextPhoto: "Следующее фото",
  quantity: "Количество",
  addToCart: "В корзину",
  quickOrderAria: "Быстрый заказ",
  viewInCatalog: "Смотреть в каталоге",
  brandSite: "Сайт производителя",
  certificatePdf: "Сертификат (PDF)",
  brandMeta: (brand: string) =>
    `Проверенное оборудование ${brand} в каталоге AVANT AQUA — подбор под объект и поставка по России.`,
  checkAvailability: "Уточнить наличие",
  downloadPassport: "Скачать паспорт / инструкцию (PDF)",
  similarLead:
    "Позиции из той же категории — часто заказывают вместе с этим товаром.",
  metaDescriptionFallback: (sku: string) =>
    `Артикул ${sku}. Купить в интернет-магазине AVANT AQUA.`,
  kitQuoteInterest: (name: string) => `КП на комплект: ${name}`,
  skuLabel: (sku: string) => `Артикул: ${sku}`,
  catalogBreadcrumb: "Каталог",
  unavailableOrder: "Товар временно недоступен для заказа.",
  photoN: (n: number) => `Фото ${n}`,
} as const;

/** Страница бренда. */
export const BRAND = {
  notFoundMeta: "Бренд не найден — AVANT AQUA",
  metaTitle: (name: string) => `${name} — оборудование в каталоге AVANT AQUA`,
  metaDescription: (name: string, count: number) =>
    `Оборудование ${name}: ${count} позиций в каталоге AVANT AQUA. Подбор, поставка и сервис.`,
  viewInCatalog: "Смотреть в каталоге",
} as const;

/** Оформление заказа. */
export const CHECKOUT = {
  titleEmpty: "Оформление",
  emptyCart: "Корзина пуста.",
  title: "Оформление заказа",
  loggedInAs: (email: string) => `Вы вошли как ${email}.`,
  cabinetLink: "Личный кабинет",
  loginHint: "Войдите",
  loginHintTail: ", чтобы видеть историю заказов.",
  fullName: "ФИО",
  deliveryMethod: "Способ получения",
  deliveryHintPrefix: "Сроки и зоны доставки —",
  deliveryHintLink: "оплата и доставка",
  pickupHint:
    "Самовывоз со склада в Москве — по согласованию с менеджером после оплаты.",
  moscowHint:
    "Доставка по Москве и МО — обычно 1–3 рабочих дня, стоимость по тарифам курьера.",
  tcHint:
    "Отправка ТК по России — сроки и стоимость зависят от региона и габаритов заказа.",
  deliveryAddress: "Адрес доставки",
  promoCode: "Промокод",
  promoPlaceholder: "Введите код",
  applyPromo: "Применить",
  acceptOfferPrefix: "Принимаю условия",
  offerLink: "публичной оферты",
  acceptPrivacyPrefix: "Даю согласие на",
  privacyLink: "обработку персональных данных",
  blockedItemsPrefix: "В корзине есть товары, которых нет в наличии. Удалите их в",
  cartLink: "корзине",
  submitting: "Оформляем…",
  submit: "Перейти к оплате",
  loadingSummary: "Загрузка состава заказа…",
  promoInvalid: "Промокод недействителен",
  promoError: "Ошибка промокода",
  formError: "Проверьте поля формы",
  checkoutError: "Ошибка оформления",
  genericError: "Ошибка",
  paymentProcessing: "Платёж обрабатывается.",
  statusChecking: "Проверяем статус…",
  orderStatus: (id: string, status: string) => `Заказ № ${id}. Статус: ${status}.`,
  statusUpdateFailed: "Не удалось обновить статус. Мы отправили подтверждение на email.",
  myOrders: "Мои заказы",
  thankYou: "Спасибо!",
  toCatalog: "В каталог",
  devTitle: "Тестовый режим оплаты",
  devLead: "ЮKassa не настроена — заказ создан без реального списания.",
} as const;

/** Галерея. */
export const GALLERY = {
  metaTitle: "Галерея — AVANT AQUA",
  metaDescription:
    "Фото смонтированных систем, бассейнов и поставленного оборудования AVANT AQUA.",
  title: "Галерея",
  lead: "Фото смонтированных систем, бассейнов и поставленного оборудования.",
  emptyCategory: "В этой категории пока нет фото. Выберите другой раздел или посмотрите все работы.",
  empty: "Изображения появятся после импорта.",
  filterAria: "Фильтр по категориям",
  all: "Все",
  openPhoto: "Открыть фото",
  lightboxAria: "Просмотр фото",
  prevPhoto: "Предыдущее фото",
  nextPhoto: "Следующее фото",
} as const;

/** Отзывы. */
export const TESTIMONIALS = {
  title: "Отзывы клиентов",
  subtitle: "Опыт сотрудничества с частными заказчиками и бизнесом",
  ratingAria: (n: number) => `Оценка: ${n} из 5`,
} as const;

/** Подписи характеристик товара. */
export const SPEC_LABELS = {
  sku: "Артикул",
  brand: "Бренд",
  country: "Страна",
  material: "Материал",
  filterDiameter: "Диаметр фильтра",
  filterDiameterValue: (mm: string) => `${mm} мм`,
  stock: "Наличие",
} as const;

/** Заказы и оформление. */
export const ORDER = {
  deliveryPickup: "Самовывоз",
  deliveryMoscow: "Доставка по Москве",
  deliveryTc: "Транспортная компания",
  statusDraft: "Черновик",
  statusPending: "Ожидает оплаты",
  statusPaid: "Оплачен",
  statusFailed: "Ошибка оплаты",
  statusCancelled: "Отменён",
  discount: "Скидка",
  discountPromo: (code: string) => `Скидка по промокоду (${code})`,
  discountPercent: (n: string) => `−${n} %`,
  yourOrder: "Ваш заказ",
  items: "Товары",
  toPay: "К оплате",
  itemCol: "Товар",
  qtyCol: "Кол-во",
  deliveryPrefix: "Доставка:",
  orderContentsTitle: "Состав заказа",
  priceCol: "Цена",
  sumCol: "Сумма",
  discountCol: "Скидка",
  totalLabel: "Итого",
  skuCol: "Артикул",
} as const;

/** Личный кабинет. */
export const ACCOUNT = {
  loginTitle: "Вход",
  registerTitle: "Регистрация",
  profileTitle: "Профиль",
  ordersTitle: "Заказы",
  cabinetTitle: "Личный кабинет",
  cabinetNavAria: "Разделы кабинета",
  loginSubmit: "Войти",
  loggingIn: "Входим…",
  registerSubmit: "Зарегистрироваться",
  registering: "Создаём…",
  noAccount: "Нет аккаунта?",
  registerLink: "Регистрация",
  hasAccount: "Уже есть аккаунт?",
  loginLink: "Войти",
  loginError: "Неверный email или пароль",
  registerError: "Не удалось зарегистрироваться. Возможно, email уже занят.",
  logout: "Выйти",
  emailLabel: "Email:",
  profileNav: "Профиль",
  ordersNav: "Заказы",
  ordersEmptyPrefix: "Заказов пока нет. ",
  toCatalogLink: "Перейти в каталог",
  backToOrders: "← Заказы",
  orderTitle: (shortId: string) => `Заказ № ${shortId}`,
  loading: "Загрузка…",
} as const;

/** Общие подписи форм. */
export const FORM = {
  name: "Имя",
  phone: "Телефон",
  email: "Email",
  city: "Город",
  message: "Сообщение",
  interest: "Интерес / категория",
  submit: "Отправить",
  submitting: "Отправка…",
  close: "Закрыть",
  back: "Назад",
  next: "Далее",
  consentPrefix: "Даю согласие на ",
  consentLink: "обработку персональных данных",
  submitError: "Не удалось отправить. Попробуйте позже.",
  leaveRequest: "Оставить заявку",
  leaveRequestLead: "Опишите задачу — подберём оборудование и свяжемся в рабочее время.",
  success: "Спасибо! Заявка принята.",
  contactSuccess: "Спасибо! Мы свяжемся с вами.",
  interestPlaceholder: "Насос, фильтр, комплект…",
  password: "Пароль",
  save: "Сохранить",
  saved: "Сохранено.",
} as const;

/** Обратный звонок. */
export const CALLBACK = {
  trigger: "Перезвоните мне",
  title: "Обратный звонок",
  preferredTime: "Удобное время",
  success: "Спасибо! Мы перезвоним в удобное время.",
  waitCall: "Жду звонка",
  timeAny: "В любое время",
  timeMorning: "Утром (9:00–12:00)",
  timeDay: "Днём (12:00–17:00)",
  timeEvening: "Вечером (17:00–20:00)",
  preferredTimeMessage: (time: string) => `Удобное время: ${time}`,
} as const;

export const CALLBACK_TIME_OPTIONS = [
  CALLBACK.timeAny,
  CALLBACK.timeMorning,
  CALLBACK.timeDay,
  CALLBACK.timeEvening,
] as const;

/** Бриф на комплектацию. */
export const BRIEF = {
  title: "Рассчитать комплектацию",
  stepsAria: "Шаги брифа",
  stepObject: "Тип объекта",
  stepRegion: "Регион",
  stepContacts: "Контакты",
  stepConfirm: "Подтверждение",
  successTitle: "Заявка отправлена",
  successLead:
    "Инженер свяжется с вами, уточнит задачу и подготовит коммерческое предложение.",
  objectQuestion: "Какой объект планируете оборудовать?",
  cityLabel: "Город или регион доставки",
  cityPlaceholder: "Москва, Санкт-Петербург…",
  cityHint: "Сохраним выбор для оформления заказа и заявок.",
  commentOptional: "Комментарий (необязательно)",
  summaryObject: "Объект",
  summaryRegion: "Регион",
  summaryContacts: "Контакты",
  summaryComment: "Комментарий",
  submit: "Отправить заявку",
  objectTypes: [
    { value: "Частный бассейн", label: "Частный бассейн" },
    { value: "SPA / сауна", label: "SPA / сауна" },
    { value: "Коммерческий объект", label: "Коммерческий объект" },
    { value: "Другое", label: "Другое" },
  ],
} as const;

/** CTA и консультация. */
export const CTA = {
  consultation: "Консультация",
  consultationEngineer: "Консультация инженера",
  consultAria: "Быстрая консультация",
  calculateKit: "Рассчитать комплектацию",
  leaveRequest: "Оставить заявку",
  toCatalog: "В каталог",
} as const;

/** Регион доставки на главной. */
export const REGION = {
  deliveryLabel: "Регион доставки:",
  cityPlaceholder: "Город или регион",
  specifyCity: "Указать город",
} as const;

/** Диалоги. */
export const DIALOG = {
  close: "Закрыть",
  closeAria: "Закрыть",
} as const;

/** Каталог — меню. */
export const CATALOG_MENU = {
  title: "Каталог",
  closeAria: "Закрыть меню каталога",
  allProducts: "Все товары каталога",
  noSubcategories: "Подкатегорий пока нет.",
  mergedPipesFittings: "Трубы и фитинги",
} as const;
