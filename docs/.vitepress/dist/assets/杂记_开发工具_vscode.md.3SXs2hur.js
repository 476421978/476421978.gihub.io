import{bS as s,w as n,aG as a,I as p}from"./chunks/framework.CqaskQ-N.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"杂记/开发工具/vscode.md","filePath":"杂记/开发工具/vscode.md"}'),e={name:"杂记/开发工具/vscode.md"},l=p(`<h2 id="_1、代码格式化工具-prettier-配置" tabindex="-1">1、代码格式化工具 prettier 配置 <a class="header-anchor" href="#_1、代码格式化工具-prettier-配置" aria-label="Permalink to &quot;1、代码格式化工具 prettier 配置&quot;">​</a></h2><p>忽略文件：.prettierignore</p><p>配置一键格式化：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;scripts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;prettier&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;prettier --config ./.prettierrc.cjs --write </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">./**/*.{js,vue}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span></code></pre></div><h3 id="prettierrc-cjs" tabindex="-1">.prettierrc.cjs <a class="header-anchor" href="#prettierrc-cjs" aria-label="Permalink to &quot;.prettierrc.cjs&quot;">​</a></h3><div class="language-cjs vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cjs</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>module.exports = {</span></span>
<span class="line"><span>  // 一行最多 160 字符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  printWidth: 160,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 使用 2 个空格缩进</span></span>
<span class="line"><span>  tabWidth: 2,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 不使用缩进符，而使用空格</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  useTabs: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 行尾需要有分号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  semi: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 使用单引号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  singleQuote: true,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 对象的 key 仅在必要时用引号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  quoteProps: &#39;as-needed&#39;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // jsx 不使用单引号，而使用双引号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  jsxSingleQuote: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 末尾需要有逗号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  trailingComma: &#39;none&#39;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 大括号内的首尾需要空格</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  bracketSpacing: true,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // jsx 标签的反尖括号需要换行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  jsxBracketSameLine: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 箭头函数，只有一个参数的时候，也需要括号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  arrowParens: &#39;always&#39;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 每个文件格式化的范围是文件的全部内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  rangeStart: 0,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  rangeEnd: Infinity,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 不需要写文件开头的 @prettier</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  requirePragma: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 不需要自动在文件开头插入 @prettier</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  insertPragma: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 使用默认的折行标准</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  proseWrap: &#39;preserve&#39;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 根据显示样式决定 html 要不要折行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  htmlWhitespaceSensitivity: &#39;css&#39;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // vue 文件中的 script 和 style 内不用缩进</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vueIndentScriptAndStyle: false,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 换行符使用 lf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  endOfLine: &#39;lf&#39;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 格式化嵌入的内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  embeddedLanguageFormatting: &#39;auto&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="_2、编译器统一工具-editorconfig" tabindex="-1">2、编译器统一工具 editorConfig <a class="header-anchor" href="#_2、编译器统一工具-editorconfig" aria-label="Permalink to &quot;2、编译器统一工具 editorConfig&quot;">​</a></h2><p>EditorConfig 帮助多个开发人员跨各种编辑器和 ide 在同一个项目上工作，维护一致的编码风格</p><h3 id="editorconfig" tabindex="-1">.editorconfig <a class="header-anchor" href="#editorconfig" aria-label="Permalink to &quot;.editorconfig&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>root = true # 根目录的配置文件，编辑器会由当前目录向上查找，如果找到 \`roor = true\` 的文件，则不再查找</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[*] # 匹配所有的文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>indent_style = space # 空格缩进</span></span>
<span class="line"><span></span></span>
<span class="line"><span>indent_size = 4 # 缩进空格为4个</span></span>
<span class="line"><span></span></span>
<span class="line"><span>end_of_line = lf # 文件换行符是 linux 的 \`\\n\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>charset = utf-8 # 文件编码是 utf-8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trim_trailing_whitespace = true # 不保留行末的空格</span></span>
<span class="line"><span></span></span>
<span class="line"><span>insert_final_newline = true # 文件末尾添加一个空行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>curly_bracket_next_line = false # 大括号不另起一行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>spaces_around_operators = true # 运算符两遍都有空格</span></span>
<span class="line"><span></span></span>
<span class="line"><span>indent_brace_style = 1tbs # 条件语句格式是 1tbs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[*.js] # 对所有的 js 文件生效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>quote_type = single # 字符串使用单引号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[*.{html,less,css,json}] # 对所有 html, less, css, json 文件生效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>quote_type = double # 字符串使用双引号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[package.json] # 对 package.json 生效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>indent_size = 2 # 使用2个空格缩进</span></span></code></pre></div><h2 id="_3、eslint-config-alloy" tabindex="-1">3、eslint-config-alloy <a class="header-anchor" href="#_3、eslint-config-alloy" aria-label="Permalink to &quot;3、eslint-config-alloy&quot;">​</a></h2><p>推荐腾讯团队的 Eslint 配置限制 注意区分 vue 版本</p><ul><li><a href="https://github.com/AlloyTeam/eslint-config-alloy" target="_blank" rel="noreferrer">git 地址</a></li><li><a href="https://alloyteam.github.io/eslint-config-alloy/?language=zh-CN&amp;rule=base" target="_blank" rel="noreferrer">rule 规则</a></li></ul>`,13),i=[l];function t(c,r,o,h,d,u){return a(),n("div",null,i)}const _=s(e,[["render",t]]);export{k as __pageData,_ as default};
