<p align="center"><img src="assets/branding/icon.png" width="96" alt="物派图标"></p>
<h1 align="center">物派 · Wupai</h1>
<p align="center">在本地观察器物，试验纹样与铜漆效果。</p>
<p align="center"><a href="https://github.com/hindingonhome/wupai/releases/latest">下载发行版</a> · <a href="PRODUCT_README.md">使用手册</a> · <a href="docs/COMMERCIAL-LICENSE.md">商业授权</a> · <a href="https://github.com/hindingonhome/wupai/issues">问题反馈</a></p>

物派是一款离线三维器物工作室，提供花瓶、圆形盘子与11个水果器型、本地图片及模型导入、纹样与灯光调节、PNG与GLB导出。无需账户，资源随发行包提供。

**V1.2.2 · CHAMBER · 个人非商业使用免费，商业使用须另行书面授权。** 本项目公开可见，但不采用开源许可。内置模型与纹样仅供个人体验，导出不等于取得商用权限。

![物派浅色界面](docs/images/wupai-main.png)

## 下载

请前往 [GitHub Releases](https://github.com/hindingonhome/wupai/releases/latest)，根据平台选择，不需要下载全部附件。

| 平台 | 推荐下载 | 打开方式 |
| --- | --- | --- |
| Windows x64 | `Wupai-版本-Desktop.zip` | 完整解压，运行“物派.exe”，无需安装 |
| Linux x86_64 | `Wupai-版本-Linux.zip` | 解压后在图形桌面执行 `sh Launch.sh` |
| Android | `Wupai-版本-Android.apk` | 安装APK；Android.zip另附备用HTML和完整说明 |
| iPhone | `Wupai-版本-iPhone.zip` | 解压后打开Models内USDZ；完整HTML交互需要兼容浏览器 |

Windows和Linux包内的 `Backup-HTML/Wupai.html` 是备用网页。iPhone没有IPA安装包，系统“文件”的网页静态预览可能无法运行三维内容。桌面应用目前未购买商业代码签名证书。

每次发行按四个平台ZIP归档，另提供直接APK与 `SHA256SUMS.txt`，共六个手动附件；GitHub自动生成的源码压缩包面向开发。模型与许可位于对应平台包内，不散装上传。

## 快速开始

1. 下载对应平台包并完整解压或安装，打开物派。
2. 在“常规器物”或“派库”的水果派选择器型；拖动观察，滚轮或双指缩放。
3. 点击下方圆球切换表面；在“纹样”中调密度，使用“＋”导入自己的图片。
4. 在“首选项”的“展示”组调整灯光，或点击“恢复原版灯光”还原。
5. “保存与作品”提供PNG与GLB；顶栏“首选项”之后的“说明与许可”可离线阅读完整手册及条款。

桌面左键旋转、右键调灯光；手机单指旋转、双指缩放。菜单缩略图固定，不随当前纹样或密度更新。专用芒果原肌理固定密度1。详见[完整使用手册](PRODUCT_README.md)。

## 个人派库

在“派库”添加自己的栏目，并直接导入模型。自建栏目齿轮提供改名、解锁与确认删除；模型编辑和恢复在首选项。默认器物及水果派只读。自建模型在本机持久保存，支持会话内20步撤销／重做；首选项提供简繁英三语、JSON配置和包含模型的 .wupai 完整备份。没有云同步，请定期导出备份。模型说明位于左上角折叠玻璃卡片。

## V1.2.2 表面设计与纹样生成

保留现有胶囊导航与三维器物。底部“疏密与配色”提供可收起的纹样疏密、四组配色和“再试一次”；旋转速度滑条和播放按钮含义不变。表面调整支持20步撤销／重做及Ctrl+Z、Ctrl+Shift+Z、Ctrl+Y。保存与作品菜单另提供“保存作品”“打开作品”“最近作品”，以独立.wupai-work文件继续编辑，不替代图片或原.wupai派库备份。

纹样面板第一栏提供固定矢量与图像纹样生成、锁色和交换、参考取色、金线识别。生成结果形成可跨器物复用的色球；每件器物底栏独立，总库保留全部纹样。密度支持1–5范围内0.01细调。“表面细节”与图形化“保存与导出纹理”独立列出，支持单张PNG与全部纹理ZIP，SVG限当前矢量设计。

## 功能与边界

- 器型、纹样、纯铜与仿金表面预览；各对象与纹样分别记忆密度。
- 本地PNG、JPG、WebP与自包含GLB、GLTF、STL导入；无UV模型可使用空间投射。
- 自由旋转、自动旋转、浅深主题、灯光调节与原版预设回退。
- 悬浮玻璃顶栏整合当前器物名称；底部控制台保持紧凑。2K、普通窗口和手机按断点分别布局，模型根据实际UI取景；调整窗口保留姿态和缩放。
- PNG画面、连续纹样PNG和带当前可导出效果的GLB导出。
- 固定缩略图、复用着色程序与近期模型缓存，减少切换的重复工作。

作品可保存到本机或导出为独立 .wupai-work 文件；当前没有云备份。首次加载速度取决于设备。显示与导出是视觉预览，不能代替生产或工艺验证。构建与自动化测试不等于全部平台真机验收。

## 文档

- [使用手册与常见问题](PRODUCT_README.md)
- [软件使用许可](LICENSE)及[商业授权说明](docs/COMMERCIAL-LICENSE.md)
- [隐私与本地数据](docs/PRIVACY.md)
- [第三方声明](THIRD_PARTY_LICENSE.txt)与[素材说明](assets/ASSET_LICENSES.md)
- [更新日志](CHANGELOG.md)
- [构建与发布](docs/RELEASING.md)、[新增系列](docs/ADDING-SERIES.md)
- [支持与反馈](SUPPORT.md)、[安全问题](SECURITY.md)

## 许可与商业使用

[LICENSE](LICENSE)允许个人非商业运行与体验，不授予本项目专有源码的复用、修改或再分发许可。软件商业使用、内置模型和纹样的商业利用均须事先取得书面授权。用户自行导入内容的权利不转移给CHAMBER，第三方组件仍按各自许可。

商业咨询联系 **CHAMBER · 97101yy@gmail.com**。价格、范围、期限和支持服务以另行书面协议为准，无默认商业授权或统一公开报价。V1.1.1条款不追溯改写旧发行版的许可。

## 维护与本地开发

需要Node.js 24+与npm；安卓构建另需Java 21、Android SDK36及原签名密钥。开发和修改须具有相应权利，不因本段技术说明而获得源码开发许可。

```sh
npm ci
npm start
```

本地开发地址为 `http://127.0.0.1:8765`。运行 `npm test` 和 `npm run test:browser` 检查回归；桌面、安卓、离线网页与归档的完整流程见[维护与发布](docs/RELEASING.md)。请修改源文件后统一构建，不分别手改多个平台HTML。

Copyright © 2026 CHAMBER. All rights reserved.
