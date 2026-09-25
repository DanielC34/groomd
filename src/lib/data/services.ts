import type { Service, ServiceCategory } from '@/lib/types';

export const services: Service[] = [
  {
    id: 'signature-cut',
    name: 'Signature Cut',
    description: 'A consultation, precision cut and styled finish. Scissors, clippers or both, whatever suits your hair.',
    price: 220,
    durationMinutes: 45,
    category: 'Haircuts',
  },
  {
    id: 'skin-fade',
    name: 'Skin Fade',
    description: 'A clean fade taken down to the skin, blended smoothly and finished with a sharp line-up.',
    price: 250,
    durationMinutes: 45,
    category: 'Haircuts',
  },
  {
    id: 'buzz-cut-line-up',
    name: "Buzz Cut & Line-Up",
    description: 'One all-over clipper length with crisp edges around the hairline and neck.',
    price: 150,
    durationMinutes: 30,
    category: 'Haircuts',
  },
  {
    id: 'beard-trim-shape',
    name: 'Beard Trim & Shape',
    description: 'Your beard trimmed to length, shaped to your face and lined up with a straight razor.',
    price: 150,
    durationMinutes: 30,
    category: 'Beard',
  },
  {
    id: 'hot-towel-shave',
    name: 'Hot Towel Shave',
    description: 'A traditional straight-razor shave with hot towels, a warm lather and a cooling finish.',
    price: 200,
    durationMinutes: 45,
    category: 'Beard',
  },
  {
    id: 'cut-and-beard',
    name: 'Cut & Beard',
    description:
      'A Signature Cut or Skin Fade with a full Beard Trim & Shape in one appointment. Choose your cut with your barber on the day, or add it in the notes.',
    price: 350,
    durationMinutes: 75,
    category: 'Packages',
  },
  {
    id: 'kids-cut',
    name: "Kids' Cut",
    description: "A patient, tidy cut for kids aged 12 and under. A parent or guardian stays during the appointment.",
    price: 120,
    durationMinutes: 30,
    category: 'Kids',
  },
];

export const serviceCategories: { category: ServiceCategory; label: string; intro: string }[] = [
  { category: 'Haircuts', label: 'Haircuts', intro: 'Classic, modern or somewhere in between.' },
  { category: 'Beard', label: 'Beard & shave', intro: 'Shape, line and a close, comfortable shave.' },
  { category: 'Packages', label: 'Packages', intro: 'Cut and beard in one visit.' },
  { category: 'Kids', label: 'Kids', intro: "Good first haircuts, without the fuss." },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category);
}

export function getAllServices(): Service[] {
  return services;
}

export function getServiceCategoryInfo(category: ServiceCategory) {
  return serviceCategories.find((c) => c.category === category);
}