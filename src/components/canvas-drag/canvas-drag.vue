<template>
    <canvas id="canvas-drag" canvas-id="canvas-drag" disable-scroll="true" @touchstart="start" @touchmove="move" @touchend="end" :style="'width: ' + width + 'px; height: ' + height + 'px;'"></canvas>
</template>

<script>
const DELETE_ICON = '../../static/replace.png'; // 删除按钮
const DELETE_ICON2 = '../../static/replace2.png';
const DRAG_ICON = '../../static/scale.png'; // 缩放按钮
const STROKE_COLOR = '#ffffff';
const ROTATE_ENABLED = true;
let isMove = false; // 标识触摸后是否有移动，用来判断是否需要增加操作历史

const DEBUG_MODE = false; // 打开调试后会渲染操作区域边框（无背景时有效）
const dragGraph = function({ x = 0, y = 0, w, h, type, text, index,id, fontSize = 20, color = "red", url = null, rotate = 0, sourceId = null, selected = false }, canvas, factor) {
  this.centerX = x + w / 2;
  this.centerY = y + h / 2;
  
  this.w = w;
  this.h = h;

  this.x = x;
  this.y = y;

  this.square = [
    [this.x, this.y],
    [this.x + this.w, this.y],
    [this.x + this.w, this.y + this.h],
    [this.x, this.y + this.h]
  ];
  this.url = url;
  this.text = text;
  this.fontSize = fontSize;
  this.color = color;
  this.ctx = canvas;
  this.rotate = rotate;
  this.type = type;
  this.selected = selected;
  this.factor = factor;
  this.sourceId = sourceId;
  this.MIN_WIDTH = 30;
  this.MIN_FONTSIZE = 10;
  this.index = index;
  // this.moveIndex = index;
  this.id = id;
};
dragGraph.prototype = {
  /**
   * 绘制元素
   */
  paint() {
    this.ctx.save();


    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotate * Math.PI / 180);
    this.ctx.translate(-this.centerX, -this.centerY);
    
    this.ctx.drawImage(this.url, this.x, this.y, this.w, this.h);
   
    // if (this.selected) {
    //   this.ctx.setLineDash([5, 5], 5);
    //   this.ctx.setLineWidth(2);
    //   this.ctx.setStrokeStyle(STROKE_COLOR);
    //   if (this.type === "text") {
    //     this.ctx.strokeRect(this.x, this.y, this.w, this.h);
    //     this.ctx.drawImage(DELETE_ICON2, this.x - 15, this.y - 15, 40, 25);
    //     this.ctx.drawImage(DRAG_ICON, this.x + this.w - 15, this.y + this.h - 15, 24, 24);
    //   } else if (this.type === "image") {
    //     this.ctx.strokeRect(this.x, this.y, this.w, this.h);
    //     this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 40, 25);
    //     this.ctx.drawImage(DRAG_ICON, this.x + this.w - 15, this.y + this.h - 15, 24, 24);
    //   }
    // }
    
    this.ctx.restore();
  },
  /**
   * 给矩形描边
   * @private
   */
  _drawBorder() {
    let p = this.square;
    let ctx = this.ctx;
    this.ctx.save();
    this.ctx.beginPath();
    ctx.setStrokeStyle("orange");
    this._draw_line(this.ctx, p[0], p[1]);
    this._draw_line(this.ctx, p[1], p[2]);
    this._draw_line(this.ctx, p[2], p[3]);
    this._draw_line(this.ctx, p[3], p[0]);
    ctx.restore();
  },
  /**
   * 画一条线
   * @param ctx
   * @param a
   * @param b
   * @private
   */
  _draw_line(ctx, a, b) {
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  /**
   * 判断点击的坐标落在哪个区域
   * @param {*} x 点击的坐标
   * @param {*} y 点击的坐标
   */
  isInGraph(x, y) {
    if(this.type == "bg") return false;
    
    const delW = 40;
    const delH = 25;
    const transformedDelCenter = this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate);
    const transformDelX = transformedDelCenter[0] - delW / 2;
    const transformDelY = transformedDelCenter[1] - delH / 2;
    const scaleW = 24;
    const scaleH = 24;
    const transformedScaleCenter = this._rotatePoint(this.x + this.w, this.y + this.h, this.centerX, this.centerY, this.rotate);
    const transformScaleX = transformedScaleCenter[0] - scaleW / 2;
    const transformScaleY = transformedScaleCenter[1] - scaleH / 2;
    if (x - transformScaleX >= 0 && y - transformScaleY >= 0 && transformScaleX + scaleW - x >= 0 && transformScaleY + scaleH - y >= 0) {
      return "transform";
    } else if (x - transformDelX >= 0 && y - transformDelY >= 0 && transformDelX + delW - x >= 0 && transformDelY + delH - y >= 0) {
      return "del";
    } else if (this.insidePolygon(this.square, [x, y])) {
      return "move";
    }
    return false;
  },
  /**
   *  判断一个点是否在多边形内部
   *  @param points 多边形坐标集合
   *  @param testPoint 测试点坐标
   *  返回true为真，false为假
   *  */
  insidePolygon(points, testPoint) {
    if(this.type == "bg") return false;
    let x = testPoint[0], y = testPoint[1];
    let inside = false;
    
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      let xi = points[i][0], yi = points[i][1];
      let xj = points[j][0], yj = points[j][1];
      let intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;

      if (intersect)
        inside = !inside;
    }
    return inside;
  },
  /**
   * 计算旋转后矩形四个顶点的坐标（相对于画布）
   * @private
   */
  _rotateSquare() {
    this.square = [
      this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x + this.w, this.y, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x + this.w, this.y + this.h, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x, this.y + this.h, this.centerX, this.centerY, this.rotate)
    ];
  },
  /**
   * 计算旋转后的新坐标（相对于画布）
   * @param x
   * @param y
   * @param centerX
   * @param centerY
   * @param degrees
   * @returns {*[]}
   * @private
   */
  _rotatePoint(x, y, centerX, centerY, degrees) {
    let newX = (x - centerX) * Math.cos(degrees * Math.PI / 180) - (y - centerY) * Math.sin(degrees * Math.PI / 180) + centerX;
    let newY = (x - centerX) * Math.sin(degrees * Math.PI / 180) + (y - centerY) * Math.cos(degrees * Math.PI / 180) + centerY;
    return [newX, newY];
  },
  /**
   *
   * @param {*} px 手指按下去的坐标
   * @param {*} py 手指按下去的坐标
   * @param {*} x 手指移动到的坐标
   * @param {*} y 手指移动到的坐标
   * @param {*} currentGraph 当前图层的信息
   */
  transform(px, py, x, y, currentGraph) {
   
    this.centerX = this.x + this.w / 2;
    this.centerY = this.y + this.h / 2;
    
    const diffXBefore = px - this.centerX;
    const diffYBefore = py - this.centerY;
    const diffXAfter = x - this.centerX;
    const diffYAfter = y - this.centerY;
    const angleBefore = Math.atan2(diffYBefore, diffXBefore) / Math.PI * 180;
    const angleAfter = Math.atan2(diffYAfter, diffXAfter) / Math.PI * 180;
    {
      this.rotate = currentGraph.rotate + angleAfter - angleBefore;
    }
    const lineA = Math.sqrt(Math.pow(this.centerX - px, 2) + Math.pow(this.centerY - py, 2));
    const lineB = Math.sqrt(Math.pow(this.centerX - x, 2) + Math.pow(this.centerY - y, 2));
   
    let resize_rito = lineB / lineA;
    let new_w = currentGraph.w * resize_rito;
    let new_h = currentGraph.h * resize_rito;
    if (currentGraph.w < currentGraph.h && new_w < this.MIN_WIDTH) {
      new_w = this.MIN_WIDTH;
      new_h = this.MIN_WIDTH * currentGraph.h / currentGraph.w;
    } else if (currentGraph.h < currentGraph.w && new_h < this.MIN_WIDTH) {
      new_h = this.MIN_WIDTH;
      new_w = this.MIN_WIDTH * currentGraph.w / currentGraph.h;
    }
    this.w = new_w;
    this.h = new_h;
    this.x = currentGraph.x - (new_w - currentGraph.w) / 2;
    this.y = currentGraph.y - (new_h - currentGraph.h) / 2;
  
  },
  toPx(rpx) {
    return rpx * this.factor;
  }
};

