import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import asyncComponent from '../utils/asyncComponent'


class App extends Component {
  componentWillMount() {

  }

  componentDidMount() {

  }


  render() {
    const Index = asyncComponent(() => import('./Index'))
    return (

      <Router basename="/">
        <div>
          <Route path="/" />
          <Switch>
            <Route exact path="/" component={Index}></Route>
            <Route path="/index" component={Index}></Route>
            <Redirect to="/"></Redirect>
          </Switch>
        </div>
      </Router>

    )
  }
}

export default App
