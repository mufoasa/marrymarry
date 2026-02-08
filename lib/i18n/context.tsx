"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language, type TranslationKeys } from "./translations"

export type { Language }

type TranslationFunction = (key: string) => string

type I18nContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationFunction
  translations: TranslationKeys
}

const I18nContext = createContext<I18nContextType | null>(null)

// Helper to get nested value by dot notation path
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Return the key if not found
    }
  }
  return typeof current === "string" ? current : path
}

// Flat translation map for simple lookups
const flatTranslations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: "Home",
    venues: "Venues",
    about: "About",
    contact: "Contact",
    login: "Login",
    signUp: "Sign Up",
    dashboard: "Dashboard",
    logout: "Logout",
    back: "Back",
    
    // General
    overview: "Overview",
    myBookings: "My Bookings",
    myVenues: "My Venues",
    myServices: "My Services",
    manageServices: "Manage your wedding service listings",
    addService: "Add Service",
    editService: "Edit Service",
    noServicesYet: "You haven't added any services yet",
    serviceProviderRole: "Service Provider",
    serviceProviderDesc: "Offer wedding services like photography, makeup, etc.",
    selectRole: "I am a...",
    hasAccount: "Already have an account?",
    signUpSuccess: "Account created! Please check your email to verify.",
    reservations: "Reservations",
    adminPanel: "Admin Panel",
    backToSite: "Back to Site",
    approvals: "Approvals",
    serviceApprovals: "Service Approvals",
    users: "Users",
    settings: "Settings",
    
    // Auth
    loginTitle: "Welcome Back",
    loginDescription: "Sign in to your account to continue",
    signUpTitle: "Create Account",
    signUpDescription: "Join Marry.mk to book or list venues",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    password: "Password",
    confirmPassword: "Confirm Password",
    registerAs: "Register as",
    customerRole: "Customer",
    hallOwnerRole: "Hall Owner",
    customerDesc: "Book venues for your events",
    hallOwnerDesc: "List and manage your venues",
    
    // Hall
    capacity: "Capacity",
    location: "Location",
    amenities: "Amenities",
    description: "Description",
    pricing: "Pricing",
    bookNow: "Book Now",
    bookVenue: "Book This Venue",
    viewDetails: "View Details",
    featured: "Featured",
    
    // Booking
    selectDate: "Select Date",
    guestCount: "Number of Guests",
    yourDetails: "Your Details",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    notes: "Notes",
    notesPlaceholder: "Any special requests or notes...",
    submitBooking: "Submit Booking",
    estimatedTotal: "Estimated Total",
    dateNotAvailable: "This date is not available",
    bookingSubmitted: "Booking request submitted! The venue will contact you soon.",
    bookThisVenue: "Book This Venue",
    startingFrom: "Starting from",
    contactVenue: "Contact Venue",
    toVenues: "Back to Venues",
    
    // Status
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    
    // Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    confirm: "Confirm",
    actions: "Actions",
    approve: "Approve",
    reject: "Reject",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    search: "Search",
    filter: "Filter",
    noResults: "No results found",
    guests: "guests",
    perGuest: "per guest",
    from: "From",
    viewAll: "View All",
    
    // Venue Form
    venueName: "Venue Name",
    city: "City",
    address: "Address",
    capacityMin: "Minimum Capacity",
    capacityMax: "Maximum Capacity",
    pricePerGuest: "Price per Guest",
    basePrice: "Base Price",
    contactPhone: "Contact Phone",
    contactEmail: "Contact Email",
    selectAmenities: "Select Amenities",
    uploadImages: "Upload Images",
    coverImage: "Cover Image",
    
    // Dashboard
    totalVenues: "Total Venues",
    pendingApprovals: "Pending Approvals",
    totalReservations: "Total Reservations",
    totalUsers: "Total Users",
    recentActivity: "Recent Activity",
    noReservations: "No Reservations",
    noReservationsDesc: "Reservations will appear here when customers book",
    allReservations: "All Reservations",
    venue: "Venue",
    customer: "Customer",
    eventDate: "Event Date",
    price: "Price",
    status: "Status",
    addVenue: "Add Venue",
    editVenue: "Edit Venue",
    noVenuesYet: "No venues yet",
    addFirstVenueDescription: "You haven’t added any venues yet. Create your first venue to start receiving bookings.",
    addFirstVenue: "Add your first venue",

    
    // Hero
    heroTitle: "Find Your Perfect Wedding Venue",
    heroSubtitle: "Discover stunning wedding halls across Macedonia",
    searchPlaceholder: "Search by city or venue name...",
    
    // Featured
    featuredTitle: "Featured Venues",
    featuredSubtitle: "Handpicked venues for your special day",
    featuredVenues: "Featured Venues",
    viewAllVenues: "View All Venues",
    
    // Footer
    allRightsReserved: "All rights reserved",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    
    // Services
    services: "Services",
    weddingServices: "Wedding Services",
    servicesSubtitle: "Find the best wedding service providers - photographers, decorators, hair salons, and more",
    allCategories: "All Categories",
    allCities: "All Cities",
    clearFilters: "Clear Filters",
    sendInquiry: "Send Inquiry",
    inquirySent: "Your inquiry has been sent successfully!",
    inquiryError: "Failed to send inquiry. Please try again.",
    message: "Message",
    send: "Send",
    website: "Website",
    
    // Service Categories
    hair_salon: "Hair Salon",
    nail_salon: "Nail Salon",
    makeup: "Makeup Artist",
    decorator: "Decorator",
    photographer: "Photographer",
    videographer: "Videographer",
    florist: "Florist",
    catering: "Catering",
    music_dj: "Music & DJ",
    wedding_planner: "Wedding Planner",
    transport: "Transport",
    other: "Other",
  },
  sq: {
    // Navigation
    home: "Ballina",
    venues: "Sallat",
    about: "Rreth Nesh",
    contact: "Kontakti",
    login: "Hyr",
    signUp: "Regjistrohu",
    dashboard: "Paneli",
    logout: "Dil",
    back: "Kthehu",
    
    // General
    overview: "Përmbledhje",
    myBookings: "Rezervimet e Mia",
    myVenues: "Sallat e Mia",
    myServices: "Shërbimet e Mia",
    manageServices: "Menaxhoni shërbimet tuaja për dasma",
    addService: "Shto Shërbim",
    editService: "Ndrysho Shërbimin",
    noServicesYet: "Nuk keni shtuar ende shërbime",
    serviceProviderRole: "Ofrues Shërbimesh",
    serviceProviderDesc: "Ofroni shërbime për dasma si fotografi, makeup, etj.",
    selectRole: "Unë jam...",
    hasAccount: "Keni tashmë një llogari?",
    signUpSuccess: "Llogaria u krijua! Kontrolloni emailin për verifikim.",
    reservations: "Rezervimet",
    adminPanel: "Paneli Admin",
    backToSite: "Kthehu në Faqe",
    approvals: "Aprovime",
    serviceApprovals: "Aprovime Shërbimesh",
    users: "Përdoruesit",
    settings: "Cilësimet",
    
    // Auth
    loginTitle: "Mirësevini Përsëri",
    loginDescription: "Hyni në llogarinë tuaj për të vazhduar",
    signUpTitle: "Krijo Llogari",
    signUpDescription: "Bashkohuni me Marry.mk",
    forgotPassword: "Keni harruar fjalëkalimin?",
    noAccount: "Nuk keni llogari?",
    haveAccount: "Keni tashmë një llogari?",
    password: "Fjalëkalimi",
    confirmPassword: "Konfirmo Fjalëkalimin",
    registerAs: "Regjistrohu si",
    customerRole: "Klient",
    hallOwnerRole: "Pronar Salle",
    customerDesc: "Rezervoni salla për eventet tuaja",
    hallOwnerDesc: "Listoni dhe menaxhoni sallat tuaja",
    
    // Hall
    capacity: "Kapaciteti",
    location: "Vendndodhja",
    amenities: "Pajisjet",
    description: "Përshkrimi",
    pricing: "Çmimet",
    bookNow: "Rezervo Tani",
    bookVenue: "Rezervo Këtë Sallë",
    viewDetails: "Shiko Detajet",
    featured: "E Zgjedhur",
    
    // Booking
    selectDate: "Zgjidhni Datën",
    guestCount: "Numri i Mysafirëve",
    yourDetails: "Të Dhënat Tuaja",
    fullName: "Emri i Plotë",
    email: "Email",
    phone: "Telefoni",
    notes: "Shënime",
    notesPlaceholder: "Kërkesa të veçanta...",
    submitBooking: "Dërgo Rezervimin",
    estimatedTotal: "Totali i Vlerësuar",
    dateNotAvailable: "Kjo datë nuk është e disponueshme",
    bookingSubmitted: "Kërkesa për rezervim u dërgua!",
    bookThisVenue: "Rezervo këtë sallë",
    startingFrom: "Duke filluar nga",
    contactVenue: "Kontakto sallën",
    toVenues: "Kthehu te sallat",
    
    // Status
    pending: "Në Pritje",
    approved: "Aprovuar",
    rejected: "Refuzuar",
    confirmed: "Konfirmuar",
    cancelled: "Anuluar",
    
    // Actions
    save: "Ruaj",
    cancel: "Anulo",
    delete: "Fshi",
    edit: "Ndrysho",
    view: "Shiko",
    confirm: "Konfirmo",
    actions: "Veprime",
    approve: "Aprovo",
    reject: "Refuzo",
    
    // Common
    loading: "Duke ngarkuar...",
    error: "Gabim",
    success: "Sukses",
    search: "Kërko",
    filter: "Filtro",
    noResults: "Nuk u gjetën rezultate",
    guests: "mysafirë",
    perGuest: "për mysafir",
    from: "Nga",
    viewAll: "Shiko të Gjitha",
    
    // Venue Form
    venueName: "Emri i Sallës",
    city: "Qyteti",
    address: "Adresa",
    capacityMin: "Kapaciteti Minimal",
    capacityMax: "Kapaciteti Maksimal",
    pricePerGuest: "Çmimi për Mysafir",
    basePrice: "Çmimi Bazë",
    contactPhone: "Telefoni Kontaktues",
    contactEmail: "Email Kontaktues",
    selectAmenities: "Zgjidhni Pajisjet",
    uploadImages: "Ngarko Foto",
    coverImage: "Foto Kryesore",
    
    // Dashboard
    totalVenues: "Salla Gjithsej",
    pendingApprovals: "Në Pritje të Aprovimit",
    totalReservations: "Rezervime Gjithsej",
    totalUsers: "Përdorues Gjithsej",
    recentActivity: "Aktiviteti i Fundit",
    noReservations: "Pa Rezervime",
    noReservationsDesc: "Rezervimet do të shfaqen këtu",
    allReservations: "Të Gjitha Rezervimet",
    venue: "Salla",
    customer: "Klienti",
    eventDate: "Data e Eventit",
    price: "Çmimi",
    status: "Statusi",
    addVenue: "Shto Sallë",
    editVenue: "Ndrysho Sallën",
    noVenuesYet: "Nuk ka ende salla",
    addFirstVenueDescription: "Ende nuk keni shtuar asnjë sallë. Krijoni sallën tuaj të parë për të filluar të merrni rezervime.",
    addFirstVenue: "Shto sallën e parë",

    
    // Hero
    heroTitle: "Gjeni Sallën Perfekte të Dasmës",
    heroSubtitle: "Zbuloni salla dasme mahnitëse në Maqedoni",
    searchPlaceholder: "Kërko sipas qytetit...",
    
    // Featured
    featuredTitle: "Sallat e Zgjedhura",
    featuredSubtitle: "Salla të përzgjedhura për ditën tuaj",
    featuredVenues: "Sallat e Zgjedhura",
    viewAllVenues: "Shiko të Gjitha",
    
    // Footer
    allRightsReserved: "Të gjitha të drejtat e rezervuara",
    privacy: "Politika e Privatësisë",
    terms: "Kushtet e Shërbimit",
    privacyPolicy: "Politika e Privatësisë",
    termsOfService: "Kushtet e Shërbimit",
    
    // Services
    services: "Shërbimet",
    weddingServices: "Shërbime për Dasma",
    servicesSubtitle: "Gjeni ofruesit më të mirë të shërbimeve për dasma - fotografë, dekoratorë, parukeri dhe më shumë",
    allCategories: "Të Gjitha Kategoritë",
    allCities: "Të Gjitha Qytetet",
    clearFilters: "Pastro Filtrat",
    sendInquiry: "Dërgo Kërkesë",
    inquirySent: "Kërkesa juaj u dërgua me sukses!",
    inquiryError: "Dështoi dërgimi i kërkesës. Ju lutem provoni përsëri.",
    message: "Mesazhi",
    send: "Dërgo",
    website: "Faqja e internetit",
    
    // Service Categories
    hair_salon: "Parukeri",
    nail_salon: "Salon Thonjsh",
    makeup: "Makeup Artist",
    decorator: "Dekorator",
    photographer: "Fotograf",
    videographer: "Videograf",
    florist: "Lulishte",
    catering: "Katering",
    music_dj: "Muzikë & DJ",
    wedding_planner: "Planifikues Dasmash",
    transport: "Transport",
    other: "Tjetër",
  },
  mk: {
    // Navigation
    home: "Почетна",
    venues: "Сали",
    about: "За Нас",
    contact: "Контакт",
    login: "Најава",
    signUp: "Регистрација",
    dashboard: "Контролна Табла",
    logout: "Одјава",
    back: "Назад",
    
    // General
    overview: "Преглед",
    myBookings: "Мои Резервации",
    myVenues: "Мои Сали",
    myServices: "Мои Услуги",
    manageServices: "Управувајте со вашите свадбени услуги",
    addService: "Додај Услуга",
    editService: "Уреди Услуга",
    noServicesYet: "Сеуште немате додадено услуги",
    serviceProviderRole: "Даватели на Услуги",
    serviceProviderDesc: "Понудете свадбени услуги како фотографија, шминкање, итн.",
    selectRole: "Јас сум...",
    hasAccount: "Веќе имате сметка?",
    signUpSuccess: "Сметката е креирана! Проверете го вашиот емаил за верификација.",
    reservations: "Резервации",
    adminPanel: "Админ Панел",
    backToSite: "Назад кон Сајт",
    approvals: "Одобрувања",
    serviceApprovals: "Одобрувања на Услуги",
    users: "Корисници",
    settings: "Поставки",
    
    // Auth
    loginTitle: "Добредојдовте Назад",
    loginDescription: "Најавете се за да продолжите",
    signUpTitle: "Креирај Сметка",
    signUpDescription: "Придружете се на Marry.mk",
    forgotPassword: "Заборавена лозинка?",
    noAccount: "Немате сметка?",
    haveAccount: "Веќе имате сметка?",
    password: "Лозинка",
    confirmPassword: "Потврди Лозинка",
    registerAs: "Регистрирај се како",
    customerRole: "Клиент",
    hallOwnerRole: "Сопственик на Сала",
    customerDesc: "Резервирајте сали за вашите настани",
    hallOwnerDesc: "Листајте и управувајте со вашите сали",
    
    // Hall
    capacity: "Капацитет",
    location: "Локација",
    amenities: "Удобности",
    description: "Опис",
    pricing: "Цени",
    bookNow: "Резервирај",
    bookVenue: "Резервирај Сала",
    viewDetails: "Погледни Детали",
    featured: "Истакната",
    
    // Booking
    selectDate: "Изберете Датум",
    guestCount: "Број на Гости",
    yourDetails: "Вашите Податоци",
    fullName: "Целосно Име",
    email: "Е-пошта",
    phone: "Телефон",
    notes: "Забелешки",
    notesPlaceholder: "Посебни барања...",
    submitBooking: "Поднеси Резервација",
    estimatedTotal: "Проценет Тотал",
    dateNotAvailable: "Овој датум не е достапен",
    bookingSubmitted: "Барањето за резервација е поднесено!",
    bookThisVenue: "Резервирај ја салата",
    startingFrom: "Почнувајќи од",
    contactVenue: "Контактирај ја салата",
    toVenues: "Назад кон салите",
    
    // Status
    pending: "Во Чекање",
    approved: "Одобрено",
    rejected: "Одбиено",
    confirmed: "Потврдено",
    cancelled: "Откажано",
    
    // Actions
    save: "Зачувај",
    cancel: "Откажи",
    delete: "Избриши",
    edit: "Уреди",
    view: "Погледни",
    confirm: "Потврди",
    actions: "Акции",
    approve: "Одобри",
    reject: "Одбиј",
    
    // Common
    loading: "Се вчитува...",
    error: "Грешка",
    success: "Успех",
    search: "Пребарај",
    filter: "Филтрирај",
    noResults: "Нема резултати",
    guests: "гости",
    perGuest: "по гост",
    from: "Од",
    viewAll: "Погледни Сите",
    
    // Venue Form
    venueName: "Име на Сала",
    city: "Град",
    address: "Адреса",
    capacityMin: "Минимален Капацитет",
    capacityMax: "Максимален Капацитет",
    pricePerGuest: "Цена по Гост",
    basePrice: "Основна Цена",
    contactPhone: "Телефон за Контакт",
    contactEmail: "Е-пошта за Контакт",
    selectAmenities: "Изберете Удобности",
    uploadImages: "Прикачи Слики",
    coverImage: "Главна Слика",
    
    // Dashboard
    totalVenues: "Вкупно Сали",
    pendingApprovals: "Чекаат Одобрување",
    totalReservations: "Вкупно Резервации",
    totalUsers: "Вкупно Корисници",
    recentActivity: "Неодамнешна Активност",
    noReservations: "Нема Резервации",
    noReservationsDesc: "Резервациите ќе се појават тука",
    allReservations: "Сите Резервации",
    venue: "Сала",
    customer: "Клиент",
    eventDate: "Датум на Настан",
    price: "Цена",
    status: "Статус",
    addVenue: "Додај Сала",
    editVenue: "Уреди Сала",
    noVenuesYet: "Сѐ уште нема сали",
    addFirstVenueDescription: "Сѐ уште немате додадено ниту една сала. Додајте ја вашата прва сала за да започнете со резервации.",
    addFirstVenue: "Додај ја првата сала",

    
    // Hero
    heroTitle: "Пронајдете Совршена Сала за Свадба",
    heroSubtitle: "Откријте прекрасни свадбени сали низ Македонија",
    searchPlaceholder: "Пребарувајте по град...",
    
    // Featured
    featuredTitle: "Истакнати Сали",
    featuredSubtitle: "Рачно избрани сали за вашиот посебен ден",
    featuredVenues: "Истакнати Сали",
    viewAllVenues: "Погледни Сите",
    
    // Footer
    allRightsReserved: "Сите права задржани",
privacy: "Политика за Приватност",
  terms: "Услови за Користење",
  privacyPolicy: "Политика за Приватност",
  termsOfService: "Услови за Користење",
    
    // Services
    services: "Услуги",
    weddingServices: "Свадбени Услуги",
    servicesSubtitle: "Пронајдете ги најдобрите даватели на свадбени услуги - фотографи, декоратори, фризерски салони и повеќе",
    allCategories: "Сите Категории",
    allCities: "Сите Градови",
    clearFilters: "Исчисти Филтри",
    sendInquiry: "Испрати Барање",
    inquirySent: "Вашето барање беше успешно испратено!",
    inquiryError: "Неуспешно испраќање на барање. Обидете се повторно.",
    message: "Порака",
    send: "Испрати",
    website: "Веб страница",
    
    // Service Categories
    hair_salon: "Фризерски Салон",
    nail_salon: "Салон за Нокти",
    makeup: "Шминкер",
    decorator: "Декоратор",
    photographer: "Фотограф",
    videographer: "Видеограф",
    florist: "Цвеќар",
    catering: "Кетеринг",
    music_dj: "Музика & DJ",
    wedding_planner: "Организатор на Свадби",
    transport: "Транспорт",
    other: "Друго",
  },
  }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const stored = localStorage.getItem("marry-mk-lang") as Language | null
    if (stored && translations[stored]) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    localStorage.setItem("marry-mk-lang", newLang)
  }

  const t = (key: string): string => {
    // First try flat translations
    const flat = flatTranslations[language]
    if (flat && flat[key]) {
      return flat[key]
    }
    // Then try nested translations
    return getNestedValue(translations[language] as unknown as Record<string, unknown>, key)
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, translations: translations[language] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

// Alias for useLanguage
export const useLanguage = useI18n
