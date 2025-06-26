<!-- 树形层级选择器-->
<!-- 1、支持单选、多选 -->
<template>
  <view>
    <view class="tree-cover" :class="{ show: showDialog }" @tap="handleCoverTap" />
    <view class="tree-dialog" :class="{ show: showDialog }">
      <view class="tree-bar">
        <view class="tree-bar-cancel" :style="{ color: cancelColor }" hover-class="hover-c" @tap="_cancel"> 取消 </view>
        <view class="tree-bar-title" :style="{ color: titleColor }">{{ title }}</view>
        <view class="tree-bar-confirm" :style="{ color: confirmColor }" hover-class="hover-c" @tap="_confirm">
          {{ multiple ? '确定' : '' }}
        </view>
      </view>
      <view class="tree-view">
        <scroll-view class="tree-list" :scroll-y="true">
          <block v-for="(item, index) in treeList" :key="index">
            <view
              class="tree-item"
              :style="[
                {
                  paddingLeft: item.level * 30 + 'rpx'
                }
              ]"
              :class="{
                itemBorder: border === true,
                show: item.isShow
              }"
            >
              <view class="item-label">
                <view class="item-icon uni-inline-item" @tap.stop="_onItemSwitch(item, index)">
                  <view v-if="!item.isLastLevel && item.isShowChild" class="switch-on" :style="{ 'border-left-color': switchColor }"></view>
                  <view v-else-if="!item.isLastLevel && !item.isShowChild" class="switch-off" :style="{ 'border-top-color': switchColor }"></view>
                  <!-- <view
                    v-else
                    class="item-last-dot"
                    :style="{ 'border-top-color': switchColor }"
                  ></view> -->
                </view>
                <view class="uni-flex-item uni-inline-item" @tap.stop="_onItemSelect(item, index)">
                  <view :class="['item-name', item.checkStatus == 2 ? 'active' : '']">
                    {{ item.name + (item.childCount ? '(' + item.childCount + ')' : '') }}
                  </view>
                  <view class="item-check" v-if="selectParent ? true : item.isLastLevel">
                    <view class="item-check-yes" v-if="item.checkStatus == 1" :class="{ radio: !multiple }" :style="{ 'border-color': confirmColor }">
                      <view class="item-check-yes-part" :style="{ 'background-color': confirmColor }"></view>
                    </view>
                    <view class="item-check-yes" v-else-if="item.checkStatus == 2" :class="{ radio: !multiple }" :style="{ 'border-color': confirmColor }">
                      <view class="item-check-yes-all" :style="{ 'background-color': confirmColor }"></view>
                    </view>
                    <view class="item-check-no" v-else :class="{ radio: !multiple }" :style="{ 'border-color': confirmColor }"></view>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  emits: ['select-change'],
  name: 'Tree-Nodes',
  props: {
    valueKey: {
      type: String,
      default: 'id'
    },
    textKey: {
      type: String,
      default: 'name'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    // 初始数组
    localdata: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 在已经格式化好的数据
    localTreeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 初始化选中
    selectedData: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 点击遮罩关闭
    isMaskClick: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    multiple: {
      // 是否可以多选
      type: Boolean,
      default: true
    },
    selectParent: {
      // 是否可以选父级
      type: Boolean,
      default: true
    },
    confirmColor: {
      // 确定按钮颜色
      type: String,
      default: '' // #FD953C
    },
    cancelColor: {
      // 取消按钮颜色
      type: String,
      default: '#909193' // #757575
    },
    titleColor: {
      // 标题颜色
      type: String,
      default: ''
    },
    switchColor: {
      // 节点切换图标颜色
      type: String,
      default: '' // #666
    },
    border: {
      // 是否有分割线
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      treeList: []
    }
  },
  computed: {},
  methods: {
    _show() {
      this.showDialog = true
    },
    _hide() {
      this.showDialog = false
    },
    _cancel() {
      this._hide()
      this.$emit('cancel', '')
    },
    // 添加新的方法来处理遮罩点击事件
    handleCoverTap() {
      if (this.isMaskClick) {
        this._cancel()
      }
    },
    _confirm() {
      // 多选
      let selectedList = [] // 如果子集全部选中，只返回父级 id
      let selectedNames
      let currentLevel = -1
      this.treeList.forEach((item, index) => {
        if (currentLevel >= 0 && item.level > currentLevel) {
          // 空块已移除
        } else {
          if (item.checkStatus === 2) {
            currentLevel = item.level
            selectedList.push(item.id)
            selectedNames = selectedNames ? selectedNames + ' / ' + item.name : item.name
          } else {
            currentLevel = -1
          }
        }
      })
      // console.log('_confirm', selectedList);
      this._hide()
      this.$emit('select-change', selectedList, selectedNames)
    },
    // 格式化原数据（原数据为tree结构） 小程序不支持递归组件显示
    _formatTreeData(list = [], level = 0, parentItem = null) {
      let flatList = []
      list.forEach((item) => {
        let isLastLevel = true
        if (item && item[this.childrenKey]) {
          let children = item[this.childrenKey]
          if (Array.isArray(children) && children.length > 0) {
            isLastLevel = false
          }
        }

        let itemT = {
          id: item[this.valueKey],
          name: item[this.textKey],
          level,
          isLastLevel,
          isShow: false, // 初始设置为 false
          isShowChild: false, // 初始设置为 false
          checkStatus: 0, // 初始选中状态为 0
          orCheckStatus: 0,
          parentId: parentItem ? parentItem.id : -1,
          // children: item[this.childrenKey], // 不在扁平化数据中保留 children 属性，避免 JSON 转换问题
          childCount: item[this.childrenKey] ? item[this.childrenKey].length : 0,
          childCheckCount: 0,
          childCheckPCount: 0
        }

        flatList.push(itemT)

        // 递归处理子节点
        if (!isLastLevel) {
          flatList = flatList.concat(this._formatTreeData(item[this.childrenKey], level + 1, itemT))
        }
      })
      return flatList
    },
    // 节点打开、关闭切换
    _onItemSwitch(item, index) {
      // console.log(item)
      // console.log('_itemSwitch')
      if (item.isLastLevel === true) {
        return
      }
      item.isShowChild = !item.isShowChild
      // 切换子节点的显示状态
      this._onItemChildSwitch(item, index)
    },
    _onItemChildSwitch(item, index) {
      // console.log('_onItemChildSwitch')
      const firstChildIndex = index + 1
      if (firstChildIndex > 0) {
        for (var i = firstChildIndex; i < this.treeList.length; i++) {
          let itemChild = this.treeList[i]
          if (itemChild.level > item.level) {
            // 检查当前子节点是否是点击项的直接子节点
            if (itemChild.parentId === item.id) {
              // 如果是直接子节点，根据父节点的 isShowChild 状态设置其 isShow
              itemChild.isShow = item.isShowChild
              // 如果父节点折叠，所有后代都应该折叠
              if (!item.isShowChild) {
                itemChild.isShowChild = false
              }
            } else if (itemChild.level > item.level) {
              // 如果是更深层级的后代节点，只有当其直接父节点可见且展开时，它才应该可见
              let parent = this.treeList.find((node) => node.id === itemChild.parentId)
              if (parent && parent.isShow && parent.isShowChild) {
                itemChild.isShow = true // 后代节点可见
              } else {
                itemChild.isShow = false // 后代节点隐藏
                itemChild.isShowChild = false // 后代节点的展开状态也重置
              }
            }
          } else {
            return // 已经遍历到当前父节点同级或更高级的节点，停止循环
          }
        }
      }
    },
    // 节点选中、取消选中
    _onItemSelect(item, index) {
      // console.log('_onItemSelect')
      // console.log(item)
      if (!this.multiple) {
        // 单选
        item.checkStatus = item.checkStatus === 0 ? 2 : 0

        this.treeList.forEach((v, i) => {
          if (i !== index) {
            this.treeList[i].checkStatus = 0
          } else {
            this.treeList[i].checkStatus = 2
          }
        })

        let selectedList = []
        let selectedNames
        selectedList.push(item.id)
        selectedNames = item.name
        this._hide()
        this.$emit('select-change', selectedList, selectedNames)
        return
      }

      let oldCheckStatus = item.checkStatus
      switch (oldCheckStatus) {
        case 0:
          item.checkStatus = 2
          item.childCheckCount = item.childCount
          item.childCheckPCount = 0
          break
        case 1:
        case 2:
          item.checkStatus = 0
          item.childCheckCount = 0
          item.childCheckPCount = 0
          break
        default:
          break
      }
      // 子节点 全部选中
      this._onItemChildSelect(item, index)
      // 父节点 选中状态变化
      this._onItemParentSelect(item, index, oldCheckStatus)
    },
    _onItemChildSelect(item, index) {
      // console.log('_onItemChildSelect')
      if (item.childCount && item.childCount > 0) {
        index++
        while (index < this.treeList.length && this.treeList[index].level > item.level) {
          let itemChild = this.treeList[index]
          itemChild.checkStatus = item.checkStatus
          if (itemChild.checkStatus === 2) {
            itemChild.childCheckCount = itemChild.childCount
            itemChild.childCheckPCount = 0
          } else if (itemChild.checkStatus === 0) {
            itemChild.childCheckCount = 0
            itemChild.childCheckPCount = 0
          }
          index++
        }
      }
    },
    _onItemParentSelect(item, index, oldCheckStatus) {
      // console.log('_onItemParentSelect')
      // console.log(item)
      const parentIndex = this.treeList.findIndex((itemP) => String(itemP.id) === String(item.parentId))
      // console.log('parentIndex：' + parentIndex)
      if (parentIndex >= 0) {
        let itemParent = this.treeList[parentIndex]
        let oldCheckStatusParent = itemParent.checkStatus

        if (oldCheckStatus === 1) {
          itemParent.childCheckPCount -= 1
        } else if (oldCheckStatus === 2) {
          itemParent.childCheckCount -= 1
        }
        if (item.checkStatus === 1) {
          itemParent.childCheckPCount += 1
        } else if (item.checkStatus === 2) {
          itemParent.childCheckCount += 1
        }

        if (itemParent.childCheckCount <= 0 && itemParent.childCheckPCount <= 0) {
          itemParent.childCheckCount = 0
          itemParent.childCheckPCount = 0
          itemParent.checkStatus = 0
        } else if (itemParent.childCheckCount >= itemParent.childCount) {
          itemParent.childCheckCount = itemParent.childCount
          itemParent.childCheckPCount = 0
          itemParent.checkStatus = 2
        } else {
          itemParent.checkStatus = 1
        }
        // console.log('itemParent：', itemParent)
        this._onItemParentSelect(itemParent, parentIndex, oldCheckStatusParent)
      }
    },
    // 重置数据
    _reTreeList() {
      this.treeList.forEach((v, i) => {
        this.treeList[i].checkStatus = v.orCheckStatus
      })
    },
    // 添加新方法：根据选中节点展开父级路径
    _expandSelectedPath(itemId) {
      let item = this.treeList.find((node) => node.id === itemId)
      if (item) {
        item.isShow = true // 确保当前节点可见
        if (item.parentId !== -1) {
          // 如果不是根节点
          let parentItem = this.treeList.find((node) => node.id === item.parentId)
          if (parentItem) {
            parentItem.isShowChild = true // 展开父节点
            parentItem.isShow = true // 确保父节点可见
            this._expandSelectedPath(parentItem.id) // 递归向上展开
          }
        }
      }
    },
    _initTree() {
      // 1. 扁平化数据
      this.treeList = this._formatTreeData(this.localdata)

      // 2. 根据 selectedData 设置选中状态
      if (this.selectedData && this.selectedData.length > 0) {
        this.treeList.forEach((item) => {
          if (this.selectedData.includes(item.id)) {
            item.checkStatus = 2
            item.orCheckStatus = 2
            // 这里可能需要根据多选/单选调整 childCheckCount 和 childCheckPCount
            // 考虑到单选，这里简单设为 2
            if (!this.multiple) {
              // 单选情况下，只设置当前节点选中，并清空其他节点的选中状态
              this.treeList.forEach((v) => {
                if (String(v.id) !== String(item.id)) {
                  // 确保ID类型一致
                  v.checkStatus = 0
                  v.orCheckStatus = 0
                  v.childCheckCount = 0
                  v.childCheckPCount = 0
                }
              })
            } else {
              // 多选情况下，调用 _onItemParentSelect 更新父级选中状态
              this._onItemParentSelect(
                item,
                this.treeList.findIndex((v) => v.id === item.id),
                0
              ) // 假设旧状态是 0
            }
          } else {
            item.checkStatus = 0
            item.orCheckStatus = 0
          }
        })
      }

      // 3. 根据 selectedData 展开被选中的节点路径
      if (this.selectedData && this.selectedData.length > 0) {
        this.selectedData.forEach((selectedId) => {
          this._expandSelectedPath(selectedId)
        })
      }

      // 4. 确保所有可见父节点下的直接子节点设置为 isShow = true
      this.treeList.forEach((parentItem) => {
        // 如果父节点被展开 (通过选中路径展开或手动展开)
        if (parentItem.isShowChild) {
          // 找到所有直接子节点并设置 isShow 为 true
          this.treeList.forEach((childItem) => {
            if (childItem.parentId === parentItem.id) {
              childItem.isShow = true
            }
          })
        }
      })

      // 初始加载时，确保第一级节点可见 (此步骤依然保留，确保顶层节点显示)
      this.treeList.forEach((item) => {
        if (item.level === 0) {
          item.isShow = true
        }
      })
    }
  },
  watch: {
    localdata() {
      this._initTree()
    },
    localTreeList() {
      this.treeList = this.localTreeList
    }
  },
  mounted() {
    this._initTree()
  }
}
</script>

