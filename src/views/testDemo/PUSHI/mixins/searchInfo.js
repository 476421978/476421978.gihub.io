const state = {
  // 存储各个页面的搜索信息
  searchInfo: {
    heng: {}, // 配送汇总表-横表
    shu: {}, // 配送汇总表-竖表
    areaFood: {}, // 区域配餐表
    consume: {} // 消费点配餐
  },
  // 存储当前选中的tab类型
  currentTabType: 'heng'
}

const mutations = {
  // 保存搜索信息
  SAVE_SEARCH_INFO(state, { pageType, searchData }) {
    state.searchInfo[pageType] = { ...searchData }
  },

  // 清除搜索信息
  CLEAR_SEARCH_INFO(state, pageType) {
    if (pageType) {
      state.searchInfo[pageType] = {}
    } else {
      state.searchInfo = {
        heng: {},
        shu: {},
        areaFood: {},
        consume: {}
      }
      state.currentTabType = 'heng'
    }
  },

  // 保存当前tab类型
  SAVE_TAB_TYPE(state, tabType) {
    state.currentTabType = tabType
  }
}

const actions = {
  // 保存搜索信息
  saveSearchInfo({ commit }, { pageType, searchData }) {
    commit('SAVE_SEARCH_INFO', { pageType, searchData })
  },

  // 清除搜索信息
  clearSearchInfo({ commit }, pageType) {
    commit('CLEAR_SEARCH_INFO', pageType)
  },

  // 保存当前tab类型
  saveTabType({ commit }, tabType) {
    commit('SAVE_TAB_TYPE', tabType)
  }
}

const getters = {
  // 获取指定页面的搜索信息
  getSearchInfo: (state) => (pageType) => {
    return state.searchInfo[pageType] || {}
  },

  // 获取所有搜索信息
  getAllSearchInfo: (state) => {
    return state.searchInfo
  },

  // 获取当前tab类型
  getCurrentTabType: (state) => {
    return state.currentTabType
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
