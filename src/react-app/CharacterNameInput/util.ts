const FIRST_NAMES = [
  'Jastira',
  'Verrona',
  'Leena',
  'Elanil',
  'Twig',
  'Khaoth',
  'Morujor',
  'Lagunarilan',
  'Kell',
  'Wren',
  'Lucy',
  'Reginald',
  'Dimble',
];

const LAST_NAMES = [
  ' Mossbrook',
  ', The Soulcleaver',
  ' Torrulon',
  ' Bottomhill',
  ' Brightleaf',
  ' Treestrider',
  ' Dalynn',
  ' Welbeck',
  ' Thrundok',
  ' Arvannis',
  ' Blacksong',
  ' Forethorne',
];

export const getRandomName = () => {
  const firstNameIndex = Math.floor(Math.random() * FIRST_NAMES.length);
  const lastNameIndex = Math.floor(Math.random() * LAST_NAMES.length);

  return `ex. ${FIRST_NAMES[firstNameIndex]}${LAST_NAMES[lastNameIndex]}`;
};
