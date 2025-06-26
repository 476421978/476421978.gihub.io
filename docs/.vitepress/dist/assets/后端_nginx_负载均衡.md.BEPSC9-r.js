import{bS as s,w as n,aG as a,I as p}from"./chunks/framework.CqaskQ-N.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"后端/nginx/负载均衡.md","filePath":"后端/nginx/负载均衡.md"}'),e={name:"后端/nginx/负载均衡.md"},l=p(`<h3 id="nginx" tabindex="-1">nginx <a class="header-anchor" href="#nginx" aria-label="Permalink to &quot;nginx&quot;">​</a></h3><ul><li>负载均衡 upstream</li><li>域名配置</li><li>443 https配置</li></ul><p>命令</p><ul><li>检查：nginx -t</li><li>重启：nginx -s reload</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>#upstream qysocket {</span></span>
<span class="line"><span>#    server    127.0.0.1:8848 weight=2;</span></span>
<span class="line"><span>#    server    127.0.0.1:8849 weight=1;</span></span>
<span class="line"><span>#}</span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>       listen 80;</span></span>
<span class="line"><span>       server_name 域名;</span></span>
<span class="line"><span>       rewrite ^(.*)$ https://\${server_name}$1 permanent;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>        # https</span></span>
<span class="line"><span>       listen 443 ssl;</span></span>
<span class="line"><span>       server_name 域名;</span></span>
<span class="line"><span>       # 证书    </span></span>
<span class="line"><span>       ssl_certificate      /etc/nginx/ssh/ibangche.com/1_ibangche.com_bundle.crt;</span></span>
<span class="line"><span>       ssl_certificate_key  /etc/nginx/ssh/ibangche.com/2_ibangche.com.key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>       ssl_session_timeout  5m;</span></span>
<span class="line"><span>       client_max_body_size 10m;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>       location / {</span></span>
<span class="line"><span>            proxy_set_header Upgrade $http_upgrade;</span></span>
<span class="line"><span>            proxy_set_header Connection &quot;upgrade&quot;;    # socket配置</span></span>
<span class="line"><span>            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span>            proxy_set_header Host $host;</span></span>
<span class="line"><span>            proxy_pass  http://qysocket;</span></span>
<span class="line"><span>	        proxy_pass http://127.0.0.1:8848;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>upstream：这个模块提供一个简单方法来实现在轮询和客户端IP之间的后端服务器负荷平衡 <ul><li>官网：<a href="https://www.nginx.cn/doc/standard/httpupstream.html" target="_blank" rel="noreferrer">https://www.nginx.cn/doc/standard/httpupstream.html</a></li></ul></li></ul>`,6),t=[l];function i(c,r,o,_,d,h){return a(),n("div",null,t)}const g=s(e,[["render",i]]);export{u as __pageData,g as default};
