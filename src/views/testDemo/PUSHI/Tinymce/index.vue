<template>
  <div style="height: 100%; overflow: hidden">
    <editor :id="tinymceId" v-model="myValue" :init="init" :disabled="disabled"></editor>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive, inject } from 'vue' //全屏
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
// import "tinymce/skins/content/default/content.css"
import 'tinymce/icons/default/icons'
import 'tinymce/models/dom' // 一定要引入
import 'tinymce/themes/silver' // 界面UI主题
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 文字计数
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/emoticons' // emoji表情
import 'tinymce/plugins/emoticons/js/emojis.js' //必须引入这个文件才有表情图库
import 'tinymce/plugins/code' // 编辑源码
import 'tinymce/plugins/link' // 链接插件
import 'tinymce/plugins/advlist' //高级列表
import 'tinymce/plugins/codesample' //代码示例
import 'tinymce/plugins/autoresize' // 自动调整编辑器大小
import 'tinymce/plugins/quickbars' // 光标处快捷提示
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/searchreplace' //查找替换
import 'tinymce/plugins/autolink' //自动链接
import 'tinymce/plugins/directionality' //文字方向
import 'tinymce/plugins/visualblocks' //显示元素范围
import 'tinymce/plugins/visualchars' //显示不可见字符
import 'tinymce/plugins/charmap' // 特殊符号
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/insertdatetime' //插入日期时间
import 'tinymce/plugins/importcss' //引入自定义样式的css文件
import 'tinymce/plugins/accordion' // 可折叠数据手风琴模式
import 'tinymce/plugins/anchor' //锚点
import 'tinymce/plugins/fullscreen'
import { apiBackgroundFileChannelUploadFile } from '@/api'
import to from 'await-to-js'
import { settings } from './data'

const emits = defineEmits(['update:modelValue', 'setHtml'])
//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
  // 内容
  value: {
    type: String,
    default: () => {
      return ''
    }
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 最小高度
  height: {
    type: Number,
    default: 400
  }
})
//定义一个对象 init初始化
const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''))
const init = reactive({
  ...settings,
  selector: '#' + tinymceId.value, //富文本编辑器的id,
  disabled: props.disabled, // 是否禁用
  height: props.height, // 编辑器高度自适应
  // 图片上传
  images_upload_handler: (blobInfo: any, progress: any) =>
    new Promise(async (resolve, reject) => {
      let file = blobInfo.blob()
      if (file.size / 1024 / 1024 > 20) {
        reject('上传失败，图片大小请控制在 20M 以内')
      }
      const formData = new FormData()
      formData.append('file', file)
      const [err, res]: any = await to(apiBackgroundFileChannelUploadFile(formData))
      if (err) {
        reject(err)
      }
      if (res && res.code === 0) {
        resolve(res.data.public_url)
      } else {
        reject(res.msg)
      }
    }),
  init_instance_callback: (editor: any) => {
    // tinymce.activeEditor?.setContent("默认值")
  }
})

// 外部传递进来的数据变化
const myValue = computed({
  get() {
    return props.value
  },
  set(val: any) {
    emits('update:modelValue', val)
  }
})

//初始化编辑器
onMounted(() => {
  tinymce.init({})
})

// 设置值
const handleSetContent = (content: string) => {
  tinymce.activeEditor?.setContent(content)
}

// 获取值
const handleGetContent = () => {
  return tinymce.activeEditor?.getContent()
}

defineExpose({
  handleSetContent,
  handleGetContent
})
</script>

<style lang="scss" scoped>
:deep(.tox-tinymce) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  .tox-statusbar {
    display: none;
  }
}
</style>
