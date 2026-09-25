import type { BusinessInfo } from '@/lib/types';

export const businessInfo: BusinessInfo = {
  name: 'Groomd',
  descriptor: "Men's Grooming Studio",
  description:
    'Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.',
  positioning: 'A modern Lusaka barbershop where looking sharp feels effortless.',
  city: 'Lusaka',
  country: 'Zambia',
  currency: 'ZMW',
  timezone: 'Africa/Lusaka',
  address: {
    full: 'Shop 3, Mopani Court, Kabulonga, Lusaka, Zambia',
    short: 'Kabulonga, Lusaka',
    multiLine: 'Shop 3, Mopani Court / Kabulonga / Lusaka, Zambia',
  },
  phone: {
    display: '+260 97 000 0000',
    tel: '+260970000000',
  },
  email: 'hello@groomd.example',
  mapSearch: 'Kabulonga, Lusaka',
};