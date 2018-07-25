import React, {PureComponent} from 'react'
import './index.scss'
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import Input from './Input'
import Reply from './Reply'
import {isLogin, hasLetter} from '@/util'
import {map} from './const'
import {log} from '@/log'

export default class Shop extends PureComponent {
    constructor (props) {
        super(props)
    }

    state = {
        isLoading: true,
        isReplied: false
    }

    componentWillMount () {
        this._getInfo().then(({isReplied}) => {
            this.setState({
                isReplied,
                isLoading: false
            })
        })
    }

    render () {
        if (this.state.isLoading) {
            return null
        }

        return (
            <div className={`shop shop-${this.state.isReplied ? 'reply' : 'input'}`}>
                <div className="shop-back" onClick={() => this._back()}></div>
                {this.state.isReplied ? <Reply {...this.props}></Reply> : <Input {...this.props} onSubmitted={() => this.setState({isReplied: true})}></Input>}
            </div>

        )
    }

    _getInfo () {
        this.setState({
            isLoading: true
        })

        let type = this.props.match.params.type
        let info = map[type]
        if (!info) {
            info = map['dzj']
        }

        return new Promise((resolve, reject) => {
            isLogin().then(() => hasLetter(info.tag)).then(() => {
                resolve({
                    isReplied: true
                })
            }).catch((err) => {
                resolve({
                    isReplied: false
                })
            })
        })

    }

    _back () {
        log.capture('egg-2-5:egg2017,return')
        this.props.history.push('/index?offset=1')
    }
}
