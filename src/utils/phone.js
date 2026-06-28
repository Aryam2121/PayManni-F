export function normalizeIndianPhone(input) {
  if (!input) return null;
  const digits = String(input).replace(/\D/g, "");
  let ten = digits;
  if (digits.length === 12 && digits.startsWith("91")) ten = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) ten = digits.slice(1);
  if (ten.length !== 10 || !/^[6-9]\d{9}$/.test(ten)) return null;
  return `+91${ten}`;
}

export function isValidIndianPhone(input) {
  return normalizeIndianPhone(input) !== null;
}
