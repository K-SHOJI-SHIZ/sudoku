import React,{ Component } from 'react';
import logo from '../../svg/logo.svg';
import '../../css/App.css';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PersistentDrawer from '../base/AppBar/PersistentDrawer'
import ButtonAppBar from '../base/AppBar/ButtonAppBar'
import PaperSheet from './PaperSheet'
import AppChild from './AppChild'

class App extends Component {
  constructor() {
    super();
    const matrix = [];
    const matrix2 = [];
    for (let i = 0; i < 9; i++) {
      const line = ['','','','','','','','',''];
      const line2 = [false,false,false,false,false,false,false,false,false];
      matrix.push(line);
      matrix2.push(line2);
    }
    this.state = {
      isShow: false,
      mode: 'set',
      data: matrix,
      isLocked: matrix2,
      file: ''
    };
  }

  getNextData = (data, notVisited) => {
    let nextData = 0;
    for (let iteration = data + 1; iteration <= 9; iteration++) {
      if (notVisited[iteration]) {
        nextData = iteration;
        break
      }
    }
    return nextData;
  }

  sleep = (waitMsec) => {
    var startMsec = new Date();

    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
  }

  solvePart = (i, j, currentData, notVisited) => {
    const newData = Object.assign(this.state.data);
    let successed = false;
    const nextData = this.getNextData(currentData, notVisited[i][j]);
    if (nextData > 0) {
      newData[i][j] = nextData;
      this.setState({
        data: newData
      });
      successed = true;
      console.log(`(${i}, ${j}):${nextData}`);
    } else {
      newData[i][j] = '';
      this.setState({
        data: newData
      });
    }
    return successed;
  }

  handleSolve = async() => {
    this.solve();
    this.setState({
      mode: 'solved'
    });
  }

  solve = () => {
    let notVisited = [];
    for (let interation1 = 0; interation1 < 9; interation1++) {
      let visitedRow = [];
      for (let interation2 = 0; interation2 < 9; interation2++) {
        visitedRow.push([]);
      }
      notVisited.push(visitedRow);
    }
    let i = 0;
    let j = 0;
    let solving = true;
    while (solving) {
      notVisited[i][j] = this.getAllowed(i, j);
      if (!this.state.isLocked[i][j]) {
        let shouldContinue = true;
        let currentData = 0;
        while(shouldContinue) {
          shouldContinue = !this.solvePart(i, j, currentData, notVisited);
          if (shouldContinue) {
            let notValid = true;
            while (notValid) {
              if (j > 0) {
                j = j - 1;
              } else {
                i = i - 1;
                j = 8;
              }
              if (i < 0) {
                console.log('failed');
                return;
              }
              notValid = this.state.isLocked[i][j];
            }
            currentData = this.state.data[i][j];
          }
          if (i < 0) {
            console.log('failed');
            return;
          }
        }
      }
      if (j < 8) {
        j = j + 1;
      } else {
        j = 0;
        i = i + 1;
      }
      if (i > 8) solving = false;
    }
  }

  handleChange = (e, index, index2) => {
    const data = Object.assign(this.state.data);
    const isLocked = Object.assign(this.state.isLocked);
    let input = parseInt(e.target.value);
    if ( 1 <= input && input <= 9) {
      data[index][index2] = input;
      if (this.state.mode === 'set') isLocked[index][index2] = true;
    } else if (e.target.value.length == 0) {
      data[index][index2] = '';
      isLocked[index][index2] = false;
    }
    this.setState({
      'data': data,
      'isLocked': isLocked
    });
  }

  getGroupIndex = (index) => {
    if (index < 3) {
      return [0, 1, 2];
    } else if (index < 6) {
      return [3, 4, 5];
    }
    return [6, 7, 8];
  }

  getAllowed = (i, j) => {
    const allowed = [false,true,true,true,true,true,true,true,true,true];
    const x = this.getGroupIndex(i);
    const y = this.getGroupIndex(j);
    const row = this.state.data[i];
    const col = [];
    for (let iteration = 0; iteration < 9; iteration++) col.push(this.state.data[iteration][j]);
    const group = [];
    x.forEach((index)=>{
      y.forEach((index2)=>{
        if (index !== i && index2 !== j) group.push(this.state.data[index][index2]);
      });
    });
    row.forEach((data, index) => {
      if (data === '' || index === j ) return;
      allowed[data] = false;
    });
    col.forEach((data, index) => {
      if (data === '' || index === i ) return;
      allowed[data] = false;
    });
    group.forEach((data, index) => {
      if (data === '') return;
      allowed[data] = false;
    });
    return allowed;
  }

