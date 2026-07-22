# 逾期款项管理系统培训课件

这是一个部署到 GitHub Pages 的静态 HTML 培训课件站点，按照三个使用角色拆分，并按 Word 操作手册重新补全步骤、表格和截图。页面顺序为：管理员、业务人员、财务人员。

- `index.html`：培训入口与课程目录
- `management.html`：管理员周报与数据查看培训
- `sales.html`：业务人员逾期款系统操作培训
- `finance.html`：财务人员逾期款系统操作培训

## 页面功能

- 左侧栏目支持手动收起 / 展开
- 管理员课件包含 9 张操作截图
- 业务人员课件包含 11 张操作截图
- 财务课件包含 3 张操作截图
- 三个角色页面均已将截图压缩后内嵌到 HTML 中，GitHub Pages 发布时不依赖额外图片目录

## 图片素材

本地源截图保留在：

- `assets/screenshots-clear/sales/`
- `assets/screenshots-clear/finance/`
- `assets/screenshots-clear/management/`

这些截图由用户确认已经完成脱敏，可用于课件展示。

## 部署方式

GitHub Pages 使用 `main` 分支根目录发布：

`Settings -> Pages -> Build and deployment -> Source -> Deploy from a branch`

选择 `main` 分支和 `/ (root)` 目录后保存。
