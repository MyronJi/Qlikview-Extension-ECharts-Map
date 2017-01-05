# ECharts3Map
- 可以在qlikview的Webview模式中运行的ECharts Map扩展。
- 支持geoJson格式的地图。
- 由于时间有限简单做了地图部分的功能，理论上可以使用ECharts的所有图表。
- 看实际需求，后期有时间在补充。

## 使用方法
- 请避免同时使用2张地图
1. Dimension：使用Data.xlsx中的Province/City列。
2. Expression：结果为数值的表达式。
3. Color：接收3种写法：#121122;rgba(3,4,5,0.4);red。用英文分号分隔。留空默认为lightskyblue;yellow;orangered
4. MapFile：使用Data.xlsx中的ProvinceJson，中国为China。
