import md5 from 'md5';
const host = 'https://apituwang.taihela.com'
const appid = '5GtjiexrCwYR0DDx'
const secret = 'Q1AaiEbPz8cl1O8Hl7nBjMrI37y6WueB'

export default function fetchWorkImage(url="", data={}, method="GET"){
  
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