<template>
  <view class="cart-popup">
    <u-popup :show="showPop" mode="bottom" :round="20" @close="handleClose">
      <view class="popup-content" catchtouchmove="true">
        <view class="cart-header flex row-between">
          <text class="title">{{ cartConfig.cartTitle }}</text>
          <view class="clear-btn flex flex-center" @click="clearCard">
            <u-icon name="trash" color="#999" size="32" style="margin-right: 5rpx" />
            清空
          </view>
        </view>
        <scroll-view :scroll-y="true" class="cart-list-scroll">
          <view class="cart-lists">
            <view :class="['cart-item flex', cartConfig.cartType === '出库' ? 'cart-item-out' : '']" v-for="(item, index) in flatLists" :key="item.id || index">
              <!-- 采购 -->
              <template v-if="cartConfig.cartType === '采购'">
                <view class="goods-info flex-1">
                  <view class="goods-name">{{ item.food_name }}</view>
                  <view class="goods-specs text-ash">
                    {{ item.spec_name }}
                  </view>
                  <view class="goods-source text-ash">
                    {{ item.source }}
                  </view>
                </view>
                <view class="goods-price">
                  <view class="price-txt">￥{{ item.spec_price.toFixed(2) }}</view>
                  <view class="add-or-subtract">
                    <img class="action-icon" src="@/static/icon/img_subtract.png" @click="handleCountChange(item.count - 1, item)" />
                    <view class="count-input">
                      <input class="input_box" type="number" v-model="item.count" @input="handleCountChange($event.target.value, item)" />
                    </view>
                    <img class="action-icon" src="@/static/icon/img_add.png" @click="handleCountChange(item.count + 1, item)" />
                  </view>
                </view>
              </template>

              <!-- 入库 -->
              <template v-if="cartConfig.cartType === '入库'">
                <view class="goods-info flex-1" style="margin-right: 80rpx">
                  <view class="goods-name">{{ item.food_name }}</view>
                  <view class="goods-specs text-ash flex row-between">
                    <view>{{ item.spec_name }}</view>
                    <view v-if="item.cost_price">
                      参考单价：
                      <text class="price-text">￥{{ item.cost_price }}</text>
                    </view>
                  </view>
                  <view class="goods-source text-ash">
                    {{ item.source }}
                  </view>
                  <view v-if="item.in_warehouse_price" class="goods-source flex" style="align-items: center">
                    <view>入库价：</view>
                    <view style="width: 100rpx">
                      <input class="input_box" type="number" v-model="item.in_warehouse_price" />
                    </view>
                  </view>
                </view>
                <view class="goods-price">
                  <view class="add-or-subtract">
                    <img class="action-icon" src="@/static/icon/img_subtract.png" @click="handleCountChange(item.count - 1, item)" />
                    <view class="count-input">
                      <input class="input_box" type="number" v-model="item.count" @input="handleCountChange($event.target.value, item)" />
                    </view>
                    <img class="action-icon" src="@/static/icon/img_add.png" @click="handleCountChange(item.count + 1, item)" />
                  </view>
                </view>
              </template>

              <!-- 出库 -->
              <template v-if="cartConfig.cartType === '出库'">
                <view class="goods-info flex-1" style="margin-right: 80rpx">
                  <view class="goods-name">{{ item.food_name }}</view>
                  <view class="goods-specs text-ash flex row-between">
                    <view>{{ item.spec_name }}</view>
                  </view>
                  <view class="goods-source text-ash">
                    {{ item.source }}
                  </view>
                  <view class="goods-source text-ash">当前库存：{{ item.current_inventory }}</view>
                  <view v-if="item.in_warehouse_price" class="goods-source flex row-between row-center">
                    <view>
                      成本价：
                      <text class="price-text">￥{{ item.cost_price }}</text>
                    </view>
                    <view>
                      合计价：
                      <text class="price-text">￥{{ item.out_warehouse_price }}</text>
                    </view>
                  </view>
                </view>
                <view class="goods-price">
                  <view class="add-or-subtract">
                    <img class="action-icon" src="@/static/icon/img_subtract.png" @click="handleCountChange(item.count - 1, item)" />
                    <view class="count-input">
                      <input class="input_box" type="number" v-model="item.count" @input="handleCountChange($event.target.value, item)" />
                    </view>
                    <img class="action-icon" src="@/static/icon/img_add.png" @click="handleCountChange(item.count + 1, item)" />
                  </view>
                </view>
              </template>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'CartPopup',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    lists: {
      type: Array,
      default: () => []
    },
    cartConfig: {
      type: Object,
      default: () => ({
        cartTitle: '待入库物资',
        cartType: '采购'
      })
    }
  },
  computed: {
    showPop: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    flatLists() {
      return this.lists.reduce((acc, dateItem) => {
        dateItem.stall.forEach((stallItem) => {
          stallItem.food.forEach((foodItem) => {
            acc.push({
              ...foodItem,
              date: dateItem.date,
              stall_id: stallItem.stall_id
            })
          })
        })
        return acc
      }, [])
    }
  },
  options: {
    styleIsolation: 'shared'
  },
  methods: {
    handleClose() {
      this.showPop = false
    },
    clearCard() {
      this.$emit('clear')
    },
    handleCountChange(value, item) {
      const newValue = Number(value)
      if (isNaN(newValue) || newValue < 0) return
      this.$emit('countchange', { value: newValue, food: item, stall_id: item.stall_id })
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-popup {
  .popup-content {
    padding-top: 30rpx;
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));

    .cart-header {
      padding: 0 0 30rpx;
      margin: 0 40rpx;
      border-bottom: 1rpx solid #efefef;

      .title {
        font-size: 32rpx;
        font-weight: bold;
      }

      .clear-btn {
        font-size: 28rpx;
        color: #999;
      }
    }

    .cart-list-scroll {
      max-height: 800rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
    }

    .cart-lists {
      padding-bottom: 40rpx;

      .cart-item {
        align-items: center;
        padding: 40rpx 0 20rpx 0;
        box-sizing: border-box;

        &:last-child {
          border-bottom: none;
        }

        .goods-info {
          .goods-name {
            font-size: 28rpx;
            font-weight: bold;
          }

          .goods-specs,
          .goods-source {
            font-size: 26rpx;
            color: #999;
            margin-top: 10rpx;
          }
        }

        .goods-price {
          font-size: 28rpx;
          color: #ff5757;

          .price-txt {
            text-align: right;
            font-size: 32rpx;
            margin-bottom: 20rpx;
          }

          .add-or-subtract {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }

      .cart-item-out {
        align-items: end;
      }
    }
  }
}

.action-icon {
  width: 48rpx;
  height: 48rpx;
  cursor: pointer;
}

.count-input {
  width: 88rpx;
  height: 48rpx;
  margin: 0 5rpx;
}

.input_box {
  border: 1rpx solid #fe9845;
  text-align: center;
  border-radius: 8rpx;
  color: #fe9845;
}

.price-text {
  color: #ff5757;
}

::v-deep .u-transition {
  z-index: 1 !important;
}
</style>
