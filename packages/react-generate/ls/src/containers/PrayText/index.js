import React, {Component} from 'react';
import confirm from 'nw-confirm'
import {fetchAPI, fetchForm} from 'shared/fetch';
import {isComicApp} from 'nw-detect';
import {openAppComic} from 'nw-app-comic';
import {callHandler, support} from 'nejsbridge/dist/bridge.comic.es.js'
import toast from 'toast';
import {setOrUpdate, share} from 'nw-share'
import {login} from 'shared/login';
import {log} from '@/log'
import './style.scss'

let shareDate = {
    title: "2018欧气值、头发浓密值、体重值、恋爱值是？强势围观",
    description: "我在网易漫画 用灵魂画符召唤出神奇签文，成功解锁新年运势！现在点击还有特邀阴阳师SSR式神加成祈愿之力，快来测测你的2018运势！",
    activityId: "20171228",
    picurl: "https://easyread.nosdn.127.net/web/trunk/1514259773005/pray-share.jpg",
    text: "我在@网易漫画 用灵魂画符召唤出神奇签文，成功解锁新年运势，运气值UP！现在点击还有特邀#阴阳师#SSR式神加成祈愿之力！——快来测测你的2018运势，另有惊喜奖品",
    link: location.protocol + '//' + location.hostname + "/activity/doubleeggs/pray"
}

class PrayText extends Component {
    constructor(options) {
        super(options);
        this.state = {
            nickname: '',
            image: '',
            note: [],
            isLogin: false,
            isComicApp: isComicApp()
        }
    }

    componentWillMount() {

    }

    goBack() {
        this.props.history.push(`/pray`)
    }

    goIndex() {
        this.props.history.push(`/index?offset=2`)
    }

    openWithApp() {
        openAppComic({
            path: 'webview',
            query: {
                url: location.href,
                mid: "2016061405"
            }
        })
    }

    shareImageWithApp() {
        if (support('savePictureAndShare')) {
            callHandler('savePictureAndShare', {
                picurl: this.state.image,
                text: '我在@网易漫画 召唤出神奇签文，成功解锁新年运势',
                link: location.protocol + '//' + location.hostname + '/activity/doubleeggs/pray'
            }, (resp) => {
            })
        } else {
            toast({text: "请升级客户端到最新版本"})
        }
    }

    doLogin() {
        login({
            needClientLogin: true
        }).then(({redirect}) => {
            if (redirect) {
                redirect()
            }
            this.setState({
                isLogin: true
            });
            this.getEmaNote();
        })
    }

    getEmaNote() {
        fetchAPI('/doubleeggs/ema/note.json', {nid: this.props.match.params.id}, 'GET')
            .then((resp) => {
                if (resp.error) {
                    throw resp.error;
                }
                if (resp.code == 400) {//登录用户访问其他人的签文
                    this.props.history.replace(`/pray`)
                    return;
                }
                if (resp.loginPromise) {
                    this.setState({
                        isLogin: false
                    })
                    resp.loginPromise().then(({redirect}) => {
                        if (redirect) {
                            redirect()
                        } else {
                            this.getEmaNote();
                        }
                    })
                    return
                } else {
                    this.setState({
                        isLogin: true
                    })
                }
                if (resp.code == 200) {
                    this.setState({
                        nickname: resp.nickname,
                        note: resp.note || [],
                        image: resp.image
                    })
                    let shareDataCopy = {
                        ...shareDate,
                        title: `${resp.nickname}的2018欧气值、头发浓密值、体重值、恋爱值是？强势围观`,

                    }
                    setOrUpdate(shareDataCopy, () => {
                        log.capture(`egg-3-4:egg2017,draw_share_return`);
                    })
                }


            })
            .catch((error) => {
                this.setState({
                    isLogin: false
                })
                console.error(error);
                throw error;
            });
    }

    componentDidMount() {
        this.getEmaNote();
        setOrUpdate(shareDate, () => {
            log.capture(`egg-3-4:egg2017,draw_share_return`);
        })
        if (this.state.isComicApp) {
            log.capture(`egg-3-11:egg2017,draw_client_read_pv`);
        } else {
            log.capture(`egg-3-10:egg2017,draw_read_pv`);

        }

    }


    render() {
        const windowHeight = window.innerHeight;
        const noteLength = this.state.note ? this.state.note.length : 0
        return (
            <div className="pray-text-page">

                <div className="action-wrap">
                    <a className="f-ib btn-back" onClick={this.goBack.bind(this)}></a>
                </div>
                {this.state.isComicApp ?
                    <div className="in-app-wrap">
                        <div className="content">
                            {this.state.isLogin ? <div>
                                <div className="name">{this.state.nickname}的2018签文</div>
                                <div className="fortune"></div>
                                <div className="fortune-A">
                                    {noteLength > 0 ? this.state.note[0] : ''}

                                </div>
                                <div className="fortune-B">
                                    {noteLength > 1 ? this.state.note[1] : ''}

                                </div>
                                <div className="fortune-C">
                                    <span>宜:</span>
                                    {noteLength > 2 ? this.state.note[2] : ''}

                                </div>
                                <div className="fortune-D">
                                    <span>忌:</span>
                                    {noteLength > 3 ? this.state.note[3] : ''}

                                </div>
                                <a href="javascript:void(0);" data-log="egg-3-5:egg2017,draw_save_share"
                                   onClick={this.shareImageWithApp.bind(this)}
                                   className="btn-save"></a>
                                <a href="javascript:void(0);" data-log="egg-3-6:egg2017,draw_return"
                                   onClick={this.goIndex.bind(this)}
                                   className="btn-back-index"></a>
                                <i className="f-ib ghost"></i>
                            </div> : <a className="btn-login" href="javascript:void(0)"
                                        onClick={this.doLogin.bind(this)}></a> }


                        </div>
                        <div className="banner">
                        </div>
                    </div>
                    :
                    <div className="out-app-wrap">
                        <div className="content-wrap">
                            <div className="content">
                                <div className="name">{this.state.nickname}的2018签文</div>
                                <div className="fortune"></div>
                                <div className="fortune-A">
                                    {noteLength > 0 ? this.state.note[0] : ''}
                                </div>
                            </div>
                        </div>


                        <div className="cover">
                            <a className="btn-download" data-log="egg-3-3:egg2017,draw_goto_app"
                               onClick={this.openWithApp.bind(this)}
                               href="javascript:void(0)"></a>
                            <a className="btn-draw-again" data-log="egg-3-2:egg2017,draw_clickdraw"
                               onClick={this.goBack.bind(this)}
                               href="javascript:void(0)"></a>

                        </div>
                        <i className="f-ib red-egg"></i>
                        <i className="f-ib ghost"></i>
                        <i className="f-ib white-egg"></i>

                    </div>
                }


            </div>
        )
    }
}

export default PrayText;
