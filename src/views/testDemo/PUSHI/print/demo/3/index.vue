<template>
  <div id="print" class="print-container">
    <div class="print-table">
      <div class="print-title">{{ route.query.print_title }}</div>
      <div class="print-controls noprint">
        <el-switch
          v-model="enableMerge"
          active-text="启用合并单元格"
          inactive-text="禁用合并单元格"
          @change="handleMergeChange"
        />
      </div>
      <!-- <ps-table :tableData="tableData" ref="psTableRef" v-loading="tableLoading">
        <ps-column :table-headers="tableSetting" />
      </ps-table> -->
      <table class="print-table-box" style="width: 100%">
        <thead class="print-table-box-head">
          <tr v-for="(item, index) in tableSetting" :key="index" class="print-table-box-head-row">
            <th
              v-for="(itemIn, indexIn) in item"
              :key="indexIn"
              :rowspan="itemIn.rowspan"
              :colspan="itemIn.colspan"
              :align="itemIn.align || 'left'"
              class="print-table-box-head-col"
            >
              <div class="print-table-box-head-item">{{ itemIn.label }}</div>
            </th>
          </tr>
        </thead>
        <tbody class="print-table-box-body">
          <tr
            v-for="(item, index) in tableData"
            :key="index"
            :class="['print-table-box-body-row', index % 2 === 0 ? 'stripe' : '']"
          >
            <template v-for="(itemIn, indexIn) in keyList" :key="indexIn">
              <td
                v-if="
                  enableMerge &&
                  (!tableData[index - 1] ||
                    computedValue(tableData[index], itemIn) !== computedValue(tableData[index - 1], itemIn))
                "
                :key="`merge-${indexIn}`"
                :rowspan="enableMerge ? tableData[index][`${itemIn}_rowspan`] || 1 : 1"
                class="print-table-box-body-col"
                :align="itemIn.align || 'left'"
              >
                <div class="print-table-box-body-item" v-if="printType !== 'MealManagementExport'">
                  <div class="print-table-box-body-item" v-if="printType === 'AuditConfiguration'">
                    <div
                      v-if="
                        itemIn.prop !== 'number' &&
                        itemIn.prop !== 'commit_time' &&
                        itemIn.prop !== 'name' &&
                        itemIn.prop !== 'supplier'
                      "
                    >
                      <div v-if="itemIn.data.question_type === 0">
                        {{ item[itemIn.prop] }}
                      </div>
                      <div v-else-if="itemIn.data.question_type === 1">
                        <div class="flex">
                          <div v-for="(itemIn1, indexIn1) in item[itemIn.prop]" :key="indexIn1">
                            {{ itemIn1 }}{{ ";" }}
                          </div>
                        </div>
                      </div>
                      <div v-else-if="itemIn.data.question_type === 2">{{ item[itemIn.prop].score }}分</div>
                      <div v-else-if="itemIn.data.question_type === 3">
                        <div v-for="(itemIn1, indexIn1) in item[itemIn.prop]" :key="indexIn1">
                          {{ itemIn1.description }}: {{ itemIn1.score }}星
                        </div>
                      </div>
                      <div v-else-if="itemIn.data.question_type === 4">
                        {{ item[itemIn.prop].text }}
                      </div>
                      <div v-else-if="itemIn.data.question_type === 5">
                        <el-button type="text" size="small" class="ps-text">查看</el-button>
                      </div>
                      <div v-else-if="itemIn.data.question_type === 6">
                        <el-button type="text" size="small" class="ps-text">下载</el-button>
                      </div>
                    </div>
                    <div v-else>{{ item[itemIn.prop] || "--" }}</div>
                  </div>
                  <div v-else>
                    {{ computedValue(item, itemIn) }}
                  </div>
                </div>
                <div class="print-table-box-body-item" v-else>
                  <div
                    v-if="
                      itemIn !== 'food_name' &&
                      itemIn !== 'gg_excellent_type_alias' &&
                      itemIn !== 'zl_excellent_type_alias' &&
                      itemIn !== 'quantity_type_alias' &&
                      itemIn !== 'price_type_alias' &&
                      itemIn !== 'food_remark'
                    "
                  >
                    {{ computedValue(item, itemIn) }}
                  </div>
                  <div v-else>
                    <multi-list-component :list="computedValue(item, itemIn)" :data-item="item" />
                  </div>
                </div>
              </td>
              <td
                v-else-if="!enableMerge"
                :key="`no-merge-${indexIn}`"
                class="print-table-box-body-col"
                :align="itemIn.align || 'left'"
              >
                <div class="print-table-box-body-item" v-if="printType !== 'MealManagementExport'">
                  <div
                    v-if="
                      itemIn !== 'food_name' &&
                      itemIn !== 'gg_excellent_type_alias' &&
                      itemIn !== 'zl_excellent_type_alias' &&
                      itemIn !== 'quantity_type_alias' &&
                      itemIn !== 'price_type_alias' &&
                      itemIn !== 'food_remark'
                    "
                  >
                    {{ computedValue(item, itemIn) }}
                  </div>
                  <div v-else>
                    <multi-list-component :list="computedValue(item, itemIn)" :data-item="item" />
                  </div>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
        <tbody />
      </table>
      <div v-if="isShowCollect" class="flex m-t-20px">
        <div
          v-for="(collectItem, collectIndex) in collectList"
          :key="collectIndex"
          :class="['flex', collectIndex > 0 ? 'm-l-10px' : '']"
        >
          <div>{{ collectItem.label }}</div>
          <div>{{ collectItem.value }}</div>
          <div v-if="collectItem.unit">{{ collectItem.unit }}</div>
        </div>
      </div>
    </div>
    <div class="print-btn noprint">
      <el-button type="primary" size="large" :icon="Printer" circle @click="toPrint" class="right-btn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { Printer } from "@element-plus/icons-vue"
