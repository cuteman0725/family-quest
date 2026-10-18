// 把 App 打包成單一個 HTML 檔（CSS、JS 全部內嵌），用來發佈成手機預覽頁。
// 用法：npm run build:artifact → dist-artifact/family-quest.html
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const out = 'dist-artifact'
execSync('npx vite build --mode artifact', { stdio: 'inherit' })

const html = readFileSync(join(out, 'index.html'), 'utf8')
const cssFile = html.match(/href="\.\/(assets\/[^"]+\.css)"/)?.[1]
const jsFile = html.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1]
if (!cssFile || !jsFile) throw new Error('找不到打包後的 CSS 或 JS')

const css = readFileSync(join(out, cssFile), 'utf8')
// 避免內嵌的程式碼裡出現 </script> 提早結束標籤
const js = readFileSync(join(out, jsFile), 'utf8').replace(/<\/script/gi, '<\\/script')

const page = `<title>家庭闖關村</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`
writeFileSync(join(out, 'family-quest.html'), page)
console.log(`✓ ${join(out, 'family-quest.html')}（${(page.length / 1024).toFixed(0)} KB）`)
