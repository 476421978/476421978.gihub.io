<template>
  <div id="print" v-loading="isLoading">
    <!-- <div class="print-title">{{ title }}</div> -->
    <!-- 有页头和页尾的 -->
    <div v-if="showPrintHeaderAndFooter" class="page-header-footer">
      <table class="wrapper-table">
        <thead>
          <tr>
            <td>
              <div :class="{ 'page-header-space': true }"></div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="print-table-wrapper">
                <span
                  v-if="
                    type === 'RechargeDailySummaryList' ||
                      (type === 'RechargeSettlementSummaryList' &&
                        tableDataList.username)
                  "
                >
                  收银员：{{ tableDataList.username }}
                </span>
                <!-- 目前所有打印报表都需要日期 ,如果不需要日期 print_date_state 传false-->
                <template v-if="printDateState">
                  <el-table
                    ref="myTableRef"
                    v-loading="isLoading"
                    :data="tableData"
                    :show-summary="showSummary"
                    :summary-method="getSummaries"
                    :span-method="arraySpanMethod"
                    :row-style="{ height: '0' }"
                    class="print-table"
                    style="width: 100%; border: 1px solid black; border-color: black"
                    :cell-style="tableCellStyle"
                    :header-cell-style="tableHeaderCellStyle"
                    :row-class-name="tableRowClass"
                  >
                    <el-table-column
                      prop="date"
                      label="日期"
                      :key="tableColumnKey"
                    >
                      <!-- eslint-disable-next-line -->
                      <template slot="header" slot-scope="scope">
                        <div
                          class="clearfix"
                          style="width: 100%; text-align: center"
                        >
                          <span
                            >起止时间：{{
                              params.start_date + '至' + params.end_date
                            }}</span
                          >
                          <!-- <span style="margin-left: 20px;" v-if="tableDataList.username">收银员：{{ tableDataList.username }}</span> -->
                        </div>
                      </template>
                      <table-column
                        v-for="item in currentTableSetting"
                        :key="item.key"
                        :col="item"
                      >
                        <template #dateStartFee="{ row }">
                          <span
                            :class="{ 'danger bold': row.error_date_start_fee }"
                          >
                            {{ row.date_start_fee | formatMoney }}
                          </span>
                        </template>
                        <template #dateEndFee="{ row }">
                          <span
                            :class="{ 'danger bold': row.error_date_end_fee }"
                          >
                            {{ row.date_end_fee | formatMoney }}
                          </span>
                        </template>
                        <template #checkStatus="{ row }">
                          {{ row.check_status ? "已晨检" : "未晨检" }}
                        </template>
                        <template #checkResult="{ row }">
                          <div :class="row.check_result_alias === '不合格' ? 'ps-red' : ''">
                            {{ row.check_result_alias }}
                          </div>
                        </template>
                        <template #temperature="{ row }">
                          {{ row.temperature? row.temperature + '°C' : '' }}
                        </template>
                        <template #foodWeight="{ row }">
                            {{ row.food_weight ? row.food_weight + 'g' : '' }}
                        </template>
                        <template #images="{ }">
                          <div>查看</div>
                        </template>
                        <template #entryCupboard="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                          {{ row.entry_cupboard ? "是" : "否" }}
                        </template>
                        <template #sampleEntryUser="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                          {{ getNameByList(row.sample_entry_user) }}
                        </template>
                        <template #sampleExitUser="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                          <div class="person-tag">
                            {{ getNameByList(row.sample_exit_user) }}
                          </div>
                        </template>
                        <template #reservedUserName="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                          <div class="person-tag">
                            {{ row.reserved_user_name ? row.reserved_user_name : "--" }}
                          </div>
                        </template>
                        <template #notReservedReason="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                          <div class="person-tag">
                            {{ row.not_reserved_reason ? row.not_reserved_reason : "--" }}
                          </div>
                        </template>
                        <template #notEntryReason="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                          <div class="person-tag" v-if="!row.entry_cupboard">
                            {{ row.not_entry_reason ? row.not_entry_reason : "--" }}
                          </div>
                        </template>
                        <template #prevent_area="{ row }" v-if="type === 'PestControlRecord'">
                          {{ computedData(row.prevent_area) }}m²
                        </template>
                        <template #prevent_duration="{ row }" v-if="type === 'PestControlRecord'">
                          {{ computedData(row.prevent_duration) }}h
                        </template>
                        <template #meal_type="{ row }">
                          {{ getMealType(row.meal_type) }}
                        </template>
                        <template #person="{ row }">
                          {{ getPersonList(row.person_record_list) }}
                        </template>
                        <template #enable="{ row }" v-if="type === 'DemocraticFeedback'">
                          {{ row.enable ? '已发布' : '未发布' }}
                        </template>
                        <template #[item.slotName]="{ row }" v-if="type === 'SurveyDetailData'">
                          <div v-if="item.key !== 'number' && item.key !== 'commit_time' && item.key !== 'name'">
                            <div v-if="item.data.question_type === 0">
                              {{ row[item.key] }}
                            </div>
                            <div v-else-if="item.data.question_type === 1">
                              <div v-for="(item, index) in row[item.key]" :key="index">{{ item }}{{ ';' }}</div>
                            </div>
                            <div v-else-if="item.data.question_type === 2">
                              {{ row[item.key].score }}分
                            </div>
                            <div v-else-if="item.data.question_type === 3">
                              <div v-for="(item, index) in row[item.key]" :key="index">
                                {{ item.description }}: {{ item.score }}星
                              </div>
                            </div>
                            <div v-else-if="item.data.question_type === 4">
                              {{ row[item.key].text }}
                            </div>
                            <div v-else-if="item.data.question_type === 5">
                              <el-button type="text" size="small" class="ps-text" @click="handleClick(row, item.key)">查看</el-button>
                            </div>
                            <div v-else>
                              <el-button type="text" size="small" class="ps-text" @click="downloadUrl(row[item.key])">下载</el-button>
                            </div>
                          </div>
                          <div v-else>{{ row[item.key] || '--' }}</div>
                        </template>
                      </table-column>
                    </el-table-column>
                  </el-table>
                </template>
                <el-table
                  v-else
                  ref="myTableRef"
                  :data="tableData"
                  style="width: 100%"
                  :show-summary="showSummary"
                  header-row-class-name="ps-table-header-row"
                  border
                  class="print-table"
                >
                  <table-column
                    v-for="item in currentTableSetting"
                    :key="item.key"
                    :col="item"
                  >
                    <template #dateStartFee="{ row }">
                      <span
                        :class="{ 'danger bold': row.error_date_start_fee }"
                      >
                        {{ row.date_start_fee | formatMoney }}
                      </span>
                    </template>
                    <template #dateEndFee="{ row }">
                      <span :class="{ 'danger bold': row.error_date_end_fee }">
                        {{ row.date_end_fee | formatMoney }}
                      </span>
                    </template>
                    <template #checkStatus="{ row }">
                      {{ row.check_status ? "已晨检" : "未晨检" }}
                    </template>
                    <template #checkResult="{ row }">
                      <div :class="row.check_result_alias === '不合格' ? 'ps-red' : ''">
                        {{ row.check_result_alias }}
                      </div>
                    </template>
                    <template #temperature="{ row }">
                      {{ row.temperature? row.temperature + '°C' : '' }}
                    </template>
                    <template #foodWeight="{ row }">
                       {{ row.food_weight ? row.food_weight + 'g' : '' }}
                    </template>
                    <template #images="{ }">
                      <div>查看</div>
                    </template>
                    <template #entryCupboard="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                      {{ row.entry_cupboard ? "是" : "否" }}
                    </template>
                    <template #sampleEntryUser="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                      {{ getNameByList(row.sample_entry_user) }}
                    </template>
                    <template #sampleExitUser="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                      <div class="person-tag">
                        {{ getNameByList(row.sample_exit_user) }}
                      </div>
                    </template>
                    <template #reservedUserName="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                      <div class="person-tag">
                        {{ row.reserved_user_name ? row.reserved_user_name : "--" }}
                      </div>
                    </template>
                    <template #notReservedReason="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                      <div class="person-tag">
                        {{ row.not_reserved_reason ? row.not_reserved_reason : "--" }}
                      </div>
                    </template>
                    <template #notEntryReason="{ row }" v-if="type === 'SupervisionCanteenSampleRecord'">
                      <div class="person-tag" v-if="!row.entry_cupboard">
                        {{ row.not_entry_reason ? row.not_entry_reason : "--" }}
                      </div>
                    </template>
                    <template #prevent_area="{ row }" v-if="type === 'PestControlRecord'">
                      {{ computedData(row.prevent_area) }}m²
                    </template>
                    <template #prevent_duration="{ row }" v-if="type === 'PestControlRecord'">
                      {{ computedData(row.prevent_duration) }}h
                    </template>
                    <template #enable="{ row }" v-if="type === 'DemocraticFeedback'">
                      {{ row.enable ? '已启用' : '已禁用' }}
                    </template>
                  </table-column>
                </el-table>
              </div>
              <!-- 统计 start -->
               <!-- 多个统计 -->
               <div v-if="collectList">
                  <table-statistics v-for="(item,key,index) in collectList" :key="index" :statistics="item" />
               </div>
              <table-statistics v-if="collect.length" :statistics="collect" />
              <!-- end -->
              <div class="m-l-20" v-if="type === 'SoldierTurnoverList'">
                <div>
                  打印分组：{{ tableDataList.group_name_list.join('、') }}
                </div>
                <div class="m-t-30">
                  <span class="m-b-10">备注：</span>
                  <div>
                    <div>
                      1.收入包括以下几种卡类型：（1）普通补贴卡A、高职补贴卡A；（2）高职补贴卡B、高职充值卡；（3）特殊卡、海军规培学员卡；（4）机关补贴卡；（5）普通补贴卡B、普通充值卡等
                    </div>
                    <div>
                      2.军人卡机包含：（1）普通补贴卡A、高职补贴卡A；（2）高职补贴卡B、高职充值卡；（3）特殊卡、海军规培学员卡；（4）机关补贴卡（无折扣）；
                    </div>
                    <div>
                      3.普通卡机包含：（1）普通补贴卡A、高职补贴卡A；（2）高职补贴卡B、高职充值卡；（3）特殊卡、海军规培学员卡；（4）机关补贴卡；（5）普通补贴卡B、普通充值卡等
                    </div>
                    <div>
                      4.普通补贴卡A、高职补贴卡A每月享受工作日天数补贴；特殊卡、海军规培学员卡每月享受足月天数补贴。
                    </div>
                  </div>
                </div>
              </div>
              <div class="m-l-20" v-if="type === 'SurgeryReportList'">
                <div>打印分组：{{ tableDataList.card_groups }}</div>
                <div>打印消费点：{{ tableDataList.orgs }}</div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div class="page-footer-space"></div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="page-header">
        <div class="logo-wrapper">
          <img src="@/assets/img/logo-01.png" alt srcset />
        </div>
        <h3 style="text-align: center; margin: 10px 0; font-weight: 600">
          {{ `${organizationName}-${title}` }}
        </h3>
      </div>

      <div
        class="page-footer"
        v-if="
          type !== 'CardInfoSubsidyInfoList' && type !== 'ConsumeReconciliation'
        "
      >
        <div class="autograph-wrapper">
          <span style="padding: 0 30px 0 0px"
            >使用单位：{{ organizationName }}</span
          >
          <span style="padding: 0 30px 0 0px"
            >打印时间：{{ new Date() | formatDate }}</span
          >
          <span style="padding: 0 60px 0 0px" v-for="(item, index) in signatureList" :key="index">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <!-- 无页头页尾 -->
    <div v-else class="print-table-wrapper">
      <!-- <custom-table
        class="print-table"
        :tableSetting="currentTableSetting"
        :tableData="tableData"
        :show-summary="showSummary"
        header-row-class-name="ps-table-header-row"
        border
      ></custom-table> -->
      <el-table
        ref="myTableRef"
        :data="tableData"
        style="width: 100%"
        :show-summary="showSummary"
        header-row-class-name="ps-table-header-row"
        border
        class="print-table"
      >
        <table-column
          v-for="item in currentTableSetting"
          :key="item.key"
          :col="item"
        >
          <template #dateStartFee="{ row }">
            <span :class="{ 'danger bold': row.error_date_start_fee }">
              {{ row.date_start_fee | formatMoney }}
            </span>
          </template>
          <template #dateEndFee="{ row }">
            <span :class="{ 'danger bold': row.error_date_end_fee }">
              {{ row.date_end_fee | formatMoney }}
            </span>
          </template>
          <template #enable="{ row }" v-if="type === 'DemocraticFeedback'">
            {{ row.enable }}
          </template>
        </table-column>
      </el-table>
    </div>
    <!-- <print-setting
      v-if="dialogVisible"
      :tableSetting="tableSetting"
      :defaultCheckedSetting="currentTableSetting"
      :show.sync="dialogVisible"
      :extraParams="{ printType: type }"
      @confirm="confirmDialog"
    ></print-setting> -->
    <div class="print-tools noprint">
      <!-- <el-button
        class="print-btn"
        size="medium"
        circle
        @click="openSetting"
        icon="el-icon-setting"
      ></el-button> -->
      <el-button
        class="print-btn"
        size="medium"
        circle
        v-print="printObj"
        @click="toPrint"
        icon="el-icon-printer"
      ></el-button>
    </div>
    <div v-if="getIsShowCurrentPage && showPageNumber" class="footer-current-page">
      第{{ currentPage }}页，共{{ totalPages }}页
    </div>
  </div>
