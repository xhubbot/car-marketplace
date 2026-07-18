import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

const _url = new URL(process.env.DATABASE_URL!)
const adapter = new PrismaMariaDb({
  host: _url.hostname,
  port: _url.port ? parseInt(_url.port) : 3306,
  user: decodeURIComponent(_url.username),
  password: decodeURIComponent(_url.password),
  database: _url.pathname.slice(1),
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding lookup tables...')

  await seedFuelTypes()
  await seedTransmissions()
  await seedDriveTypes()
  await seedColors()
  await seedEmissionStandards()
  await seedVehicleCategories()
  await seedBodyTypes()
  await seedCountries()
  await seedLocations()
  await seedFeatureCategories()
  await seedCarFeatures()
  await seedPremiumFeatures()
  await seedDealerCategories()

  console.log('✅ Seed complete.')
}

// ─────────────────────────────────────────────────────────────────────────────
// Fuel types
// ─────────────────────────────────────────────────────────────────────────────
async function seedFuelTypes() {
  await prisma.fuelType.createMany({
    skipDuplicates: true,
    data: [
      { id: 1,  technicalName: 'petrol',          isElectric: false, isHybrid: false },
      { id: 2,  technicalName: 'diesel',           isElectric: false, isHybrid: false },
      { id: 3,  technicalName: 'electric',         isElectric: true,  isHybrid: false },
      { id: 4,  technicalName: 'hybrid_petrol',    isElectric: false, isHybrid: true  },
      { id: 5,  technicalName: 'hybrid_diesel',    isElectric: false, isHybrid: true  },
      { id: 6,  technicalName: 'phev_petrol',      isElectric: false, isHybrid: true  },
      { id: 7,  technicalName: 'phev_diesel',      isElectric: false, isHybrid: true  },
      { id: 8,  technicalName: 'lpg',              isElectric: false, isHybrid: false },
      { id: 9,  technicalName: 'cng',              isElectric: false, isHybrid: false },
      { id: 10, technicalName: 'lpg_petrol',       isElectric: false, isHybrid: false },
      { id: 11, technicalName: 'cng_petrol',       isElectric: false, isHybrid: false },
      { id: 12, technicalName: 'ethanol',          isElectric: false, isHybrid: false },
      { id: 13, technicalName: 'hydrogen',         isElectric: false, isHybrid: false },
      { id: 14, technicalName: 'mild_hybrid_petrol', isElectric: false, isHybrid: true },
      { id: 15, technicalName: 'mild_hybrid_diesel',  isElectric: false, isHybrid: true },
      { id: 16, technicalName: 'other',            isElectric: false, isHybrid: false },
    ],
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: [
      { category: 'fuel_type', refId: 1,  languageCode: 'et', name: 'Bensiin' },
      { category: 'fuel_type', refId: 1,  languageCode: 'en', name: 'Petrol' },
      { category: 'fuel_type', refId: 1,  languageCode: 'ru', name: 'Бензин' },
      { category: 'fuel_type', refId: 2,  languageCode: 'et', name: 'Diisel' },
      { category: 'fuel_type', refId: 2,  languageCode: 'en', name: 'Diesel' },
      { category: 'fuel_type', refId: 2,  languageCode: 'ru', name: 'Дизель' },
      { category: 'fuel_type', refId: 3,  languageCode: 'et', name: 'Elekter' },
      { category: 'fuel_type', refId: 3,  languageCode: 'en', name: 'Electric' },
      { category: 'fuel_type', refId: 3,  languageCode: 'ru', name: 'Электро' },
      { category: 'fuel_type', refId: 4,  languageCode: 'et', name: 'Hübriid (bensiin)' },
      { category: 'fuel_type', refId: 4,  languageCode: 'en', name: 'Hybrid (petrol)' },
      { category: 'fuel_type', refId: 4,  languageCode: 'ru', name: 'Гибрид (бензин)' },
      { category: 'fuel_type', refId: 5,  languageCode: 'et', name: 'Hübriid (diisel)' },
      { category: 'fuel_type', refId: 5,  languageCode: 'en', name: 'Hybrid (diesel)' },
      { category: 'fuel_type', refId: 5,  languageCode: 'ru', name: 'Гибрид (дизель)' },
      { category: 'fuel_type', refId: 6,  languageCode: 'et', name: 'Laetav hübriid (bensiin)' },
      { category: 'fuel_type', refId: 6,  languageCode: 'en', name: 'Plug-in hybrid (petrol)' },
      { category: 'fuel_type', refId: 6,  languageCode: 'ru', name: 'Подключаемый гибрид (бензин)' },
      { category: 'fuel_type', refId: 7,  languageCode: 'et', name: 'Laetav hübriid (diisel)' },
      { category: 'fuel_type', refId: 7,  languageCode: 'en', name: 'Plug-in hybrid (diesel)' },
      { category: 'fuel_type', refId: 7,  languageCode: 'ru', name: 'Подключаемый гибрид (дизель)' },
      { category: 'fuel_type', refId: 8,  languageCode: 'et', name: 'LPG' },
      { category: 'fuel_type', refId: 8,  languageCode: 'en', name: 'LPG' },
      { category: 'fuel_type', refId: 8,  languageCode: 'ru', name: 'ГАЗ (LPG)' },
      { category: 'fuel_type', refId: 9,  languageCode: 'et', name: 'CNG (maagaas)' },
      { category: 'fuel_type', refId: 9,  languageCode: 'en', name: 'CNG (natural gas)' },
      { category: 'fuel_type', refId: 9,  languageCode: 'ru', name: 'КПГ (природный газ)' },
      { category: 'fuel_type', refId: 10, languageCode: 'et', name: 'LPG + bensiin' },
      { category: 'fuel_type', refId: 10, languageCode: 'en', name: 'LPG + petrol' },
      { category: 'fuel_type', refId: 10, languageCode: 'ru', name: 'ГАЗ + бензин' },
      { category: 'fuel_type', refId: 11, languageCode: 'et', name: 'CNG + bensiin' },
      { category: 'fuel_type', refId: 11, languageCode: 'en', name: 'CNG + petrol' },
      { category: 'fuel_type', refId: 11, languageCode: 'ru', name: 'КПГ + бензин' },
      { category: 'fuel_type', refId: 12, languageCode: 'et', name: 'Etanool (E85)' },
      { category: 'fuel_type', refId: 12, languageCode: 'en', name: 'Ethanol (E85)' },
      { category: 'fuel_type', refId: 12, languageCode: 'ru', name: 'Этанол (E85)' },
      { category: 'fuel_type', refId: 13, languageCode: 'et', name: 'Vesinik' },
      { category: 'fuel_type', refId: 13, languageCode: 'en', name: 'Hydrogen' },
      { category: 'fuel_type', refId: 13, languageCode: 'ru', name: 'Водород' },
      { category: 'fuel_type', refId: 14, languageCode: 'et', name: 'Kerghübriid (bensiin)' },
      { category: 'fuel_type', refId: 14, languageCode: 'en', name: 'Mild hybrid (petrol)' },
      { category: 'fuel_type', refId: 14, languageCode: 'ru', name: 'Мягкий гибрид (бензин)' },
      { category: 'fuel_type', refId: 15, languageCode: 'et', name: 'Kerghübriid (diisel)' },
      { category: 'fuel_type', refId: 15, languageCode: 'en', name: 'Mild hybrid (diesel)' },
      { category: 'fuel_type', refId: 15, languageCode: 'ru', name: 'Мягкий гибрид (дизель)' },
      { category: 'fuel_type', refId: 16, languageCode: 'et', name: 'Muu' },
      { category: 'fuel_type', refId: 16, languageCode: 'en', name: 'Other' },
      { category: 'fuel_type', refId: 16, languageCode: 'ru', name: 'Другое' },
    ],
  })
  console.log('  ✓ fuel_types')
}

// ─────────────────────────────────────────────────────────────────────────────
// Transmissions
// ─────────────────────────────────────────────────────────────────────────────
async function seedTransmissions() {
  await prisma.transmission.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, technicalName: 'manual' },
      { id: 2, technicalName: 'automatic' },
      { id: 3, technicalName: 'semi_automatic' },
    ],
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: [
      { category: 'transmission', refId: 1, languageCode: 'et', name: 'Manuaal' },
      { category: 'transmission', refId: 1, languageCode: 'en', name: 'Manual' },
      { category: 'transmission', refId: 1, languageCode: 'ru', name: 'Механическая' },
      { category: 'transmission', refId: 2, languageCode: 'et', name: 'Automaat' },
      { category: 'transmission', refId: 2, languageCode: 'en', name: 'Automatic' },
      { category: 'transmission', refId: 2, languageCode: 'ru', name: 'Автоматическая' },
      { category: 'transmission', refId: 3, languageCode: 'et', name: 'Poolautomaat' },
      { category: 'transmission', refId: 3, languageCode: 'en', name: 'Semi-automatic' },
      { category: 'transmission', refId: 3, languageCode: 'ru', name: 'Полуавтоматическая' },
    ],
  })
  console.log('  ✓ transmissions')
}

