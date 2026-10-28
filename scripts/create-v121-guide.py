from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from PIL import Image
import pypdfium2 as pdfium
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
out=root/'docs/物派-简明使用说明.pdf'
out.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('CN','C:/Windows/Fonts/msyh.ttc',subfontIndex=0))
pdfmetrics.registerFont(TTFont('CNB','C:/Windows/Fonts/msyhbd.ttc',subfontIndex=0))
W,H=595.28,841.89
c=canvas.Canvas(str(out),pagesize=(W,H));c.setTitle('物派 V1.2.2 · 简明使用说明');c.setAuthor('CHAMBER');c.setSubject('离线三维器物展示、表面设计与个人模型库操作速览')
ink='#202124';muted='#656873';blue='#007aff';line='#e1e3e7'
def text(x,y,t,size=11,color=ink,bold=False):
 c.setFillColor(HexColor(color));c.setFont('CNB' if bold else 'CN',size);c.drawString(x,y,t)
def para(x,y,t,width=495,size=10.5,leading=18):
 row=''
 for ch in t:
  if ch in '，。；：！？）》”':
   row+=ch;continue
  if pdfmetrics.stringWidth(row+ch,'CN',size)>width:
   text(x,y,row,size);y-=leading;row=ch
  else:row+=ch
 if row:text(x,y,row,size);y-=leading
 return y

def base(n,kicker,title,subtitle):
 c.setFillColor(HexColor('#f7f8fa'));c.rect(0,0,W,H,fill=1,stroke=0)
 c.drawImage(str(root/'assets/branding/icon-64.png'),42,H-76,34,34,mask='auto')
 text(88,H-55,'物派  /  WUPAI',14,bold=True);text(88,H-72,'V1.2.2  ·  简明使用说明',9,muted)
 text(42,H-116,kicker,10,blue);text(42,H-151,title,25,bold=True);text(42,H-177,subtitle,10.5,muted)
 c.setStrokeColor(HexColor(line));c.line(42,46,W-42,46)
 text(42,29,'CHAMBER  ·  2026.10.28  ·  正式版',8,muted);text(W-93,29,f'{n} / 4',8,muted)
def pic(file,y,width=511):
 im=Image.open(root/file);height=width*im.height/im.width
 c.setFillColor(HexColor('#ffffff'));c.roundRect(40,y-height-2,width+4,height+4,15,fill=1,stroke=0)
 c.drawImage(str(root/file),42,y-height,width,height,mask='auto');return y-height

def block(y,num,title,body):
 c.setFillColor(HexColor('#e8f1ff'));c.roundRect(42,y-20,26,26,9,fill=1,stroke=0);text(50,y-11,str(num),11,blue,True)
 text(80,y-10,title,12,bold=True);return para(80,y-33,body,465,10.5,18)-14
