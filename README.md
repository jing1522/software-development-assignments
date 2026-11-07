# 软件开发作业（整理版）

把原本分散在 9 个 GitHub 仓库里的课程练习合并成一个仓库。合并使用 `git subtree`，**每个项目原有的提交历史都完整保留**，用 `git log` 可以逐条回溯。

- 前端练习 8 个：`frontend-practice/`
- 综合项目 1 个：`projects/`

合并前的总提交数：**110**。这些提交全部保留在新仓库里，此外还有 9 个子树合并提交、2 次远端补同步，以及若干整理类提交。

## 目录结构

```
software-development-assignments/
├── README.md
├── .gitignore
├── frontend-practice/
│   ├── frontend-practice-2/      个人主页、主题页（HTML 基础 + Git 练习）
│   ├── frontend-practice2/       调研表单、课程反馈表单（表单语义与 CSS 状态）
│   ├── frontend-practice3/       课程展示页、数模 AI 使用指南（Bootstrap 版与手写版对比）
│   ├── frontend-practice4/       消费统计、成绩统计（原生 JS 小工具）
│   ├── frontend-practice5/       我的课程表、任务清单（localStorage 增删改查）
│   ├── frontend-practice6/       图书馆数据看板、数模备赛看板（jQuery + ECharts/Chart.js）
│   ├── frontend-practice7/       旋转展示台、校园角标、太阳地球月亮（Three.js / A-Frame）
│   └── frontend-practice8/       校园信息中心、数模备赛小站原型（综合实践）
└── projects/
    └── rjkf-qimozy/              数模备赛小站（期末作品，多页面静态站点）
```

## 项目一览

| 目录 | 原仓库 | 内容 | 提交数 |
| --- | --- | --- | --- |
| `frontend-practice/frontend-practice-2` | [frontend-practice](https://github.com/jing1522/frontend-practice)（原 `frontend-practice-2`，已改名） | 第一个页面、个人主页、主题页（数模比赛的 AI 使用建议），HTML 与 Git 入门练习 | 20 |
| `frontend-practice/frontend-practice2` | [frontend-practice2](https://github.com/jing1522/frontend-practice2) | 数模 AI 工具使用调研表单、课程反馈表单，练习表单语义、label 关联与纯 CSS 状态 | 11 |
| `frontend-practice/frontend-practice3` | [frontend-practice3](https://github.com/jing1522/frontend-practice3) | 课程展示页（同一页面手写 CSS 与 Bootstrap 两版）、数模 AI 使用指南专题页 | 16 |
| `frontend-practice/frontend-practice4` | [frontend-practice4](https://github.com/jing1522/frontend-practice4) | 消费统计、成绩统计两个原生 JS 小工具，含数组排序与数据聚合 | 7 |
| `frontend-practice/frontend-practice5` | [jing1522-frontend-practice5](https://github.com/jing1522/jing1522-frontend-practice5) | 我的课程表、任务清单，练习事件处理与 localStorage 持久化，另含 research 目录的探究版 | 17 |
| `frontend-practice/frontend-practice6` | [frontend-practice6](https://github.com/jing1522/frontend-practice6) | 图书馆借阅数据看板（案例复现）、数模竞赛备赛看板（自主实践），jQuery + ECharts + Chart.js | 15 |
| `frontend-practice/frontend-practice7` | [jing1522-jing1522-frontend-practice7](https://github.com/jing1522/jing1522-jing1522-frontend-practice7) | Three.js / A-Frame 三维练习：旋转展示台、校园角标、太阳–地球–月亮，含交互与性能对比研究 | 7 |
| `frontend-practice/frontend-practice8` | [frontend-practice8](https://github.com/jing1522/frontend-practice8) | 前端综合实践：迷你版校园信息中心（案例复现）+ 数模竞赛问卷单页站（自主实践） | 15 |
| `projects/rjkf-qimozy` | [rjkf-qimozy](https://github.com/jing1522/rjkf-qimozy) | 软件开发综合实践期末作品「数模备赛小站」：首页、我的准备、我的心得、三维沙盘、问卷五个页面 | 2 |

## 技术要点

- **纯静态前端**：全部页面都是 HTML + CSS + 原生/原生风格 JS，没有构建步骤。
- **第三方库本地化**：Bootstrap 5.3、jQuery 3.7.1、ECharts 5.5、Chart.js 4.4、A-Frame 1.7、Three.js 都放在各项目的 `libs/` 目录里，断网也能跑。
- **数据驱动**：`frontend-practice6`、`frontend-practice8`、`projects/rjkf-qimozy` 用 `fetch` 读取 JSON，配合 localStorage 做本地增删改。

## 怎么运行

多数页面会 `fetch` 本地 JSON，**直接双击 `index.html`（`file://`）会加载失败**，需要用本地服务器打开。任选一种：

```bash
# 方式一：Node.js 起一个静态服务器（在目标项目目录下执行）
npx --yes http-server . -p 8080

# 方式二：Python
python -m http.server 8080
```

然后浏览器访问 `http://127.0.0.1:8080/`。用 VS Code 的 Live Server 插件右键打开同样可以。

少数纯静态页面（例如 `frontend-practice-2`、`frontend-practice3` 的课程页、`frontend-practice4` 的两个统计工具）不读外部数据，双击也能直接看。

## 关于提交历史

每个项目都是用它自己的仓库历史合并进来的，不是复制文件。原仓库的提交都挂在对应合并提交的**第二个父提交**下面：

```bash
# 1) 找到某个项目的合并提交（消息里带 from commit '...'）
git log --merges --oneline -1 -- frontend-practice/frontend-practice7
# 例如：ab79acb Add 'frontend-practice/frontend-practice7/' from commit '7166a87...'

# 2) 从该合并提交的第二个父提交回溯，就是原仓库的完整历史
git log --oneline ab79acb^2

# 看整棵合并图
git log --graph --oneline --all
```

合并提交消息里 `from commit '...'` 后面的 SHA，就是合并时该仓库的最新提交。

> 小提示：subtree 合并后，`git log -- 路径` 只匹配“该路径存在过”的提交，所以按目录过滤通常只看到合并提交本身，这是正常的；查完整历史请用上面的 `^2` 写法。

## 原仓库

合并完成后，原仓库会归档（或删除），仓库名为 `software-development-assignments`。上表的「原仓库」一列保留了对应关系，需要找回某个项目的历史时按名字对应即可。
