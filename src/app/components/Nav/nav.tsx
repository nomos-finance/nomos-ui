import './nav.styl'

import classnames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'

export default (): React.ReactElement => {
    const history = useHistory()

    return (
        <nav className={classnames('lt-nav')}>
            <div className="logo">nomos</div>
            <div className="menu">
                <div className="item">Market</div>
                <div className="item">DAO</div>
                <div className="item">Voting</div>
                <div className="item">Invitation</div>
                <div className="item">Staking</div>
                <div className="item">Position</div>
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
