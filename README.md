# 逾期款项管理系统培训课件

这是一个部署到 GitHub Pages 的静态 HTML 培训课件站点，按照三个使用角色拆分，并依据 Word 操作手册补全步骤、表格和截图。页面顺序为：管理员、业务人员、财务人员。

- `index.html`：培训入口与课程目录
- `management.html`：管理员周报与数据查看培训
- `sales.html`：业务人员逾期款系统操作培训
- `finance.html`：财务人员逾期款系统操作培训

## 页面功能

- 左侧栏目支持手动收起 / 展开
- 多种操作方式采用左右并排展示，左侧为推荐方式
- 管理员课件包含 9 张操作截图
- 业务人员课件包含 11 张操作截图
- 财务人员课件包含 3 张操作截图
- 三个角色页面均已将截图压缩后内嵌到 HTML 中，GitHub Pages 发布时不依赖额外图片目录
- 页面右下角提供“标注模式”：开启后点击图片、步骤或文字，输入修改意见，再点击“复制清单”发给维护人员即可继续调整

## 标注模式使用方法

1. 打开任一课件页面。
2. 点击右下角“开启标注”。
3. 点击需要修改的图片、步骤、标题或文字。
4. 在弹窗中输入修改意见。
5. 标完后点击“复制清单”，把复制出来的内容发给维护人员。

如标错了，可点击“清空标注”重新开始。标注只保存在当前浏览器本地，不会自动上传到 GitHub。

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
