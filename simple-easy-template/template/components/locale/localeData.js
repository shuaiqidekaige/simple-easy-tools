

class LocalData {
  constructor () {
    this.data = {};
    this.dataAll = {};
  }
    updata = (value) => this.data = value// 设置目前选中的语言的配置
    setDataAll = (value) => this.dataAll = value// 设置所有语言包的数据

    getDataAll = () => this.dataAll// 获取所有语言包的数据
    getLocale = () => Object.keys(this.data)// 获取当前使用语言的key
}
const local = new LocalData();

export const updata = local.updata;
export const getLocale = local.getLocale;
export const setDataAll = local.setDataAll;
export const getDataAll = local.getDataAll;
