export const formatSpellLevel = (level: number, isPlural = false) =>
  level === 0
    ? `Cantrip${isPlural ? 's' : ''}`
    : level === 1
    ? '1st-Level'
    : level === 2
    ? '2nd-Level'
    : level === 3
    ? '3rd-Level'
    : `${level}th-Level`;
