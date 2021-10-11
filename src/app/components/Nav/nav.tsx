import './nav.styl'

import classnames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'

export default (): React.ReactElement => {
    const history = useHistory()
    const { pathname } = history.location

    return (
        <nav className={classnames('lt-nav')}>
            <Link className="logo" to="/" />
            <div className="menu">
                <Link className={classnames('item', { cur: pathname === '/' || /market/.test(pathname) })} to="/">
                    <span>Market</span>
                </Link>
                <Link className={classnames('item', { cur: /dao/.test(pathname) })} to="/dao">
                    <span>DAO</span>
                </Link>
                <Link className={classnames('item', { cur: /voting/.test(pathname) })} to="/voting">
                    <span>Voting</span>
                </Link>
                <Link className={classnames('item', { cur: /invitation/.test(pathname) })} to="/invitation">
                    <span>Invitation</span>
                </Link>
                <Link className={classnames('item', { cur: /staking/.test(pathname) })} to="/staking">
                    <span>Staking</span>
                </Link>
                <Link className={classnames('item', { cur: /position/.test(pathname) })} to="/position">
                    <span>Position</span>
                </Link>
            </div>
            <div>
                <div className="github">xx</div>
            </div>
            <div>
                <div className="github">xx</div>
            </div>
        </nav>
    )
}
