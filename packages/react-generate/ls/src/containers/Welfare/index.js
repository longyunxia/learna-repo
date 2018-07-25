import React, {Component} from 'react';
import confirm from 'nw-confirm'
import {fetchAPI, fetchForm} from 'shared/fetch';
import {isComicApp} from 'nw-detect';
import {login} from 'shared/login';
import {openAppComic} from 'nw-app-comic';
import {setOrUpdate, share} from 'nw-share'
import toast from 'toast';
import {log} from '@/log'
import welfareRule from '@/components/WelfareRule'
import './style.scss'

class Welfare extends Component {
    constructor(options) {
        super(options);
        this.state = {
            booksData: {
                books: [],
                loading: false,
                fail: false,
                loaded: false
            },
            subing: false
        }
    }

    componentWillMount() {

    }

    goIndex() {
        this.props.history.push(`/index?offset=4`)
    }

    onShare() {
        log.capture(`egg-5-3:egg2017,welfare_share`);
        share();
    }

    showRule() {
        welfareRule({parent: this.refs.welfarePage});
    }

    getBooks() {
        let booksData = this.state.booksData;
        booksData.loading = true;
        this.setState({
            booksData: booksData
        })
        fetchAPI('/doubleeggs/welfare/books.json', {}, 'GET')
            .then((resp) => {
                let booksData = this.state.booksData;
                booksData.loaded = true;
                booksData.fail = false;
                booksData.loading = false;
                booksData.books = resp.books;
                this.setState({
                    booksData: booksData
                })
            })
            .catch((error) => {
                let booksData = this.state.booksData;
                booksData.loaded = false;
                booksData.fail = true;
                booksData.loading = false;
                this.setState({
                    booksData: booksData
                })

            });
    }

    toDetail(bookId) {
        log.capture(`egg-5-1:egg2017,welfare_clickcomic,${bookId}`);
        openAppComic({
            path: 'detail',//path='detail'表示使用APP打开漫画详情页面
            query: {
                id: bookId//漫画bookId
            },
            h5Fallback: true
        })
    }

    doSub(bookId) {
        if (this.state.subing) return;
        this.setState({subing: true})
        fetchAPI('/doubleeggs/welfare/sub.json', {bookId: bookId}, 'POST')
            .then((resp) => {
                console.log(resp);
                this.setState({subing: false})
                if (resp.loginPromise) {
                    confirm({
                        content: '登录后才能够将福利反馈给你哦，赶快登录吧',
                        okText: '去登录',
                        cancelText: '啥也不要'
                    }).then(() => {
                        resp.loginPromise().then(({redirect}) => {
                            if (redirect) {
                                redirect()
                            } else {
                                this.doSub(bookId)
                            }
                        })

                    }).catch(() => {
                        console.log('取消')
                    })


                    return
                }
                if (resp.code == 200) {
                    confirm({
                        content: '收藏成功，邀请好友一起来助力吧',
                        okText: '马上分享',
                        cancelText: '啥也不要'
                    }).then(() => {
                        share();


                    }).catch(() => {
                        console.log('取消')
                    })
                    let booksData = this.state.booksData;
                    (booksData.books || []).map((book) => {
                        if (book.bookId == bookId) {
                            book.subscribe = true;
                            book.subscribeCount += 1;
                        }
                    })
                    this.setState({
                        booksData: booksData
                    })

                }


            })
            .catch((error) => {
                toast({text: '网络错误，请检查网络'})
                this.setState({subing: false})
            });
        log.capture(`egg-5-2:egg2017,welfare_storecomic,${bookId}`);
    }

    componentDidMount() {
        this.getBooks();
        setOrUpdate({
            title: "【网易漫画】收藏作品看独家！更有周边送不停",
            description: "12.29-1.4日，收藏超人气作品，新增收藏超过3w，即可解锁独家贺图、番外，限免，爆更等只在网易漫画的福利哦！分享还有作品正版周边、新年礼盒掉落！",
            activityId: "20171228",
            picurl: "https://easyread.nosdn.127.net/web/trunk/1514427933910/welfare-share.jpg",
            text: "12.29-1.4日，来@网易漫画 收藏超人气作品，新增收藏超过3w，即可解锁独家贺图、番外，限免，爆更等只在网易漫画的福利哦！分享还有作品正版周边、新年礼盒掉落",
            link: location.protocol + '//' + location.hostname + "/activity/doubleeggs/welfare"
        }, () => {
            log.capture(`egg-5-4:egg2017,welfare_share_return`);
        })
    }

