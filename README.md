# EChartsGeoMap
简单的教程：[博客园](http://www.cnblogs.com/moiam/p/6257217.html)

- 可以在qlikview的Webview模式中运行的ECharts Map扩展。
- 支持geoJson格式的地图。
- 由于时间有限简单做了地图部分的功能，理论上可以使用ECharts的所有图表。
- 看实际需求，后期有时间在补充。
## 目录结构
```
lib/js                  //引用的js文件 ( jquery3，echarts3 )
lib/maps                //地图数据 ( 省份地图数据来自dataV.js项目 )
Definition.xml          //qv中右键配置
Icon.png                //插件图标
Script.js               //自定义脚本
```
## 安装方法
- 双击qar文件自动安装

## 使用方法
1. Dimension：使用Data.xlsx中的Province/City列。
2. Expression：结果为数值的表达式。
3. MapFile：使用Data.xlsx中的ProvinceJson，中国为China。
4. Color(lower;normal;upper)：接收3种写法：#121122;rgba(3,4,5,0.4);red。用英文分号分隔。留空默认为lightskyblue;yellow;orangered
5. Color Piecewise:0为连续图例；其他为分级图例。
6. Color Piecewise(lower;upper):分级图例分段数值。
