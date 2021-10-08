import BigNumber from 'bignumber.js'
import * as React from 'react'

export const formatDecimal = (number: string, decimal: number): string => {
    if (isNaN(Number(number))) return '-'
    const index = number.indexOf('.')
    if (index !== -1) {
        number = number.substring(0, decimal + index + 1)
    } else {
        number = number.substring(0)
    }
    return new BigNumber(new BigNumber(number).toFixed(decimal)).toFixed()
}

export const formatMoney = (value: string | number, n = 18): number | string => {
    if (isNaN(Number(value)) || !Number(value)) return 0
    const isNegative = value < 0
    const validLength = !Math.floor(Math.abs(+value)) ? n : 6
    const v = formatDecimal(new BigNumber(value).abs().toFixed(), validLength > 0 ? validLength : 0)
    const l = v.split('.')[0].split('').reverse()
    const r = v.split('.')[1]
    let t = ''
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
    }
    const res = t.split('').reverse().join('') + `${r ? '.' + r : ''}`
    return `${isNegative ? '-' : ''}${res}`
}

export function getShortenAddress(address): string {
    const firstCharacters = address.substring(0, 6)
    const lastCharacters = address.substring(address.length - 4, address.length)
    return `${firstCharacters}...${lastCharacters}`
}

export function getShortenAddress2(address): string {
    const firstCharacters = address.substring(0, 10)
    const lastCharacters = address.substring(address.length - 10, address.length)
    return `${firstCharacters}****${lastCharacters}`
}

export function formatColor(value: string): JSX.Element {
    if (/\-/.test(value)) {
        return <span style={{ color: '#E26048' }}>{value}</span>
    }
    return <span style={{ color: '#44C27F' }}>{value}</span>
}

export function getUnit(pair: string | undefined, direction: string | undefined): string {
    if (!pair) return ''
    const arr = pair.split('_')
    return direction === 'inverse' ? arr[0] : arr[1]
}

interface IAbi {
    contract_name: string
    address: string
    abi: any
}

// export function getABI(data: IAbi[], address: string): string {
//     const item = data.filter(item => item.address === address)
//     return item[0] ? item[0].abi : ''
// }

export function getABI(data: IAbi[], name: string): any {
    const item = data.filter(item => item.contract_name === name)
    return item[0] ? item[0].abi : ''
}

export function getContractAddress(data: IAbi[], name: string): string {
    const item = data.filter(item => item.contract_name === name)
    return item[0] ? item[0].address : ''
}

export function formatInput(value: string): string {
    let obj = ''
    obj = value.replace(/[^\d.]/g, '')
    obj = obj.replace(/^\./g, '')
    obj = obj.replace(/\.{2,}/g, '.')
    obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    return obj
}
