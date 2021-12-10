import { IPromise, request } from '../utils/request';

export function getCountry(): IPromise<any> {
  return request(
    `https://api.ipstack.com/check?access_key=827955377e3b2073e7f7b50f8c07e583&fields=country_code,country_name`,
    {
      method: 'GET',
    }
  );
}