import { getLocalStorage } from "@/utils/storage"
import { cloneDeep } from "lodash"
import { ElMessage } from "element-plus"
import printApi from "@/api/index"
import useFormatDataHook from "./useFormatData.hook"
import MultiListComponent from "./components/MultiListComponent.vue"
const route = useRoute()

const tableData = ref<any>([])
const tableSetting = ref<any>()
const enableMerge = ref<boolean>(true) // 合并单元格开关
// const tableLoading = ref(false)

const rowCount = ref(0)
const keyList = ref<any>([])
const printType = ref(route.query.print_type)
const isShowCollect = ref<boolean>(false)
const collectList = ref<Array<any>>()
// 获取最大深度
const getMaxDepth = (tree: any) => {
  if (!Array.isArray(tree) || tree.length === 0) return 0

  const queue = [...tree]
  let depth = 0

  while (queue.length > 0) {
    const levelSize = queue.length
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      if (node.children && node.children.length > 0) {
        queue.push(...node.children)
      }
    }
    depth++
  }

  return depth
}
// 获取叶子节点数量
const countLeafNodes = (tree: any) => {
  if (!Array.isArray(tree) || tree.length === 0) return 0

  const queue = [...tree]
  let leafCount = 0
  console.log("queue", queue)

  while (queue.length > 0) {
    const node = queue.shift()
    if (node.children && node.children.length > 0) {
      // 将子节点加入队列
      queue.push(...node.children)
    } else {
      // 如果没有子节点，则是叶子节点
      console.log("leafCount", leafCount)

      leafCount++
    }
  }

  return leafCount
}
const setChildren = (arr: any, fatherLevel: number) => {
  arr.forEach((item: any) => {
    // 无论有没有都要加的
    item.level = fatherLevel + 1
    if (!item.children) {
      item.rowspan = rowCount.value - item.level
      item.colspan = 1
      item.children = []
    } else if (item.children.length) {
      item.rowspan = 1
      item.colspan = countLeafNodes(item.children)
      setChildren(item.children, item.level)
    }
  })
}
const setArr = (arr: any, bigArr: any) => {
  // debugger
  if (arr.length) {
    const newArr: any = []
    arr.forEach((item: any) => {
      newArr.push(item)
      if (item.children && item.children.length) {
        // 要判断大数组是否有该层数组，如果有，则在原数组里push，否则新增
        if (bigArr.length > item.level) {
          item.children.forEach((child: any) => {
            bigArr[item.level].push(child)
          })
        } else {
          setArr(item.children, bigArr)
        }
      }
    })
    bigArr.push(newArr)
  }
}
// 获取叶子节点的key
const getLeftKey = (tree: any) => {
  let leftKeyArr: string[] = []

  const dfs = (node: any) => {
    if (!node.children || node.children.length === 0) {
      // 如果没有子节点，则是叶子节点
      if (printType.value !== "AuditConfiguration") {
        leftKeyArr.push(node.prop)
      } else {
        leftKeyArr.push(node)
      }
    } else {
      // 递归处理子节点
      node.children.forEach((child: any) => {
        dfs(child)
      })
    }
  }

  if (Array.isArray(tree)) {
    tree.forEach((node: any) => {
      dfs(node)
    })
  }

  return leftKeyArr
}
/*
  换个思路，现在需要将tree转成数组，数组内包着每一层的list
*/
const setTableSetting = () => {
  const tableSettingResult = getLocalStorage("print_setting") || []
  console.log("tableSettingResult", tableSettingResult)

  if (tableSettingResult) {
    tableSetting.value = tableSettingResult
  }
  // 获取叶子节点的key值
  keyList.value = getLeftKey(tableSetting.value)
  // 先确认有几行
  rowCount.value = getMaxDepth(tableSetting.value)
  console.log("rowCount.value", rowCount.value)
  // 遍历处理
  tableSetting.value = tableSetting.value.map((item: any) => {
    // 无论有没有都要加的
    item.level = 0
    if (!item.children) {
      item.rowspan = rowCount.value
      item.colspan = 1
      // 如果不存在children，则插入children
      item.children = []
    } else if (item.children.length) {
      // 因为有子节点所以不用向下合并
      item.rowspan = 1
      // 查询当前节点的叶子节点个数
      item.colspan = countLeafNodes(item.children)
      setChildren(item.children, item.level)
    }
    return item
  })
  console.log("tableSetting.value", tableSetting.value, keyList.value)
  // 外层大数组
  let newSetting: any = []
  setArr(tableSetting.value, newSetting)
  console.log("newSetting", newSetting)
  tableSetting.value = cloneDeep(newSetting.reverse())
  console.log("tableSetting.value", tableSetting.value)
}