// ─────────────────────────────────────────────────────────────────────────────
// Drive types
// ─────────────────────────────────────────────────────────────────────────────
async function seedDriveTypes() {
  await prisma.driveType.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, technicalName: 'fwd' },
      { id: 2, technicalName: 'rwd' },
      { id: 3, technicalName: 'awd' },
    ],
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: [
      { category: 'drive_type', refId: 1, languageCode: 'et', name: 'Esivedu' },
      { category: 'drive_type', refId: 1, languageCode: 'en', name: 'Front-wheel drive' },
      { category: 'drive_type', refId: 1, languageCode: 'ru', name: 'Передний привод' },
      { category: 'drive_type', refId: 2, languageCode: 'et', name: 'Tagavedu' },
      { category: 'drive_type', refId: 2, languageCode: 'en', name: 'Rear-wheel drive' },
      { category: 'drive_type', refId: 2, languageCode: 'ru', name: 'Задний привод' },
      { category: 'drive_type', refId: 3, languageCode: 'et', name: 'Nelikvedu' },
      { category: 'drive_type', refId: 3, languageCode: 'en', name: 'All-wheel drive' },
      { category: 'drive_type', refId: 3, languageCode: 'ru', name: 'Полный привод' },
    ],
  })
  console.log('  ✓ drive_types')
}

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────
async function seedColors() {
  await prisma.color.createMany({
    skipDuplicates: true,
    data: [
      { id: 1,  technicalName: 'black',         hexCode: '#000000' },
      { id: 2,  technicalName: 'white',         hexCode: '#FFFFFF' },
      { id: 3,  technicalName: 'silver',        hexCode: '#C0C0C0' },
      { id: 4,  technicalName: 'grey',          hexCode: '#808080' },
      { id: 5,  technicalName: 'dark_grey',     hexCode: '#404040' },
      { id: 6,  technicalName: 'blue',          hexCode: '#0000FF' },
      { id: 7,  technicalName: 'dark_blue',     hexCode: '#00008B' },
      { id: 8,  technicalName: 'light_blue',    hexCode: '#ADD8E6' },
      { id: 9,  technicalName: 'red',           hexCode: '#FF0000' },
      { id: 10, technicalName: 'dark_red',      hexCode: '#8B0000' },
      { id: 11, technicalName: 'green',         hexCode: '#008000' },
      { id: 12, technicalName: 'dark_green',    hexCode: '#006400' },
      { id: 13, technicalName: 'yellow',        hexCode: '#FFFF00' },
      { id: 14, technicalName: 'orange',        hexCode: '#FFA500' },
      { id: 15, technicalName: 'brown',         hexCode: '#A52A2A' },
      { id: 16, technicalName: 'beige',         hexCode: '#F5F5DC' },
      { id: 17, technicalName: 'gold',          hexCode: '#FFD700' },
      { id: 18, technicalName: 'bronze',        hexCode: '#CD7F32' },
      { id: 19, technicalName: 'violet',        hexCode: '#EE82EE' },
      { id: 20, technicalName: 'purple',        hexCode: '#800080' },
      { id: 21, technicalName: 'pink',          hexCode: '#FFC0CB' },
      { id: 22, technicalName: 'turquoise',     hexCode: '#40E0D0' },
      { id: 23, technicalName: 'dark_brown',    hexCode: '#5C4033' },
      { id: 24, technicalName: 'champagne',     hexCode: '#F7E7CE' },
      { id: 25, technicalName: 'dark_cherry',   hexCode: '#7B1C2D' },
      { id: 26, technicalName: 'light_yellow',  hexCode: '#FFFACD' },
      { id: 27, technicalName: 'pearl_white',   hexCode: '#F0EAD6' },
      { id: 28, technicalName: 'anthracite',    hexCode: '#2D2D2D' },
      { id: 29, technicalName: 'bright_red',    hexCode: '#FF2400' },
      { id: 30, technicalName: 'night_blue',    hexCode: '#1C2B5E' },
      { id: 31, technicalName: 'olive',         hexCode: '#808000' },
      { id: 32, technicalName: 'other',         hexCode: null },
    ],
  })

  const colorData: Array<{ id: number; et: string; en: string; ru: string }> = [
    { id: 1,  et: 'Must',            en: 'Black',         ru: 'Чёрный' },
    { id: 2,  et: 'Valge',           en: 'White',         ru: 'Белый' },
    { id: 3,  et: 'Hõbedane',        en: 'Silver',        ru: 'Серебристый' },
    { id: 4,  et: 'Hall',            en: 'Grey',          ru: 'Серый' },
    { id: 5,  et: 'Tumehall',        en: 'Dark grey',     ru: 'Тёмно-серый' },
    { id: 6,  et: 'Sinine',          en: 'Blue',          ru: 'Синий' },
    { id: 7,  et: 'Tumesinine',      en: 'Dark blue',     ru: 'Тёмно-синий' },
    { id: 8,  et: 'Helesinine',      en: 'Light blue',    ru: 'Голубой' },
    { id: 9,  et: 'Punane',          en: 'Red',           ru: 'Красный' },
    { id: 10, et: 'Tumepunane',      en: 'Dark red',      ru: 'Тёмно-красный' },
    { id: 11, et: 'Roheline',        en: 'Green',         ru: 'Зелёный' },
    { id: 12, et: 'Tumeroheline',    en: 'Dark green',    ru: 'Тёмно-зелёный' },
    { id: 13, et: 'Kollane',         en: 'Yellow',        ru: 'Жёлтый' },
    { id: 14, et: 'Oranž',          en: 'Orange',        ru: 'Оранжевый' },
    { id: 15, et: 'Pruun',           en: 'Brown',         ru: 'Коричневый' },
    { id: 16, et: 'Beež',           en: 'Beige',         ru: 'Бежевый' },
    { id: 17, et: 'Kuldne',          en: 'Gold',          ru: 'Золотой' },
    { id: 18, et: 'Pronks',          en: 'Bronze',        ru: 'Бронзовый' },
    { id: 19, et: 'Violetne',        en: 'Violet',        ru: 'Фиолетовый' },
    { id: 20, et: 'Lilla',           en: 'Purple',        ru: 'Пурпурный' },
    { id: 21, et: 'Roosa',           en: 'Pink',          ru: 'Розовый' },
    { id: 22, et: 'Türkiis',        en: 'Turquoise',     ru: 'Бирюзовый' },
    { id: 23, et: 'Tumepruun',       en: 'Dark brown',    ru: 'Тёмно-коричневый' },
    { id: 24, et: 'Šampanja',       en: 'Champagne',     ru: 'Шампанское' },
    { id: 25, et: 'Tumekiresvärv',  en: 'Dark cherry',   ru: 'Тёмная вишня' },
    { id: 26, et: 'Helekollane',     en: 'Light yellow',  ru: 'Светло-жёлтый' },
    { id: 27, et: 'Pärlvalge',      en: 'Pearl white',   ru: 'Перламутровый белый' },
    { id: 28, et: 'Antratsit',       en: 'Anthracite',    ru: 'Антрацит' },
    { id: 29, et: 'Eredpunane',      en: 'Bright red',    ru: 'Ярко-красный' },
    { id: 30, et: 'Öösinine',       en: 'Night blue',    ru: 'Ночной синий' },
    { id: 31, et: 'Oliiv',          en: 'Olive',         ru: 'Оливковый' },
    { id: 32, et: 'Muu',             en: 'Other',         ru: 'Другое' },
  ]

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: colorData.flatMap(c => [
      { category: 'color', refId: c.id, languageCode: 'et', name: c.et },
      { category: 'color', refId: c.id, languageCode: 'en', name: c.en },
      { category: 'color', refId: c.id, languageCode: 'ru', name: c.ru },
    ]),
  })
  console.log('  ✓ colors')
}

// ─────────────────────────────────────────────────────────────────────────────
// Emission standards
// ─────────────────────────────────────────────────────────────────────────────
async function seedEmissionStandards() {
  const standards = [
    { id: 1, name: 'Euro 1' },
    { id: 2, name: 'Euro 2' },
    { id: 3, name: 'Euro 3' },
    { id: 4, name: 'Euro 4' },
    { id: 5, name: 'Euro 5' },
    { id: 6, name: 'Euro 6' },
    { id: 7, name: 'Euro 6d' },
    { id: 8, name: 'Euro 6d-temp' },
    { id: 9, name: 'Euro 0' },
  ]

  await prisma.emissionStandard.createMany({
    skipDuplicates: true,
    data: standards.map(s => ({ id: s.id, technicalName: s.name.toLowerCase().replace(' ', '_') })),
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: standards.flatMap(s => [
      { category: 'emission_standard', refId: s.id, languageCode: 'et', name: s.name },
      { category: 'emission_standard', refId: s.id, languageCode: 'en', name: s.name },
      { category: 'emission_standard', refId: s.id, languageCode: 'ru', name: s.name },
    ]),
  })
  console.log('  ✓ emission_standards')
}

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle categories
// ─────────────────────────────────────────────────────────────────────────────
async function seedVehicleCategories() {
  await prisma.vehicleCategory.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, technicalName: 'car' },
      { id: 2, technicalName: 'motorcycle' },
      { id: 3, technicalName: 'van' },
      { id: 4, technicalName: 'truck' },
      { id: 5, technicalName: 'bus' },
      { id: 6, technicalName: 'rv' },
      { id: 7, technicalName: 'trailer' },
      { id: 8, technicalName: 'caravan' },
      { id: 9, technicalName: 'construction' },
      { id: 10, technicalName: 'agriculture' },
      { id: 11, technicalName: 'forestry' },
      { id: 12, technicalName: 'municipal' },
      { id: 13, technicalName: 'watercraft' },
    ],
  })

  const catTranslations: Array<{ id: number; et: string; en: string; ru: string }> = [
    { id: 1,  et: 'Sõiduauto',         en: 'Car',              ru: 'Легковой автомобиль' },
    { id: 2,  et: 'Mootorratas',        en: 'Motorcycle',       ru: 'Мотоцикл' },
    { id: 3,  et: 'Kaubik',             en: 'Van',              ru: 'Фургон' },
    { id: 4,  et: 'Veoauto',            en: 'Truck',            ru: 'Грузовик' },
    { id: 5,  et: 'Buss',               en: 'Bus',              ru: 'Автобус' },
    { id: 6,  et: 'Matkaauto',          en: 'Motorhome / RV',   ru: 'Автодом / Кемпер' },
    { id: 7,  et: 'Haagis',             en: 'Trailer',          ru: 'Прицеп' },
    { id: 8,  et: 'Haagissuvila',       en: 'Caravan',          ru: 'Каравана' },
    { id: 9,  et: 'Ehitustehnika',      en: 'Construction equipment', ru: 'Строительная техника' },
    { id: 10, et: 'Põllumajandustehnika', en: 'Agricultural equipment', ru: 'Сельхозтехника' },
    { id: 11, et: 'Metsatehnika',       en: 'Forestry equipment', ru: 'Лесозаготовительная техника' },
    { id: 12, et: 'Kommunaaltehnika',   en: 'Municipal vehicles', ru: 'Коммунальная техника' },
    { id: 13, et: 'Veesõiduk',         en: 'Watercraft',       ru: 'Водный транспорт' },
  ]

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: catTranslations.flatMap(c => [
      { category: 'vehicle_category', refId: c.id, languageCode: 'et', name: c.et },
      { category: 'vehicle_category', refId: c.id, languageCode: 'en', name: c.en },
      { category: 'vehicle_category', refId: c.id, languageCode: 'ru', name: c.ru },
    ]),
  })
  console.log('  ✓ vehicle_categories')
}

