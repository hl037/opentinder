import React, {Component} from 'react'
import Router, {Route, Link, DefaultRoute, RouteHandler} from 'react-router'

import Matches from './components/pages/Matches'
import Messages from './components/pages/Messages'
import messages from './messages'

import tinder from 'jstinder'

export default class Root extends Component {
  constructor (props) {
    super(props)

    this.state = {me: null}

    tinder.login()
      .then((me) => {
        tinder.auth(me.token, me.id).then(() => {
          this.setState({me: me})
        })
      })
  }

  zap (e) {
    e.preventDefault()
    messages.emit('zap')
  }

  render () {
    return tinder.token ? (
      <div className='Root'>
        <div className='Toolbar'>
          <Link to='/'>Matches</Link>
          <a href='#zap' onClick={this.zap}>Zap</a>
          <Link to='/messages'>Messages</Link>
        </div>
        <RouteHandler />
      </div>
    ) : (
      <div className='loading'>Logging you in with Facebook.</div>
    )
  }
}

Router.run((
  <Route handler={Root}>
    <DefaultRoute handler={Matches} />
    <Route path='/messages' handler={Messages} />
  </Route>
), function (Handler) {
  React.render(<Handler/>, document.getElementById('content'))
})