</template>

<script>
import { to, parseTime, formatWallet, divide, deepClone } from '@/utils'
import * as dayjs from 'dayjs'
import { mergeHandle, mergeRowAction } from '@/utils/table'
import ElTable from './ElTable3.vue'
import print from 'vue-print-nb'
import { nextTick } from 'process'
import { mapGetters } from 'vuex'
import { getNameByType, getMealTypeName, getPersonNameByList } from "../merchant/supervision-and-management/meal-management/utils"

export default {
  name: 'print',
  components: {
    ElTable
  },
  directives: {
    print
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
  data() {
    return {
      tableDataList: null,
      isLoading: false,
      requestApi: '', // 请求的接口
      type: '',
      title: '', // 标题
      organizationName: '', // 当前组织名称
      printDateState: true, // 是否开启报表日期
      tableSetting: [],
      currentTableSetting: [],
      tableData: [], // table数据
      params: {}, // 请求数据的参数
      dialogVisible: false,
      showPrintHeaderAndFooter: false, // 是否显示打印头和尾
      resultKey: 'data', // 列表值的获取字段
      showSummary: false, // 是否显示合计 showSummary/pushSummary二选一
      pushSummary: false, // 合计添加到到table数据最后
      collect: [], // 统计
      collectList: {}, // 统计多条
      tableColumnKey: 1, // 给有时间的表加个key
      rowMergeArrs: [], // 合并表格
      mergeOpts: {
        useKeyList: {}, // 根据id去合并set_meal_id:[name]
        mergeKeyList: ['name'] // 通用的合并字段，根據值合并
      },
      printObj: {
        id: 'print', // 这里是要打印元素的ID
        popTitle: '&nbsp', // 打印的标题
        extraCss: '', // 打印可引入外部的一个 css 文件
        extraHead: '' // 打印头部文字
      },
      // 和退户管理相关
      need_to_handle: false,
      quitStatus: {
        ENABLE: '使用中',
        DELETE: '删除',
        PERSON_QUIT: '退户',
        FREEZE: '冻结中'
      },
      isMerge: true, // 是否合并
      signatureList: [{ value: '主管签字：' }, { value: '制表人签字：' }, { value: '审核人签字：' }],
      mergeMap: new Map(), // 用于存储合并信息
      // 底部当前页码
      currentPage: 1, // 当前页
      pageHeight: 0, // 一页高度
      totalPages: 1, // 总页数
      showPageNumber: true, // 控制页码显示状态
      maxScrollY: 0 // 页面的最大滚动距离
    }
  },
  created() {
    try {
      this.type = this.$route.query.print_type
      this.title = this.$route.query.print_title
      this.requestApi = this.$route.query.api
      this.showSummary = this.$route.query.show_summary === 'true'
      this.showPrintHeaderAndFooter =
        this.$route.query.show_print_header_and_footer === 'true'
      this.tableSetting = JSON.parse(this.$route.query.table_setting)
      this.currentTableSetting = JSON.parse(this.$route.query.current_table_setting)
      this.need_to_handle = this.$route.query.need_to_handle
      if (this.$route.query.mergeOpts) {
        this.mergeOpts = JSON.parse(this.$route.query.mergeOpts)
      }
      this.printDateState = this.$route.query.print_date_state
        ? this.$route.query.print_date_state
        : false
      this.params = JSON.parse(this.$route.query.params)
      if (this.printDateState && Reflect.has(this.params, 'start_time')) {
        this.params.start_date = dayjs(this.params.start_time).format('YYYY-MM-DD')
        this.params.end_date = dayjs(this.params.end_time).format('YYYY-MM-DD')
      }
      if (this.$route.query.collect) {
        this.collect = JSON.parse(this.$route.query.collect)
      }
      if (this.$route.query.collectList) {
        this.collectList = JSON.parse(this.$route.query.collectList)
      }
      this.pushSummary = this.$route.query.push_summary === 'true'
      if (this.$route.query.result_key) {
        this.resultKey = this.$route.query.result_key
      }
      // 拿到当前组织名称 登陆的组织
      if (this.$store.getters.userInfo && !this.$store.getters.userInfo.organizationList) return
      this.$store.getters.userInfo.organizationList.forEach(item => {
        if (this.$store.getters.organization === item.id) {
          this.organizationName = item.name
        }
      })
      if (this.$route.query.isMerge) {
        this.isMerge = this.$route.query.isMerge !== '0'
      }
      console.log('this.tableSetting', this.tableSetting, this.type)
    } catch (error) {
      console.log('get print query error', error)
    }
    this.initLoad()
  },
  computed: {
    ...mapGetters(['userInfo']),
    getIsShowCurrentPage() {
      return this.$route.query.show_current_page
    },
    computedData() {
      return d => {
        return divide(d, 100)
      }
    }
  },
  methods: {
    // 初始化表格滚动监听
    initTableScrollListener() {
      this.$nextTick(() => {
        // 给 window 添加滚动监听
        window.addEventListener('scroll', this.handleWindowScroll)
        // 添加窗口大小改变监听
        window.addEventListener('resize', this.calculatePageLayout)
      })
    },
    // 修改 table cell边框的背景色
    tableCellStyle() {
      // return 'border-color:red;'
      return 'border-color:black;'
    },
    // 修改 table header cell的背景色
    tableHeaderCellStyle() {
      return 'background: #eef1f6;border-color: black;color:black'
    },
    parseTime,
    initLoad() {
      this.getTableData()
      this.printListener()
      this.getAccountPrintSignInfo() // 获取签名数据
    },
    // 目前只有设备消费汇总表要
    tableRowClass({ row, rowIndex }) {
      if (row.primary === '小计') {
        return 'hang-row-class'
      }
    },
    // 格式化处理
    formattingProcess(data) {
      // 对于退户管理的格式化处理
      if (this.need_to_handle) {
        data.map(item => {
          item.card_user_group_alias = item.card_user_group_alias.join('，')
          item.organization_alias = item.organization_alias.join('，')
          item.person_status_alias = this.formatQuitStatusText(item.card_orgs)
          // 格式化下钱包
          item = formatWallet(item)
          return item
        })
      }
    },
    // status 退户状态显示
    formatQuitStatusText(data) {
      let text = ''
      data.forEach(v => {
        if (v.organization === this.$store.getters.organization) {
          text = this.quitStatus[v.person_status]
        }
      })
      console.log('text', text)
      return text
    },
    async getTableData() {
      if (!this.requestApi) return this.$message.error('请求失败，请检查参数！')
      this.isLoading = true
      const [err, res] = await to(this.$apis[this.requestApi](this.params))
      this.isLoading = false
      this.tableData = []
      if (err) {
        this.$message.error(err.message)
        return
      }
      if (res.code === 0) {
        this.tableDataList = res.data
        let result = res.data
        if (this.type === 'AccountWalletDaily') {
          this.initAccountWalletDaily(result)
        }
        if (this.resultKey) {
          this.formattingProcess(result[this.resultKey])
          // 目前 设备汇总表特有 需要加小计
          if (this.type === 'DeviceCostSummary') {
            // 创建一个映射，以便快速查找 total 中的数据
            const totalMap = new Map(result.org_collect.map(item => [item.org_id, item]))
            // 新数组用于存储处理后的数据
            let processedArea = []
            // 遍历 area 数据，找到每个 id 组的最后一项并插入总计
            for (let i = 0; i < result[this.resultKey].length; i++) {
              processedArea.push(result[this.resultKey][i])
              const current = result[this.resultKey][i]
              const next = result[this.resultKey][i + 1]
              // 如果当前项是某个 id 组的最后一项
              if (!next || next.org_id !== current.org_id) {
                // 从 totalMap 中获取对应的总计值
                const totalItem = totalMap.get(current.org_id)
                if (totalItem) {
                  let newObj = deepClone(totalItem)
                  let obj = {}
                  obj = {
                    primary: '小计',
                    consume_count: newObj.consume_count,
                    consume: newObj.consume,
                    refund_count: newObj.refund_count,
                    refund_fee: newObj.refund_fee,
                    real_fee: newObj.real_fee,
                    settle: newObj.settle
                  }
                  // 插入总计行
                  processedArea.push(obj)
                }
              }
            }
            console.log(processedArea, 7777777)
            this.tableData = processedArea
          } else {
            this.tableData = result[this.resultKey]
          }
          if (this.type === 'AccompanyingMealRecord') {
            result[this.resultKey] = this.getNewListByGoodList(result[this.resultKey])
          }
          this.tableData = result[this.resultKey]
          if (this.type === 'SurveyDetailData') {
            this.tableData = result.filter((item, index) => index >= 1)
          }
          // 预处理合并数据
          if (this.type === 'InboundAndOutboundStatisticsClassification') {
            this.preprocessMergeData()
          }
          // 处理报餐点餐汇总的合计
          if (this.type === 'ReportMealDepartmentGroupSummaryList' || this.type === 'ReportMealGroupSummaryList') {
            result.collect = {
              group_organization_name: "合计",
              collect_count: result.summary_data.collect_total_count,
              collect_stop_count: result.summary_data.collect_total_stop_count,
              collect_refund_count: result.summary_data.collect_total_refund_count,
              breakfast_count: result.summary_data.breakfast_total_count,
              breakfast_stop_count: result.summary_data.breakfast_total_stop_count,
              breakfast_refund_count: result.summary_data.breakfast_total_refund_count,
              lunch_count: result.summary_data.lunch_total_count,
              lunch_stop_count: result.summary_data.lunch_total_stop_count,
              lunch_refund_count: result.summary_data.lunch_total_refund_count,
              afternoon_count: result.summary_data.afternoon_total_count,
              afternoon_stop_count: result.summary_data.afternoon_total_stop_count,
              afternoon_refund_count: result.summary_data.afternoon_total_refund_count,
              dinner_count: result.summary_data.dinner_total_count,
              dinner_stop_count: result.summary_data.dinner_total_stop_count,
              dinner_refund_count: result.summary_data.dinner_total_refund_count,
              supper_count: result.summary_data.supper_total_count,
              supper_stop_count: result.summary_data.supper_total_stop_count,
              supper_refund_count: result.summary_data.supper_total_refund_count,
              morning_count: result.summary_data.morning_total_count,
              morning_stop_count: result.summary_data.morning_total_stop_count,
              morning_refund_count: result.summary_data.morning_total_refund_count
            }
          }
          console.log('data', this.tableData, this.resultKey, this.currentTableSetting)
        } else {
          this.formattingProcess(result)
          this.tableData = result
        }
        // 统计
        if (this.collect && this.collect.length) {
          this.setCollectData(res)
        }
        // 合计
        if (this.pushSummary) {
          this.setSummaryData(res)
        }
        if (this.isMerge) {
          this.rowMergeArrs = mergeHandle(this.tableData, this.mergeOpts)
        }
        // this.$refs.myTableRef.doLayout()
        nextTick(() => {
        })
        this.resetTableStyle()
        // 是否显示底部当前页码
        this.getIsShowCurrentPage && this.calculatePageLayout()
      } else {
        this.$message.error(res.msg)
      }
    },
    initAccountWalletDaily(data) {
      let dateList = {} // 记录期初期末数据，用于分页的收尾数据
      let len = data.result.length
      let result = data.result
      result = result.map((item, index) => {
        // 手动存下当前分页首末的期初期末数据
        if (index === 0 || index === len - 1) {
          dateList[item.date] = {
            date_start_fee: item.date_start_fee,
            date_end_fee: item.date_end_fee
          }
        }
        // 上一条的日期，因为后台返回的数据是倒序
        let nextDate = dayjs(item.date)
          .add(1, 'day')
          .format('YYYY-MM-DD')
        // 计算当前期初的金额与上一天的期末金额是否相等，如果不相等则证明数据有误，需标红显示
        if (index > 0) {
          // 对比上一条的数据
          let nextItem = result[index - 1]
          // 当日期符合时进行金额的判断
          if (nextItem) {
            // 当上一条期末金额与当前的期初金额不同时
            if (
              nextItem.date === nextDate &&
              nextItem.date_start_fee !== item.date_end_fee
            ) {
              item.error_date_end_fee = true
              nextItem.error_date_start_fee = true
            }
          } else {
            // nextItem = dateList[nextDate]
            // if (nextItem && nextItem.date_start_fee !== item.date_end_fee) {
            //   item.error_date_end_fee = true
            //   nextItem.error_date_start_fee = true
            // }
          }
        } else {
          // 当index为0的时候，应该是分页的数据了
          let nextItem = dateList[nextDate]
          // 当日期符合时进行金额的判断
          if (nextItem) {
            // 当上一条期末金额与当前的期初金额不同时
            if (nextItem.date_start_fee !== item.date_end_fee) {
              item.error_date_end_fee = true
              // nextItem.error_date_start_fee = true
            }
          }
        }
        return item
      })
    },
    openSetting() {
      this.dialogVisible = true
    },
    confirmDialog(val, params) {
      this.currentTableSetting = val
      this.tableColumnKey++
      this.setPrintSettingInfo(val, params)
    },
    // 设置统计的值
    setCollectData(res) {
      // 统计
      this.collect.forEach(item => {
        if (res.data.collect && res.data.collect[item.key] !== undefined) {
          this.$set(item, 'value', res.data.collect[item.key])
          // item.value = res.data.collect[item.key]
        }
      })
    },
    // 设置合计的值，严格依赖tableSetting，和数据的先后顺序
    setSummaryData(res) {
      let collect = res.data.collect
      collect[this.tableSetting[0].key] = '合计'
      this.tableData.push(collect)
    },
    // 表格合计
    getSummaries(param) {
    },
    // 重置表格样式，importance
    resetTableStyle() {
      if (this.type === 'CardInfoSubsidyInfoList') {
        nextTick(() => {
        // this.$nextTick(() => {
          let colgroupEl = document.querySelectorAll('colgroup')
          setTimeout(() => {
            for (let i = 0; i < colgroupEl.length; i++) {
              colgroupEl[i].childNodes.forEach((m, l) => {
                if (l === 3) {
                  m.setAttribute('width', '230' + 'px') // 例如 '100px'
                } else {
                  // colgroupEl[i].childNodes.remove()
                  m.setAttribute('width', '100' + '%') // 例如 '100px'
                }
              })
            }
            // window.print()
          }, 100)
        })
      } else {
        this.$nextTick(() => {
          let colgroupEl = document.querySelectorAll('colgroup')
          setTimeout(() => {
            for (let i = 0; i < colgroupEl.length; i++) {
              colgroupEl[i].childNodes.forEach((m, l) => {
                m.setAttribute('width', '100' + '%') // 例如 '100px'
              })
              // colgroupEl[i].remove()
            }
            // window.print()
          }, 50)
        })
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.type === 'AccompanyingMealRecord') {
        if ((columnIndex < 10 || columnIndex === 16) && row.isMerge) {
          return { rowspan: row.spanNumber, colspan: 1 }
        }
        // 其他列不合并
        return { rowspan: 1, colspan: 1 }
      }
      if (this.type === 'InboundAndOutboundStatisticsClassification') {
        return this.arraySpanMethodInbound({ row, column, rowIndex, columnIndex })
      }
      if (this.isMerge) {
        console.log('row', row, column, rowIndex, columnIndex)
        let keys = Object.keys(this.mergeOpts.useKeyList)
        let useKey = this.mergeOpts.useKeyList && keys.length
        if (useKey) {
          for (const key in this.mergeOpts.useKeyList) {
            if (this.mergeOpts.useKeyList[key].includes(column.property)) {
              return mergeRowAction(
                this.rowMergeArrs,
                column.property,
                rowIndex,
                columnIndex
              )
            }
          }
        }
        if (
          this.mergeOpts.mergeKeyList &&
          this.mergeOpts.mergeKeyList.length &&
          this.mergeOpts.mergeKeyList.includes(column.property)
        ) {
          return mergeRowAction(
            this.rowMergeArrs,
            column.property,
            rowIndex,
            columnIndex
          )
        }
      }
    },
    // 获取签名数据
    async getAccountPrintSignInfo() {
      const [err, res] = await this.$to(
        this.$apis.apiBackgroundOrganizationAccountGetAccountPrintSignInfoPost({
          id: this.userInfo.account_id,
          // 需要签名数据 key 后端要重新定义新的key，所以在后面加个Sign 写死的
          print_sign_key: this.type + 'Sign'
        })
      )
      if (err) {
        this.$message.error(err.message)
        return
      }
      if (res.code === 0) {
        if (Array.isArray(res.data)) {
          this.signatureList = res.data
        }
        // this.$message.success('设置成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    async setPrintSettingInfo(list, params) {
      const [err, res] = await to(this.$apis.apiBackgroundAdminAccountSetAccountPrintInfoPost({
        id: this.userInfo.account_id,
        print_key: this.type,
        print_list: list,
        ...params
      }))
      if (err) {
        this.$message.error(err.message)
        return
      }
      if (res.code === 0) {
        // console.log(res)
        this.getAccountPrintSignInfo()
        this.resetTableStyle()
        // this.$message.success('设置成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    // 打印窗口监听
    printListener() {
      // 貌似火狐不支持事件监听
      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print')
        // mediaQueryList.onchange = function(ee) {
        //   console.log('ee',ee)
        // }
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
          } else {
            window.close()
          }
        })
      }
    },
    toPrint() {
      // window.print()
      // 预览隐藏底部当前页码
      if (this.getIsShowCurrentPage) {
        this.showPageNumber = false
        setTimeout(() => {
          this.showPageNumber = true
        }, 1000)
      }
    },
    // 获取列表名字
    getNameByList(list) {
      console.log("getNameByList", list)
      if (!list || list.length === 0) {
        return ""
      }
      if (typeof list === "object") {
        let newList = []
        for (let key in list) {
          newList.push(list[key])
        }
        return newList.join("、")
      } else if (Array.isArray(list) && list.length > 0) {
        let newList = list.map((item) => item.name)
        return newList.join("、")
      }
    },
    // 获取新列表，根据菜品列表
    getNewListByGoodList(list) {
      if (!list || list.length === 0) {
        return []
      }
      // 用一个新的列表存储拿出来的菜品数据
      let newList = []
      list.forEach((item) => {
        let foodRecordList = item.food_record_list || []
        let setMealRecordList = item.set_meal_record_list || []
        item.room_clean_type =
          this.getCurrentNameByType("room_clean_type", item.room_clean_type) +
          "、" +
          this.getCurrentNameByType("room_attitude_type", item.room_attitude_type)
        item.area_clean_type =
        this.getCurrentNameByType("area_clean_type", item.area_clean_type) +
          "、" +
          this.getCurrentNameByType("area_waste_type", item.area_waste_type)
        item.oa_clean_type =
        this.getCurrentNameByType("oa_clean_type", item.oa_clean_type) +
          "、" +
          this.getCurrentNameByType("oa_operate_type", item.oa_operate_type)
        item.tda_clean_type =
        this.getCurrentNameByType("tda_clean_type", item.tda_clean_type) +
          "、" +
          this.getCurrentNameByType("tda_disinfection_type", item.tda_disinfection_type)
        item.operation_type = this.getCurrentNameByType("operation_type", item.operation_type)
        foodRecordList = foodRecordList.concat(setMealRecordList)
        if (foodRecordList && foodRecordList.length > 0) {
          foodRecordList.forEach((subItem, index) => {
            newList.push({
              ...item,
              food_name: this.getFoodName(subItem),
              gg_excellent_type_alias: subItem.gg_excellent_type_alias,
              zl_excellent_type_alias: subItem.zl_excellent_type_alias,
              quantity_type_alias: subItem.quantity_type_alias,
              price_type_alias: subItem.price_type_alias,
              food_remark: subItem.remark,
              isMerge: foodRecordList && foodRecordList.length > 1,
              spanNumber: foodRecordList && foodRecordList.length > 1 ? (index === 0 ? foodRecordList.length : 0) : 1
            })
          })
        } else {
          newList.push({
            ...item,
            foodName: "",
            gg_excellent_type_alias: "",
            zl_excellent_type_alias: "",
            quantity_type_alias: "",
            price_type_alias: "",
            food_remark: "",
            isMerge: false,
            spanNumber: 1
          })
        }
      })
      return newList
    },
    // 获取名称
    getCurrentNameByType (type, value) {
      console.log("getCurrentNameByType", type, value)
      return getNameByType(type, value)
    },
    // 获取餐段类型
    getMealType(type) {
      return getMealTypeName(type)
    },
    // 获取人员列表
    getPersonList (list) {
      return getPersonNameByList(list)
    },
    // 获取详情菜品名称
    getFoodName(row) {
      let name = row.name
      let price = row.price ? divide(row.price) : "0.00"
      return `${name}  ¥${price}/份`
    },
    arraySpanMethodInbound({ row, column, rowIndex, columnIndex }) {
      // 需要合并的列索引（仓库名称、日期、物资分类）
      const mergeColumns = [0, 1, 2];
      // 需要累加的列（入库合计、出库合计）
      const sumColumns = ['entry_all_total', 'exit_all_total'];

      // 获取当前列的属性名
      const prop = column.property;

      // 如果是需要累加的列
      if (sumColumns.includes(prop)) {
        // 查找当前行所属的合并组
        for (const [firstIndex, mergeInfo] of this.mergeMap.entries()) {
          if (mergeInfo.indexes.includes(rowIndex)) {
            // 如果是合并组的第一行，显示累加后的值
            if (rowIndex === firstIndex) {
              // 根据列名设置对应的累加值
              if (prop === 'entry_all_total') {
                row[prop] = mergeInfo.sumColumns.entry_total;
              } else if (prop === 'exit_all_total') {
                row[prop] = mergeInfo.sumColumns.exit_total;
              }
              return {
                rowspan: mergeInfo.rowspan,
                colspan: 1
              };
            }
            // 其他行隐藏
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }

      // 处理需要合并的列
      if (mergeColumns.includes(columnIndex)) {
        // 查找当前行所属的合并组
        for (const [firstIndex, mergeInfo] of this.mergeMap.entries()) {
          if (mergeInfo.indexes.includes(rowIndex)) {
            // 如果是合并组的第一行，显示合并后的单元格
            if (rowIndex === firstIndex) {
              return {
                rowspan: mergeInfo.rowspan,
                colspan: 1
              };
            }
            // 其他行隐藏
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }

      // 其他列不合并
      return {
        rowspan: 1,
        colspan: 1
      };
    },
    // 预处理合并数据
    preprocessMergeData() {
      this.mergeMap.clear();
      const keyMap = new Map(); // 用于存储相同key的行索引
      this.tableData.forEach((row, index) => {
        row.key = row.warehouse_name + "_" + row.date + "_" + row.materail_classification_name;
      })
      // 正确的字符串排序
      this.tableData.sort((a, b) => a.key.localeCompare(b.key))
      // 按key分组
      this.tableData.forEach((row, index) => {
        const key = row.key;
        if (!keyMap.has(key)) {
          keyMap.set(key, []);
        }
        keyMap.get(key).push(index);
      });

      // 计算每组的合并信息
      keyMap.forEach((indexes, key) => {
        const firstIndex = indexes[0];
        const mergeInfo = {
          rowspan: indexes.length,
          indexes: indexes,
          // 需要累加的列
          sumColumns: {
            'entry_total': 0, // 入库合计金额
            'exit_total': 0 // 出库合并金额
          }
        };

        // 计算需要累加的列的总和
        indexes.forEach(idx => {
          const row = this.tableData[idx];
          // 累加入库合计金额
          mergeInfo.sumColumns.entry_total += Number(row.entry_total || 0);
          // 累加出库合并金额
          mergeInfo.sumColumns.exit_total += Number(row.exit_total || 0);
        });

        this.mergeMap.set(firstIndex, mergeInfo);
      });
      console.log('mergeMap', this.mergeMap)
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
    // 移除表格滚动监听器
    removeTableScrollListener() {
      // 移除窗口滚动监听
      window.removeEventListener('scroll', this.handleWindowScroll)
      // 移除窗口大小改变监听
      window.removeEventListener('resize', this.calculatePageLayout)
    }
  }
}
</script>
<style lang="scss">
#print {
  .el-table th.gutter{
  display: none;
  width: 0;
}
  .hang-row-class {
    background: #eef1f6 !important;
  }
  .el-table colgroup col[name='gutter']{
    display: none;
    width: 0;
  }

  background-color: #fff;
  width: 100%;
  height: 100%;
  .el-table .el-table__cell {
    font-size: 18px;
  }
  .el-table {
    width: auto;
  }
  .print-title {
    padding: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
  .print-table-wrapper {
    margin: 0 20px;
  }
  .print-tools {
    position: fixed;
    right: 45px;
    bottom: 45px;
    z-index: 99;
    .el-button {
      display: block;
      margin: 15px 0;
      font-size: 26px;
    }
  }
  table {
    width: 100% !important;
    font-weight: 500;
    th {
      font-weight: 500;
    }
  }
  .page-header,
  .page-header-space {
    // height: 120px;
    height: 100px;
  }

  .page-footer,
  .page-footer-space {
    height: 110px;
  }
  .page-header {
    position: fixed;
    top: 0mm;
    left: 20px;
    width: 100%;
    background-color: #fff;
  }
  .page-footer {
    position: fixed;
    left: 20px;
    bottom: 0;
    width: 100%;
    // height: 90px;
    background-color: #fff;
    z-index: 1;
    .autograph-wrapper {
      display: flex;
      flex-wrap: wrap;
      padding: 20px 0;
    }
  }
}
.bold {
  font-weight: bold;
}
.page {
  page-break-after: always;
}

@media print {
  #print {
    .el-table th.gutter {
      display: table-cell !important;
    }
    thead {
      page-break-before: auto;
    }
    /* .el-table td {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    } */
    .el-table--group,
    .el-table--border {
      border: none !important;
    }
    .el-table td,
    .el-table th,
    .el-table tr {
      border: 1px solid #000 !important;
    }
    .el-table th[colspan],
    .el-table td[colspan] {
      width: auto;
    }

    .el-table th[rowspan],
    .el-table td[rowspan] {
      height: auto;
    }
    .el-table__body {
      border-collapse: collapse;
    }
    .el-table--group::after,
    .el-table--border::after,
    .el-table::before {
      content: none;
    }
  }
  @page {
    size: auto;
    margin-bottom: 0px;
  }
  .page-header-footer {
    @page {
      size: auto;
      margin: 120px 0 80px;
    }
  }
  .noprint {
    display: none;
  }
}

.footer-current-page{
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
  z-index: 999;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}
</style>
