<template>
  <view class="user_form_box">
    <!-- #ifdef MP-WEIXIN || H5  -->
    <u-navbar
      :title="userForm.id ? '编辑用户' : '新建用户'"
      :title-style="{ fontSize: '37rpx', color: color.navigation }"
      left-icon-size="20px"
      :left-icon-color="color.navigation"
      placeholder
      @leftClick="leftClick"
    />
    <!--#endif-->

    <view class="form_box">
      <u-form ref="userForm" :model="userForm" :rules="userRules" labelWidth="160" errorType="border-bottom">
        <u-form-item label="姓名" prop="name" placeholder="请输入" required borderBottom>
          <u-input v-model="userForm.name" placeholder="请输入姓名" inputAlign="right" border="none" />
        </u-form-item>
        <u-form-item label="人员编号" prop="personNo" required borderBottom>
          <u-input v-model="userForm.personNo" placeholder="请输入" :disabled="userForm.id ? true : false" inputAlign="right" border="none" />
        </u-form-item>
        <u-form-item label="性别" prop="gender" required borderBottom>
          <template slot="right">
            <u-radio-group v-model="userForm.gender" size="28" activeColor="orange">
              <u-radio label="男" name="MAN" labelSize="28" />
              <view style="margin: 0 40rpx">
                <u-radio label="女" name="WOMEN" labelSize="28" />
              </view>
              <u-radio label="其他" name="OTHER" labelSize="28" />
            </u-radio-group>
          </template>
        </u-form-item>
        <u-form-item label="手机号" prop="phone" borderBottom>
          <u-input v-model="userForm.phone" placeholder="请输入" border="none" inputAlign="right" />
        </u-form-item>
        <u-form-item label="卡号" borderBottom>
          <u-input v-model="userForm.cardNumber" placeholder="请前往后台操作发卡" :disabled="userForm.id ? true : false" inputAlign="right" border="none" />
        </u-form-item>
        <u-form-item label="分组" prop="group" borderBottom>
          <view class="select-input" @click="showG = true">
            <u-input :value="selectGroup" disabled disabledColor="#ffffff" placeholder="请选择分组" border="none" inputAlign="right" />
            <u-icon :name="`arrow-right`" />
          </view>
        </u-form-item>
        <u-form-item label="部门" prop="department" borderBottom>
          <view class="select-input" @click="showPicker">
            <u-input :value="selectDepartment" disabled disabledColor="#ffffff" placeholder="请选择部门" border="none" inputAlign="right" />
            <u-icon :name="`arrow-right`" />
          </view>
        </u-form-item>
        <u-form-item label="有效期" borderBottom>
          <view class="select-input" style="justify-content: flex-end" @click="calendarOpen">
            <template v-if="userForm.validityDate.length > 0">
              <u-input
                :value="` ${userForm.validityDate[0]} 至 ${userForm.validityDate[1]}`"
                disabled
                disabledColor="#ffffff"
                placeholder="请选择时间"
                border="none"
                inputAlign="right"
              />
            </template>
            <u-icon :name="`arrow-right`" />
          </view>

          <!-- 插件 可以精确到时分秒 -->
          <!-- <uni-datetime-picker
            ref="datePicker"
            v-model="userForm.validityDate"
            type="daterange"
            rangeSeparator="至"
            :border="false"
          />
          <template slot="right">
            <u-icon :name="`arrow-right`" @click="openDatePicker" />
          </template> -->
        </u-form-item>
        <u-form-item v-if="sensitiveSetting.id_number" prop="idNumber" label="身份证号" borderBottom>
          <u-input v-model="userForm.idNumber" placeholder="请输入" border="none" inputAlign="right" />
        </u-form-item>
        <u-form-item label="年龄" borderBottom>
          <u-input v-model="userForm.age" type="number" placeholder="请输入年龄" border="none" inputAlign="right" />
        </u-form-item>
        <u-form-item :label="spareField" borderBottom>
          <u-input v-model="userForm.spare_field" placeholder="请输入" border="none" inputAlign="right" />
        </u-form-item>
        <u-form-item :label="spareField2">
          <u-input v-model="userForm.spare_field2" placeholder="请输入" border="none" inputAlign="right" />
        </u-form-item>
      </u-form>
    </view>

    <view class="btn_save_box">
      <view class="btn_box">
        <u-button type="primary" @click="submit">保存</u-button>
      </view>
    </view>

    <u-picker
      ref="uPickerG"
      :show="showG"
      :columns="groups"
      keyName="group_name"
      :defaultIndex="selectGroupIndex"
      :itemHeight="60"
      confirmColor="#FD953C"
      @cancel="onCancel('group')"
      @confirm="(e) => onConfirm('group', e)"
    />
    <!-- 部门树列表 -->
    <tree-nodes
      ref="treePicker"
      :multiple="false"
      @select-change="selectChange"
      title="选择部门"
      :localdata="departments"
      :selectedData="initialSelectedDepartmentIds"
      valueKey="id"
      textKey="group_name"
      childrenKey="children_list"
    />

    <!-- 日历 年-月-日 -->
    <uni-calendar ref="calendar" range :insert="false" @confirm="calendarConfirm" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  apiReportCenterDataReportGetSensitiveSettingPost,
  apiCardServiceCardUserAddPost,
  apiCardServiceCardUserModifyPost,
  apiCardServiceCardOperateCancelPersonQuitPost,
  apiCardServiceCardOperateGetSpareFieldAliasPost,
  apiCardServiceCardDepartmentGroupTreeList,
  getCardServiceCardUserGroupList
} from '@/api/ai_assistant'
import { encrypted, decrypted } from '@/utils/aesUtil'
import { isPhone, isIden } from '@/utils/validata'
import dayjs from 'dayjs'
import TreeNodes from '../components/TreeNodes/index.vue'

