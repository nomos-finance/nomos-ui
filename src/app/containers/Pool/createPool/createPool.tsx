import './createPool.styl'

import { Token } from '@uniswap/sdk-core'
import { computePoolAddress, Pool } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { Form, Input } from 'antd'
import classnames from 'classnames'
import { toBigNum } from 'qilin-sdk-v2'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import { useThemeContext } from '@/theme'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const c = useThemeContext()

    return (
        <Layout className={classnames('page-createPool')}>
            <div className="block">xxx</div>
        </Layout>
    )
}
