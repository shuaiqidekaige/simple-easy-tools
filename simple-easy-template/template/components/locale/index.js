import React, {Component} from 'react';
import Context from './context';
import { updata, setDataAll } from './localeData';
// 引入语言配置文件
class Locale extends Component {
  constructor (props) {
    super(props);
    this.state = {
      message: this.props.message,
      lang: Object.keys(this.props.message)[0],
    };
    setDataAll(this.props.message);
    if (this.state.message && this.state.lang) {
      console.log('=======');
      updata(this.state.message[this.state.lang]);
    }
  }
    changeLange = (value) => {
      updata(this.state.message[value]);
      this.setState({
        lang: value
      });

    }
    render () {
      return (
        <Context.Provider value={{
          message: this.state.message[this.state.lang],
          changeLange: this.changeLange
        }}>
          {this.props.children}
        </Context.Provider>
      );
    }
}
export default Locale;
