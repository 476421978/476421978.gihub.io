<template>
  <text :style="{ color, 'font-weight': weight, 'font-size': size + 'rpx' }" :class="(lineThrough ? 'line-through' : '') + ' price-format'">
    <text v-if="showSubscript" :style="{ 'font-size': subscriptSize + 'rpx', 'margin-right': '2rpx' }"> ¥ </text>
    <text>{{ newPrice }}</text>
  </text>
</template>

<script>
export default {
  name: 'PriceFormat',
  data() {
    return {
      newPrice: 0,
      subscriptSize: ''
    }
  },
  components: {},
  props: {
    size: {
      type: [String, Number],
      default: 28
    },
    color: {
      type: String
    },
    weight: {
      type: [String, Number],
      default: 400
    },
    price: {
      type: [String, Number],
      default: ''
    },
    showSubscript: {
      type: Boolean,
      default: true
    },
    lineThrough: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.priceFormat()
  },
  watch: {
    price(val) {
      this.priceFormat()
    }
  },
  methods: {
    priceFormat() {
      let { price } = this
      if (price !== null && price !== '' && price !== undefined) {
        price = Number(price) / 100
        price = price.toFixed(2)
        this.newPrice = price
      } else {
        this.newPrice = 0
      }
    }
  }
}
</script>
<style></style>
