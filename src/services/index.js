import md5 from 'md5';
const host = 'https://apituwang.taihela.com'
const appid = '5GtjiexrCwYR0DDx'
const secret = 'Q1AaiEbPz8cl1O8Hl7nBjMrI37y6WueB'

export default function fetchWork(url="", data={}, method="GET",text){
  
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
            if(url == "/v1.index/search_code_word" || url == "/v1.font/render_text" || url == "/v1.upload/image"){
              reject(data.msg)
            }else{
              if(data.msg){
                uni.showToast({
                  title: data.msg,
                  icon: 'none'
                });
              }
            }
          }
      },
      fail:function(errMsg){
        console.log(errMsg)
        reject(errMsg)
      }
    })
  })
}

export function fetchWorkImage(url,path,cb){

    const format_data = formatData({});
    const format_header = formatHeader();
    const uploadTask = uni.uploadFile({
        url: host+url,
        header:format_header,
        fileType:"image",
        filePath:path,
        name:"file",
        formData:format_data,
        success:(res)=>{
          cb(res)
        },
        fail:function(errMsg){
          console.log(errMsg)
        }
    })
    return uploadTask;

 
}


function formatHeader(){
  const header = {
    "qr-client": "tiktok-mini",
    "qr-ver": "1.0.0",
    "qr-ver-code": "100",
    "qr-token": uni.getStorageSync('token') || "",
    
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