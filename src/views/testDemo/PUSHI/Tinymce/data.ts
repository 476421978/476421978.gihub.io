export const settings = {
  content_style: "img{max-width:100%;height:auto;}p {margin: 0px;}",
  toolbar: `insertfile undo redo
    | charmap bold italic underline strikethrough subscript superscript
    | inserttable table tableprops deletetable cell row alignleft aligncenter alignright alignjustify bullist numlist outdent indent image
  `,
  menu: {
    file: { title: "File", items: "preview | importword exportpdf exportword | print | deleteallconversations" } // 去掉新建文档 'newdocument' 菜单项
  },
  plugins: "table charmap preview image link",
  language_url: "/tinymce/langs/zh_CN.js", // 语言包的路径，具体路径看自己的项目
  language: "zh_CN", // 语言
  skin_url: "/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
  branding: false, // 是否禁用“Powered by TinyMCE”
  promotion: false, //去掉 upgrade
  paste_data_images: true, //允许粘贴图像
  image_dimensions: false, //去除宽高属性
  convert_urls: false, // 取消图片资源路径转换
  link_default_target: "_blank", // 超链接默认打开方式
  image_caption: true, // 图片标题
  editimage_cors_hosts: ["picsum.photos"], // 图片跨域
  noneditable_class: "mceNonEditable", // 不可编辑的样式
  toolbar_mode: "wrap", // 工具栏模式 floating / sliding / scrolling / wrap
  image_advtab: true, // 菜单栏图片高级标签
  importcss_append: true, // 导入css
  paste_webkit_styles: "all", // 粘贴样式
  paste_merge_formats: true, // 粘贴合并格式
  nonbreaking_force_tab: false, // 强制换行
  paste_auto_cleanup_on_paste: false, // 粘贴自动清理
  file_picker_types: "file", // 文件类型
  autoresize_bottom_margin: 20, // 编辑器高度自适应
  autoresize_overflow_padding: 16, // 编辑器高度自适应
  font_size_formats: "12px 14px 16px 18px 24px 28px 32px 36px 48px", // 文字大小
  content_css: "/tinymce/skins/content/default/content.css" //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
}
