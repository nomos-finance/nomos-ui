import './market.stylus'

import { useWeb3React } from '@web3-react/core'
import { Form, Input, Progress } from 'antd'
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
                <div className="block">
                    <div className="text">
                        <span>总流动性</span>
                    </div>
                    <div className="number">$50,000.00</div>
                </div>
                <div className="block">
                    <div className="text">
                        <span>总存款</span>
                    </div>
                    <div className="number">$50,000.00</div>
                </div>
                <div className="block">
                    <div className="text">
                        <span>总贷款</span>
                    </div>
                    <div className="number">$50,000.00</div>
                </div>
            </div>
            <div className="userBlock">
                <div className="title">我的账户</div>
                <div className="userBlockMain">
                    <div className="block">
                        <div className="main">
                            <div className="item">
                                <div className="text">我的存款</div>
                                <div className="number">$50,000.00</div>
                            </div>
                            <div className="item">
                                <div className="text">我的贷款</div>
                                <div className="number">$50,000.00</div>
                            </div>
                            <div className="item">
                                <div className="text">总收益年利率</div>
                                <div className="number">$50,000.00</div>
                            </div>
                            <div className="item">
                                <div className="text">可领取奖励NOMO</div>
                                <div className="number">$50,000.00</div>
                            </div>
                        </div>
                        <div className="btn">领取奖励</div>
                    </div>
                    <div className="block">
                        <Progress width={130} type="circle" showInfo={false} trailColor={'#4E5159'} strokeColor={'#44C27F'} percent={50} />
                        <div>健康因子</div>
                        <div>贷款上限 $1000.00</div>
                    </div>
                </div>
            </div>
            <div className="block voteBlock">
                <div className="text">通过投票提高放大倍数来获取更高收益</div>
                <div className="btn">投票</div>
            </div>
            <div className="assetBlock">
                <div className="header">
                    <div className="tab">
                        <div className="tabItem">我的存款</div>
                        <div className="tabItem">我的存款</div>
                    </div>
                    <div className="text">想把抵押资产换成其他资产，不用赎回，一键可完成</div>
                </div>
                <div className="block">
                    <table>
                        <thead>
                            <tr>
                                <th>资产</th>
                                <th>存款APY</th>
                                <th>奖励APR</th>
                                <th>钱包余额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>1</td>
                                <td>1</td>
                                <td>1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="marketBlock">
                <div className="main">
                    <div className="title">存款市场</div>
                    <div className="block">
                        <table>
                            <thead>
                                <tr>
                                    <th>资产</th>
                                    <th>存款APY</th>
                                    <th>奖励APR</th>
                                    <th>钱包余额</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="main">
                    <div className="title">贷款市场</div>
                    <div className="block">
                        <table>
                            <thead>
                                <tr>
                                    <th>存款资产</th>
                                    <th>存款数量</th>
                                    <th>存款APY</th>
                                    <th>奖励APR</th>
                                    <th>抵押品</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
