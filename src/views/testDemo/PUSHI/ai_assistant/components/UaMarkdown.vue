<!-- uniapp vue2 markdown解析 -->
<template>
  <view>
    <view class="ua__markdown">
      <u-parse
        class="markdown_body"
        :class="{
          'dynamic-style': ['edit_user', 'add_user', 'jump_path'].includes(commandInfo.cmd_key)
        }"
        :content="parseNodes(source)"
        :tagStyle="style"
      />

      <template v-if="commandInfo.cmd_key === 'jump_path'">
        <view class="user_info_box" @click="onJump">
          <view class="info_box">
            <text style="color: #fd953c; font-size: 28rpx">
              {{ commandInfo.title }}
            </text>
            <img style="width: 10rpx; height: 20rpx; margin-left: 10rpx" src="/static/image/ai_assistant/ai_arrow.png" mode="aspectFill" />
          </view>
        </view>
      </template>

      <template v-if="commandInfo.cmd_key === 'edit_user'">
        <view v-if="userList && userList.length === 1" class="user_info_box">
          <view style="height: 10rpx; background: #f5f5f5; margin: 0 -25rpx" />
          <view class="info_box">
            <view class="title">用户信息</view>
            <u-line></u-line>
            <view class="content_box">
              <view class="item">姓名: {{ userList[0].name }}</view>
              <view class="item">人员编号: {{ userList[0].person_no }}</view>
              <view class="item">性别: {{ userList[0].gender_alias }}</view>
              <view class="item">手机号: {{ userList[0].phone | filterIdDesPhone }}</view>
              <view class="item">卡号：{{ userList[0].card_no || '--' }}</view>
              <view class="item">分组：{{ userList[0].department_group_name || '--' }}</view>
              <view class="item">部门：{{ userList[0].card_department_group_alias || '--' }}</view>
              <view class="item">
                有效期：{{ userList[0].effective_time | filterTime }} 至
                {{ userList[0].expiration_time | filterTime }}
              </view>
              <view class="item">身份证号：{{ userList[0].id_number | filterIdDesIdNumber }}</view>
              <view class="item">年龄：{{ userList[0].age || '--' }}</view>
              <view class="item">{{ spareField }}：{{ userList[0].spare_field || '--' }}</view>
              <view class="item">{{ spareField2 }}：{{ userList[0].spare_field2 || '--' }}</view>
              <u-button type="primary" size="small" style="margin-top: 10rpx" @click="onEditorUser(userList[0])"> 编辑 </u-button>
            </view>
          </view>
        </view>

        <view v-else-if="userList && userList.length > 1" class="user_info_box">
          <view class="info_box">
            <view style="margin-bottom: 20rpx">找到多个用户信息。</view>
            <view class="content_box_btn">
              <template v-for="item in userList">
                <view class="btn_box" :key="item.id">
                  <view class="name">{{ item.name }}（编号：{{ item.person_no }}）</view>
                  <view class="btn">
                    <u-button type="primary" size="small" @click="onEditorUser(item)"> 编辑 </u-button>
                  </view>
                </view>
              </template>
            </view>
          </view>
        </view>

        <view v-else class="user_info_box">未找到用户</view>
      </template>

      <template v-if="commandInfo.cmd_key === 'add_user'">
        <view class="user_info_box">
          <view>是否立即新增用户。</view>
          <view style="width: 160rpx; margin-top: 10rpx">
            <u-button type="primary" size="small" @click="onAddUser()">新增用户</u-button>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import MarkdownIt from '@/uni_modules/markdown/lib/markdown-it.min.js'