<style scoped lang="scss">
.uni-flex-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-cover {
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: all 0.3s ease;
  visibility: hidden;
}

.tree-cover.show {
  visibility: visible;
  opacity: 1;
}

.tree-dialog {
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  z-index: 102;
  top: 20%;
  transition: all 0.3s ease;
  transform: translateY(100%);
}

.tree-dialog.show {
  transform: translateY(0);
}

.tree-bar {
  /* background-color: #fff; */
  height: 90rpx;
  padding-left: 25rpx;
  padding-right: 25rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom-width: 1rpx !important;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;
  font-size: 32rpx;
  color: #757575;
  line-height: 1;
}

.tree-bar-confirm {
  color: #fd953c;
  padding: 15rpx;
}

.tree-bar-title {
  // width: 100%;
  // text-align: center;
}

.tree-bar-cancel {
  color: #757575;
  padding: 15rpx;
  // position: absolute;
  // left: 20rpx;
}

.tree-view {
  flex: 1;
  padding: 20rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.tree-list {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.tree-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  height: 0;
  opacity: 0;
  transition: 0.2s;
  overflow: hidden;
}

.tree-item.show {
  height: 90rpx;
  opacity: 1;
}

.tree-item.showchild:before {
  transform: rotate(90deg);
}

.tree-item.last:before {
  opacity: 0;
}

.switch-on {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 15rpx solid #666;
}

.switch-off {
  width: 0;
  height: 0;
  border-bottom: 10rpx solid transparent;
  border-top: 10rpx solid transparent;
  border-left: 15rpx solid #666;
}

.item-last-dot {
  position: absolute;
  width: 10rpx;
  height: 10rpx;
  border-radius: 100%;
  background: #666;
}

.item-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 8rpx;
  padding-right: 20rpx;
  padding-left: 20rpx;
}

.item-label {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1.2;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 450rpx;
  &.active {
    color: #fd953c;
  }
}

.item-check {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-check-yes,
.item-check-no {
  width: 20px;
  height: 20px;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  border-top-width: 1rpx;
  border-left-width: 1rpx;
  border-bottom-width: 1rpx;
  border-right-width: 1rpx;
  border-style: solid;
  border-color: #fd953c;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  border: none;
}

.item-check-yes-part {
  width: 12px;
  height: 12px;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  background-color: #fd953c;
}

.item-check-yes-all {
  margin-bottom: 5px;
  border: 2px solid #fd953c;
  border-left: 0;
  border-top: 0;
  height: 12px;
  width: 6px;
  transform-origin: center;
  /* #ifndef APP-NVUE */
  transition: all 0.3s;
  /* #endif */
  transform: rotate(45deg);
}

.item-check .radio {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.item-check .radio .item-check-yes-b {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.hover-c {
  opacity: 0.6;
}

.itemBorder {
  border-bottom: 1px solid #e5e5e5;
}
</style>
