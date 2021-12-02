import BigNumber from 'bignumber.js';

export function pow10(num: number | string | undefined, decimals = 18): string {
  if (!num) return '0';
  return new BigNumber(num).dividedBy(new BigNumber(10).pow(decimals)).toFixed();
}

export function original(num: number | string | undefined, decimals = 18): string {
  if (!num) return '0';
  return new BigNumber(num).multipliedBy(new BigNumber(10).pow(decimals)).toFixed();
}

export const formatDecimal = (number: number | string | undefined, decimal: number = 2): string => {
  if (number === undefined) return '';
  let num = number.toString();
  const index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return parseFloat(num).toFixed(decimal);
};

export const formatMoney = (value: string | number, n: number = 2): number | string => {
  if (isNaN(Number(value)) || Number(value).toFixed(n)) return Number(0).toFixed(n > 0 ? n : 0);
  const isNegative = value < 0;
  const v = formatDecimal(Math.abs(Number(value)), n > 0 ? n : 0);
  const l = v.split('.')[0].split('').reverse();
  const r = v.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
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

export function filterInput(val: string): string {
  const v = val
    .replace('-', '')
    .replace(/^\.+|[^\d.]/g, '')
    .replace(/^0\d+\./g, '0.')
    .replace(/\.{6,}/, '')
    .replace(/^0(\d)/, '$1')
    .replace(/^(\-)*(\d+)\.(\d{0,6}).*$/, '$1$2.$3');
  return Number(v) > 0 ? v : '';
}

export function chunk(arr: any[], size: number): any[] {
  let objArr = [];
  let index = 0;
  let objArrLen = arr.length / size;
  for (let i = 0; i < objArrLen; i++) {
    let arrTemp = [];
    for (let j = 0; j < size; j++) {
      arrTemp[j] = arr[index++];
      if (index === arr.length) {
        break;
      }
    }
    objArr[i] = arrTemp;
  }
  return objArr;
}
