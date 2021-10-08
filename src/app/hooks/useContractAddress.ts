import { useSelector } from 'react-redux'

import { IRootState } from '../reducers/RootState'
import { IContractAddressResponse } from '../services/baseServer'

export default (): [IContractAddressResponse] => {
    const { contractAddress } = useSelector((store: IRootState) => store.base)
    return [contractAddress]
}