  generateTextFieldPart = (i, j) => {
    let color1 = '#00ffff';
    let color2 = '#00ff00';
    let color = color2;
    const size = '60px'
    const allowed = this.getAllowed(i, j);
    if (
      (i < 3 && (j < 3 || j > 5))
      || (i > 5 && (j < 3 || j > 5))
      || ((i >= 3 && i <= 5) && ((j >= 3 && j <= 5)))
    ) {
      color = color1;
    }

    const items = [<option value=''></option>];
    for (let i = 1; i <= 9; i++) {
      if (allowed[i]) items.push(<option value={i}>{i}</option>);
    }
    let locked = true;
    if (this.state.mode === 'set') locked = false;

    return (
      <select
        value = {this.state.data[i][j]}
        style = {{
          width:size,
          height:size,
          fontSize:size,
          background:color,
          textAlign:'center',
          webkitAppearance: 'none',
          paddingLeft: '10px'
        }}
        disabled = {this.state.isLocked[i][j] && locked}
        onChange = {(e) => {this.handleChange(e, i, j);}}
      >
        {items}
      </select>
    );
  }

  generateTextField = () => {
    const dom = [];
    for (let i = 0; i < 9; i++) {
      const part = [];
      for (let j = 0; j < 9; j++) {
        part.push(this.generateTextFieldPart(i, j));
      }
      dom.push(<div>{part}</div>)
    }
    return <div>{dom}</div>;
  }

  handleReset = () => {
    const matrix = [];
    let isLocked = this.state.isLocked;
    if (this.state.mode === 'set') {
      isLocked = [];
    }
    for (let i = 0; i < 9; i++) {
      let line = [];
      if (this.state.mode === 'set') {
        line = ['','','','','','','','',''];
        let line2 = [false,false,false,false,false,false,false,false,false];
        isLocked.push(line2);
      } else {
        for (let j = 0; j < 9; j++) {
          let data = '';
          if (this.state.isLocked[i][j]) data = Object.assign(this.state.data[i][j]);
          line.push(data);
        }
      }
      matrix.push(line);
    }
    let mode = this.state.mode;
    if (this.state.mode === 'solved') {
      mode = 'solve';
    }
    this.setState({
      data: matrix,
      isLocked: isLocked,
      mode: mode
    });
  }

  handleMode = () => {
    if (this.state.mode === 'set' || this.state.mode === 'solved') this.setState({ mode: 'solve'});
    else {
      this.handleReset();
      this.setState({ mode: 'set'});
    }
  }

  handleOutputCsv = () => {
    let string = '';
    this.state.data.forEach((row)=>{
      string = string + row.join(',') + '\n';
    });
    var blob = new Blob([string], { "type": "text/plain" });

    //IEの場合
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, "sudoku.csv");
        //IE以外の場合
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sudoku.csv';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  handleUploadCsv = (e) => {
    const files = e.target.files;
    this.setState({file: files[0]});
  }

  handleReadFile = () => {
    if (this.state.file === '' || this.state.mode !== 'set') return;
    const reader = new FileReader();
    let isValid = true;
    reader.readAsText(this.state.file);
    reader.onload = (event) => {
      const rows = event.target.result.split('\n');
      if (rows.length < 9) isValid = false;
      const newData = [];
      const newIsLocked = [];
      rows.forEach((row, index)=>{
        const isLocked = [];
        const data = [];
        const splitData = row.split(',');
        if (index < 9) {
          if (splitData.length < 9) isValid = false;
          splitData.forEach((element)=>{
            if (element === '') {
              data.push('');
              isLocked.push(false);
              return;
            }
            const parsedData = parseInt(element);
            data.push(parsedData);
            isLocked.push(true);
          });
          newData.push(data);
          newIsLocked.push(isLocked);
        }
      });
      if (isValid) {
        this.setState({
          data: newData,
          isLocked: newIsLocked
        });
      }
    };
  }

  render() {
    let mode = '解答モード';
    let disabled = false;
    if (this.state.mode === 'set') {
      mode = '問題入力モード';
      disabled = true;
    }
    if (this.state.mode === 'solved') {
      mode = '解答';
      disabled = true;
    }
    return (
      <div>
      　<div style = {{ fontSize: '24px'}}>{mode}</div>
        <div style = {{ marginBottom: '10px'}}>
          <input
            style = {{ backgroundColor : '#aaa'}}
            onChange = {this.handleUploadCsv}
            type = 'file'
          />
          <Button
            style = {{ backgroundColor : '#9ff', marginLeft: '10px'}}
            onClick = {this.handleReadFile}
          >
            読み込み
          </Button>
        </div>
        {this.generateTextField()}
        <Button
          style = {{ backgroundColor : '#9ff'}}
          onClick = {this.handleMode}
        >
          入力モード変更
        </Button>
        <div>
          <Button
            style = {{ backgroundColor : '#9ff'}}
            onClick = {this.handleReset}
          >
            リセット
          </Button>
        </div>
        <div>
          <Button
            style = {{ backgroundColor : '#9f9'}}
            onClick = {this.handleSolve}
            disabled = {disabled}
          >
            解く
          </Button>
        </div>
        <div>
          <Button
            style = {{ backgroundColor : '#ccc'}}
            onClick = {this.handleOutputCsv}
          >
            CSV出力
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
