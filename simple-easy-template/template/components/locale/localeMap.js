import React, {Component} from 'react';
import Context from './context';
// 高阶组件里使用生命周期函数
const localeMap = (Com) => {
  class GetLocaleMap extends Component {
    render () {
      return <Context.Consumer>
        {
          (context) => (
            <Com {...context}/>
          )
        }
      </Context.Consumer>;
    }
  }
  return GetLocaleMap;
};
// context的载体,一个高阶组件。像内部传递的组件下发context数据
export default localeMap;
