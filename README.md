# 数据看板（课堂作业六）

用 jQuery + ECharts + Chart.js 做的两个数据看板：`dashboard/` 是案例复现（图书馆借阅月报），`my-dashboard/` 是自主实践（数模竞赛备赛看板）。

## 怎么运行

**不能直接双击 `index.html` 打开。** 用 `file://` 打开时，浏览器会拦掉页面里的 fetch 请求，页面只会显示「加载失败：Failed to fetch」。必须用一个本地服务器打开（地址栏是 `http://` 开头），二选一：

**方法一：VS Code + Live Server（不用装 Node）**

1. 用 VS Code 打开这个文件夹
2. 在扩展里搜 `Live Server` 装上
3. 右键 `dashboard/index.html` → `Open with Live Server`
4. 想看自主实践的看板，就把第 3 步换成右键 `my-dashboard/index.html`

**方法二：Node 的 http-server**

在仓库根目录执行（第一次会联网下载这个包）：

```
npx http-server -p 8080
```

然后用浏览器访问：

- 案例复现看板：<http://127.0.0.1:8080/dashboard/>
- 自主实践看板：<http://127.0.0.1:8080/my-dashboard/>

两种方法效果一样。关掉那个命令行窗口 / 停止 Live Server，就等于停掉服务器。

## 目录

- `dashboard/`：案例复现看板，数据在 `dashboard/data/books.json`（课堂统一数据）
- `my-dashboard/`：自主实践看板，数据在 `my-dashboard/data/prep.json`（实际）和 `plan.json`（计划）
- 两个文件夹里各有一份 `libs/`，jQuery、Bootstrap、ECharts、Chart.js 都放在本地，不联网也能打开
