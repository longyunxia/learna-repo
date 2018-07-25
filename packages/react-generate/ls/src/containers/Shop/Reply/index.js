import React, {PureComponent} from 'react'
import './index.scss'
import {map} from '../const'
import ProgressWrapper from '@/components/ProgressWrapper'
import Progress from '../Progress'
import showRule from '../Rule'
import {isComicApp} from 'nw-detect'
import {openAppComic} from 'nw-app-comic'
import {hasLetter, getSupportValue, isLogin} from '@/util'
import {callHandler, support} from 'nejsbridge/dist/bridge.comic.es.js'
import {setOrUpdate, share} from 'nw-share'
import confirm from 'nw-confirm'
import toast from 'toast'
import {shopReply} from '@/share'
import {log} from '@/log'

export default class Reply extends PureComponent {
    constructor (props) {
        super(props)
    }

    state = {
        value: 0,
        letter: '',
        image: '',
        userName: ''
    }

    componentWillMount () {
        if (isComicApp()) {
            log.capture('egg2-12:egg2017,shop_client_read_pv')
        } else {
            log.capture('egg2-11:egg2017,shop_read_pv')
        }
        this._info = this._getInfoByProps(this.props)
        setOrUpdate(shopReply[this._info.tag])
        this._getInfo()
    }

    componentDidMount () {
        toast({
            text: '已经为你解忧~\(≧▽≦)/~'
        })
    }

    componentWillReceiveProps (props) {
        this._info = this._getInfoByProps(props)
    }

    render () {

        let info = this._info

        // 如果不在客户端
        if (!isComicApp()) {
            let letter = this.state.letter.slice(0, 60) + '...'
            return (
                <div className={`shop-reply-web shop-reply-view shop-reply-${info.id}`}>
                    <div className="shop-container">
                        <div className="shop-title shop-reply-title">我是{info.name}，我为你解忧</div>
                        <div className="shop-letter-hd">
                            <div className="shop-letter-avatar"></div>
                            <div className="shop-letter-title">Hi {this.state.userName}</div>
                        </div>
                        <div className="shop-letter-content">{letter}</div>
                        <div className="shop-letter-notice">{info.nickname}将给你的完整回信藏在了网易漫画APP中，快点击下方按钮(APP-我的消息)接收吧</div>
                        <ProgressWrapper
                            text={`为${info.name}应援，解锁专属公益应援`}
                            className="shop-reply-progress"
                            total={50000}
                            value={this.state.value}
                            component={Progress}></ProgressWrapper>
                    </div>
                    <div className="shop-letter-desc"></div>
                    <div className="shop-reply-actions-wrapper">
                        <div className="shop-reply-actions shop-container">
                            <div onClick={() => this._back2index()} className="shop-btn shop-btn__brown">返回游园会</div>
                            <div onClick={() => this._toClient()} className="shop-btn shop-btn__red">登录APP查看完整回信</div>
                        </div>
                    </div>
                    <div className="shop-rule-action" onClick={() => showRule()}>应援规则 &gt;</div>
                </div>
            )
        } else {
            let letter = this.state.letter
            return (
                <div className={`shop-reply-client shop-reply-view shop-reply-${info.id}`}>
                    <div className="shop-container">
                        <div className="shop-letter-hd">
                            <div className="shop-letter-avatar"></div>
                            <div className="shop-letter-title">Hi {this.state.userName}</div>
                        </div>
                        <div className="shop-letter-content">
                            {letter}
                            <div className="shop-letter-signature"></div>
                        </div>
                        <div className="shop-reply-actions-wrapper">
                            <div className="shop-reply-actions shop-container">
                                <div onClick={() => this._shareImage()} className="shop-btn shop-btn__red">一键存图分享</div>
                                <div onClick={() => this._back2index()} className="shop-btn shop-btn__red">返回游园会</div>
                            </div>
                        </div>
                        <div onClick={() => showRule()} className="shop-rule-action">应援规则 &gt;</div>
                        <ProgressWrapper
                            text={`为${info.name}应援，解锁专属公益应援`}
                            className="shop-reply-progress"
                            total={50000}
                            value={this.state.value}
                            component={Progress}></ProgressWrapper>
                    </div>
                    <div onClick={() => this._goToComic()} className="shop-reply-bottom">
                        <div className="shop-container">
                            {info.name}推荐你看 <br/>
                            《{info.book}》,解忧无烦恼~
                        </div>
                        <div className="shop-reply-bottom-recommend">
                            <div className="shop-reply-bottom-book"></div>
                            <div className="shop-reply-bottom-tip"></div>
                        </div>
                    </div>
                </div>
            )
        }

    }

    _back2index () {
        log.capture('egg-2-3:egg2017,shop_return')
        this.props.history.push('/index')
    }

    _toClient () {
        log.capture('egg-2-4:egg2017,shop_goto_app')
        openAppComic({
            path: 'webview',
            query: {
                url: location.href,
                mid: '2016061404'
            }
        })

    }

    _getInfo () {
        hasLetter(this._info.tag).then(({letter, image}) => {
            this.setState({
                letter,
                image
            })
        })
        getSupportValue().then(res => {
            this.setState({
                value: res[this._info.tag]
            })
        })
        isLogin().then(user => {
            this.setState({
                userName: user.nickname
            })
        })
    }

    _shareImage () {
        if (support('savePictureAndShare')) {
            log.capture('egg-2-6:egg2017,shop_save_share')
            callHandler('savePictureAndShare', {picurl: this.state.image, text: '看，这是我的专属解忧回信！参与还能给爱豆应援', link: location.protocol + '//' + location.hostname + '/activity/doubleeggs?offset=1'}, () => {})
        } else {
            toast({
                text: '请升级客户端到最新版本'
            })
        }

    }

    _goToComic () {
        log.capture('egg-2-7:egg2017,shop_click_comic,' + this._info.url)
        callHandler('pageRedirect', {
            path: 'detail',
            query: {
                id: this._info.url
            }
        });
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
