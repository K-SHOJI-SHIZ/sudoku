import React,{ Component } from 'react';
import logo from '../../svg/logo.svg';
import '../../css/AppChild.css';
import Button from '@material-ui/core/Button';
import ButtonAppBar from '../base/AppBar/ButtonAppBar'
import PaperSheet from './PaperSheet'

class AppChild extends Component {
  constructor() {
    super();
    this.state = {
        isShow: false,
    };
  }

  onClick = () => {
    this.setState({isShow: !this.state.isShow});
  }

  getStyle = () => {
    let style;
    if (this.state.isShow) {
      style={
        border: "double 10px #0000ff",
        display: "",
      }
    } else {
      style={
        display: "none",
      }
    }
    return style;
  }

  getLabel = () => {
    return this.state.isShow ? "隠したいの？" : "見たいの?"
  }

  render() {
    const style = this.getStyle();
    const label = this.getLabel();
    return (
      <div>
        <ButtonAppBar
          title = "タイトル"
        />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
        </div>
        <div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Button color="inherit" style={{border: "solid 1px #000000"}} onClick={this.onClick}>{label}</Button>
          <div
            style={style}
          >
            <PaperSheet/>
          </div>
        </div>
      </div>
    );
  }
}

export default AppChild;