// 计算表格宽度
const computedWidth = ref<string>("")

watch(
  () => tableSetting.value,
  (newVal) => {
    let width = 1123 // a4纸转像素有一套贼哈拉复杂的公式，要先mm转inch再转px，其中转px还要看DPI，这里用的DPI是96，目前都合适
    let colCount = countLeafNodes(newVal[0])
    // console.log("colCount", colCount)
    computedWidth.value = `${width / colCount}px`
  }
)

const computedValue = (data: any, key: string) => {
  if (printType.value) {
    const useFormatData = useFormatDataHook(route.query.params)
    return useFormatData.formatDataByType(printType, data, key)
  }
  return data[key]
}

const toPrint = () => {
  window.print()
}
// 获取数据
const getLocalData = () => {
  // 获取API
  const query = route.query || {}
  if (query) {
    const params = JSON.parse(query.params as string)
    const api: keyof typeof printApi | undefined = query.api as keyof typeof printApi | undefined
    console.log("api", api)
    if (!api || !(api in printApi)) {
      ElMessage.error("无效的 API 请求")
      return
    }

    printApi[api](params)
      .then((res: any) => {
        console.log("res", res)
        if (res && res.code === 0) {
          const data = res.data || {}
          const result = data.results || []
          if (result && result.length > 0) {
            if (printType.value !== "AuditConfiguration") {
              tableData.value = result
            } else {
              tableData.value = result.filter((item: any, index: number) => index >= 1)
            }
            // 在获取数据后调用
            keyList.value.forEach((key: string) => {
              countLeafNodesAndSetRowspan(tableSetting.value, tableData.value, key)
            })
          }
          console.log("tableData", tableData.value)
        } else {
          ElMessage.error(res.msg)
        }
      })
      .catch((err: any) => {
        console.log("err", err)
      })
  }
}

