import type { Barber, BarberRole } from '@/lib/types';

export const barbers: Barber[] = [
  {
    id: 'mwila-banda',
    name: 'Mwila Banda',
    role: 'Head Barber',
    cardDescription: 'Precise fades and tapers, with a calm hand and a sharp eye.',
    bio: 'Mwila has been cutting hair in Lusaka for over ten years, starting in his uncle\'s shop in Kabwata. He\'s known for patient consultations and fades that grow out cleanly. As head barber, he keeps standards consistent across the studio.',
    specialities: ['Skin fades', 'Tapers', 'Line-ups'],
    altText: 'Mwila Banda, head barber at Groomd, standing in the studio wearing a black apron.',
  },
  {
    id: 'chanda-mulenga',
    name: 'Chanda Mulenga',
    role: 'Senior Barber',
    cardDescription: 'Beard shaping and straight-razor shaves, done slowly and properly.',
    bio: 'Chanda moved into barbering after years of cutting friends\' hair at university in Kitwe. Seven years on, beards are his speciality: shaping, lining and hot towel shaves that leave skin comfortable, not irritated.',
    specialities: ['Beard shaping', 'Hot towel shaves', 'Classic cuts'],
    altText: 'Chanda Mulenga, senior barber at Groomd, smiling in the studio.',
  },
  {
    id: 'kondwani-phiri',
    name: 'Kondwani Phiri',
    role: 'Barber',
    cardDescription: 'Modern textured cuts and easy-going kids\' appointments.',
    bio: 'Kondwani trained in Lusaka and joined Groomd after four years in busy city-centre shops. He enjoys modern textured styles and working with younger clients. He\'s also great with first haircuts.',
    specialities: ['Textured cuts', 'Kids\' cuts', 'Styling'],
    altText: 'Kondwani Phiri, barber at Groomd, standing at a barber station.',
  },
];

export function getBarberById(id: string): Barber | undefined {
  return barbers.find((b) => b.id === id);
}

export function getAllBarbers(): Barber[] {
  return barbers;
}

export function getBarbersByRole(role: BarberRole): Barber[] {
  return barbers.filter((b) => b.role === role);
}