    formatNumber(number) {
        if (number < 10000) {
            return number
        } else {
            let point = parseInt((number % 10000) / 1000)

            return Math.floor(number / 10000) + '' + (point > 0 ? ('.' + point) : '') + '万'
        }
    }


    render() {
        const windowHeight = window.innerHeight;
        const {books} = {...this.state.booksData}
        return (
            <div ref="welfarePage" className="welfare-page" style={{minHeight: windowHeight}}>
                <div className="action-wrap">
                    <a className="f-ib btn-back" onClick={this.goIndex.bind(this)}></a>
                    <a className="f-ib btn-share" onClick={this.onShare.bind(this)}></a>
                </div>
                <div className="rule-wrap">
                    <div className="rule-content">
                        <div className="title"><span>·</span> 活动规则 <span>·</span></div>
                        <div className="content">
                            12.29-1.4日，收藏下列人气作品，即可解锁只在网易漫画独家的新年贺图、番外、爆更、限免福利！
                            <br/>
                            分享还有作品精美周边掉落哦!
                        </div>
                        <a href="javascript:void(0);" onClick={this.showRule.bind(this)} className="f-ib">详细玩法 ></a>
                    </div>
                </div>
                <div className="main-content">
                    <div className="book-list">
                        {(books || []).map((book, index) => {
                            let progressLen = book.subscribeCount / book.fullCount * 100;
                            if (progressLen > 100) {
                                progressLen = 100;
                            }
                            return <div className="book-item" key={`${book.bookId}_${index}`}>
                                <div className="meta-left">
                                    <div className="img-block" onClick={this.toDetail.bind(this, book.bookId)}>
                                        <img
                                            style={ {"backgroundImage": `url(${book.cover} )`} }

                                            alt=""/>
                                    </div>
                                    {book.subscribe ?

                                        <a href="javascript:void(0);"
                                           className="f-ib btn-favored"></a> :
                                        <a href="javascript:void(0);" onClick={this.doSub.bind(this, book.bookId)}
                                           className="f-ib btn-favor"></a>}

                                </div>
                                <div className="meta-right">
                                    <h2 className="title"
                                        onClick={this.toDetail.bind(this, book.bookId)}>{book.title}</h2>
                                    <div className="desc">·{book.description}</div>
                                    <div className="award-wrap">
                                        <div className="progress-wrap">
                                            <div className="progress"
                                                 style={{width: `${progressLen}%`}}></div>
                                            <span className="f-ib separator separator1"></span>
                                            <span className="f-ib separator separator2"></span>
                                            <span className="f-ib separator separator3"></span>
                                            <span className="f-ib separator separator4"></span>
                                            {(book.bookPrizes || []).map((prize, index) => {
                                                if (prize.count <= book.subscribeCount) {
                                                    return <img key={index} className="f-ib award" src={prize.lighturl}
                                                                style={{
                                                                    left: `${prize.count / book.fullCount * 100}%`,
                                                                    width: `${prize.lightwidth / 75.0}rem`

                                                                }}/>
                                                } else {
                                                    return <img key={index} className="f-ib award" src={prize.grayurl}
                                                                style={{
                                                                    left: `${prize.count / book.fullCount * 100}%`,
                                                                    width: `${prize.graywidth / 75.0}rem`

                                                                }}/>

                                                }

                                            })
                                            }

                                        </div>
                                        <div
                                            className="favor-count">{this.formatNumber(book.subscribeCount)}/{this.formatNumber(book.fullCount)}收藏
                                        </div>
                                        <div className="tip">收藏作品开启独家福利</div>

                                    </div>
                                </div>
                            </div>
                        })}


                    </div>
                    <div className="cooperation-wrap">
                        <div className="cooperation"></div>
                    </div>

                </div>

            </div>
        )
    }
}

export default Welfare;