import { mapGetters } from 'vuex'
import { apiCardServiceCardUserListPost } from '@/api/ai_assistant'
import dayjs from 'dayjs'
import { decrypted } from '@/utils/aesUtil'
export default {
  name: 'UaMarkdown',
  props: {
    source: String,
    showLine: { type: [Boolean, String], default: true },
    spareField: {
      type: String,
      default: '备用字段1'
    },
    spareField2: {
      type: String,
      default: '备用字段2'
    }
  },
  computed: {
    ...mapGetters(['color'])
  },
  filters: {
    filterTime(value) {
      return dayjs(value).format('YYYY-MM-DD') || ''
    },
    filterIdDesIdNumber(value) {
      return decrypted(value).replace(/(\d{6})\d{6}(\d{6})/g, '$1******$2') || '--'
    },
    filterIdDesPhone(value) {
      return value.replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2') || '--'
    }
  },
  data() {
    return {
      userList: [],
      markdown: null,
      copyCodeData: [],
      style: {
        h1: 'font-size: 42rpx;padding-top:24rpx;margin-bottom:24rpx',
        h2: 'font-size: 38rpx;padding-top:24rpx;margin-bottom:24rpx',
        h3: 'font-size: 34rpx;padding-top:24rpx;margin-bottom:24rpx',
        h4: 'font-size: 30rpx;padding-top:24rpx;margin-bottom:24rpx',
        h5: 'font-size: 26rpx;padding-top:24rpx;margin-bottom:24rpx',
        strong: 'font-size:30rpx;font-weight: 700;'
      },
      // 之后扩展 cmd_key 实现不同前端交互效果
      commandInfo: {
        cmd_key: '',
        title: '',
        path: '/'
      },
      lastParsedSource: '',
      lastParsedHtml: ''
    }
  },
  async mounted() {
    this.markdown = MarkdownIt({
      html: true,
      typographer: true, // 启用智能标点
      linkify: true // 自动识别链接
    })
  },
  methods: {
    // 格式化查询参数
    formatQueryParams(obj) {
      const result = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // 使用 Object.prototype.hasOwnProperty.call
          const value = obj[key]
          // 检查值是否为空
          if (
            value !== null &&
            value !== undefined &&
            value !== '' &&
            !(Array.isArray(value) && value.length === 0) &&
            !(value instanceof Object && Object.keys(value).length === 0)
          ) {
            result[key] = value
          }
        }
      }
      return result
    },
    // 新增用户
    onAddUser() {
      this.$Router.push({
        path: '/pages/ai_assistant/user_form/index'
      })
    },
    // 编辑用户
    onEditorUser(item) {
      const params = {
        id: item.id,
        name: item.name,
        gender: item.gender,
        card_no: item.card_no || '',
        phone: item.phone || '',
        person_no: item.person_no || '',
        effective_time: item.effective_time ? dayjs(item.effective_time).format('YYYY-MM-DD') : '',
        expiration_time: item.expiration_time ? dayjs(item.expiration_time).format('YYYY-MM-DD') : '',
        is_auto_group: item.is_auto_group || false,
        id_number: item.id_number || '',
        age: item.age || '',
        spare_field: item.spare_field || '',
        spare_field2: item.spare_field2 || '',
        card_user_groups: item.card_user_groups || [],
        card_user_group_alias: item.card_user_group_alias || [],
        card_department_group_alias: item.card_department_group_alias || '',
        card_department_group: item.card_department_group || ''
      }
      // 使用Vuex存储用户数据
      this.$store.dispatch('userForm/setUserFormData', params)
      this.$miRouter.push({
        path: '/pages/ai_assistant/user_form/index'
      })
    },
    // 查询用户列表
    async getUserInfo() {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const params = this.commandInfo.query

      const [error, res] = await this.$to(
        apiCardServiceCardUserListPost({
          is_self_org: false,
          page: 1,
          page_size: 10,
          ...this.formatQueryParams(params)
        })
      )
      uni.hideLoading()
      if (error) {
        error.message && uni.$u.toast(error.message)
        return
      }
      if (res && res.code === 0) {
        this.userList = res.data.results || []
      }
    },
    onJump() {
      this.$miRouter.push({
        path: this.commandInfo.path
      })
    },
    parseNodes(value) {
      if (!value) return ''
      if (!this.markdown) return ''

      if (value === this.lastParsedSource) {
        return this.lastParsedHtml
      }

      value = value.replace(/<br>|<br\/>|<br \/>/g, '\n')
      value = value.replace(/&nbsp;/g, ' ')
      let htmlString = ''
      if (value.split('```').length % 2) {
        let mdtext = value
        if (mdtext[mdtext.length - 1] !== '\n') {
          mdtext += '\n'
        }
        htmlString = this.markdown.render(mdtext)
      } else {
        htmlString = this.markdown.render(value)
      }
      // 解决小程序表格边框型失效问题
      htmlString = htmlString.replace(/<table/g, `<table class="table"`)
      htmlString = htmlString.replace(/<tr/g, `<tr class="tr"`)
      htmlString = htmlString.replace(/<th>/g, `<th class="th">`)
      htmlString = htmlString.replace(/<td/g, `<td class="td"`)
      htmlString = htmlString.replace(/<hr>|<hr\/>|<hr \/>/g, `<hr class="hr">`)

      // 解析 command 标签
      const regex = /<command(?:\s+[^>]*)?>([\s\S]*?)<\/command>/g
      let match

      while ((match = regex.exec(htmlString)) !== null) {
        // 修复 JSON 格式
        const fixedJson = match[1]
          .replace(/“/g, '"') // 替换中文引号 “
          .replace(/”/g, '"') // 替换中文引号 ”

        try {
          const newCommandInfo = JSON.parse(fixedJson.trim()) || {}
          // 只要最后一个common标签
          if (JSON.stringify(newCommandInfo) !== JSON.stringify(this.commandInfo)) {
            this.commandInfo = newCommandInfo
          }
        } catch (error) {
          console.error('JSON parsing error:', error)
        }
      }
      htmlString = htmlString.replace(regex, '')

      // 根据commandInfo类型查询用户信息
      if (this.commandInfo.cmd_key === 'edit_user') {
        this.getUserInfo()
      }

      this.lastParsedSource = value
      this.lastParsedHtml = htmlString
      return htmlString
    }
  }
}
</script>

<style lang="scss" scoped>
// .ua__markdown {
//   padding: 20rpx 24rpx;
// }

// .jump_box {
//   display: flex;
//   // width: 100%;
//   justify-content: flex-start;
//   align-items: center;
//   flex-wrap: wrap;
//   margin: 10rpx 0;
//   // background-color: #fff;
//   display: inline-block;
//   word-break: break-word;
//   text {
//     color: #fd953c;
//     font-size: 28rpx;
//   }
// }

.user_info_box {
  background: #fff;
  font-size: 32rpx;
  padding: 0 20rpx 24rpx 20rpx;
  border-radius: 0 0 16rpx 0;
  .info_box {
    .title {
      font-size: 32rpx;
      line-height: 60rpx;
    }
    .content_box {
      .item {
        line-height: 60rpx;
      }
    }
    .content_box_btn {
      .btn_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20rpx;
        .name {
          flex: 1;
        }
        .btn {
          width: 120rpx;
          // height: 46rpx;
        }
        &:last-child {
          padding-bottom: 0;
        }
      }
    }
  }
}

.markdown_body {
  background: #fff;
  font-size: 32rpx;
  padding: 20rpx 24rpx;
  border-radius: 16rpx 16rpx 16rpx 0;
  display: table;
  max-width: 100%;
  word-break: break-word;
}

.dynamic-style {
  display: block;
  border-radius: 16rpx 16rpx 0 0;
}
</style>
