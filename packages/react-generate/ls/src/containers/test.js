import React, {PureComponent} from 'react'
import {callHandler, support} from 'nejsbridge/dist/bridge.comic.es.js'
import {share, setOrUpdate} from 'nw-share'
import {log} from '@/util'

var script = document.createElement('script')
script.src = 'https://easyread.nosdn.127.net/web/trunk/1511750707379/bridge.comic.iife.js'
document.body.appendChild(script)

export default class Test extends PureComponent {
    render () {
        let style = {
            fontSize: 50
        }

        return (
            <div>
                <button style={style} onClick={() => this._share()}>分享</button>
            </div>
        )
    }

    _share () {
        log('share')
        share()
    }
}
