/**
 * Where the business serves in person: the 13 districts of the canton of
 * San Carlos (Alajuela). Online, all of Costa Rica. Also used as
 * schema.org `areaServed`.
 */
export const districts = [
  'Quesada',
  'Florencia',
  'Buenavista',
  'Aguas Zarcas',
  'Venecia',
  'Pital',
  'La Fortuna',
  'La Tigra',
  'La Palmera',
  'Venado',
  'Cutris',
  'Monterrey',
  'Pocosol',
] as const;

export const canton = { name: 'San Carlos', province: 'Alajuela', country: 'Costa Rica', countryCode: 'CR' } as const;
