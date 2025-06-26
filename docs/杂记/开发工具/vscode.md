## 1、代码格式化工具 prettier 配置

忽略文件：.prettierignore

配置一键格式化：

```js
  "scripts": {
    "prettier": "prettier --config ./.prettierrc.cjs --write \"./**/*.{js,vue}\" "
  },
```

### .prettierrc.cjs

```cjs
module.exports = {
  // 一行最多 160 字符

  printWidth: 160,

  // 使用 2 个空格缩进
  tabWidth: 2,

  // 不使用缩进符，而使用空格

  useTabs: false,

  // 行尾需要有分号

  semi: false,

  // 使用单引号

  singleQuote: true,

  // 对象的 key 仅在必要时用引号

  quoteProps: 'as-needed',

  // jsx 不使用单引号，而使用双引号

  jsxSingleQuote: false,

  // 末尾需要有逗号

  trailingComma: 'none',

  // 大括号内的首尾需要空格

  bracketSpacing: true,

  // jsx 标签的反尖括号需要换行

  jsxBracketSameLine: false,

  // 箭头函数，只有一个参数的时候，也需要括号

  arrowParens: 'always',

  // 每个文件格式化的范围是文件的全部内容

  rangeStart: 0,

  rangeEnd: Infinity,

  // 不需要写文件开头的 @prettier

  requirePragma: false,

  // 不需要自动在文件开头插入 @prettier

  insertPragma: false,

  // 使用默认的折行标准

  proseWrap: 'preserve',

  // 根据显示样式决定 html 要不要折行

  htmlWhitespaceSensitivity: 'css',

  // vue 文件中的 script 和 style 内不用缩进

  vueIndentScriptAndStyle: false,

  // 换行符使用 lf

  endOfLine: 'lf',

  // 格式化嵌入的内容

  embeddedLanguageFormatting: 'auto'
}
```

## 2、编译器统一工具 editorConfig

EditorConfig 帮助多个开发人员跨各种编辑器和 ide 在同一个项目上工作，维护一致的编码风格

### .editorconfig

```
root = true # 根目录的配置文件，编辑器会由当前目录向上查找，如果找到 `roor = true` 的文件，则不再查找

[*] # 匹配所有的文件

indent_style = space # 空格缩进

indent_size = 4 # 缩进空格为4个

end_of_line = lf # 文件换行符是 linux 的 `\n`

charset = utf-8 # 文件编码是 utf-8

trim_trailing_whitespace = true # 不保留行末的空格

insert_final_newline = true # 文件末尾添加一个空行

curly_bracket_next_line = false # 大括号不另起一行

spaces_around_operators = true # 运算符两遍都有空格

indent_brace_style = 1tbs # 条件语句格式是 1tbs

[*.js] # 对所有的 js 文件生效

quote_type = single # 字符串使用单引号

[*.{html,less,css,json}] # 对所有 html, less, css, json 文件生效

quote_type = double # 字符串使用双引号

[package.json] # 对 package.json 生效

indent_size = 2 # 使用2个空格缩进
```

## 3、eslint-config-alloy

推荐腾讯团队的 Eslint 配置限制 注意区分 vue 版本

- [git 地址](https://github.com/AlloyTeam/eslint-config-alloy)
- [rule 规则](https://alloyteam.github.io/eslint-config-alloy/?language=zh-CN&rule=base)