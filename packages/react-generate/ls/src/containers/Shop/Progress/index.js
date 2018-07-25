import './index.scss'
import {formatNumber} from '@/util'
import React from 'react'

export default function Progress ({percent, value, total, className, text}) {
    let milestones = [
        {
            id: 'mh',
            percent: 50
        },
        {
            id: 'read',
            percent: 75
        }
    ]

    let mtView = milestones.map((item, index) => {
        let className = [
            'shop-progress-milestone',
            `shop-progress-milestone-${item.id}`
        ]
        if (percent > item.percent) {
            className.push('active')
        }
        return (
            <div
                style={{left: item.percent + '%'}}
                key={item.id}
                className={className.join(' ')}>
                <div className="shop-progress-milestone-logo"></div>
                <div className="shop-progress-milestone-bar"></div>
            </div>
        )
    })
    return (
        <div className={`shop-progress ${className}`}>
            {mtView}
            <div className="shop-progress-outer">
                <div className="shop-progress-inner" style={{width: percent + '%'}}></div>
            </div>
            <div className="shop-progress-info">
                <span>{text}</span>
                <span className="bigger"><span className="bold">{formatNumber(value)}</span>/5W</span>
            </div>
        </div>
    )
}