// ─────────────────────────────────────────────────────────────────────────────
// Body types  (category_id 1 = car, 2 = motorcycle, etc.)
// ─────────────────────────────────────────────────────────────────────────────
async function seedBodyTypes() {
  await prisma.bodyType.createMany({
    skipDuplicates: true,
    data: [
      // Cars (category 1)
      { id: 1,  categoryId: 1, technicalName: 'sedan' },
      { id: 2,  categoryId: 1, technicalName: 'hatchback' },
      { id: 3,  categoryId: 1, technicalName: 'estate' },
      { id: 4,  categoryId: 1, technicalName: 'suv' },
      { id: 5,  categoryId: 1, technicalName: 'coupe' },
      { id: 6,  categoryId: 1, technicalName: 'convertible' },
      { id: 7,  categoryId: 1, technicalName: 'minivan' },
      { id: 8,  categoryId: 1, technicalName: 'pickup' },
      // Motorcycles (category 2)
      { id: 20, categoryId: 2, technicalName: 'sport' },
      { id: 21, categoryId: 2, technicalName: 'naked' },
      { id: 22, categoryId: 2, technicalName: 'touring' },
      { id: 23, categoryId: 2, technicalName: 'cruiser' },
      { id: 24, categoryId: 2, technicalName: 'enduro' },
      { id: 25, categoryId: 2, technicalName: 'motocross' },
      { id: 26, categoryId: 2, technicalName: 'scooter' },
      { id: 27, categoryId: 2, technicalName: 'moped' },
      // Vans (category 3)
      { id: 40, categoryId: 3, technicalName: 'panel_van' },
      { id: 41, categoryId: 3, technicalName: 'minibus' },
      { id: 42, categoryId: 3, technicalName: 'flatbed' },
      // Trucks (category 4)
      { id: 60, categoryId: 4, technicalName: 'box_truck' },
      { id: 61, categoryId: 4, technicalName: 'tractor_unit' },
      { id: 62, categoryId: 4, technicalName: 'tipper' },
      { id: 63, categoryId: 4, technicalName: 'refrigerated' },
      // Buses (category 5)
      { id: 80, categoryId: 5, technicalName: 'city_bus' },
      { id: 81, categoryId: 5, technicalName: 'coach' },
      { id: 82, categoryId: 5, technicalName: 'minibus_bus' },
      // RV (category 6)
      { id: 100, categoryId: 6, technicalName: 'alcove' },
      { id: 101, categoryId: 6, technicalName: 'integrated' },
      { id: 102, categoryId: 6, technicalName: 'semi_integrated' },
      // Trailers (category 7)
      { id: 120, categoryId: 7, technicalName: 'car_trailer' },
      { id: 121, categoryId: 7, technicalName: 'boat_trailer' },
      { id: 122, categoryId: 7, technicalName: 'cargo_trailer' },
      { id: 123, categoryId: 7, technicalName: 'livestock_trailer' },
      // Caravans (category 8)
      { id: 140, categoryId: 8, technicalName: 'caravan_touring' },
      { id: 141, categoryId: 8, technicalName: 'caravan_static' },
      // Construction (category 9)
      { id: 160, categoryId: 9, technicalName: 'excavator' },
      { id: 161, categoryId: 9, technicalName: 'bulldozer' },
      { id: 162, categoryId: 9, technicalName: 'crane' },
      { id: 163, categoryId: 9, technicalName: 'loader' },
      // Agriculture (category 10)
      { id: 180, categoryId: 10, technicalName: 'tractor' },
      { id: 181, categoryId: 10, technicalName: 'combine' },
      { id: 182, categoryId: 10, technicalName: 'telehandler' },
      // Forestry (category 11)
      { id: 200, categoryId: 11, technicalName: 'harvester' },
      { id: 201, categoryId: 11, technicalName: 'forwarder' },
      // Municipal (category 12)
      { id: 220, categoryId: 12, technicalName: 'sweeper' },
      { id: 221, categoryId: 12, technicalName: 'snow_plow' },
      // Watercraft (category 13)
      { id: 240, categoryId: 13, technicalName: 'motorboat' },
      { id: 241, categoryId: 13, technicalName: 'sailboat' },
      { id: 242, categoryId: 13, technicalName: 'jet_ski' },
    ],
  })

  const bodyTranslations: Array<{ id: number; et: string; en: string; ru: string }> = [
    { id: 1,   et: 'Sedaan',           en: 'Sedan',            ru: 'Седан' },
    { id: 2,   et: 'Luukpära',        en: 'Hatchback',        ru: 'Хэтчбек' },
    { id: 3,   et: 'Universaal',       en: 'Estate',           ru: 'Универсал' },
    { id: 4,   et: 'Maastur / SUV',    en: 'SUV / Off-road',   ru: 'Внедорожник / SUV' },
    { id: 5,   et: 'Kupee',            en: 'Coupé',           ru: 'Купе' },
    { id: 6,   et: 'Kabriolett',       en: 'Convertible',      ru: 'Кабриолет' },
    { id: 7,   et: 'Minivan',          en: 'Minivan / MPV',    ru: 'Минивэн / MPV' },
    { id: 8,   et: 'Pikap',            en: 'Pick-up',          ru: 'Пикап' },
    { id: 20,  et: 'Sport',            en: 'Sport',            ru: 'Спорт' },
    { id: 21,  et: 'Naked',            en: 'Naked',            ru: 'Нейкед' },
    { id: 22,  et: 'Touring',          en: 'Touring',          ru: 'Туринг' },
    { id: 23,  et: 'Chopper/Cruiser',  en: 'Chopper/Cruiser',  ru: 'Чоппер/Крузер' },
    { id: 24,  et: 'Enduro',           en: 'Enduro',           ru: 'Эндуро' },
    { id: 25,  et: 'Motokross',        en: 'Motocross',        ru: 'Мотокросс' },
    { id: 26,  et: 'Skuter',           en: 'Scooter',          ru: 'Скутер' },
    { id: 27,  et: 'Mopeed',           en: 'Moped',            ru: 'Мопед' },
    { id: 40,  et: 'Kastiauto',        en: 'Panel van',        ru: 'Грузопассажирский фургон' },
    { id: 41,  et: 'Minibuss',         en: 'Minibus',          ru: 'Микроавтобус' },
    { id: 42,  et: 'Lahtine',          en: 'Flatbed',          ru: 'Бортовой' },
    { id: 60,  et: 'Kinnine veok',     en: 'Box truck',        ru: 'Фургон-грузовик' },
    { id: 61,  et: 'Veduk',            en: 'Tractor unit',     ru: 'Тягач' },
    { id: 62,  et: 'Kallur',           en: 'Tipper',           ru: 'Самосвал' },
    { id: 63,  et: 'Külmik',          en: 'Refrigerated',     ru: 'Рефрижератор' },
    { id: 80,  et: 'Linnabuss',        en: 'City bus',         ru: 'Городской автобус' },
    { id: 81,  et: 'Reisibuss',        en: 'Coach',            ru: 'Туристический автобус' },
    { id: 82,  et: 'Minibuss (buss)',  en: 'Minibus',          ru: 'Микроавтобус' },
    { id: 100, et: 'Alkoov',           en: 'Alcove',           ru: 'Алькобус' },
    { id: 101, et: 'Integreeritud',    en: 'Integrated',       ru: 'Интегральный' },
    { id: 102, et: 'Poolintegreeritud', en: 'Semi-integrated', ru: 'Полуинтегральный' },
    { id: 120, et: 'Autohaagis',       en: 'Car trailer',      ru: 'Автоприцеп' },
    { id: 121, et: 'Venehaagis',       en: 'Boat trailer',     ru: 'Лодочный прицеп' },
    { id: 122, et: 'Kaubahaagis',      en: 'Cargo trailer',    ru: 'Грузовой прицеп' },
    { id: 123, et: 'Loomade vedu',     en: 'Livestock trailer', ru: 'Животноводческий прицеп' },
    { id: 140, et: 'Turistihaagis',    en: 'Touring caravan',  ru: 'Туристический прицеп' },
    { id: 141, et: 'Statsionaarne',    en: 'Static caravan',   ru: 'Стационарный' },
    { id: 160, et: 'Ekskavaator',      en: 'Excavator',        ru: 'Экскаватор' },
    { id: 161, et: 'Buldooser',        en: 'Bulldozer',        ru: 'Бульдозер' },
    { id: 162, et: 'Kraana',           en: 'Crane',            ru: 'Кран' },
    { id: 163, et: 'Laadur',           en: 'Loader',           ru: 'Погрузчик' },
    { id: 180, et: 'Traktor',          en: 'Tractor',          ru: 'Трактор' },
    { id: 181, et: 'Kombain',          en: 'Combine harvester', ru: 'Комбайн' },
    { id: 182, et: 'Teleskoopkäsi',   en: 'Telehandler',      ru: 'Телескопический погрузчик' },
    { id: 200, et: 'Harvester',        en: 'Harvester',        ru: 'Харвестер' },
    { id: 201, et: 'Forvarder',        en: 'Forwarder',        ru: 'Форвардер' },
    { id: 220, et: 'Pühkur',          en: 'Street sweeper',   ru: 'Подметальная машина' },
    { id: 221, et: 'Lumeaur',          en: 'Snow plow',        ru: 'Снегоуборочная машина' },
    { id: 240, et: 'Mootorpaat',       en: 'Motorboat',        ru: 'Моторная лодка' },
    { id: 241, et: 'Purjekas',         en: 'Sailboat',         ru: 'Парусная лодка' },
    { id: 242, et: 'Jet-ski',          en: 'Jet ski',          ru: 'Гидроцикл' },
  ]

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: bodyTranslations.flatMap(b => [
      { category: 'body_type', refId: b.id, languageCode: 'et', name: b.et },
      { category: 'body_type', refId: b.id, languageCode: 'en', name: b.en },
      { category: 'body_type', refId: b.id, languageCode: 'ru', name: b.ru },
    ]),
  })
  console.log('  ✓ body_types')
}

