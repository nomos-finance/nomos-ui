import './market.stylus'

import { useWeb3React } from '@web3-react/core'
import { Form, Input } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import { getProvider } from '@/app/contracts/getProvider'
import IPoolDataProviderContract from '@/app/contracts/IPoolDataProviderContract'
import { useThemeContext } from '@/theme'

export default (): React.ReactElement => {
    // const { library, account } = useWeb3React()
    // const history = useHistory()
    // const c = useThemeContext()
    const contract = IPoolDataProviderContract('0x04110Dc40B04b99B94840E53B2a33bE45E45A8Ed', getProvider('kovan'))
    const fetchData = async () => {
        const d = await contract.getReservesData('0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E', '0x04110Dc40B04b99B94840E53B2a33bE45E45A8Ed')
        console.log(d)
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Layout className="page-market">
            <div className="totalBlock">
                <div className="block">总流动性</div>
                <div className="block">总存款</div>
                <div className="block">总贷款</div>
            </div>
            <div className="userBlock">
                <div className="title">我的账户</div>
                <div>
                    <div className="block">我的存款</div>
                    <div className="block">贷款上限 $1000.00</div>
                </div>
            </div>
            <div>
                <div className="title">通过投票提高放大倍数来获取更高收益</div>
            </div>
            <div>
                <div className="block">存款资产 存款数量 存款APY 奖励APR 抵押品</div>
            </div>
            <div>
                <div className="block">存款市场</div>
                <div className="block">贷款市场</div>
            </div>
        </Layout>
    )
}
