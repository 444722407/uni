import md5 from 'md5';
const host = 'https://apituwang.taihela.com'
const appid = '5GtjiexrCwYR0DDx'
const secret = 'Q1AaiEbPz8cl1O8Hl7nBjMrI37y6WueB'

export default function fetchWork(url="", data={}, method="GET"){
  
  const format_data = formatData(data);
  const format_header = formatHeader();

  return new Promise((resolve,reject)=>{
    uni.request({
      url: host+url,
      data: format_data,
      header: format_header,
      method,
      success: function(res){
        
        const data = res.data;
        if(data.code == 1){
          resolve(data.data)
        }else{
          if(data.msg){
            uni.showToast({
              title: data.msg,
              icon: 'none'
            });
          }
          reject(data.msg)
        }
      },
      fail:function(errMsg){
        reject(errMsg)
      }
    })
  })
}

function formatHeader(){
  const header = {
    "qr-client": "tiktok-mini",
    // "qr_appId": appid,
    "qr-ver": "1.0.0",
    "qr-ver-code": "100",
    "qr-token": uni.getStorageSync('token') || "",
    // "qr-country": "cn",
    // "qr-locale": "zh_CN",
    // "qr-timezone": "28800",
    // "qr-tz": "Asia/Shanghai",
    // "qr-lang": "zh",
    // "qr-app-lang": "3",
  };
 
  return header;
}

function formatData(data){
  const obj={
    timeStamp:parseInt(new Date().getTime()/1000),
    nonceStr:Math.random().toString(32).substring(2),
    appId: appid,
  }
  const format_data = {
    ...obj,
    ...data,
  }
  const apiSign = sign(format_data);
  format_data.apiSign = apiSign;
  return format_data;
}

function sign(obj){
  const sort = Object.keys(obj).sort();

  let str = sort.map((s)=> s=s + "=" + obj[s]).join("&");

  str += `&key=${secret}`;

  const apiSign = md5(str);

  return apiSign.toLocaleUpperCase();
}