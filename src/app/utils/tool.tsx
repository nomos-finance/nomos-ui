import BigNumber from 'bignumber.js';

export const formatDecimal = (number: string, decimal: number): string => {
  if (isNaN(Number(number))) return '-';
  const index = number.indexOf('.');
  if (index !== -1) {
    number = number.substring(0, decimal + index + 1);
  } else {
    number = number.substring(0);
  }
  return new BigNumber(new BigNumber(number).toFixed(decimal)).toFixed();
};

export const formatMoney = (value: string | number, n = 18): number | string => {
  if (isNaN(Number(value)) || !Number(value)) return 0;
  const isNegative = value < 0;
  const validLength = !Math.floor(Math.abs(+value)) ? n : 6;
  const v = formatDecimal(new BigNumber(value).abs().toFixed(), validLength > 0 ? validLength : 0);
  const l = v.split('.')[0].split('').reverse();
  const r = v.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  const res = t.split('').reverse().join('') + `${r ? '.' + r : ''}`;
  return `${isNegative ? '-' : ''}${res}`;
};

export function getShortenAddress(address: string | null | undefined): string {
  if (!address) return '';
  const firstCharacters = address.substring(0, 6);
  const lastCharacters = address.substring(address.length - 4, address.length);
  return `${firstCharacters}...${lastCharacters}`;
}

export function getShortenAddress2(address: string): string {
  if (!address) return '';
  const firstCharacters = address.substring(0, 10);
  const lastCharacters = address.substring(address.length - 10, address.length);
  return `${firstCharacters}****${lastCharacters}`;
}