// ─────────────────────────────────────────────────────────────────────────────
// Countries
// ─────────────────────────────────────────────────────────────────────────────
async function seedCountries() {
  const countries: Array<{ id: number; iso2: string; et: string; en: string; ru: string }> = [
    { id: 1,  iso2: 'EE', et: 'Eesti',          en: 'Estonia',          ru: 'Эстония' },
    { id: 2,  iso2: 'LV', et: 'Läti',           en: 'Latvia',           ru: 'Латвия' },
    { id: 3,  iso2: 'LT', et: 'Leedu',          en: 'Lithuania',        ru: 'Литва' },
    { id: 4,  iso2: 'FI', et: 'Soome',          en: 'Finland',          ru: 'Финляндия' },
    { id: 5,  iso2: 'SE', et: 'Rootsi',         en: 'Sweden',           ru: 'Швеция' },
    { id: 6,  iso2: 'NO', et: 'Norra',          en: 'Norway',           ru: 'Норвегия' },
    { id: 7,  iso2: 'DK', et: 'Taani',          en: 'Denmark',          ru: 'Дания' },
    { id: 8,  iso2: 'DE', et: 'Saksamaa',       en: 'Germany',          ru: 'Германия' },
    { id: 9,  iso2: 'AT', et: 'Austria',        en: 'Austria',          ru: 'Австрия' },
    { id: 10, iso2: 'CH', et: 'Šveits',        en: 'Switzerland',      ru: 'Швейцария' },
    { id: 11, iso2: 'NL', et: 'Holland',        en: 'Netherlands',      ru: 'Нидерланды' },
    { id: 12, iso2: 'BE', et: 'Belgia',         en: 'Belgium',          ru: 'Бельгия' },
    { id: 13, iso2: 'FR', et: 'Prantsusmaa',    en: 'France',           ru: 'Франция' },
    { id: 14, iso2: 'ES', et: 'Hispaania',      en: 'Spain',            ru: 'Испания' },
    { id: 15, iso2: 'PT', et: 'Portugal',       en: 'Portugal',         ru: 'Португалия' },
    { id: 16, iso2: 'IT', et: 'Itaalia',        en: 'Italy',            ru: 'Италия' },
    { id: 17, iso2: 'GB', et: 'Suurbritannia',  en: 'United Kingdom',   ru: 'Великобритания' },
    { id: 18, iso2: 'IE', et: 'Iirimaa',        en: 'Ireland',          ru: 'Ирландия' },
    { id: 19, iso2: 'PL', et: 'Poola',          en: 'Poland',           ru: 'Польша' },
    { id: 20, iso2: 'CZ', et: 'Tšehhi',        en: 'Czech Republic',   ru: 'Чехия' },
    { id: 21, iso2: 'SK', et: 'Slovakkia',      en: 'Slovakia',         ru: 'Словакия' },
    { id: 22, iso2: 'HU', et: 'Ungari',         en: 'Hungary',          ru: 'Венгрия' },
    { id: 23, iso2: 'RO', et: 'Rumeenia',       en: 'Romania',          ru: 'Румыния' },
    { id: 24, iso2: 'BG', et: 'Bulgaaria',      en: 'Bulgaria',         ru: 'Болгария' },
    { id: 25, iso2: 'HR', et: 'Horvaatia',      en: 'Croatia',          ru: 'Хорватия' },
    { id: 26, iso2: 'SI', et: 'Sloveenia',      en: 'Slovenia',         ru: 'Словения' },
    { id: 27, iso2: 'RS', et: 'Serbia',         en: 'Serbia',           ru: 'Сербия' },
    { id: 28, iso2: 'GR', et: 'Kreeka',         en: 'Greece',           ru: 'Греция' },
    { id: 29, iso2: 'RU', et: 'Venemaa',        en: 'Russia',           ru: 'Россия' },
    { id: 30, iso2: 'UA', et: 'Ukraina',        en: 'Ukraine',          ru: 'Украина' },
    { id: 31, iso2: 'BY', et: 'Valgevene',      en: 'Belarus',          ru: 'Беларусь' },
    { id: 32, iso2: 'US', et: 'USA',            en: 'United States',    ru: 'США' },
    { id: 33, iso2: 'CA', et: 'Kanada',         en: 'Canada',           ru: 'Канада' },
    { id: 34, iso2: 'JP', et: 'Jaapan',         en: 'Japan',            ru: 'Япония' },
    { id: 35, iso2: 'KR', et: 'Lõuna-Korea',   en: 'South Korea',      ru: 'Южная Корея' },
    { id: 36, iso2: 'CN', et: 'Hiina',          en: 'China',            ru: 'Китай' },
    { id: 37, iso2: 'AU', et: 'Austraalia',     en: 'Australia',        ru: 'Австралия' },
    { id: 38, iso2: 'ZA', et: 'Lõuna-Aafrika', en: 'South Africa',     ru: 'ЮАР' },
    { id: 39, iso2: 'TR', et: 'Türgi',         en: 'Turkey',           ru: 'Турция' },
  ]

  await prisma.country.createMany({
    skipDuplicates: true,
    data: countries.map(c => ({ id: c.id, iso2Code: c.iso2, fallbackName: c.et })),
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: countries.flatMap(c => [
      { category: 'country', refId: c.id, languageCode: 'et', name: c.et },
      { category: 'country', refId: c.id, languageCode: 'en', name: c.en },
      { category: 'country', refId: c.id, languageCode: 'ru', name: c.ru },
    ]),
  })
  console.log('  ✓ countries')
}

