import { lazy } from 'react'

const CreatePool = lazy(() => import(/*webpackChunkName: 'CreatePool'*/ /* webpackPrefetch: true */ '../containers/Pool/createPool'))

const menuData = [
    {
        name: 'CreatePool',
        key: 'CreatePool',
        router: '/pool/create',
        component: CreatePool,
        exact: true
    }
]

export default menuData
