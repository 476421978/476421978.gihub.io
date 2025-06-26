/**
 * 搜索信息管理混入
 * 提供搜索信息的保存和恢复功能
 *
 * 使用方式：
 * 1. 对于路由组件：使用activated/deactivated生命周期
 * 2. 对于子组件（v-show）：使用watch监听父组件状态 + beforeDestroy保存
 * 3. 在搜索时主动保存：在searchHandle中调用_save_searchInfo
 *
 * 当前实现：
 * 监听父组件tabType变化恢复，在搜索和销毁时保存
 * - HengReport
 * - ShuReport
 * - AreaFood
 * - Consume
 */
export default {
  methods: {
    /**
     * 保存当前页面的搜索信息到vuex
     * @param {string} pageType - 页面类型标识
     */
    _save_searchInfo(pageType) {
      if (this.formatQueryParams && this.searchFormSetting) {
        const searchData = this.formatQueryParams(this.searchFormSetting)
        this.$store.dispatch('searchInfo/saveSearchInfo', {
          pageType,
          searchData
        })
      }
    },

    /**
     * 从vuex恢复搜索信息
     */
    _restore_searchInfo(pageType) {
      const savedSearchInfo = this.$store.getters['searchInfo/getSearchInfo'](pageType)
      if (savedSearchInfo && Object.keys(savedSearchInfo).length > 0) {
        this._fill_searchForm(savedSearchInfo)
      }
    },

    /**
     * 回填搜索表单
     * @param {Object} searchData - 搜索数据
     */
    _fill_searchForm(searchData) {
      if (!this.searchFormSetting) return

      // 处理日期范围
      if (searchData.reservation_date_start && searchData.reservation_date_end) {
        if (this.searchFormSetting.select_date) {
          this.searchFormSetting.select_date.value = [
            searchData.reservation_date_start,
            searchData.reservation_date_end
          ]
        }
      }

      // 处理其他字段
      Object.keys(searchData).forEach(key => {
        if (key !== 'reservation_date_start' && key !== 'reservation_date_end') {
          if (this.searchFormSetting[key]) {
            this.searchFormSetting[key].value = searchData[key]
          }
        }
      })
    },

    /**
     * 清除指定页面的搜索信息
     * @param {string} pageType - 页面类型标识
     */
    _clear_searchInfo(pageType) {
      this.$store.dispatch('searchInfo/clearSearchInfo', pageType)
    },

    /**
     * 保存当前tab类型到vuex
     * @param {string} tabType - tab类型
     */
    _save_tab_type(tabType) {
      this.$store.dispatch('searchInfo/saveTabType', tabType)
    },

    /**
     * 从vuex恢复tab类型
     * @returns {string} 保存的tab类型
     */
    _restore_tab_type() {
      return this.$store.getters['searchInfo/getCurrentTabType']
    }
  }
}
