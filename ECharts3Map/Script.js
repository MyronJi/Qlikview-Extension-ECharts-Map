function ECharts3Map_Init() {
    if (document.charset) {
        //alert(document.charset + "!!!!1");
        document.charset = 'utf-8';
        //alert(document.charset);
    }
    Qva.AddExtension("ECharts3Map", function () {
        var _this = this;

        _this.ExtSettings = {};
        _this.ExtSettings.ExtensionName = 'ECharts3Map';
        _this.ExtSettings.LoadUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=';

        var mapPath = 'Extensions/' + _this.ExtSettings.ExtensionName + '/lib/maps';
        var imagePath = 'Extensions/' + _this.ExtSettings.ExtensionName + '/lib/images';

        //Array to hold the js libraries to load up.
        var jsFiles = [];

        //pushing the js files to the jsFiles array
        jsFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/js/jquery.min.js');
        jsFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/js/echarts.min.js');

        //读取qv数据
        var mapData = [];
        var maxValue = 0;
        var minValue = 50;
        d = _this.Data
        for (var i = 0; i < d.Rows.length; i++) {
            var r = d.Rows[i];
            obj = {
                name: r[0].text,
                value: parseFloat(r[1].text)
            };
            if (maxValue < obj.value) { maxValue = obj.value };
            if (minValue > obj.value) { minValue = obj.value };
            mapData.push(obj);
        }

        var colors = _this.Layout.Text0.text.split(';');
        var mapFile= _this.Layout.Text1.text.toString();

        //Loading up the js files via the QlikView api that allows an array to be passed.   
        //After we load them up successfully, initialize the chart settings and append the chart
        Qv.LoadExtensionScripts(jsFiles, function () {
            InitSettings();
            Init();
            InitChart(mapFile,mapData, maxValue, minValue, colors);
        });

        function InitSettings() {

            _this.ExtSettings.UniqueId = _this.Layout.ObjectId.replace('\\', '_');

        }

        function Init() {

            $(_this.Element).empty();

            mapchart = document.createElement("div");
            $(mapchart).attr('id', 'Chart_' + _this.ExtSettings.UniqueId);
            $(mapchart).height('100%');
            $(mapchart).width('100%');
            $(_this.Element).append(mapchart);
        }

        function randomData() {
            return Math.round(Math.random() * 1000);
        }

        function InitChart(mapFile,mapData, maxValue, minValue, mapColor) {
            try {
                var myChart = echarts.init(document.getElementById('Chart_' + _this.ExtSettings.UniqueId));

                myChart.showLoading();
                $.get(_this.ExtSettings.LoadUrl + 'Extensions/ECharts3Map/lib/maps/'+mapFile+'.json').done(function (geoJson) {
                    myChart.hideLoading();
                    echarts.registerMap(mapFile, geoJson);
                    option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: '{b}<br/>{c}'
                        },
                        toolbox: {
                            show: true,
                            left: 'left',
                            top: 'top',
                            feature: {
                                dataView: { readOnly: false },
                                restore: {}
                                //saveAsImage: {}
                            }
                        },
                        visualMap: {
                            min: minValue,
                            max: maxValue,
                            text: ['High', 'Low'],
                            realtime: false,
                            calculable: true,
                            inRange: {
                                color: mapColor,//['lightskyblue','yellow', 'orangered'],
                                symbolSize: [30, 100]
                            }
                        },
                        series: [
                            {
                                name: 'data',
                                type: 'map',
                                mapType: mapFile,
                                selectedMode: 'multiple',
                                itemStyle: {
                                    normal: { label: { show: true } },
                                    emphasis: { label: { show: true } }
                                },
                                data: mapData
                                // [
                                //     { name: '北京', value: randomData() },
                                //     { name: '天津', value: randomData() },
                                //     { name: '上海', value: randomData() },
                                //     { name: '重庆', value: randomData() },
                                //     { name: '河北', value: randomData() },
                                //     { name: '河南', value: randomData() },
                                //     { name: '云南', value: randomData() },
                                //     { name: '辽宁', value: randomData() },
                                //     { name: '黑龙江', value: randomData() },
                                //     { name: '湖南', value: randomData() },
                                //     { name: '安徽', value: randomData() },
                                //     { name: '山东', value: randomData() },
                                //     { name: '新疆', value: randomData() },
                                //     { name: '江苏', value: randomData() },
                                //     { name: '浙江', value: randomData() },
                                //     { name: '江西', value: randomData() },
                                //     { name: '湖北', value: randomData() },
                                //     { name: '广西', value: randomData() },
                                //     { name: '甘肃', value: randomData() },
                                //     { name: '山西', value: randomData() },
                                //     { name: '内蒙古', value: randomData() },
                                //     { name: '陕西', value: randomData() },
                                //     { name: '吉林', value: randomData() },
                                //     { name: '福建', value: randomData() },
                                //     { name: '贵州', value: randomData() },
                                //     { name: '广东', value: randomData() },
                                //     { name: '青海', value: randomData() },
                                //     { name: '西藏', value: randomData() },
                                //     { name: '四川', value: randomData() },
                                //     { name: '宁夏', value: randomData() },
                                //     { name: '海南', value: randomData() },
                                //     { name: '台湾', value: randomData() },
                                //     { name: '香港', value: randomData() },
                                //     { name: '澳门', value: randomData() },
                                //     { name: '南海诸岛', value: randomData() }
                                // ]//mapData
                            }
                        ]
                    };

                    myChart.setOption(option);
                });
                //单击事件
                myChart.on('click', function (params) {
                    _this.Data.SelectRow(params.dataIndex);
                });
            }
            catch (err) {
                if (typeof map != 'undefined') {
                    map.remove();
                }
                $(mapchart).html('<div id="errormsg">There was an issue creating the map. Did you forget to set the PopUPHTML?<br/><br/><b>Error Message:</b><br />' + err.message + '</div> ');

            }
        }
    });
};


ECharts3Map_Init();