export default  {
  data() {
    return {
      history: [],
    };
  },
  emits:['getData','changeImg','selectImgId'],
  components: {},
  props: {
    graph: {
      type: Object,
      default: () => ({})
    },
    bgColor: {
      type: String,
      default: ""
    },
    bgSourceId: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 750
    },
    height: {
      type: Number,
      default: 750
    },
    enableUndo: {
      type: Boolean,
      default: false
    },
    bgImage: {
      type: String,
      default: ""
    }
  },
  watch: {
    graph: {
      handler: "onGraphChange",
      deep: true
    }
  },
  beforeMount() {

    if (typeof this.drawArr === 'undefined') {
        this.drawArr = [];
    }

    this.ctx = uni.createCanvasContext('canvas-drag', this);
    this.draw();
  },
  methods: {
    toPx(rpx) {
      return rpx * this.factor;
    },
    initHistory() {
      this.history = [];
    },
    recordHistory() {
      if (!this.enableUndo) {
        return;
      }
      this.exportJson().then((imgArr) => {
        this.history.push(JSON.stringify(imgArr));
      }).catch((e) => {
        console.error(e);
      });
    },
    undo() {
      if (!this.enableUndo) {
        console.log(`后退功能未启用，请设置enableUndo="{{true}}"`);
        return;
      }
      if (this.history.length > 1) {
        this.history.pop();
        let newConfigObj = this.history[this.history.length - 1];
        this.initByArr(JSON.parse(newConfigObj));
      } else {
        console.log("已是第一步，不能回退");
      }
    },
    onGraphChange(n, o) {
      if (JSON.stringify(n) === "{}")
        return;
      this.drawArr.push(new dragGraph(Object.assign({
        x: 30,
        y: 30
      }, n), this.ctx, this.factor));

      this.draw();
      this.recordHistory();
    },
    initByArr(newArr,sy) {
    
      this.drawArr = [];
      
      newArr.forEach((item, index) => {
        this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
      });

      // 增加水印
      this.drawArr.push(new dragGraph(sy,this.ctx, this.factor))
      
      this.draw();
    },
    draw() {
      
      this.drawArr.forEach((item) => {
        item.paint();
      });

      this.drawArr.forEach((item) => {

          if(item.selected){
            item.ctx.save()     
            item.ctx.translate(item.centerX, item.centerY);
            item.ctx.rotate(item.rotate * Math.PI / 180);
            item.ctx.translate(-item.centerX, -item.centerY);
        
            item.ctx.setLineDash([5, 5], 5);
            item.ctx.setLineWidth(2);
            item.ctx.setStrokeStyle(STROKE_COLOR);
            if (item.type === "text") {
              item.ctx.strokeRect(item.x, item.y, item.w, item.h);
              item.ctx.drawImage(DELETE_ICON2, item.x - 15, item.y - 15, 40, 25);
              item.ctx.drawImage(DRAG_ICON, item.x + item.w - 15, item.y + item.h - 15, 24, 24);
            } else if (item.type === "image") {
              item.ctx.strokeRect(item.x, item.y, item.w, item.h);
              item.ctx.drawImage(DELETE_ICON, item.x - 15, item.y - 15, 40, 25);
              item.ctx.drawImage(DRAG_ICON, item.x + item.w - 15, item.y + item.h - 15, 24, 24);
            }
            item.ctx.restore()
          }
        
      });
 
      
      
    
      return new Promise((resolve) => {
        this.ctx.draw(false, () => {
          resolve();
        });
      });
    },
    start(e) {
      isMove = false;
      const {
        x,
        y
      } = e.touches[0];
      this.tempGraphArr = [];
      let lastDelIndex = null;

   
      this.drawArr && this.drawArr.forEach((item, index) => {
        const action = item.isInGraph(x, y);
        
        if (action) {
          item.action = action;
          // item.index = 99999;
          item.selected = true;
          this.$emit('selectImgId',item.id,item.type)
          this.tempGraphArr.push(item);
          this.currentTouch = {
            x,
            y
          };
          if (action === "del") {
            lastDelIndex = index;
            item.selected = true;
          }
        } else {
          item.action = false;
          item.selected = false;
        }
        
      });
   
  
      if (this.tempGraphArr.length > 0) {
        for (let i = 0; i < this.tempGraphArr.length; i++) {
          let lastIndex = this.tempGraphArr.length - 1;
          if (i === lastIndex) {
            if (lastDelIndex !== null && this.tempGraphArr[i].selected) {
              if (this.drawArr[lastDelIndex].action == "del") {
               
                this.$emit('changeImg',this.tempGraphArr[i].id,this.tempGraphArr[i].type)
                // this.drawArr.splice(lastDelIndex, 1);
                // this.ctx.clearRect(0, 0, this.toPx(this.width), this.toPx(this.height));
              }
            } else {
             
              this.tempGraphArr[lastIndex].selected = true;
              this.currentGraph = Object.assign({}, this.tempGraphArr[lastIndex]);
            }
          } else {
            // this.tempGraphArr[i].index = this.tempGraphArr[i].moveIndex;
            this.tempGraphArr[i].action = false;
            this.tempGraphArr[i].selected = false;
          }
        }
      }
      // this.sortArr();
      this.draw();
    },
    move(e) {
    
      const {
        x,
        y
      } = e.touches[0];
      if (this.tempGraphArr && this.tempGraphArr.length > 0) {
        isMove = true;
        const currentGraph = this.tempGraphArr[this.tempGraphArr.length - 1];
        if (currentGraph.action === "move") {
          currentGraph.centerX = this.currentGraph.centerX + (x - this.currentTouch.x);
          currentGraph.centerY = this.currentGraph.centerY + (y - this.currentTouch.y);
          currentGraph.x = currentGraph.centerX - this.currentGraph.w / 2;
          currentGraph.y = currentGraph.centerY - this.currentGraph.h / 2;
        } else if (currentGraph.action === "transform") {
       
          currentGraph.transform(this.currentTouch.x, this.currentTouch.y, x, y, this.currentGraph);
        }
        currentGraph._rotateSquare();
        // this.sortArr();
        this.draw();
      }
    },
    end(e) {
      // const index = this.drawArr.findIndex((item)=>item.action == "move" || item.action == "transform");
   
      // if(index != -1){
      
      //   this.drawArr[index].index =  this.drawArr[index].moveIndex;
      //   this.getData(this.drawArr[index])
      // }

      this.tempGraphArr = [];
      if (isMove) {
        isMove = false;
        this.recordHistory();
      }
      
    },
    exportFun() {
      return new Promise((resolve, reject) => {
        this.drawArr = this.drawArr.map((item) => {
          item.selected = false;
          return item;
        });
        this.draw().then(() => {
          wx.canvasToTempFilePath({
            canvasId: "canvas-drag",
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (e) => {
              reject(e);
            }
          }, this);
        });
      });
    },
    exportJson() {
      return new Promise((resolve, reject) => {
        let exportArr = this.drawArr.map((item) => {
          return {
                type: item.type,
                url: item.url,
                y: item.y,
                x: item.x,
                w: item.w,
                h: item.h,
                rotate: item.rotate,
                index:item.index,
                id:item.id,
                selected:item.selected
              };
         
        });
        resolve(exportArr);
      });
    },
  
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.toPx(this.width), this.toPx(this.height));
      this.ctx.draw();
      this.drawArr = [];
      this.initBg();
      this.initHistory();
    },
    sortArr() {
      this.drawArr.sort((a, b) => a.index - b.index);
    },
    // 将当前图片显示编辑状态
    selectImg(id){

      this.drawArr.map((item)=>item.selected = false);

      this.drawArr.map((item)=>{
        if(item.id == id){
          // item.index = 99999;
          item.selected = true;
        }
      });
      // this.sortArr();
      this.draw();

      // this.drawArr.map((item)=>{
      //   if(item.id == id){
      //     item.index = item.moveIndex;
      //     item.selected = false;
      //   }
      // });
    },
    getData(item){
        this.$emit('getData',item)
    },
    export() {
    
            return new Promise((resolve, reject) => {
                this.drawArr = this.drawArr.map((item) => {
                    item.selected = false;
                    return item;
                });
                const index =  this.drawArr.findIndex((item)=>item.id == -9527);
                this.drawArr.splice(index,1)
             
                this.draw().then(() => {
                  
                    uni.canvasToTempFilePath({
                        canvasId: 'canvas-drag',
                        width:parseInt(this.width),
                        height:parseInt(this.height),
                        destWidth:1080/2,
                        destHeight:2336/2,
                        fileType:"png",
                        success: (res) => {
                            resolve(res.tempFilePath);
                        },
                        fail: (e) => {
                          console.log(e)
                            reject(e);
                        },
                    }, this);
                });
            })
        },
  }
}
</script>

<style>
    #canvas-drag{
        margin: 0 auto;
    }
    
</style>