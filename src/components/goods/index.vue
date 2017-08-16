<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" 
              class="menu-item" 
              :class="{'current':currentIndex === index}"
              @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>      
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" 
                  @click="selectFood(food,$event)"
                  class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" alt="" height="57" width="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :dPrice="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
  
</template>
<script type="text/ecmascript-6">

import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/index';
import cartcontrol from 'components/cartcontrol/index';
import food from 'components/food/index';
import data from 'common/js/data.json';

const ERRNO = 0;

export default {
  props: {
    seller:{
      type : Object
    }
  },
  data(){
    return {
      goods : [],
      listHeight:[],
      scrollY:0,
      selectedFood: {}
    }
  },

  computed:{
    currentIndex(){
      for(let i = 0;i<this.listHeight.length;i++){
        let height1 = this.listHeight[i];//当前y高度
        let height2 = this.listHeight[i + 1];//下一个y高度
        if(!height2 || (this.scrollY >= height1&& this.scrollY <height2) ){
          return i;
        }
      }
      return 0;
    },
    selectFoods(){
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if(food.count){
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },

  created(){
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    let response = data;
    this.goods = response.goods;
    this.$nextTick(() => { //可能相当于setTimeOut(..,0)//下一个事件循环
      this.initScroll();
      this.calculateHeight();//用于滚动的联动效果
    }); 
    // this.$http.get('/api/goods').then((response) => {
    //   response = response.body;
    //   if(response.errno === ERRNO){
    //     this.goods = response.data;
    //     this.$nextTick(() => { //可能相当于setTimeOut(..,0)//下一个事件循环
    //       this.initScroll();
    //       this.calculateHeight();//用于滚动的联动效果
    //     }); 
    //   }
    // })
  },
  methods:{
    selectMenu(index,e){
      if(!e._constructed){//浏览器原生没有这个属性//这个步骤防止两次点击事件
        return 
      }
      //当只有自定义事件的时候//_constructed为true，则不会return
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index]; //找到想要滚动到的dom元素
      this.fScroll.scrollToElement(el, 300); //滚动到地点，BScroll的原生api
    },
    initScroll(){
      this.mScroll = new BScroll(this.$refs.menuWrapper,{
        click: true, //在移动端的情况下派发一个点击事件
      });
      this.fScroll = new BScroll(this.$refs.foodWrapper,{
        click: true,
        probeType:3
      });
      this.fScroll.on('scroll',(pos) => {
        this.scrollY =Math.abs(Math.round(pos.y));
      });
    },
    calculateHeight(){
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for(let i = 0;i<foodList.length;i++){
        let item =foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }      
    },
    addFood(target) {
      this._drop(target);
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    }
  },
  components : {
    shopcart,
    cartcontrol,
    food
  }
}
</script>
<style lang="scss">

  @import "../../common/sass/mixin.scss";

  .goods{
    position: absolute;
    top: 174px;
    width: 100%;
    bottom: 46px;
    display: flex;
    overflow: hidden;
    .menu-wrapper{
      flex:0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item{
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current{
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          font-weight: 700;
          .text{
            @include border-none();
          }    
        }
        .icon{
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease{
            @include bg-image('decrease_3');
          }
          &.discount{
            @include bg-image('discount_3'); 
          }
          &.guarantee{
            @include bg-image('guarantee_3'); 
          }
          &.invoice{
            @include bg-image('invoice_3'); 
          }
          &.special{
            @include bg-image('special_3'); 
          }
        }
        .text{
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          @include border-1px(rgba(7,17,27,0.1)); 
          font-size: 12px;
        }
      }
    }
    .foods-wrapper{
      flex:1;
      .title{
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item{
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7,17,27,0.1)); 
        &:last-child{
          @include border-none();
          margin-bottom: 0;
        }
        .icon{
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content{
          flex: 1;
          .name{
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc{
            margin-bottom: 8px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .extra{
            line-height: 10px;
            font-size: 10px;
            color: rgb(147,153,159);
            .count{
              margin-right: 12px;
            }
          }
          .price{
            font-weight: 700;
            line-height: 24px;
            .now{
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240,20,20);
            }
            .old{
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
