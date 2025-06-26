<template>
  <div>
    <div v-if="getIsShowCurrentPage && showPageNumber" class="footer-current-page">第{{ currentPage }}页，共{{ totalPages }}页</div>

    <!-- 合并单元格 -->
    <el-switch v-model="enableMerge" active-text="启用合并单元格" inactive-text="禁用合并单元格" @change="handleMergeChange" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 底部当前页码
      currentPage: 1, // 当前页
      pageHeight: 0, // 一页高度
      totalPages: 1, // 总页数
      showPageNumber: true, // 控制页码显示状态
      maxScrollY: 0 // 页面的最大滚动距离
    }
  },
  computed: {
    getIsShowCurrentPage() {
      return this.$route.query.show_current_page
    }
  },
  mounted() {
    // 添加表格滚动监听
    this.$nextTick(() => {
      if (this.getIsShowCurrentPage) {
        this.initTableScrollListener()
      }
    })
  },
  beforeDestroy() {
    if (this.getIsShowCurrentPage) {
      this.removeTableScrollListener()
    }
  },
  methods: {
    // ---------- 合并单元格 start
    countLeafNodesAndSetRowspan(tree, data, key) {
      if (!Array.isArray(tree) || tree.length === 0) return 0
      const queue = [...tree]
      let leafCount = 0
      while (queue.length > 0) {
        const node = queue.shift()
        if (node.children && node.children.length > 0) {
          queue.push(...node.children)
        } else {
          leafCount++
        }
      }

      // 如果禁用合并，则直接返回叶子节点数量
      if (!enableMerge.value) {
        return leafCount
      }

      for (let i = 0; i < data.length; ) {
        const value = computedValue(data[i], key)
        let nextRow = i + 1
        // 判断当前项与下一项是否相同
        while (nextRow < data.length && value === computedValue(data[nextRow], key)) {
          nextRow++
        }
        // 设置rowspan
        data[i][`${key}_rowspan`] = nextRow - i
        // 更新当前行索引
        i = nextRow
      }
      return leafCount
    },
    // ---------- 合并单元格 end

    // 移除表格滚动监听器
    removeTableScrollListener() {
      // 移除窗口滚动监听
      window.removeEventListener('scroll', this.handleWindowScroll)
      // 移除窗口大小改变监听
      window.removeEventListener('resize', this.calculatePageLayout)
    },
    // 页面布局计算
    calculatePageLayout() {
      this.$nextTick(() => {
        const tableRef = this.$refs.myTableRef
        if (!tableRef || !tableRef.$el) return

        // 1、计算表格可视化高度
        // 有页头和页尾的
        if (this.showPrintHeaderAndFooter) {
          const header = document.querySelector('.page-header')
          const footer = document.querySelector('.page-footer')
          const headerHeight = header ? header.offsetHeight : 0
          const footerHeight = footer ? footer.offsetHeight : 0
          this.pageHeight = window.innerHeight - headerHeight - footerHeight
        } else {
          // 如果没有页头页脚，则整个表格可视区域为一页
          const tableBodyWrapper = tableRef.$el.querySelector('.el-table__body-wrapper')
          if (tableBodyWrapper) {
            this.pageHeight = tableBodyWrapper.clientHeight
          }
        }

        // 2. 基于总高度精确计算总页数
        if (this.pageHeight > 0 && tableRef.$el.scrollHeight > 0) {
          this.totalPages = Math.ceil(tableRef.$el.scrollHeight / this.pageHeight)
        } else {
          this.totalPages = 1
        }

        // 3. 计算最大滚动距离 (延迟以确保 DOM 更新)
        this.$nextTick(() => {
          this.maxScrollY = document.documentElement.scrollHeight - window.innerHeight
          // 初始化当前页
          this.handleWindowScroll()
        })
      })
    },
    // 处理窗口滚动
    handleWindowScroll() {
      if (this.maxScrollY <= 0) {
        this.currentPage = 1
        return
      }
      const scrollY = window.scrollY
      let currentPage
      if (scrollY === 0) {
        currentPage = 1
      } else {
        // 基于滚动条的相对位置计算当前页
        const scrollPercent = scrollY / this.maxScrollY
        currentPage = Math.ceil(scrollPercent * this.totalPages)
      }
      // 确保当前页不会超过总页数 (作为安全保护)
      currentPage = Math.min(currentPage, this.totalPages)
      if (this.currentPage !== currentPage) {
        this.currentPage = currentPage
      }
    },
    // 初始化表格滚动监听
    initTableScrollListener() {
      this.$nextTick(() => {
        // 给 window 添加滚动监听
        window.addEventListener('scroll', this.handleWindowScroll)
        // 添加窗口大小改变监听
        window.addEventListener('resize', this.calculatePageLayout)
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
