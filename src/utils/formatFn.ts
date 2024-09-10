// Desc: Format functions
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------

// 转换数字为千位符，默认保留1位小数
export const fnFormatK = (num: number,fixed=1) => {
  return num > 999 ? (num / 1000).toFixed(fixed) + 'k' : num
}

// 校验输入项是否含有非法字符 [true：含有，验证不通过；false:不含有，验证通过]
export const hasIllegalChar = (str:string) => {
  return new RegExp(".*?script[^>]*?.*?(<\/.*?script.*?>)*", "ig").test(str);
}


// 转换时间格式
export const fnFormatTime = (time?: number|string) => {
  if(!time) return '';
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}