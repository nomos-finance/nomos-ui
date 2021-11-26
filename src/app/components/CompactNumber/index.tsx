import React from 'react';
import { valueToBigNumber } from '@aave/protocol-js';
import { formatMoney } from '../../utils/tool';

interface CompactNumberProps {
  value: string | number;
}

const POSTFIXES = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

export function CompactNumber({ value }: CompactNumberProps) {
  const bnValue = valueToBigNumber(value);

  const integerPlaces = bnValue.toFixed(0).length;
  const significantDigitsGroup = Math.min(
    Math.floor(integerPlaces ? (integerPlaces - 1) / 3 : 0),
    POSTFIXES.length - 1
  );
  const postfix = POSTFIXES[significantDigitsGroup];
  const formattedValue = bnValue.dividedBy(10 ** (3 * significantDigitsGroup)).toNumber();

  return (
    <>
      {formatMoney(formattedValue)}
      {postfix}
    </>
  );
}
