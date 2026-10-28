# 持续开发与发布

独立仓库： https://github.com/hindingonhome/wupai 。开发者 CHAMBER，邮箱 97101yy@gmail.com。

## 换电脑继续

克隆完整仓库，保留源码、assets、vendor、android 和 release-assets，不是只复制 Markdown。运行 `npm ci`，用 Codex 打开整个目录，先阅读 AGENTS.md。不要只编辑生成的 HTML。

## 更新版本

1. 修改源码、资源或固定缩略图，运行 `npm test`、`npm run build` 和浏览器检查。
2. 更新 package.json 三段版本号，例如 1.2.2，并在 docs/releases/V1.2.2.md 写变更说明。
3. 同时更新 CHANGELOG.md。提交并推送 main，GitHub Actions 构建四个平台 ZIP、直接安装的安卓 APK 与校验表，共六项，并发布对应 V 标签。
4. 检查 Actions 成功以及 Releases 附件。已发布版本不会自动覆盖，通常应递增版本号。

## 安卓签名

应用标识为 `cn.chamber.qiwuzhijian`。后续更新须保留同一签名密钥。仓库不保存密钥或密码，发布使用 GitHub 仓库秘密配置：ANDROID_KEYSTORE_BASE64、ANDROID_KEYSTORE_PASSWORD、ANDROID_KEY_ALIAS。

本机签名备份在项目目录之外，换电脑时单独安全备份，不提交到公开仓库。

本地先执行 `npm run mobile:sync`，设置 ANDROID_HOME 指向 SDK，再设置 ANDROID_KEYSTORE_PATH、ANDROID_KEYSTORE_PASSWORD、ANDROID_KEY_ALIAS；进入 android 目录，运行 `./gradlew assembleRelease`（Windows 用 `./gradlew.bat assembleRelease`）。

更新版本号时同时运行 `npm install --package-lock-only` 同步锁文件。版本号的三个数字每段应小于 1000，安卓版本代码由三段数字计算。

## 项目维护

桌面和手机网页内嵌资源。APK 使用包内拆分资源，避免解析巨大的内嵌网页。release-assets/native-usdz 为 iPhone 原生查看资源，不含网页交互；这些模型统一归入 iPhone ZIP 的 Models 文件夹，不再单独上传。

`npm run build -- --native` 在 `.release-work` 准备网页与模型。签名 APK 也放入该目录，再运行 `npm run package:platforms` 和 `node scripts/checksums.mjs`。`dist` 只包含四个平台 ZIP、直接 APK、SHA256SUMS.txt；每个平台包带有独立说明、通用操作指南和 CHANGELOG.md。Windows 包含便携 EXE，Linux 包含 AppImage、Launch.sh 和可选菜单入口脚本；HTML 位于 Backup-HTML。运行 `node node_modules/electron/install.js` 安装桌面构建运行时，随后 `npm run desktop:prepare`、`npm run desktop:build -- --win portable --x64` 或 Linux 的 `--linux AppImage --x64`。两个桌面二进制放入 `.release-work` 后再打包。

固定缩略图放在 assets/thumbs，不恢复实时重绘。水果着色程序共用 uniform 调色板，避免不同水果反复编译。新增系列仍检查 UV、露铜遮罩、完整缩略图和居中图标，遵循 AGENTS.md。

本项目不包含金属工坊、其他算法网页、旧交付历史、个人申请表或聊天附件。此前“实用软件”中的交付保留为历史，后续以本目录为独立开发位置。

## 正式文档同步

V1.1.1起，PRODUCT_README.md、LICENSE、docs/COMMERCIAL-LICENSE.md、docs/PRIVACY.md及THIRD_PARTY_LICENSE.txt为说明源。执行 `node scripts/prepare-help.cjs` 更新help-content.mjs；两个网页构建器也会自动生成。不要只编辑生成模块。每个平台包包含User-Guide.md、LICENSE.txt、Commercial-License.md、Privacy.md、Support.md及第三方许可。许可修改须取得权利人确认，不追溯改写历史发行包。

V1.2.2发布前应同步PRODUCT_README、CHANGELOG、隐私说明、docs/releases/V1.2.2.md和docs/物派-简明使用说明.pdf。浏览器测试默认使用Chromium，本机Edge通过PLAYWRIGHT_CHANNEL=msedge指定；不要在测试内硬编码平台浏览器。
