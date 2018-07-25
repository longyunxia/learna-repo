import React, {PureComponent} from 'react'
import Barrage from 'react-barrage'
import confirm from 'nw-confirm'
import './index.scss'
import {map} from '../const'
import {fetchAPI} from 'shared/fetch'
import {login} from 'shared/login'
import {isLogin} from '@/util'
import toast from 'toast'
import {setOrUpdate, share} from 'nw-share'
import * as shareData from '@/share'
import {log} from '@/log'

function Bullet ({text}) {
    return <div className="shop-bullet">{text}</div>
}

export default class Input extends PureComponent {
    constructor (props) {
        super(props)
    }

    static defaultProps = {
        // 提交烦恼后执行
        onSubmitted: () => {}
    }

    state = {
        text: ''
    }

    componentWillMount () {
        setOrUpdate(shareData.shop)
        log.capture('egg-2-10:egg2017,shop_enter_pv')
        this._info = this._getInfoByProps(this.props)
        this.setState({
            text: this._store()
        })
    }

    componentWillReceiveProps (props) {
        this._info = this._getInfoByProps(props)
    }

    render () {
        let info = this._info
        let containerWith = parseInt(window.innerWidth) || 350
        if (containerWith > 540) containerWith = 540
        return (
            <div className={`shop-view shop-input-${info.id}`}>
                <div className="shop-container shop-title shop-title__top">写下你的烦恼，我来帮你粉碎它</div>
                <div className="shop-input-input" ref={ele => this._inputNode = ele}>
                    <div className="shop-container">
                        <textarea onFocus={() => this._onInputFocus()} onChange={this._onTextChange} value={this.state.text} placeholder=" 戳这里写下烦恼" className="shop-box shop-input-box"></textarea>
                        <div onClick={() => this._submit()} className="shop-btn-big shop-input-btn">{info.name}帮你粉碎烦恼</div>
                    </div>
                </div>
                <div className="shop-input-letter"></div>
                <Barrage
                    Item={Bullet}
                    itemKey='id'
                    getData={this._getBullets}
                    maxSpeed={containerWith / 4}
                    minSpeed={containerWith / 6}
                    margin={45 / 750 * containerWith + 1}
                    className="shop-input-barrage"></Barrage>
            </div>
        )
    }

    _getBullets () {
        return fetchAPI('/doubleeggs/relieve/barrage', {}, 'GET').then(({barrage}) => {
            return barrage.map((item, index) => {
                return {id: index, text: item}
            })
        }).catch(() => [])
    }

    _onTextChange = event => {
        this.setState({
            text: event.target.value
        })
    }

    _onInputFocus () {
        log.capture('egg-2-1:egg2017,shop_enter_annoyance')
    }

    _alert (str) {
        toast({
            text: str
        })
    }

    _submit () {
        let worry = this.state.text.trim()
        if (worry.length === 0) {
            this._alert('烦恼不能为空哦')
            return
        }
        log.capture('egg-2-2:egg2017,shop_smash_annoyance')
        isLogin().then(user => {
            this._store('')
            return fetchAPI('/doubleeggs/relieve/sendworry', {
                idol: this._info.tag,
                worry
            }, 'POST').then(res => {
                if (res.code !== 200) {
                    this._alert(res.msg)
                } else {
                    this.props.onSubmitted()
                }
            }).catch(err => {
                this._alert(err.message)
            })
        }).catch(err => {
            this._store(this.state.text)
            confirm({
                content: `登录再粉碎烦恼，${this._info.name}准备了属于你的解忧回信哦`,
                okText: '立即登录',
                cancelText: '再改一下'
            }).then(() => {
                login({
                    needClientLogin: true
                }).then(({redirect}) => redirect ? redirect() : location.reload())
            }).catch(() => {})

        })
    }

    _store (text) {
        const KEY = 'shop_last_input_' + this._info.id
        if (text === void 0) {
            return window.sessionStorage.getItem(KEY) || ''
        } else {
            window.sessionStorage.setItem(KEY, text)
        }
    }

    _getInfoByProps (props) {
        let type = this.props.match.params.type
        let info = map[type]
        if (!info) {
            info = map['dzj']
        }
        return info
    }
}