// ─────────────────────────────────────────────────────────────────────────────
// Locations (Estonian counties + major cities)
// ─────────────────────────────────────────────────────────────────────────────
async function seedLocations() {
  // Counties (maakond) first — no parent
  const counties = [
    { id: 1,  name: 'Harjumaa' },
    { id: 2,  name: 'Hiiumaa' },
    { id: 3,  name: 'Ida-Virumaa' },
    { id: 4,  name: 'Järvamaa' },
    { id: 5,  name: 'Jõgevamaa' },
    { id: 6,  name: 'Läänemaa' },
    { id: 7,  name: 'Lääne-Virumaa' },
    { id: 8,  name: 'Põlvamaa' },
    { id: 9,  name: 'Pärnumaa' },
    { id: 10, name: 'Raplamaa' },
    { id: 11, name: 'Saaremaa' },
    { id: 12, name: 'Tartumaa' },
    { id: 13, name: 'Valgamaa' },
    { id: 14, name: 'Viljandimaa' },
    { id: 15, name: 'Võrumaa' },
  ]

  await prisma.location.createMany({
    skipDuplicates: true,
    data: counties.map(c => ({ id: c.id, fallbackName: c.name, parentId: null })),
  })

  // Cities / municipalities (linnad/vallad) under their county
  const cities = [
    // Harjumaa (1)
    { id: 101, parentId: 1,  name: 'Tallinn' },
    { id: 102, parentId: 1,  name: 'Keila' },
    { id: 103, parentId: 1,  name: 'Maardu' },
    { id: 104, parentId: 1,  name: 'Saue' },
    { id: 105, parentId: 1,  name: 'Paldiski' },
    // Ida-Virumaa (3)
    { id: 301, parentId: 3,  name: 'Narva' },
    { id: 302, parentId: 3,  name: 'Kohtla-Järve' },
    { id: 303, parentId: 3,  name: 'Sillamäe' },
    { id: 304, parentId: 3,  name: 'Jõhvi' },
    // Tartumaa (12)
    { id: 1201, parentId: 12, name: 'Tartu' },
    { id: 1202, parentId: 12, name: 'Elva' },
    // Pärnumaa (9)
    { id: 901, parentId: 9,  name: 'Pärnu' },
    // Lääne-Virumaa (7)
    { id: 701, parentId: 7,  name: 'Rakvere' },
    // Saaremaa (11)
    { id: 1101, parentId: 11, name: 'Kuressaare' },
    // Järvamaa (4)
    { id: 401, parentId: 4,  name: 'Paide' },
    // Viljandimaa (14)
    { id: 1401, parentId: 14, name: 'Viljandi' },
    // Raplamaa (10)
    { id: 1001, parentId: 10, name: 'Rapla' },
    // Võrumaa (15)
    { id: 1501, parentId: 15, name: 'Võru' },
    // Valgamaa (13)
    { id: 1301, parentId: 13, name: 'Valga' },
    // Põlvamaa (8)
    { id: 801, parentId: 8,  name: 'Põlva' },
    // Jõgevamaa (5)
    { id: 501, parentId: 5,  name: 'Jõgeva' },
    // Läänemaa (6)
    { id: 601, parentId: 6,  name: 'Haapsalu' },
    // Hiiumaa (2)
    { id: 201, parentId: 2,  name: 'Kärdla' },
  ]

  await prisma.location.createMany({
    skipDuplicates: true,
    data: cities.map(c => ({ id: c.id, fallbackName: c.name, parentId: c.parentId })),
  })

  const allLocations = [...counties, ...cities]
  await prisma.translation.createMany({
    skipDuplicates: true,
    data: allLocations.flatMap(l => [
      { category: 'location', refId: l.id, languageCode: 'et', name: l.name },
      { category: 'location', refId: l.id, languageCode: 'en', name: l.name },
      { category: 'location', refId: l.id, languageCode: 'ru', name: l.name },
    ]),
  })
  console.log('  ✓ locations')
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature categories
// ─────────────────────────────────────────────────────────────────────────────
async function seedFeatureCategories() {
  const categories = [
    { id: 1,  name: 'safety',        sortOrder: 1,  et: 'Ohutus',                en: 'Safety',              ru: 'Безопасность' },
    { id: 2,  name: 'comfort',       sortOrder: 2,  et: 'Mugavus',               en: 'Comfort',             ru: 'Комфорт' },
    { id: 3,  name: 'entertainment', sortOrder: 3,  et: 'Meelelahutus',          en: 'Entertainment',       ru: 'Развлечения' },
    { id: 4,  name: 'exterior',      sortOrder: 4,  et: 'Välimus',               en: 'Exterior',            ru: 'Внешний вид' },
    { id: 5,  name: 'interior',      sortOrder: 5,  et: 'Sisemus',               en: 'Interior',            ru: 'Интерьер' },
    { id: 6,  name: 'lighting',      sortOrder: 6,  et: 'Valgustus',             en: 'Lighting',            ru: 'Освещение' },
    { id: 7,  name: 'windows_mirrors', sortOrder: 7, et: 'Aknad ja peeglid',    en: 'Windows & Mirrors',   ru: 'Окна и зеркала' },
    { id: 8,  name: 'driving',       sortOrder: 8,  et: 'Juhtimine',             en: 'Driving assistance',  ru: 'Помощь при вождении' },
    { id: 9,  name: 'towing',        sortOrder: 9,  et: 'Haakeseade',            en: 'Towing',              ru: 'Буксировка' },
    { id: 10, name: 'other_features', sortOrder: 10, et: 'Muud lisad',           en: 'Other features',      ru: 'Прочие опции' },
  ]

  await prisma.featureCategory.createMany({
    skipDuplicates: true,
    data: categories.map(c => ({ id: c.id, technicalName: c.name, sortOrder: c.sortOrder })),
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: categories.flatMap(c => [
      { category: 'feature_category', refId: c.id, languageCode: 'et', name: c.et },
      { category: 'feature_category', refId: c.id, languageCode: 'en', name: c.en },
      { category: 'feature_category', refId: c.id, languageCode: 'ru', name: c.ru },
    ]),
  })
  console.log('  ✓ feature_categories')
}

// ─────────────────────────────────────────────────────────────────────────────
// Car features  (150+ equipment checkboxes from auto24.ee)
// ─────────────────────────────────────────────────────────────────────────────
async function seedCarFeatures() {
  const features: Array<{ id: number; catId: number; tech: string; et: string; en: string; ru: string }> = [
    // Safety (1)
    { id: 1,   catId: 1, tech: 'abs',                   et: 'ABS',                           en: 'ABS',                           ru: 'ABS' },
    { id: 2,   catId: 1, tech: 'esp',                   et: 'ESP',                           en: 'ESP',                           ru: 'ESP' },
    { id: 3,   catId: 1, tech: 'airbags_front',         et: 'Esiairbagid',                   en: 'Front airbags',                 ru: 'Передние подушки безопасности' },
    { id: 4,   catId: 1, tech: 'airbags_side',          et: 'Külgairbagid',                  en: 'Side airbags',                  ru: 'Боковые подушки безопасности' },
    { id: 5,   catId: 1, tech: 'airbags_curtain',       et: 'Kardinaairbagid',               en: 'Curtain airbags',               ru: 'Шторные подушки безопасности' },
    { id: 6,   catId: 1, tech: 'airbags_knee',          et: 'Põlveairbagid',                 en: 'Knee airbags',                  ru: 'Коленные подушки безопасности' },
    { id: 7,   catId: 1, tech: 'parking_sensors_front', et: 'Parkimisandurid ees',           en: 'Front parking sensors',         ru: 'Передние парктроники' },
    { id: 8,   catId: 1, tech: 'parking_sensors_rear',  et: 'Parkimisandurid taga',          en: 'Rear parking sensors',          ru: 'Задние парктроники' },
    { id: 9,   catId: 1, tech: 'parking_camera',        et: 'Tagurduskaamera',               en: 'Reversing camera',              ru: 'Камера заднего вида' },
    { id: 10,  catId: 1, tech: 'camera_360',            et: '360° kaamera',                 en: '360° camera',                  ru: '360° камера' },
    { id: 11,  catId: 1, tech: 'lane_assist',           et: 'Rajahoidmisabi',                en: 'Lane keeping assist',           ru: 'Помощь удержания в полосе' },
    { id: 12,  catId: 1, tech: 'blind_spot',            et: 'Surnud nurga hoiatus',          en: 'Blind spot monitoring',         ru: 'Контроль слепых зон' },
    { id: 13,  catId: 1, tech: 'cross_traffic_alert',   et: 'Tagumise liikluse hoiatus',     en: 'Rear cross-traffic alert',      ru: 'Предупреждение о поперечном движении' },
    { id: 14,  catId: 1, tech: 'emergency_braking',     et: 'Automaatpidurid',               en: 'Automatic emergency braking',   ru: 'Автоматическое экстренное торможение' },
    { id: 15,  catId: 1, tech: 'isofix',                et: 'ISOFIX',                        en: 'ISOFIX',                        ru: 'ISOFIX' },
    { id: 16,  catId: 1, tech: 'tpms',                  et: 'Rehvisurve jälgimissüsteem',    en: 'Tyre pressure monitoring',      ru: 'Система контроля давления в шинах' },
    // Comfort (2)
    { id: 20,  catId: 2, tech: 'ac',                    et: 'Kliimaseade',                   en: 'Air conditioning',              ru: 'Кондиционер' },
    { id: 21,  catId: 2, tech: 'climate_control',       et: 'Kliimakontroll',                en: 'Climate control',               ru: 'Климат-контроль' },
    { id: 22,  catId: 2, tech: 'dual_zone_climate',     et: 'Kahetstoonline kliimakontroll', en: 'Dual-zone climate control',     ru: 'Двухзонный климат-контроль' },
    { id: 23,  catId: 2, tech: 'seat_heating_front',    et: 'Eistmete soojendus (esi)',      en: 'Heated front seats',            ru: 'Подогрев передних сидений' },
    { id: 24,  catId: 2, tech: 'seat_heating_rear',     et: 'Istmete soojendus (taga)',      en: 'Heated rear seats',             ru: 'Подогрев задних сидений' },
    { id: 25,  catId: 2, tech: 'seat_cooling',          et: 'Istmete ventilatsioon',         en: 'Ventilated seats',              ru: 'Вентиляция сидений' },
    { id: 26,  catId: 2, tech: 'seat_electric_driver',  et: 'Elektriline juhi iste',         en: 'Electric driver seat',          ru: 'Электропривод сиденья водителя' },
    { id: 27,  catId: 2, tech: 'seat_memory',           et: 'Istme mälupositsioon',          en: 'Seat memory',                   ru: 'Память положения сиденья' },
    { id: 28,  catId: 2, tech: 'massage_seats',         et: 'Massaažiistmed',                en: 'Massage seats',                 ru: 'Массажные сиденья' },
    { id: 29,  catId: 2, tech: 'cruise_control',        et: 'Tempomat',                      en: 'Cruise control',                ru: 'Круиз-контроль' },
    { id: 30,  catId: 2, tech: 'adaptive_cruise',       et: 'Adaptiivne tempomat',           en: 'Adaptive cruise control',       ru: 'Адаптивный круиз-контроль' },
    { id: 31,  catId: 2, tech: 'auto_parking',          et: 'Autoparkimine',                 en: 'Automatic parking',             ru: 'Автоматическая парковка' },
    { id: 32,  catId: 2, tech: 'keyless_entry',         et: 'Käivitus nupuga / ilma võtmeta', en: 'Keyless entry & start',        ru: 'Бесключевой доступ' },
    { id: 33,  catId: 2, tech: 'remote_start',          et: 'Kaugkäivitamine',               en: 'Remote engine start',           ru: 'Дистанционный запуск двигателя' },
    { id: 34,  catId: 2, tech: 'heated_steering',       et: 'Soojendatav rool',              en: 'Heated steering wheel',         ru: 'Подогрев руля' },
    { id: 35,  catId: 2, tech: 'head_up_display',       et: 'Peakuva (HUD)',                 en: 'Head-up display',               ru: 'Проекционный дисплей' },
    { id: 36,  catId: 2, tech: 'auto_tailgate',         et: 'Elektriline pagasiruum',        en: 'Electric tailgate',             ru: 'Электрическая дверь багажника' },
    { id: 37,  catId: 2, tech: 'night_vision',          et: 'Öövaade',                      en: 'Night vision',                  ru: 'Ночное видение' },
    // Entertainment (3)
    { id: 50,  catId: 3, tech: 'radio',                 et: 'Raadio',                        en: 'Radio',                         ru: 'Радио' },
    { id: 51,  catId: 3, tech: 'cd',                    et: 'CD-mängija',                    en: 'CD player',                     ru: 'CD-плеер' },
    { id: 52,  catId: 3, tech: 'navigation',            et: 'Navigatsioon',                  en: 'Navigation',                    ru: 'Навигация' },
    { id: 53,  catId: 3, tech: 'bluetooth',             et: 'Bluetooth',                     en: 'Bluetooth',                     ru: 'Bluetooth' },
    { id: 54,  catId: 3, tech: 'apple_carplay',         et: 'Apple CarPlay',                 en: 'Apple CarPlay',                 ru: 'Apple CarPlay' },
    { id: 55,  catId: 3, tech: 'android_auto',          et: 'Android Auto',                  en: 'Android Auto',                  ru: 'Android Auto' },
    { id: 56,  catId: 3, tech: 'wireless_charging',     et: 'Juhtmevaba laadimine',          en: 'Wireless charging',             ru: 'Беспроводная зарядка' },
    { id: 57,  catId: 3, tech: 'usb',                   et: 'USB',                           en: 'USB',                           ru: 'USB' },
    { id: 58,  catId: 3, tech: 'aux',                   et: 'AUX',                           en: 'AUX input',                     ru: 'AUX вход' },
    { id: 59,  catId: 3, tech: 'wifi',                  et: 'WiFi / hotspot',                en: 'Wi-Fi / Hotspot',               ru: 'Wi-Fi / Точка доступа' },
    { id: 60,  catId: 3, tech: 'rear_entertainment',    et: 'Tagumine meelelahutussüsteem',  en: 'Rear entertainment system',     ru: 'Система развлечений для задних пассажиров' },
    { id: 61,  catId: 3, tech: 'premium_audio',         et: 'Kvaliteetheli (Bose/B&O jne)',  en: 'Premium audio system',          ru: 'Премиум аудиосистема' },
    { id: 62,  catId: 3, tech: 'dab_radio',             et: 'Digitaalraadio (DAB)',          en: 'DAB digital radio',             ru: 'Цифровое радио DAB' },
    // Exterior (4)
    { id: 70,  catId: 4, tech: 'alloy_wheels',          et: 'Sulavaluveljed',                en: 'Alloy wheels',                  ru: 'Литые диски' },
    { id: 71,  catId: 4, tech: 'panoramic_roof',        et: 'Panoraamkatus',                 en: 'Panoramic roof',                ru: 'Панорамная крыша' },
    { id: 72,  catId: 4, tech: 'sunroof',               et: 'Luuk',                          en: 'Sunroof / Moonroof',            ru: 'Люк' },
    { id: 73,  catId: 4, tech: 'roof_rails',            et: 'Katuseraamid',                  en: 'Roof rails',                    ru: 'Рейлинги крыши' },
    { id: 74,  catId: 4, tech: 'running_boards',        et: 'Astmelauad',                    en: 'Running boards',                ru: 'Подножки' },
    { id: 75,  catId: 4, tech: 'sport_package',         et: 'Spordipakett',                  en: 'Sport package',                 ru: 'Спортпакет' },
    { id: 76,  catId: 4, tech: 'tow_bar',               et: 'Haakeseade',                    en: 'Tow bar / trailer hitch',       ru: 'Фаркоп' },
    // Interior (5)
    { id: 80,  catId: 5, tech: 'leather',               et: 'Nahkpolster',                   en: 'Leather upholstery',            ru: 'Кожаный салон' },
    { id: 81,  catId: 5, tech: 'leather_partial',       et: 'Osaline nahkpolster',           en: 'Partial leather trim',          ru: 'Частичная кожаная отделка' },
    { id: 82,  catId: 5, tech: 'alcantara',             et: 'Alcantara',                     en: 'Alcantara',                     ru: 'Алькантара' },
    { id: 83,  catId: 5, tech: 'ambient_lighting',      et: 'Meeleolutuli',                  en: 'Ambient lighting',              ru: 'Подсветка салона' },
    { id: 84,  catId: 5, tech: 'digital_cockpit',       et: 'Digitaalne mõõdupaneel',        en: 'Digital instrument cluster',    ru: 'Цифровая приборная панель' },
    { id: 85,  catId: 5, tech: 'cargo_cover',           et: 'Pagasiruumi kate',              en: 'Cargo cover / blind',           ru: 'Шторка багажника' },
    { id: 86,  catId: 5, tech: 'foldable_rear',         et: 'Kokkuklapitavad tagaistmed',    en: 'Foldable rear seats',           ru: 'Складывающиеся задние сиденья' },
    // Lighting (6)
    { id: 90,  catId: 6, tech: 'led_headlights',        et: 'LED esituled',                  en: 'LED headlights',                ru: 'LED фары' },
    { id: 91,  catId: 6, tech: 'xenon_headlights',      et: 'Ksenontuled',                   en: 'Xenon / HID headlights',        ru: 'Ксеноновые фары' },
    { id: 92,  catId: 6, tech: 'laser_headlights',      et: 'Laserkiirtuled',                en: 'Laser headlights',              ru: 'Лазерные фары' },
    { id: 93,  catId: 6, tech: 'daytime_running_lights', et: 'LED päevasõidutuled',         en: 'LED daytime running lights',    ru: 'LED дневные ходовые огни' },
    { id: 94,  catId: 6, tech: 'auto_high_beam',        et: 'Automaatsed kaugtuled',         en: 'Automatic high beams',          ru: 'Автоматический дальний свет' },
    { id: 95,  catId: 6, tech: 'fog_lights',            et: 'Udutuled',                      en: 'Fog lights',                    ru: 'Противотуманные фары' },
    // Windows & Mirrors (7)
    { id: 100, catId: 7, tech: 'electric_windows_front', et: 'Elektrilised aknad (esi)',    en: 'Electric windows (front)',      ru: 'Электростеклоподъёмники (передние)' },
    { id: 101, catId: 7, tech: 'electric_windows_all',  et: 'Kõik elektrilised aknad',       en: 'Electric windows (all)',        ru: 'Электростеклоподъёмники (все)' },
    { id: 102, catId: 7, tech: 'heated_windshield',     et: 'Köetav tuuleklaas',             en: 'Heated windshield',             ru: 'Подогрев лобового стекла' },
    { id: 103, catId: 7, tech: 'tinted_windows',        et: 'Toonitud klaasid',              en: 'Tinted windows',                ru: 'Тонированные стёкла' },
    { id: 104, catId: 7, tech: 'electric_mirrors',      et: 'Elektrilised välispeeglid',     en: 'Electric wing mirrors',         ru: 'Электрорегулировка зеркал' },
    { id: 105, catId: 7, tech: 'heated_mirrors',        et: 'Köetavad välispeeglid',         en: 'Heated wing mirrors',           ru: 'Подогрев боковых зеркал' },
    { id: 106, catId: 7, tech: 'folding_mirrors',       et: 'Kokkuklapitavad peeglid',       en: 'Folding wing mirrors',          ru: 'Складывающиеся зеркала' },
    { id: 107, catId: 7, tech: 'auto_dimming_mirror',   et: 'Automaatne tagapeegel',         en: 'Auto-dimming rear-view mirror', ru: 'Зеркало с автозатемнением' },
    // Driving assistance (8)
    { id: 110, catId: 8, tech: 'awd_system',            et: 'Nelikveosüsteem',               en: 'All-wheel drive system',        ru: 'Система полного привода' },
    { id: 111, catId: 8, tech: 'hill_descent',          et: 'Mäest laskumise abi',           en: 'Hill descent control',          ru: 'Помощь при спуске' },
    { id: 112, catId: 8, tech: 'hill_start',            et: 'Mäest stardi abi',              en: 'Hill start assist',             ru: 'Помощь при старте в гору' },
    { id: 113, catId: 8, tech: 'traffic_sign_rec',      et: 'Liiklusmärkide tuvastus',       en: 'Traffic sign recognition',      ru: 'Распознавание дорожных знаков' },
    { id: 114, catId: 8, tech: 'driver_attention',      et: 'Juhi tähelepanumonitor',        en: 'Driver attention monitor',      ru: 'Контроль внимания водителя' },
    // Other (10)
    { id: 130, catId: 10, tech: 'spare_wheel',          et: 'Tagavaraploki / rehv',          en: 'Spare wheel / tyre',            ru: 'Запасное колесо' },
    { id: 131, catId: 10, tech: 'tow_bar_electric',     et: 'Elektriline haakeseade',        en: 'Electric tow bar',              ru: 'Электрический фаркоп' },
    { id: 132, catId: 10, tech: 'winter_package',       et: 'Talvepakett',                   en: 'Winter package',                ru: 'Зимний пакет' },
    { id: 133, catId: 10, tech: 'summer_tyres',         et: 'Suvised rehvid kaasas',         en: 'Summer tyres included',         ru: 'Летние шины в комплекте' },
    { id: 134, catId: 10, tech: 'winter_tyres',         et: 'Talvised rehvid kaasas',        en: 'Winter tyres included',         ru: 'Зимние шины в комплекте' },
    { id: 135, catId: 10, tech: 'ev_charging_cable',    et: 'Laadimiskaabel',                en: 'EV charging cable',             ru: 'Кабель для зарядки EV' },
    { id: 136, catId: 10, tech: 'first_aid_kit',        et: 'Esmaabikomplekt',               en: 'First aid kit',                 ru: 'Аптечка' },
    { id: 137, catId: 10, tech: 'fire_extinguisher',    et: 'Tulekustuti',                   en: 'Fire extinguisher',             ru: 'Огнетушитель' },
    { id: 138, catId: 10, tech: 'disabled_access',      et: 'Puuetega inimestele kohandatud', en: 'Disabled access adapted',     ru: 'Адаптировано для инвалидов' },
    { id: 139, catId: 10, tech: 'taxi_equipment',       et: 'Taksovarustus',                 en: 'Taxi equipment',                ru: 'Таксооборудование' },
  ]

  await prisma.carFeature.createMany({
    skipDuplicates: true,
    data: features.map(f => ({ id: f.id, categoryId: f.catId, technicalName: f.tech })),
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: features.flatMap(f => [
      { category: 'car_feature', refId: f.id, languageCode: 'et', name: f.et },
      { category: 'car_feature', refId: f.id, languageCode: 'en', name: f.en },
      { category: 'car_feature', refId: f.id, languageCode: 'ru', name: f.ru },
    ]),
  })
  console.log('  ✓ car_features')
}

// ─────────────────────────────────────────────────────────────────────────────
// Premium features
// ─────────────────────────────────────────────────────────────────────────────
async function seedPremiumFeatures() {
  await prisma.premiumFeature.createMany({
    skipDuplicates: true,
    data: [
      { technicalName: 'top_listing',     pricePerDay: 2.99 },
      { technicalName: 'featured',        pricePerDay: 1.49 },
      { technicalName: 'highlighted',     pricePerDay: 0.99 },
      { technicalName: 'urgent_badge',    pricePerDay: 0.49 },
    ],
  })
  console.log('  ✓ premium_features')
}

// ─────────────────────────────────────────────────────────────────────────────
// Dealer business-activity tree ("Tegevusalad")
// ─────────────────────────────────────────────────────────────────────────────
async function seedDealerCategories() {
  const categories: Array<{ id: number; parentId: number | null; et: string; en: string; ru: string }> = [
    // Autokeemia, vedelikud (60)
    { id: 60,  parentId: null, et: 'Autokeemia, vedelikud',              en: 'Car chemicals, fluids',              ru: 'Автохимия, жидкости' },
    { id: 144, parentId: 60,   et: 'Autokeemia müük',                    en: 'Car chemical sales',                 ru: 'Продажа автохимии' },
    { id: 93,  parentId: 144,  et: 'Autovärvide müük',                   en: 'Car paint sales',                    ru: 'Продажа автомобильных красок' },
    { id: 94,  parentId: 144,  et: 'Hooldusvahendite müük',              en: 'Maintenance product sales',          ru: 'Продажа средств по уходу' },
    { id: 98,  parentId: 144,  et: 'Korrosioonitõrjevahendite müük',     en: 'Anti-corrosion product sales',       ru: 'Продажа антикоррозийных средств' },
    { id: 62,  parentId: 60,   et: 'Määrdeainete müük',                  en: 'Lubricant sales',                    ru: 'Продажа смазочных материалов' },
    { id: 95,  parentId: 62,   et: 'Õlide müük',                         en: 'Oil sales',                          ru: 'Продажа масел' },

    // Autopuhastus, värvihooldus (12)
    { id: 12,  parentId: null, et: 'Autopuhastus, värvihooldus',         en: 'Car cleaning, paint care',           ru: 'Мойка авто, уход за окраской' },
    { id: 13,  parentId: 12,   et: 'Autopesulad',                        en: 'Car washes',                         ru: 'Автомойки' },
    { id: 109, parentId: 13,   et: 'Automaatpesulad',                    en: 'Automatic car washes',               ru: 'Автоматические автомойки' },
    { id: 108, parentId: 13,   et: 'Käsipesu',                           en: 'Hand wash',                          ru: 'Ручная мойка' },
    { id: 173, parentId: 13,   et: 'Klaasipesu',                         en: 'Glass wash',                         ru: 'Мойка стёкол' },
    { id: 85,  parentId: 13,   et: 'Mootori pesu',                       en: 'Engine wash',                        ru: 'Мойка двигателя' },
    { id: 154, parentId: 13,   et: 'Pigieemaldus',                       en: 'Tar removal',                        ru: 'Удаление битумных пятен' },
    { id: 171, parentId: 13,   et: 'Velgede puhastus',                   en: 'Rim cleaning',                       ru: 'Чистка дисков' },
    { id: 145, parentId: 12,   et: 'Salongipuhastus',                    en: 'Interior cleaning',                  ru: 'Чистка салона' },
    { id: 121, parentId: 145,  et: 'Nahksisu puhastus ja hooldus',       en: 'Leather interior cleaning and care', ru: 'Чистка и уход за кожаным салоном' },
    { id: 15,  parentId: 145,  et: 'Salongipesu',                        en: 'Interior wash',                      ru: 'Мойка салона' },
    { id: 146, parentId: 12,   et: 'Värvihooldus',                       en: 'Paint care',                         ru: 'Уход за окраской' },
    { id: 14,  parentId: 146,  et: 'Poleerimine',                        en: 'Polishing',                          ru: 'Полировка' },
    { id: 84,  parentId: 146,  et: 'Vahatamine',                         en: 'Waxing',                             ru: 'Вощение' },

    // Finants, kindlustus, ekspertiis (69)
    { id: 69,  parentId: null, et: 'Finants, kindlustus, ekspertiis',    en: 'Finance, insurance, expertise',      ru: 'Финансы, страхование, экспертиза' },
    { id: 190, parentId: 69,   et: 'Autolaenud',                         en: 'Car loans',                          ru: 'Автокредиты' },
    { id: 196, parentId: 69,   et: 'Ekspertiis',                         en: 'Expertise',                          ru: 'Экспертиза' },
    { id: 72,  parentId: 69,   et: 'Kindlustusfirmad',                   en: 'Insurance companies',                ru: 'Страховые компании' },
    { id: 87,  parentId: 72,   et: 'Kasko sõidukikindlustus',            en: 'Kasko vehicle insurance',            ru: 'КАСКО страхование транспорта' },
    { id: 86,  parentId: 72,   et: 'Kohustuslik liikluskindlustus',      en: 'Mandatory traffic insurance',        ru: 'Обязательное страхование ОСАГО' },
    { id: 207, parentId: 72,   et: 'Laevakindlustus',                    en: 'Ship insurance',                     ru: 'Страхование судов' },
    { id: 208, parentId: 72,   et: 'Väikelaevakindlustus',               en: 'Small boat insurance',               ru: 'Страхование маломерных судов' },
    { id: 206, parentId: 69,   et: 'Müügiabi',                           en: 'Sales assistance',                   ru: 'Помощь в продаже' },
    { id: 202, parentId: 69,   et: 'Ostuabi',                            en: 'Purchase assistance',                ru: 'Помощь в покупке' },

    // Liiklusvahendid (33)
    { id: 33,  parentId: null, et: 'Liiklusvahendid',                    en: 'Vehicles',                           ru: 'Транспортные средства' },
    { id: 151, parentId: 33,   et: 'Sõidukite müük',                     en: 'Vehicle sales',                      ru: 'Продажа транспортных средств' },
    { id: 38,  parentId: 151,  et: 'Busside müük',                       en: 'Bus sales',                          ru: 'Продажа автобусов' },
    { id: 198, parentId: 151,  et: 'Haagissuvilate ja matkaautode müük', en: 'Caravan and motorhome sales',        ru: 'Продажа автодомов и караванов' },
    { id: 37,  parentId: 151,  et: 'Haagiste müük',                      en: 'Trailer sales',                      ru: 'Продажа прицепов' },
    { id: 39,  parentId: 151,  et: 'Kaubikute müük',                     en: 'Van sales',                          ru: 'Продажа фургонов' },
    { id: 49,  parentId: 151,  et: 'Limusiinide müük',                   en: 'Limousine sales',                    ru: 'Продажа лимузинов' },
    { id: 41,  parentId: 151,  et: 'Mototehnika müük',                   en: 'Motor equipment sales',              ru: 'Продажа мототехники' },
    { id: 43,  parentId: 151,  et: 'Sõiduautode müük',                   en: 'Car sales',                          ru: 'Продажа легковых автомобилей' },
    { id: 35,  parentId: 43,   et: 'Kasutatud sõiduautode müük',         en: 'Used car sales',                     ru: 'Продажа подержанных автомобилей' },
    { id: 34,  parentId: 43,   et: 'Uute sõiduautode müük',              en: 'New car sales',                      ru: 'Продажа новых автомобилей' },
    { id: 40,  parentId: 151,  et: 'Veesõidukite müük',                  en: 'Watercraft sales',                   ru: 'Продажа водного транспорта' },
    { id: 36,  parentId: 151,  et: 'Veoautode müük',                     en: 'Truck sales',                        ru: 'Продажа грузовиков' },
    { id: 136, parentId: 33,   et: 'Sõidukite ost',                      en: 'Vehicle purchase',                   ru: 'Покупка транспортных средств' },
    { id: 42,  parentId: 136,  et: 'Busside ost',                        en: 'Bus purchase',                       ru: 'Покупка автобусов' },
    { id: 129, parentId: 136,  et: 'Haagiste ost',                       en: 'Trailer purchase',                   ru: 'Покупка прицепов' },
    { id: 46,  parentId: 136,  et: 'Kaubikute ost',                      en: 'Van purchase',                       ru: 'Покупка фургонов' },
    { id: 139, parentId: 136,  et: 'Limusiinide ost',                    en: 'Limousine purchase',                 ru: 'Покупка лимузинов' },
    { id: 138, parentId: 136,  et: 'Mototehnika ost',                    en: 'Motor equipment purchase',           ru: 'Покупка мототехники' },
    { id: 132, parentId: 136,  et: 'Sõiduautode ost',                    en: 'Car purchase',                       ru: 'Покупка легковых автомобилей' },
    { id: 50,  parentId: 136,  et: 'Veesõidukite ost',                   en: 'Watercraft purchase',                ru: 'Покупка водного транспорта' },
    { id: 142, parentId: 136,  et: 'Veoautode ost',                      en: 'Truck purchase',                     ru: 'Покупка грузовиков' },
    { id: 135, parentId: 33,   et: 'Sõidukite rent',                     en: 'Vehicle rental',                     ru: 'Аренда транспортных средств' },
    { id: 47,  parentId: 135,  et: 'Busside rent',                       en: 'Bus rental',                         ru: 'Аренда автобусов' },
    { id: 197, parentId: 135,  et: 'Haagissuvilate ja matkaautode rent', en: 'Caravan and motorhome rental',       ru: 'Аренда автодомов и караванов' },
    { id: 137, parentId: 135,  et: 'Haagiste rent',                      en: 'Trailer rental',                     ru: 'Аренда прицепов' },
    { id: 130, parentId: 135,  et: 'Kaubikute rent',                     en: 'Van rental',                         ru: 'Аренда фургонов' },
    { id: 91,  parentId: 135,  et: 'Limusiinide rent',                   en: 'Limousine rental',                   ru: 'Аренда лимузинов' },
    { id: 48,  parentId: 135,  et: 'Mototehnika rent',                   en: 'Motor equipment rental',             ru: 'Аренда мототехники' },
    { id: 140, parentId: 135,  et: 'Sõiduautode rent',                   en: 'Car rental',                         ru: 'Аренда легковых автомобилей' },
    { id: 133, parentId: 135,  et: 'Veesõidukite rent',                  en: 'Watercraft rental',                  ru: 'Аренда водного транспорта' },
    { id: 131, parentId: 135,  et: 'Veoautode rent',                     en: 'Truck rental',                       ru: 'Аренда грузовиков' },

    // Lisavarustus ja -seadmed (165)
    { id: 165, parentId: null, et: 'Lisavarustus ja -seadmed',           en: 'Additional equipment and accessories', ru: 'Дополнительное оборудование и оснащение' },
    { id: 1,   parentId: 165,  et: 'Audio, video ja elektroonika',       en: 'Audio, video and electronics',       ru: 'Аудио, видео и электроника' },
    { id: 125, parentId: 1,    et: 'Müük',                               en: 'Sales',                              ru: 'Продажа' },
    { id: 9,   parentId: 125,  et: 'Helivõimendid',                      en: 'Amplifiers',                         ru: 'Усилители звука' },
    { id: 10,  parentId: 125,  et: 'Kõlarid',                            en: 'Speakers',                           ru: 'Колонки' },
    { id: 11,  parentId: 125,  et: 'LCD ekraanid',                       en: 'LCD screens',                        ru: 'ЖК-экраны' },
    { id: 8,   parentId: 125,  et: 'Stereod',                            en: 'Stereo systems',                     ru: 'Магнитолы' },
    { id: 126, parentId: 1,    et: 'Ost',                                en: 'Purchase',                           ru: 'Покупка' },
    { id: 127, parentId: 1,    et: 'Paigaldustööd',                      en: 'Installation work',                  ru: 'Монтажные работы' },
    { id: 128, parentId: 1,    et: 'Remont',                             en: 'Repair',                             ru: 'Ремонт' },
    { id: 178, parentId: 1,    et: 'Rent',                               en: 'Rental',                             ru: 'Аренда' },
    { id: 148, parentId: 165,  et: 'Muu lisavarustus ja -seadmed',       en: 'Other additional equipment',         ru: 'Прочее дополнительное оборудование' },
    { id: 149, parentId: 148,  et: 'Müük',                               en: 'Sales',                              ru: 'Продажа' },
    { id: 209, parentId: 149,  et: 'Elektriauto laadijad',               en: 'EV chargers',                        ru: 'Зарядные устройства для электромобилей' },
    { id: 180, parentId: 149,  et: 'Gaasiseadmed',                       en: 'Gas equipment',                      ru: 'Газовое оборудование' },
    { id: 143, parentId: 149,  et: 'Katuseboksid',                       en: 'Roof boxes',                         ru: 'Багажные боксы' },
    { id: 134, parentId: 149,  et: 'Katuseraamid',                       en: 'Roof racks',                         ru: 'Багажники на крышу' },
    { id: 112, parentId: 149,  et: 'Kesklukud',                          en: 'Central locking systems',            ru: 'Центральные замки' },
    { id: 6,   parentId: 149,  et: 'Navigatsioonisüsteemid',             en: 'Navigation systems',                 ru: 'Навигационные системы' },
    { id: 45,  parentId: 149,  et: 'Rattahoidjad',                       en: 'Bike racks',                         ru: 'Крепления для велосипедов' },
    { id: 187, parentId: 149,  et: 'Reklaam sõidukitel',                 en: 'Vehicle advertising',                ru: 'Реклама на транспорте' },
    { id: 81,  parentId: 149,  et: 'Vabakäeseadmed',                     en: 'Hands-free devices',                 ru: 'Устройства громкой связи' },
    { id: 44,  parentId: 149,  et: 'Veokonksud',                         en: 'Tow hooks',                          ru: 'Фаркопы' },
    { id: 181, parentId: 148,  et: 'Paigaldus',                          en: 'Installation',                       ru: 'Установка' },
    { id: 182, parentId: 181,  et: 'Gaasiseadmed',                       en: 'Gas equipment',                      ru: 'Газовое оборудование' },
    { id: 188, parentId: 181,  et: 'Reklaam sõidukitel',                 en: 'Vehicle advertising',                ru: 'Реклама на транспорте' },
    { id: 163, parentId: 148,  et: 'Rent',                               en: 'Rental',                             ru: 'Аренда' },
    { id: 55,  parentId: 163,  et: 'Katusebokside rent',                 en: 'Roof box rental',                    ru: 'Аренда багажных боксов' },
    { id: 177, parentId: 163,  et: 'Katuseraamide rent',                 en: 'Roof rack rental',                   ru: 'Аренда багажников на крышу' },
    { id: 179, parentId: 163,  et: 'Navigatsioonisüsteemid',             en: 'Navigation systems',                 ru: 'Навигационные системы' },
    { id: 113, parentId: 165,  et: 'Rehvid ja veljed',                   en: 'Tires and rims',                     ru: 'Шины и диски' },
    { id: 115, parentId: 113,  et: 'Rehvide hoidla',                     en: 'Tire storage',                       ru: 'Хранение шин' },
    { id: 3,   parentId: 113,  et: 'Rehvide müük',                       en: 'Tire sales',                         ru: 'Продажа шин' },
    { id: 28,  parentId: 113,  et: 'Rehvitööd',                          en: 'Tire services',                      ru: 'Шиномонтаж' },
    { id: 2,   parentId: 113,  et: 'Velgede müük',                       en: 'Rim sales',                          ru: 'Продажа дисков' },
    { id: 114, parentId: 113,  et: 'Velgede taastamine',                 en: 'Rim restoration',                    ru: 'Восстановление дисков' },
    { id: 51,  parentId: 165,  et: 'Turvaseadmed, ohutus',               en: 'Safety equipment, safety',           ru: 'Оборудование безопасности' },
    { id: 205, parentId: 51,   et: 'Lukuabi',                            en: 'Locksmith assistance',               ru: 'Помощь при вскрытии замков' },
    { id: 71,  parentId: 51,   et: 'Müük',                               en: 'Sales',                              ru: 'Продажа' },
    { id: 199, parentId: 71,   et: 'Esmaabivahendite müük',              en: 'First aid supplies sales',           ru: 'Продажа средств первой помощи' },
    { id: 99,  parentId: 71,   et: 'Tuleohutusseadmete müük',            en: 'Fire safety equipment sales',        ru: 'Продажа противопожарного оборудования' },
    { id: 201, parentId: 71,   et: 'Turvahällide ja turvatoolide müük',  en: 'Child car seat sales',               ru: 'Продажа детских автокресел' },
    { id: 141, parentId: 71,   et: 'Turvaseadmete müük',                 en: 'Safety equipment sales',             ru: 'Продажа оборудования безопасности' },
    { id: 5,   parentId: 141,  et: 'Alarmide müük',                      en: 'Alarm sales',                        ru: 'Продажа сигнализаций' },
    { id: 161, parentId: 141,  et: 'Immobilisaatorite müük',             en: 'Immobilizer sales',                  ru: 'Продажа иммобилайзеров' },
    { id: 162, parentId: 141,  et: 'Käigukangi lukkude müük',            en: 'Gear lever lock sales',              ru: 'Продажа блокираторов КПП' },
    { id: 57,  parentId: 141,  et: 'Salalülitite müük',                  en: 'Secret switch sales',                ru: 'Продажа скрытых выключателей' },
    { id: 164, parentId: 51,   et: 'Paigaldus',                          en: 'Installation',                       ru: 'Установка' },
    { id: 82,  parentId: 164,  et: 'Turvaseadmete paigaldus',            en: 'Safety equipment installation',      ru: 'Установка оборудования безопасности' },
    { id: 156, parentId: 165,  et: 'Tuuning',                            en: 'Tuning',                             ru: 'Тюнинг' },
    { id: 59,  parentId: 156,  et: 'Tuuningdetailide müük',              en: 'Tuning parts sales',                 ru: 'Продажа тюнинг-деталей' },
    { id: 58,  parentId: 59,   et: 'Aknakiled',                          en: 'Window tint film',                   ru: 'Тонировочная плёнка' },
    { id: 116, parentId: 59,   et: 'Antitiivad',                         en: 'Rear spoilers',                      ru: 'Антикрылья' },
    { id: 78,  parentId: 59,   et: 'Kere',                               en: 'Body parts',                         ru: 'Кузовные детали' },
    { id: 77,  parentId: 59,   et: 'Mootor',                             en: 'Engine',                             ru: 'Двигатель' },
    { id: 203, parentId: 77,   et: 'CHIP Tuuning',                       en: 'Chip tuning',                        ru: 'Чип-тюнинг' },
    { id: 80,  parentId: 59,   et: 'Salong',                             en: 'Interior',                           ru: 'Салон' },
    { id: 117, parentId: 59,   et: 'Spoilerid',                          en: 'Spoilers',                           ru: 'Спойлеры' },
    { id: 79,  parentId: 59,   et: 'Tuled',                              en: 'Lights',                             ru: 'Фары и фонари' },
    { id: 150, parentId: 156,  et: 'Tuuningtööd',                        en: 'Tuning work',                        ru: 'Тюнинг-работы' },
    { id: 102, parentId: 150,  et: 'Klaaside toonimine',                 en: 'Window tinting',                     ru: 'Тонировка стёкол' },

    // Sõidukite remont ja hooldus (24)
    { id: 24,  parentId: null, et: 'Sõidukite remont ja hooldus',        en: 'Vehicle repair and maintenance',     ru: 'Ремонт и обслуживание транспортных средств' },
    { id: 100, parentId: 24,   et: 'Hooldustööd',                        en: 'Maintenance work',                   ru: 'Работы по обслуживанию' },
    { id: 169, parentId: 100,  et: 'Kliimaseadmete täitmine',            en: 'AC refilling',                       ru: 'Заправка кондиционеров' },
    { id: 97,  parentId: 100,  et: 'Korrosioonitõrjetööd',               en: 'Anti-corrosion treatment',           ru: 'Антикоррозийная обработка' },
    { id: 120, parentId: 100,  et: 'Õlivahetus',                         en: 'Oil change',                         ru: 'Замена масла' },
    { id: 153, parentId: 24,   et: 'Parandustööd, remont',               en: 'Repair work',                        ru: 'Ремонтные работы' },
    { id: 25,  parentId: 153,  et: 'Elektritööd',                        en: 'Electrical work',                    ru: 'Электротехнические работы' },
    { id: 83,  parentId: 153,  et: 'Käigukastide remont',                en: 'Gearbox repair',                     ru: 'Ремонт коробок передач' },
    { id: 106, parentId: 83,   et: 'Automaatkäigukastide remont',        en: 'Automatic gearbox repair',           ru: 'Ремонт автоматических коробок передач' },
    { id: 107, parentId: 83,   et: 'Manuaalkäigukastide remont',         en: 'Manual gearbox repair',              ru: 'Ремонт механических коробок передач' },
    { id: 27,  parentId: 153,  et: 'Klaasitööd',                         en: 'Glass work',                         ru: 'Стекольные работы' },
    { id: 172, parentId: 27,   et: 'Klaaside parandus',                  en: 'Glass repair',                       ru: 'Ремонт стёкол' },
    { id: 103, parentId: 27,   et: 'Klaaside vahetus',                   en: 'Glass replacement',                  ru: 'Замена стёкол' },
    { id: 168, parentId: 153,  et: 'Kliimaseadmete remont',              en: 'AC repair',                          ru: 'Ремонт кондиционеров' },
    { id: 31,  parentId: 153,  et: 'Mootorite remont',                   en: 'Engine repair',                      ru: 'Ремонт двигателей' },
    { id: 105, parentId: 31,   et: 'Bensiinimootorite remont',           en: 'Petrol engine repair',               ru: 'Ремонт бензиновых двигателей' },
    { id: 104, parentId: 31,   et: 'Diiselmootorite remont',             en: 'Diesel engine repair',               ru: 'Ремонт дизельных двигателей' },
    { id: 184, parentId: 31,   et: 'Generaatorite remont',               en: 'Generator repair',                   ru: 'Ремонт генераторов' },
    { id: 185, parentId: 31,   et: 'Starterite remont',                  en: 'Starter repair',                     ru: 'Ремонт стартеров' },
    { id: 191, parentId: 31,   et: 'Turbokompressorite remont',          en: 'Turbocharger repair',                ru: 'Ремонт турбокомпрессоров' },
    { id: 118, parentId: 153,  et: 'Pleki- ja metallitööd',              en: 'Sheet metal and body work',          ru: 'Жестяно-кузовные работы' },
    { id: 92,  parentId: 118,  et: 'Keevitustööd',                       en: 'Welding work',                       ru: 'Сварочные работы' },
    { id: 119, parentId: 118,  et: 'Keretööd',                           en: 'Body work',                          ru: 'Кузовные работы' },
    { id: 29,  parentId: 153,  et: 'Reguleerimistööd',                   en: 'Adjustment work',                    ru: 'Регулировочные работы' },
    { id: 189, parentId: 153,  et: 'Salongi remont',                     en: 'Interior repair',                    ru: 'Ремонт салона' },
    { id: 26,  parentId: 153,  et: 'Värvimistööd',                       en: 'Painting work',                      ru: 'Малярные работы' },
    { id: 32,  parentId: 153,  et: 'Veermiku remont',                    en: 'Suspension repair',                  ru: 'Ремонт подвески' },
    { id: 67,  parentId: 24,   et: 'Tehniline kontroll',                 en: 'Technical inspection',               ru: 'Технический контроль' },
    { id: 101, parentId: 67,   et: 'Diagnostika',                        en: 'Diagnostics',                        ru: 'Диагностика' },
    { id: 30,  parentId: 67,   et: 'Tehnoülevaatused',                   en: 'Roadworthiness inspection',          ru: 'Техосмотр' },
    { id: 193, parentId: 24,   et: 'Veoautode remont',                   en: 'Truck repair',                       ru: 'Ремонт грузовиков' },

    // Töövahendid (73)
    { id: 73,  parentId: null, et: 'Töövahendid',                        en: 'Work equipment',                     ru: 'Рабочее оборудование' },
    { id: 157, parentId: 73,   et: 'Töömasinate, tööriistade müük',      en: 'Work machinery and tool sales',      ru: 'Продажа рабочей техники и инструментов' },
    { id: 74,  parentId: 157,  et: 'Ehitusmasinate müük',                en: 'Construction machinery sales',       ru: 'Продажа строительной техники' },
    { id: 75,  parentId: 157,  et: 'Tõsteseadmete müük',                 en: 'Lifting equipment sales',            ru: 'Продажа подъёмного оборудования' },
    { id: 192, parentId: 157,  et: 'Värvimisseadmed',                    en: 'Painting equipment',                 ru: 'Оборудование для покраски' },

    // Transporditeenused (63)
    { id: 63,  parentId: null, et: 'Transporditeenused',                 en: 'Transport services',                 ru: 'Транспортные услуги' },
    { id: 66,  parentId: 63,   et: 'Kauba veoteenused',                  en: 'Freight transport services',         ru: 'Грузоперевозки' },
    { id: 65,  parentId: 66,   et: 'Kullerteenus',                       en: 'Courier service',                    ru: 'Курьерская служба' },
    { id: 124, parentId: 66,   et: 'Rahvusvahelised veoteenused',        en: 'International transport services',   ru: 'Международные перевозки' },
    { id: 76,  parentId: 63,   et: 'Pukseerimine ja treilerveod',        en: 'Towing and trailer transport',       ru: 'Буксировка и трейлерные перевозки' },
    { id: 123, parentId: 76,   et: 'Sõiduautode puksiirteenus',          en: 'Car towing service',                 ru: 'Эвакуация легковых автомобилей' },
    { id: 195, parentId: 76,   et: 'Treilerveod',                        en: 'Trailer transport',                  ru: 'Трейлерные перевозки' },
    { id: 122, parentId: 76,   et: 'Veoautode puksiirteenus',            en: 'Truck towing service',               ru: 'Эвакуация грузовиков' },

    // Varuosad ja tarvikud (147)
    { id: 147, parentId: null, et: 'Varuosad ja tarvikud',               en: 'Spare parts and accessories',        ru: 'Запчасти и аксессуары' },
    { id: 7,   parentId: 147,  et: 'Elektrisüsteemide, tarvikute müük',  en: 'Electrical systems and accessories sales', ru: 'Продажа электросистем и аксессуаров' },
    { id: 88,  parentId: 7,    et: 'Adapterid',                          en: 'Adapters',                           ru: 'Адаптеры' },
    { id: 4,   parentId: 7,    et: 'Akud',                               en: 'Batteries',                          ru: 'Аккумуляторы' },
    { id: 89,  parentId: 7,    et: 'Akude laadijad',                     en: 'Battery chargers',                   ru: 'Зарядные устройства для аккумуляторов' },
    { id: 155, parentId: 7,    et: 'Klemmid',                            en: 'Terminals',                          ru: 'Клеммы' },
    { id: 16,  parentId: 147,  et: 'Lammutused',                         en: 'Salvage yards',                      ru: 'Разборки' },
    { id: 20,  parentId: 16,   et: 'Bussid',                             en: 'Buses',                              ru: 'Автобусы' },
    { id: 19,  parentId: 16,   et: 'Haagised',                           en: 'Trailers',                           ru: 'Прицепы' },
    { id: 21,  parentId: 16,   et: 'Kaubikud',                           en: 'Vans',                               ru: 'Фургоны' },
    { id: 23,  parentId: 16,   et: 'Mootorrattad',                       en: 'Motorcycles',                        ru: 'Мотоциклы' },
    { id: 176, parentId: 16,   et: 'Pakiautod',                          en: 'Delivery vans',                      ru: 'Микроавтобусы' },
    { id: 17,  parentId: 16,   et: 'Sõiduautod',                         en: 'Cars',                                ru: 'Легковые автомобили' },
    { id: 22,  parentId: 16,   et: 'Veesõidukid',                        en: 'Watercraft',                         ru: 'Водный транспорт' },
    { id: 18,  parentId: 16,   et: 'Veoautod',                           en: 'Trucks',                             ru: 'Грузовики' },
    { id: 54,  parentId: 147,  et: 'Varuosade müük',                     en: 'Spare parts sales',                  ru: 'Продажа запчастей' },
    { id: 183, parentId: 54,   et: 'Generaatorite müük',                 en: 'Generator sales',                    ru: 'Продажа генераторов' },
  ]

  await prisma.dealerCategory.createMany({
    skipDuplicates: true,
    data: categories.map(c => ({ id: c.id, parentId: c.parentId, fallbackName: c.et })),
  })

  await prisma.translation.createMany({
    skipDuplicates: true,
    data: categories.flatMap(c => [
      { category: 'dealer_category', refId: c.id, languageCode: 'et', name: c.et },
      { category: 'dealer_category', refId: c.id, languageCode: 'en', name: c.en },
      { category: 'dealer_category', refId: c.id, languageCode: 'ru', name: c.ru },
    ]),
  })
  console.log(`  ✓ dealer_categories (${categories.length})`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