base(1,'认识物派','把器物，变成自己的表达。','离线浏览三维器物、调整表面纹样，并逐步建立个人模型库。')
y=pic('verification/v122-main.png',H-204,450)
text(42,y-23,'图示：V1.2.2 实际界面，保留浮动玻璃顶栏与底部紧凑控制。',8.5,muted)
y=block(y-55,1,'选择器物','在顶栏“常规器物”或“派库”选择模型。左上角的名称与简介卡可折叠。')
y=block(y,2,'设计表面','每件器物使用自己的底部色栏；顶栏“纹样”可浏览全部纹样，点“疏密与配色”改变疏密或配色。')
y=block(y,3,'保存与复用','“保存与作品”按图片、可编辑作品、模型分组。悬停预览，单击固定，再点关闭。')
para(42,75,'适用平台：Windows 免安装应用、Android 安装应用，以及Linux 应用 / iPhone 备用网页。手机端操作与设备能力可能有所差异。',511,9,15)
c.showPage()
base(2,'快速上手','几分钟，完成一次表面设计。','无需先理解专业参数，按下面的操作即可开始。')
y=H-211
rows=[('观察模型','电脑：左键拖动旋转器物，右键拖动调整灯光，滚轮缩放。手机：单指转动，双指缩放。'),('选择纹样','每件器物有独立底栏，首次使用原来的贴图。从“纹样”总库选用新纹样，只加入当前器物底栏；其他器物不变。色球最多显示五种主色。'),('轻量调整','点“疏密与配色”打开小浮层。纹样疏密为 1–5，可按 0.01 细调（如 1.37、1.58）；原色、暖阳、清凉、柔和提供配色预设。“再试一次”改变疏密。'),('恢复上一步','到“首选项”使用“撤销表面调整 / 重做表面调整”。点击或聚焦记录组选择快捷键范围，鼠标经过不切换。快捷键为 Ctrl+Z、Ctrl+Shift+Z 或 Ctrl+Y。'),('控制展示','三角形按钮播放或暂停自动旋转，旁边滑条调整旋转速度。首选项“展示”中可调灯光，并恢复原版灯光。')]
for i,(title,body) in enumerate(rows,1):y=block(y,i,title,body)
# Crop the real compact control row, keeping the guide legible.
Image.open(root/'verification/v122-dock.png').save(root/'verification/v122-dock-guide.png')
y=pic('verification/v122-dock-guide.png',y+1)
text(42,y-22,'底部控制：加号导入纹理；疏密与配色编辑纹样；转速控制旋转。',9,muted)
para(42,103,'说明：纯金属或原材质模式不开放无效的纹样操作；芒果原始图集的疏密固定为 1。撤销范围见首选项提示；记录只在当前会话保留，长期请保存作品。',511,9,15)
c.showPage()
base(3,'纹样生成','从配色实验，直接到三维器物。','打开顶栏“纹样”，第一栏即“纹样生成”；所有分析与生成均在本机完成。')
y=pic('verification/v121-studio-guide.png',H-208,460)
y=block(y-25,1,'选一种生成方式','固定矢量提供 4–6 色分区，金线与区域共用边界；图像纹样可导入 PNG / JPG / WebP，提取 4–7 色并识别金线。')
y=block(y,2,'调色并观察','点击色卡改颜色，锁定后随机配色不改该色；点两枚色卡的“交换”或拖动交换颜色。可导入参考图取色。金线与边缘中可改金线颜色、透明露铜、加粗或识别方式。')
y=block(y,3,'应用与分享','点“生成并应用”立即铺到当前器物。新纹理形成总库色球。切换模型恢复各自的选择，可从总库再次选用该色球，并按 0.01 调密度。独立导出栏可用色球选现有纹理，保存 PNG、色卡、设计图或全部 ZIP；SVG 限当前矢量设计。')
para(42,79,'PNG 可选 1024 / 2048 / 4096 像素；DPI 为打印元数据。应用预览使用受控分辨率，适合实时操作；需要完整矢量精度时保存 SVG。',511,9,15)
c.showPage()
base(4,'收藏与交付','管理派库，保存自己的作品。','派库用于模型收藏；作品文件用于恢复当前设计，两者分别备份。')
y=H-211
for i,(title,body) in enumerate([
 ('建立个人栏目','打开“派库”，点“添加新派”并命名。默认水果派和常规器物只读；自建栏目可增删与改名。新建名称默认为“新派”。直接在栏目中点加号导入 GLB / glTF / STL 模型，不需要先解锁。'),
 ('安全管理内容','派库像书架一样浏览和添加模型，圆角箭头展开时朝下、收起时转向右侧。自建栏目标题的齿轮提供解锁、改名和删除；删除前须确认。模型编辑到首选项“派库管理”中处理，误操作仅在首选项撤销；历史最多保留 20 步。'),
 ('保存可编辑作品','“保存与作品”菜单中选择“保存作品”。重新打开软件后可从“最近作品”恢复；在最近作品中点“导出”，得到 .wupai-work 文件，可用“打开作品”重新导入。'),
 ('选择正确的交付文件','PNG 用于分享画面；GLB 用于交付当前应用材质的三维模型；.wupai-work 用于继续编辑。首选项中的 JSON 保存界面配置，.wupai 完整派库备份含导入模型，不含作品。首选项“导出位置”可设置默认文件夹；桌面版还可每次询问。安卓与不支持目录授权的浏览器使用系统保存方式。')],1):y=block(y,i,title,body)
c.setFillColor(HexColor('#eef1f6'));c.roundRect(42,91,511,108,14,fill=1,stroke=0)
text(58,176,'建议：重要内容保留一份独立文件备份。',11,bold=True)
para(58,152,'个人数据保存在本机，清理应用或浏览器数据可能造成丢失。内置素材仅供体验；软件仅限个人非商业使用，商业用途与内置素材商业使用需另行书面授权。',479,9.5,16)
text(58,105,'授权联系：CHAMBER  ·  97101yy@gmail.com',9.5,muted)
c.save()
reader=PdfReader(str(out));assert len(reader.pages)==4
for i,page in enumerate(reader.pages):assert len(page.extract_text())>120
pdf=pdfium.PdfDocument(str(out))
for i in range(len(pdf)):pdf[i].render(scale=1.25).to_pil().save(root/f'verification/v121-guide-page-{i+1}.png')
print(f'PDF_CREATED_AND_RENDERED {out} | {out.stat().st_size} bytes | 4 pages')
