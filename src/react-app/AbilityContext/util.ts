export const validateAbilityInput = (valueStr: string) => {
  if (valueStr === '') return valueStr;

  const valueNumber = Number(valueStr);

  if (Number.isNaN(valueNumber) || valueNumber < 0) return 0;

  return valueNumber;
};

export const getAbilityNumber = (value: number | '') => {
  if (value === '') return 0;

  return value;
};