export default {
  components: {
    TreeNodes
  },
  computed: {
    ...mapGetters(['color', 'userFormData'])
  },
  data() {
    return {
      spareField: '备用字段1', // 备用字段1
      spareField2: '备用字段2', // 备用字段2
      sensitiveSetting: {}, // 隐藏后台配置的信息
      showG: false,
      groups: [],
      showD: false,
      departments: [],
      treeList: [],
      showModel: false,
      initialSelectedDepartmentIds: [],
      userRules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change']
          }
        ],
        personNo: [
          {
            required: true,
            message: '请输入人员编号',
            trigger: ['blur', 'change']
          }
        ],
        gender: [
          {
            required: true,
            message: '请选择性别',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          {
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          {
            validator: (rule, value, callback) => {
              if (!value) return true
              return isPhone(value)
            },
            message: '请输入正确手机号',
            trigger: ['change', 'blur']
          }
        ],
        idNumber: [
          {
            message: '请输入身份证号',
            trigger: ['blur', 'change']
          },
          {
            validator: (rule, value, callback) => {
              if (!value) return true
              return isIden(value)
            },
            message: '请输入正确的身份证号码',
            trigger: ['change', 'blur']
          }
        ]
      },
      userForm: {
        name: '', // 姓名
        gender: '', // 性别
        group: '', // 分组
        department: {}, // 部门
        cardNumber: '', // 会员卡号
        cardPwd: '', // 会员卡密码
        phone: '', // 手机号
        personNo: '', // 人员编号
        validityDate: [dayjs().format('YYYY-MM-DD'), dayjs().add('1', 'year').format('YYYY-MM-DD')], // 有效期
        isAutoGroup: false, // 是否自定分组
        idNumber: '',
        age: '',
        spare_field: '',
        spare_field2: ''
      },
      selectGroup: '',
      selectGroupIndex: [0],
      selectDepartment: ''
    }
  },
  methods: {
    // uni-calendar
    calendarOpen() {
      this.$refs.calendar.open()
    },
    calendarConfirm(day) {
      const { after, before } = day.range
      if (before && after) {
        this.userForm.validityDate = [before, after]
      }
    },
    // 显示选择器
    showPicker() {
      this.$refs.treePicker._show()
    },
    // 监听选择（ids为数组）
    selectChange(ids, names) {
      this.userForm.department = ids[0]
      this.selectDepartment = names
      console.log(ids, names)
    },
    // 导航左侧按钮点击
    leftClick() {
      this.$miRouter.back()
    },
    // pick弹窗
    onCancel(type) {
      if (type === 'group') {
        this.showG = false
      } else if (type === 'department') {
        this.showD = false
      }
    },
    onConfirm(type, e) {
      if (type === 'group') {
        this.userForm[type] = e.value[0].id
        this.selectGroup = e.value[0].group_name
      } else if (type === 'department') {
        this.userForm[type] = e.value[0].id
        this.selectDepartment = e.value[0].group_name
      }
      this.onCancel(type)
    },
    // 编辑用户
    async editCardUser(params) {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const [error, res] = await this.$to(apiCardServiceCardUserModifyPost(params))
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }

      if (res && res.code === 0) {
        uni.$u.toast('保存成功')
        setTimeout(() => {
          this.leftClick()
        }, 1000)
      } else {
        uni.$u.toast(res.msg)
      }
    },
    // 新增用户
    async addCardUser(params) {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const [error, res] = await this.$to(apiCardServiceCardUserAddPost(params))
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }

      const that = this
      if (res.code === 100016) {
        params.is_sync = true
        this.$confirm(
          {
            dialogTypeValue: 'content', // 弹窗类型
            titleTxt: '提示', // 弹窗标题
            contentTxt: '该用户已存在，是否同步用户信息?',
            isShowDialog: true, // 是否显示弹窗
            cancelCallBack: function () {
              console.log('点击取消')
            },
            confirmCallBack: async function () {
              await this.addCardUser(params)
            }
          },
          that
        )
      } else if (res.code === 100020) {
        params.is_sync = true
        this.$confirm(
          {
            dialogTypeValue: 'content', // 弹窗类型
            titleTxt: '提示', // 弹窗标题
            contentTxt: '存在相同用户（已退户），是否取消退户？',
            isShowDialog: true, // 是否显示弹窗
            cancelCallBack: function () {
              console.log('点击取消')
            },
            confirmCallBack: async function () {
              await this.cancelQuit(res.data.card_user_id)
            }
          },
          that
        )
      } else if (res.code === 100017 || res.code === 100018) {
        // 满人-弹窗
        uni.$u.toast('用户已达上限')
      } else if (res && res.code === 0) {
        uni.$u.toast('保存成功')
        setTimeout(() => {
          this.leftClick()
        }, 1000)
      } else {
        uni.$u.toast(res.msg || '保存失败')
      }
    },
    // 取消退户
    async cancelQuit(id) {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const [error, res] = await this.$to(
        apiCardServiceCardOperateCancelPersonQuitPost({
          card_user_ids: [id]
        })
      )
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }
      if (res && res.code === 0) {
        uni.$u.toast('取消成功')
        setTimeout(() => {
          this.leftClick()
        }, 1000)
      } else {
        uni.$u.toast(res.msg || '取消失败')
      }
    },
    // 提交表单
    async submit() {
      let params = {
        person_name: this.userForm.name,
        person_no: this.userForm.personNo,
        gender: this.userForm.gender,
        is_auto_group: this.userForm.isAutoGroup,
        id_number: this.userForm.idNumber ? encrypted(this.userForm.idNumber) : '',
        spare_field: this.userForm.spare_field,
        spare_field2: this.userForm.spare_field2
      }

      if (this.userForm.phone) {
        params.phone = this.userForm.phone
      }
      if (this.userForm.cardNumber) {
        params.card_no = this.userForm.cardNumber
      }
      if (this.userForm.age) {
        params.age = this.userForm.age
      }

      if (this.userForm.department && this.selectDepartment) {
        params.card_department_group_id = this.userForm.department
      }
      if (this.userForm.group && this.selectGroup) {
        params.card_user_group_ids = this.userForm.group ? [this.userForm.group] : []
      }

      if (this.userForm.validityDate) {
        params.effective_time = this.userForm.validityDate[0] + ' 00:00:00'
        params.expiration_time = this.userForm.validityDate[1] + ' 23:59:59'
      }

      this.$refs.userForm
        .validate()
        .then((res) => {
          // uni.$u.toast('校验通过')
          if (this.userForm.id) {
            params.card_user_id = this.userForm.id
            this.editCardUser(params)
          } else {
            this.addCardUser(params)
          }
        })
        .catch((errors) => {})
    },
    // 判断显/隐身份证
    async getSetting() {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const [error, res] = await this.$to(apiReportCenterDataReportGetSensitiveSettingPost())
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }
      if (res && res.code === 0) {
        this.sensitiveSetting = res.data
      }
    },
    // 分组
    async getGroupList(callBack) {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      this.groups = []
      const [error, res] = await this.$to(getCardServiceCardUserGroupList())
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }
      if (res && res.code === 0) {
        this.groups.push(res.data.results)
        callBack()
      }
    },
    // 部门
    async getDepartList(callBack) {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      this.departments = []
      const [error, res] = await this.$to(apiCardServiceCardDepartmentGroupTreeList())
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }
      if (res && res.code === 0) {
        this.departments = res.data
        callBack()
      }
    },
    // 获取自定义字段
    async getCardUserSpareFieldAlias() {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const [error, res] = await this.$to(apiCardServiceCardOperateGetSpareFieldAliasPost())
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }
      if (res && res.code === 0) {
        let result = res.data || {}
        this.spareField = result.spare_field
        this.spareField2 = result.spare_field2
      }
    },
    openDatePicker() {
      this.$refs.datePicker.show()
    },
    onCloseDatePick() {
      console.log('close')
    }
  },
  onReady() {
    // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.userForm.setRules(this.userRules)
  },

  onLoad() {
    // 从Vuex获取用户数据
    const userInfo = this.userFormData
    if (userInfo) {
      this.userForm.id = userInfo.id
      this.userForm.name = userInfo.name
      this.userForm.gender = userInfo.gender

      // 分组
      this.userForm.group = userInfo.card_user_groups[0] || '' // 单选
      this.selectGroup = userInfo.card_user_group_alias[0] || '' // 单选

      // 部门
      this.userForm.department = userInfo.card_department_group // id
      this.selectDepartment = userInfo.card_department_group_alias

      this.userForm.cardNumber = userInfo.card_no
      this.userForm.phone = userInfo.phone
      this.userForm.personNo = userInfo.person_no

      this.userForm.validityDate = userInfo.effective_time && userInfo.expiration_time ? [userInfo.effective_time, userInfo.expiration_time] : []
      this.userForm.isAutoGroup = userInfo.is_auto_group
      this.userForm.idNumber = userInfo.id_number ? decrypted(userInfo.id_number) : ''
      this.userForm.age = userInfo.age
      this.userForm.spare_field = userInfo.spare_field
      this.userForm.spare_field2 = userInfo.spare_field2

      // 如果存在初始选中的部门ID，将其添加到 initialSelectedDepartmentIds 数组
      if (this.userForm.department) {
        this.initialSelectedDepartmentIds = [this.userForm.department]
      }
    }
    this.getSetting()
    this.getGroupList(() => {})
    this.getDepartList(() => {})
    this.getCardUserSpareFieldAlias()
  },

  // 在组件销毁时清除Vuex中的数据
  beforeDestroy() {
    this.$store.dispatch('userForm/clearUserFormData')
  }
}
</script>

