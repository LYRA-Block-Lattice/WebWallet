import React, { Component } from 'react';
import './App.css';
import Main from './pages/Main';

const isIOS = !!global.navigator.userAgent && /iPad|iPhone|iPod/.test(global.navigator.userAgent)

const getAppVersion = () => {
  const url = `/version.json?c=${Date.now()}`
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }

  return fetch(url, { headers }).then(response => response.json())
}

const handleScreenFocus = () => {
  if (isIOS) {
    const currentVersion = global.localStorage.getItem('appVersion')

    getAppVersion()
      .then((data) => {
        if (data.version !== currentVersion) {
          global.localStorage.setItem('appVersion', data.version)

          window.location.reload()
        }
      })
  }
}
class App extends Component {

  componentDidMount() {
    global.addEventListener('focus', handleScreenFocus, false)
  }

  componentWillUnmount() {
    global.removeEventListener('focus', handleScreenFocus, false)
  }

  render() {
    return (
      <div className="App">
        <Main />
      </div>
    );
  }
}

export default App;
