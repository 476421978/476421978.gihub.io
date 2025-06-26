<template>
  <view class="cart-footer-container">
    <!-- 购物车 -->
    <view class="foot-fixed" v-show="allCount > 0">
      <view class="cart col-center flex">
        <view class="cart-num flex flex-center" @tap="showCart = !showCart">
          <img :src="cartFootConfig.cartFootImg" style="width: 132rpx; height: 132rpx" />
          <u-badge bg-color="#fff" color="#fe9845" max="99" :value="allCount" absolute :offset="[16, 16]" />
        </view>
        <view class="flex-1 total-order">
          <text class="md">{{ cartFootConfig.totalTxt || '合计' }}:</text>
          <price-format class="price" color="#fe9845" :price="totalAmount * 100" :size="36" />
        </view>

        <u-button
          :customStyle="{
            width: '200rpx',
            height: '70rpx',
            'margin-right': '40rpx',
            'background-image': 'linear-gradient(to right, #ffae6d, #fe9845)',
            color: '#fff',
            'border-radius': '35rpx',
            border: 'none'
          }"
          size="large"
          shape="circle"
          :text="cartFootConfig.btnTxt || '下单'"
          @click="gotoConfirmOrder"
        ></u-button>
      </view>
    </view>

    <cart-popup
      v-model="showCart"
      :lists="cartLists"
      :cartConfig="cartFootConfig.cartConfig"
      @clear="clearCard"
      @countchange="handleCountChange"
      :popup-style="{ bottom: showCart ? footerHeight : '0rpx' }"
    ></cart-popup>
  </view>
</template>

<script>
import CartPopup from './CartPopup'
import PriceFormat from './PriceFormat'
import { mapGetters } from 'vuex'
import { mockCartData } from '../data'

export default {
  name: 'CartFooter',
  components: { PriceFormat, CartPopup },
  props: {
    cartFootConfig: {
      type: Object,
      default: () => {
        return {
          cartFootImg: '',
          btnTxt: '下单',
          totalTxt: '合计',
          // 弹窗配置
          cartConfig: {
            cartTitle: '标题',
            cartType: '类型'
          }
        }
      }
    }
  },
  data() {
    return {
      isVerificationOrderFlag: false,
      totalAmount: 0,
      allCount: 0,
      showCart: false,
      cartLists: mockCartData
    }
  },
  computed: {
    ...mapGetters(['color']),
    footerHeight() {
      // 计算底部固定栏的实际高度，包括安全底部区域
      // 注意：在 script 中直接获取 env(safe-area-inset-bottom) 需要uni-app或其他框架的支持
      // 这里先假设一个固定的安全区域高度，实际应用中需要根据平台和设备动态获取
      const systemInfo = uni.getSystemInfoSync()
      const safeAreaBottom = systemInfo.safeAreaInsets.bottom
      return `calc(100rpx + ${safeAreaBottom}px)`
    }
  },
  watch: {
    cartLists: {
      handler(newVal) {
        this.calculateTotal()
      },
      deep: true
    }
  },
  methods: {
    // 合计金额
    calculateTotal() {
      let total = 0
      let count = 0
      this.cartLists.forEach((dateItem) => {
        dateItem.stall.forEach((stallItem) => {
          stallItem.food.forEach((foodItem) => {
            total += foodItem.spec_price * foodItem.count
            count += foodItem.count
          })
        })
      })
      this.totalAmount = total
      this.allCount = count
    },
    gotoConfirmOrder() {
      // 触发事件通知父组件
      this.$emit('orderConfirmed')
    },
    clearCard() {
      // uni.showModal({
      //   title: '提示',
      //   content: '确定要清空购物车吗？',
      //   success: res => {
      //     if (res.confirm) {
      //       this.cartLists = []
      //       this.calculateTotal()
      //     }
      //   }
      // })
    },
    // 合计数量
    handleCountChange({ value, food, id }) {
      // 更新购物车中对应商品的数量
      this.cartLists.forEach((dateItem) => {
        dateItem.stall.forEach((stallItem) => {
          stallItem.food.forEach((foodItem) => {
            if (foodItem.food_id === food.food_id || foodItem.set_meal_id === food.set_meal_id) {
              foodItem.count = value
            }
          })
        })
      })
      this.calculateTotal()
    },
    // 添加商品到购物车
    addItemToCart(item) {
      // 确保 cartLists 至少有一个日期项
      if (this.cartLists.length === 0) {
        this.cartLists.push({
          date: new Date().toISOString().split('T')[0],
          stall: []
        })
      }

      let targetDateCart = this.cartLists[0]
      let purchaseStall = targetDateCart.stall.find((stall) => stall.id === 99)

      if (!purchaseStall) {
        purchaseStall = {
          id: 99,
          stall_name: '采购商品',
          meal_type: 'purchase',
          meal_type_alias: '采购',
          food: []
        }
        targetDateCart.stall.push(purchaseStall)
      }

      let existingItem = purchaseStall.food.find((food) => food.food_id === item.food_id && food.spec_name === item.spec_name)

      if (existingItem) {
        existingItem.count++
      } else {
        purchaseStall.food.push({
          ...item,
          count: 1
        })
      }
    }
  },
  mounted() {
    this.calculateTotal()
  }
}
</script>

<style lang="scss" scoped>
.cart-footer-container {
  .foot-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    .cart {
      height: 100rpx;
      box-sizing: content-box;
      padding-bottom: env(safe-area-inset-bottom);
      position: relative;
      background-color: #fff;
      border-top: $border-base;
      align-items: center; /* Ensure vertical alignment */

      .cart-num {
        position: absolute;
        left: 0rpx;
        top: -40rpx;
        width: 132rpx;
        height: 132rpx;
        z-index: 10077;
      }

      .total-order {
        margin-left: 140rpx;
        display: flex;
        align-items: center;
        .md {
          letter-spacing: 0px;
          color: #595a5c;
          font-size: 30rpx;
          margin-right: 10rpx;
        }
        .price {
          font-size: 36rpx;
          color: #fe9845;
        }
      }
    }
  }
}
</style>