<style lang="scss" scoped>
.user_form_box {
  background: #f0f3f5;
  padding-bottom: 150rpx;
  /* #ifdef MP-WEIXIN */
  padding-bottom: calc(constant(150rpx + safe-area-inset-bottom));
  padding-bottom: calc(env(150rpx + safe-area-inset-bottom));
  /* #endif */
}
.form_box {
  padding: 40rpx 40rpx 0rpx 40rpx;
  background: #fff;
}
.btn_save_box {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 10rpx 0;

  // display: none;
  .btn_box {
    padding: 24rpx 40rpx;
    width: 100%;
  }
  // border:none;
  // height: 100rpx;
  // border-bottom: 1rpx solid #efefef;
  /* #ifdef MP-WEIXIN */
  bottom: calc(constant(safe-area-inset-bottom));
  bottom: calc(env(safe-area-inset-bottom));
  /* #endif */
}
.select-input {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

// ::v-deep .uni-calendar-item--before-checked {
//   background: #fd953c !important;
// }

// ::v-deep .uni-calendar-item--after-checked {
//   background: #fd953c !important;
// }

// ::v-deep .uni-calendar-item--multiple {
//   background: #fd953c !important;
// }

// ::v-deep .uni-calendar-item--checked {
//   background: #fd953c !important;
// }

// ::v-deep .uni-calendar-item--isDay {
//   background: #fd953c !important;
//   color: #fff !important;
// }

// ::v-deep .uni-calendar-item--isDay-text {
//   color: #fd953c;
// }
</style>