// 合并单元格
const countLeafNodesAndSetRowspan = (tree: any, data: any[], key: string) => {
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
}

// 设置汇总数据
const setCollect = () => {
  isShowCollect.value = route.query.isShowCollect === "1"
  console.log("isShowCollect", isShowCollect)

  if (isShowCollect.value) {
    collectList.value = getLocalStorage("collect" + printType.value) || []
    console.log("collectList", collectList.value)
  }
}

// 处理合并单元格开关变化的逻辑
const handleMergeChange = () => {
  console.log("enableMerge changed to:", enableMerge.value)
  getLocalData()
}

onMounted(() => {
  setTableSetting()
  setCollect()
  getLocalData()
})
</script>
<style lang="scss">
// .print-container {
//   position: relative;
// }

.print-table {
  padding: 0px 10px;

  .print-title {
    font-size: 26px;
    text-align: center;
    font-weight: bold;
    margin: 20px 0px;
  }

  &-box {
    width: 100%;
    // border: 1px solid red;
    color: #606266;
    background-color: #fff;
    border-collapse: collapse;
    border-top: 1px solid #4a4a4a;
    border-left: 1px solid #4a4a4a;
    &-head {
      &-col {
        background-color: #f5f7fa;
        border-right: 1px solid #4a4a4a;
        border-bottom: 1px solid #4a4a4a;
        width: v-bind(computedWidth);
        max-width: 200px;
        padding: 10px 10px;
      }

      &-item {
        // width: v-bind(computedWidth);
        // max-width: 200px;
        // padding: 10px 10px;
      }
    }

    &-body {
      &-col {
        border-right: 1px solid #4a4a4a;
        border-bottom: 1px solid #4a4a4a;
        width: v-bind(computedWidth);
        max-width: 200px;
        padding: 10px 10px;
      }

      &-item {
        // width: v-bind(computedWidth);
        // max-width: 200px;
        // padding: 10px 10px;
      }

      .stripe {
        background-color: #fafafa;
      }
    }
  }
}

.print-btn {
  width: 100%;
  // position: sticky;
  z-index: 99;
  bottom: 20px;

  .right-btn {
    position: absolute;
    right: 20px;
    bottom: 0;
  }
}

.print-controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

@media print {
  html {
    // font-size: 1920px !important;
    margin: 0px;
    height: auto;
  }

  body {
    // font-size: 1920px !important;
    // outline: 1px solid blue;
    width: auto;
    margin: 5mm 0mm;
    height: auto;
  }

  @page {
    size: A4 landscape;
    margin: 0;
    padding: 0;
  }

  .noprint {
    display: none;
  }

  #print {
    // outline: 1px solid yellow;
    .print-table {
      padding: 0px 50px;
      .print-title {
        font-size: 26px;
        text-align: center;
        font-weight: bold;
        margin-bottom: 20px;
      }

      &-box {
        color: #606266;
        background-color: #fff;
        border-collapse: collapse;
        border-top: 1px solid #4a4a4a;
        border-left: 1px solid #4a4a4a;
        page-break-inside: auto;

        &-head {
          &-row {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          &-col {
            background-color: #f5f7fa;
            border-right: 1px solid #4a4a4a;
            border-bottom: 1px solid #4a4a4a;
            width: v-bind(computedWidth);
            max-width: 200px;
            padding: 10px 10px;
          }

          &-item {
            width: v-bind(computedWidth);
            max-width: 200px;
            padding: 10px 10px;
          }
        }

        &-body {
          &-row {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          &-col {
            border-right: 1px solid #4a4a4a;
            border-bottom: 1px solid #4a4a4a;
            width: v-bind(computedWidth);
            max-width: 200px;
            padding: 10px 10px;
          }

          &-item {
            width: v-bind(computedWidth);
            max-width: 200px;
            padding: 10px 10px;
          }

          .stripe {
            background-color: #fafafa;
          }
        }
      }
    }
  }
}
</style>
