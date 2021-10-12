import './nav.styl'

import classnames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Icon from '@/assets/icons'

export default (): React.ReactElement => {
    const history = useHistory()
    const { pathname } = history.location

    return (
        <nav className={classnames('lt-nav')}>
            <Link className="logo" to="/" />
            <div className="menu">
                <Link className={classnames('item', { cur: pathname === '/' || /market/.test(pathname) })} to="/">
                    <i>
                        <Icon name="market" />
                    </i>
                    <span>Market</span>
                </Link>
                <Link className={classnames('item', { cur: /dao/.test(pathname) })} to="/dao">
                    <i>
                        <Icon name="dao" />
                    </i>
                    <span>DAO</span>
                </Link>
                <Link className={classnames('item', { cur: /voting/.test(pathname) })} to="/voting">
                    <i>
                        <Icon name="voting" />
                    </i>
                    <span>Voting</span>
                </Link>
                <Link className={classnames('item', { cur: /invitation/.test(pathname) })} to="/invitation">
                    <i>
                        <Icon name="invitation" />
                    </i>
                    <span>Invitation</span>
                </Link>
                <Link className={classnames('item', { cur: /staking/.test(pathname) })} to="/staking">
                    <i>
                        <Icon name="staking" />
                    </i>
                    <span>Staking</span>
                </Link>
                <Link className={classnames('item', { cur: /position/.test(pathname) })} to="/position">
                    <i>
                        <Icon name="position" />
                    </i>
                    <span>Position</span>
                </Link>
            </div>
            <div className="doc">
                <div className="item">
                    <i>
                        <Icon name="announcement" />
                    </i>
                    <span>Announcement</span>
                </div>
                <div className="item">
                    <i>
                        <Icon name="file" />
                    </i>
                    <span>File</span>
                </div>
            </div>
            <div className="medium">
                <Icon name="twitter" />
                <Icon name="facebook" />
                <Icon name="weChat" />
                <Icon name="in" />
            </div>
        </nav>
    )
}
