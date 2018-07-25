import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

export class Rule extends PureComponent {

    render () {
        return (
            <div className="srule-mask">
                <div className="srule">
                    <div onClick={this._onCancel} className="srule-close"></div>
                </div>
            </div>
        )
    }

    _onCancel = () => {
        this.props.onCancel()
    }
}

export default function showRule () {
    let div = document.createElement('div')
    let hide = () => {
        ReactDOM.render(<span></span>, div)
        document.body.removeChild(div)
    }
    document.body.appendChild(div)
    ReactDOM.render(
        <Rule onCancel={() => hide()}></Rule>,
        div
    )

}
