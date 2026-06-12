import { SEED_CAR_ID } from '@carsharing/common';

const status = (n: number): string => {
  if (n >= 43 && n <= 45) return 'rented';
  if (n >= 46 && n <= 48) return 'reserved';
  if (n >= 49) return 'maintenance';
  return 'available';
};

const vin = (n: number) => `SEED${String(n).padStart(13, '0')}`;

interface CarSeed {
  id: string; brand: string; model: string; year: number;
  category: string; status: string; pricePerDay: number;
  licensePlate: string; city: string; color: string;
  mileage: number; vin: string; slug: string; description?: string;
}

export const CARS_SEED_DATA: CarSeed[] = [
  { id: SEED_CAR_ID(1), slug: 'lada-vesta-2022', brand: 'Lada', model: 'Vesta', year: 2022, category: 'economy', status: status(1), pricePerDay: 1800, licensePlate: 'А001ВГ77', city: 'Москва', color: 'Белый', mileage: 45000, vin: vin(1) },
  { id: SEED_CAR_ID(2), slug: 'lada-granta-2021', brand: 'Lada', model: 'Granta', year: 2021, category: 'economy', status: status(2), pricePerDay: 1600, licensePlate: 'В002ДЕ77', city: 'Москва', color: 'Синий', mileage: 62000, vin: vin(2) },
  { id: SEED_CAR_ID(3), slug: 'lada-vesta-sw-2023', brand: 'Lada', model: 'Vesta SW', year: 2023, category: 'economy', status: status(3), pricePerDay: 1900, licensePlate: 'Г003ЖЗ78', city: 'Санкт-Петербург', color: 'Серый', mileage: 18000, vin: vin(3) },
  { id: SEED_CAR_ID(4), slug: 'lada-largus-2022', brand: 'Lada', model: 'Largus', year: 2022, category: 'economy', status: status(4), pricePerDay: 2000, licensePlate: 'Д004ИК78', city: 'Санкт-Петербург', color: 'Серебристый', mileage: 38000, vin: vin(4) },
  { id: SEED_CAR_ID(5), slug: 'hyundai-solaris-2023', brand: 'Hyundai', model: 'Solaris', year: 2023, category: 'economy', status: status(5), pricePerDay: 2300, licensePlate: 'Е005ЛМ16', city: 'Казань', color: 'Красный', mileage: 12000, vin: vin(5) },
  { id: SEED_CAR_ID(6), slug: 'hyundai-solaris-2022', brand: 'Hyundai', model: 'Solaris', year: 2022, category: 'economy', status: status(6), pricePerDay: 2200, licensePlate: 'З006НО16', city: 'Казань', color: 'Чёрный', mileage: 31000, vin: vin(6) },
  { id: SEED_CAR_ID(7), slug: 'hyundai-solaris-2021', brand: 'Hyundai', model: 'Solaris', year: 2021, category: 'economy', status: status(7), pricePerDay: 2000, licensePlate: 'И007ПР66', city: 'Екатеринбург', color: 'Белый', mileage: 54000, vin: vin(7) },
  { id: SEED_CAR_ID(8), slug: 'kia-rio-2023', brand: 'Kia', model: 'Rio', year: 2023, category: 'economy', status: status(8), pricePerDay: 2400, licensePlate: 'К008СТ66', city: 'Екатеринбург', color: 'Серебристый', mileage: 8000, vin: vin(8) },
  { id: SEED_CAR_ID(9), slug: 'kia-rio-2022', brand: 'Kia', model: 'Rio', year: 2022, category: 'economy', status: status(9), pricePerDay: 2200, licensePlate: 'Л009УФ23', city: 'Краснодар', color: 'Белый', mileage: 26000, vin: vin(9) },
  { id: SEED_CAR_ID(10), slug: 'kia-rio-2021', brand: 'Kia', model: 'Rio', year: 2021, category: 'economy', status: status(10), pricePerDay: 2000, licensePlate: 'М010ХЦ23', city: 'Краснодар', color: 'Синий', mileage: 48000, vin: vin(10) },
  { id: SEED_CAR_ID(11), slug: 'renault-logan-2022', brand: 'Renault', model: 'Logan', year: 2022, category: 'economy', status: status(11), pricePerDay: 1900, licensePlate: 'Н011ЧШ54', city: 'Новосибирск', color: 'Серый', mileage: 35000, vin: vin(11) },
  { id: SEED_CAR_ID(12), slug: 'renault-logan-2021', brand: 'Renault', model: 'Logan', year: 2021, category: 'economy', status: status(12), pricePerDay: 1800, licensePlate: 'О012ЩЭ54', city: 'Новосибирск', color: 'Бежевый', mileage: 58000, vin: vin(12) },
  { id: SEED_CAR_ID(13), slug: 'volkswagen-polo-2023', brand: 'Volkswagen', model: 'Polo', year: 2023, category: 'economy', status: status(13), pricePerDay: 2200, licensePlate: 'П013ЮЯ93', city: 'Сочи', color: 'Белый', mileage: 5000, vin: vin(13) },
  { id: SEED_CAR_ID(14), slug: 'volkswagen-polo-2022', brand: 'Volkswagen', model: 'Polo', year: 2022, category: 'economy', status: status(14), pricePerDay: 2100, licensePlate: 'Р014АВ93', city: 'Сочи', color: 'Красный', mileage: 22000, vin: vin(14) },
  { id: SEED_CAR_ID(15), slug: 'toyota-corolla-2023', brand: 'Toyota', model: 'Corolla', year: 2023, category: 'comfort', status: status(15), pricePerDay: 3500, licensePlate: 'С015БГ77', city: 'Москва', color: 'Белый', mileage: 9000, vin: vin(15) },
  { id: SEED_CAR_ID(16), slug: 'toyota-corolla-2022', brand: 'Toyota', model: 'Corolla', year: 2022, category: 'comfort', status: status(16), pricePerDay: 3200, licensePlate: 'Т016ДЕ77', city: 'Москва', color: 'Серебристый', mileage: 28000, vin: vin(16) },
  { id: SEED_CAR_ID(17), slug: 'volkswagen-passat-2022', brand: 'Volkswagen', model: 'Passat', year: 2022, category: 'comfort', status: status(17), pricePerDay: 3800, licensePlate: 'У017ЖЗ78', city: 'Санкт-Петербург', color: 'Чёрный', mileage: 33000, vin: vin(17) },
  { id: SEED_CAR_ID(18), slug: 'volkswagen-passat-2021', brand: 'Volkswagen', model: 'Passat', year: 2021, category: 'comfort', status: status(18), pricePerDay: 3500, licensePlate: 'Ф018ИК78', city: 'Санкт-Петербург', color: 'Серый', mileage: 52000, vin: vin(18) },
  { id: SEED_CAR_ID(19), slug: 'mazda-3-2023', brand: 'Mazda', model: '3', year: 2023, category: 'comfort', status: status(19), pricePerDay: 3500, licensePlate: 'Х019ЛМ16', city: 'Казань', color: 'Красный', mileage: 7000, vin: vin(19) },
  { id: SEED_CAR_ID(20), slug: 'mazda-3-2022', brand: 'Mazda', model: '3', year: 2022, category: 'comfort', status: status(20), pricePerDay: 3300, licensePlate: 'Ц020НО16', city: 'Казань', color: 'Белый', mileage: 24000, vin: vin(20) },
  { id: SEED_CAR_ID(21), slug: 'mazda-6-2022', brand: 'Mazda', model: '6', year: 2022, category: 'comfort', status: status(21), pricePerDay: 3800, licensePlate: 'Ч021ПР66', city: 'Екатеринбург', color: 'Серебристый', mileage: 30000, vin: vin(21) },
  { id: SEED_CAR_ID(22), slug: 'ford-focus-2022', brand: 'Ford', model: 'Focus', year: 2022, category: 'comfort', status: status(22), pricePerDay: 3200, licensePlate: 'Ш022СТ66', city: 'Екатеринбург', color: 'Синий', mileage: 27000, vin: vin(22) },
  { id: SEED_CAR_ID(23), slug: 'ford-focus-2021', brand: 'Ford', model: 'Focus', year: 2021, category: 'comfort', status: status(23), pricePerDay: 3000, licensePlate: 'Щ023УФ23', city: 'Краснодар', color: 'Чёрный', mileage: 46000, vin: vin(23) },
  { id: SEED_CAR_ID(24), slug: 'skoda-octavia-2023', brand: 'Skoda', model: 'Octavia', year: 2023, category: 'comfort', status: status(24), pricePerDay: 3800, licensePlate: 'Э024ХЦ23', city: 'Краснодар', color: 'Белый', mileage: 6000, vin: vin(24) },
  { id: SEED_CAR_ID(25), slug: 'skoda-octavia-2022', brand: 'Skoda', model: 'Octavia', year: 2022, category: 'comfort', status: status(25), pricePerDay: 3600, licensePlate: 'Ю025ЧШ54', city: 'Новосибирск', color: 'Серый', mileage: 21000, vin: vin(25) },
  { id: SEED_CAR_ID(26), slug: 'renault-duster-2023', brand: 'Renault', model: 'Duster', year: 2023, category: 'comfort', status: status(26), pricePerDay: 3200, licensePlate: 'Я026ЩЭ54', city: 'Новосибирск', color: 'Оранжевый', mileage: 11000, vin: vin(26) },
  { id: SEED_CAR_ID(27), slug: 'renault-duster-2022', brand: 'Renault', model: 'Duster', year: 2022, category: 'comfort', status: status(27), pricePerDay: 3000, licensePlate: 'А027ЮЯ93', city: 'Сочи', color: 'Синий', mileage: 29000, vin: vin(27) },
  { id: SEED_CAR_ID(28), slug: 'hyundai-tucson-2022', brand: 'Hyundai', model: 'Tucson', year: 2022, category: 'comfort', status: status(28), pricePerDay: 3500, licensePlate: 'В028АБ93', city: 'Сочи', color: 'Белый', mileage: 19000, vin: vin(28) },
  { id: SEED_CAR_ID(29), slug: 'kia-sportage-2022', brand: 'Kia', model: 'Sportage', year: 2022, category: 'comfort', status: status(29), pricePerDay: 3600, licensePlate: 'Г029ВГ77', city: 'Москва', color: 'Серебристый', mileage: 16000, vin: vin(29) },
  { id: SEED_CAR_ID(30), slug: 'toyota-camry-2023', brand: 'Toyota', model: 'Camry', year: 2023, category: 'business', status: status(30), pricePerDay: 5800, licensePlate: 'Д030ДЕ77', city: 'Москва', color: 'Чёрный', mileage: 8000, vin: vin(30) },
  { id: SEED_CAR_ID(31), slug: 'toyota-camry-2022', brand: 'Toyota', model: 'Camry', year: 2022, category: 'business', status: status(31), pricePerDay: 5500, licensePlate: 'Е031ЖЗ78', city: 'Санкт-Петербург', color: 'Серебристый', mileage: 22000, vin: vin(31) },
  { id: SEED_CAR_ID(32), slug: 'toyota-camry-2021', brand: 'Toyota', model: 'Camry', year: 2021, category: 'business', status: status(32), pricePerDay: 5000, licensePlate: 'З032ИК78', city: 'Санкт-Петербург', color: 'Белый', mileage: 44000, vin: vin(32) },
  { id: SEED_CAR_ID(33), slug: 'audi-a4-2023', brand: 'Audi', model: 'A4', year: 2023, category: 'business', status: status(33), pricePerDay: 6000, licensePlate: 'И033ЛМ16', city: 'Казань', color: 'Чёрный', mileage: 5000, vin: vin(33) },
  { id: SEED_CAR_ID(34), slug: 'audi-a4-2022', brand: 'Audi', model: 'A4', year: 2022, category: 'business', status: status(34), pricePerDay: 5500, licensePlate: 'К034НО16', city: 'Казань', color: 'Серый', mileage: 18000, vin: vin(34) },
  { id: SEED_CAR_ID(35), slug: 'bmw-3-series-2023', brand: 'BMW', model: '3 Series', year: 2023, category: 'business', status: status(35), pricePerDay: 6200, licensePlate: 'Л035ПР66', city: 'Екатеринбург', color: 'Чёрный', mileage: 7000, vin: vin(35) },
  { id: SEED_CAR_ID(36), slug: 'bmw-3-series-2022', brand: 'BMW', model: '3 Series', year: 2022, category: 'business', status: status(36), pricePerDay: 5800, licensePlate: 'М036СТ66', city: 'Екатеринбург', color: 'Синий', mileage: 20000, vin: vin(36) },
  { id: SEED_CAR_ID(37), slug: 'mercedes-c-class-2023', brand: 'Mercedes', model: 'C-Class', year: 2023, category: 'business', status: status(37), pricePerDay: 6500, licensePlate: 'Н037УФ23', city: 'Краснодар', color: 'Белый', mileage: 4000, vin: vin(37) },
  { id: SEED_CAR_ID(38), slug: 'mercedes-c-class-2022', brand: 'Mercedes', model: 'C-Class', year: 2022, category: 'business', status: status(38), pricePerDay: 6000, licensePlate: 'О038ХЦ23', city: 'Краснодар', color: 'Чёрный', mileage: 17000, vin: vin(38) },
  { id: SEED_CAR_ID(39), slug: 'volkswagen-tiguan-2023', brand: 'Volkswagen', model: 'Tiguan', year: 2023, category: 'business', status: status(39), pricePerDay: 5500, licensePlate: 'П039ЧШ54', city: 'Новосибирск', color: 'Серебристый', mileage: 10000, vin: vin(39) },
  { id: SEED_CAR_ID(40), slug: 'volkswagen-tiguan-2022', brand: 'Volkswagen', model: 'Tiguan', year: 2022, category: 'business', status: status(40), pricePerDay: 5000, licensePlate: 'Р040ЩЭ54', city: 'Новосибирск', color: 'Чёрный', mileage: 25000, vin: vin(40) },
  { id: SEED_CAR_ID(41), slug: 'skoda-superb-2022', brand: 'Skoda', model: 'Superb', year: 2022, category: 'business', status: status(41), pricePerDay: 5200, licensePlate: 'С041ЮЯ93', city: 'Сочи', color: 'Тёмно-синий', mileage: 14000, vin: vin(41) },
  { id: SEED_CAR_ID(42), slug: 'kia-sorento-2022', brand: 'Kia', model: 'Sorento', year: 2022, category: 'business', status: status(42), pricePerDay: 5000, licensePlate: 'Т042АВ93', city: 'Сочи', color: 'Белый', mileage: 19000, vin: vin(42) },
  { id: SEED_CAR_ID(43), slug: 'bmw-5-series-2022', brand: 'BMW', model: '5 Series', year: 2022, category: 'premium', status: status(43), pricePerDay: 8500, licensePlate: 'У043БГ77', city: 'Москва', color: 'Чёрный', mileage: 15000, vin: vin(43), description: 'Бизнес-седан с кожаным салоном и панорамной крышей' },
  { id: SEED_CAR_ID(44), slug: 'bmw-5-series-2023', brand: 'BMW', model: '5 Series', year: 2023, category: 'premium', status: status(44), pricePerDay: 9000, licensePlate: 'Ф044ДЕ77', city: 'Москва', color: 'Серебристый', mileage: 6000, vin: vin(44), description: 'Флагманский седан с пакетом M Sport' },
  { id: SEED_CAR_ID(45), slug: 'bmw-x5-2023', brand: 'BMW', model: 'X5', year: 2023, category: 'premium', status: status(45), pricePerDay: 12000, licensePlate: 'Х045ЖЗ78', city: 'Санкт-Петербург', color: 'Чёрный', mileage: 9000, vin: vin(45), description: 'Премиальный кроссовер с полным приводом xDrive' },
  { id: SEED_CAR_ID(46), slug: 'mercedes-e-class-2022', brand: 'Mercedes', model: 'E-Class', year: 2022, category: 'premium', status: status(46), pricePerDay: 9000, licensePlate: 'Ц046ИК78', city: 'Санкт-Петербург', color: 'Белый', mileage: 11000, vin: vin(46), description: 'Элегантный бизнес-седан с массажными сиденьями' },
  { id: SEED_CAR_ID(47), slug: 'mercedes-e-class-2023', brand: 'Mercedes', model: 'E-Class', year: 2023, category: 'premium', status: status(47), pricePerDay: 9500, licensePlate: 'Ч047ЛМ16', city: 'Казань', color: 'Графит', mileage: 4000, vin: vin(47), description: 'Новейший E-Class с системой MBUX и Head-Up дисплеем' },
  { id: SEED_CAR_ID(48), slug: 'mercedes-gle-2023', brand: 'Mercedes', model: 'GLE', year: 2023, category: 'premium', status: status(48), pricePerDay: 12500, licensePlate: 'Ш048НО16', city: 'Казань', color: 'Чёрный', mileage: 7000, vin: vin(48), description: 'Представительский кроссовер с воздушной подвеской' },
  { id: SEED_CAR_ID(49), slug: 'audi-a6-2022', brand: 'Audi', model: 'A6', year: 2022, category: 'premium', status: status(49), pricePerDay: 8000, licensePlate: 'Щ049ПР66', city: 'Екатеринбург', color: 'Серый', mileage: 35000, vin: vin(49), description: 'Плановое ТО — доступен через 3 дня' },
  { id: SEED_CAR_ID(50), slug: 'toyota-land-cruiser-2023', brand: 'Toyota', model: 'Land Cruiser', year: 2023, category: 'premium', status: status(50), pricePerDay: 15000, licensePlate: 'Э050СТ66', city: 'Екатеринбург', color: 'Белый перламутр', mileage: 3000, vin: vin(50), description: 'Легендарный внедорожник, плановое обслуживание' },
];
