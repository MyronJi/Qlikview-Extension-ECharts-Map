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

        //��ȡqv����
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
                                //     { name: '����', value: randomData() },
                                //     { name: '���', value: randomData() },
                                //     { name: '�Ϻ�', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '�ӱ�', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '������', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: 'ɽ��', value: randomData() },
                                //     { name: '�½�', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '�㽭', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: 'ɽ��', value: randomData() },
                                //     { name: '���ɹ�', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '�㶫', value: randomData() },
                                //     { name: '�ຣ', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '�Ĵ�', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '̨��', value: randomData() },
                                //     { name: '���', value: randomData() },
                                //     { name: '����', value: randomData() },
                                //     { name: '�Ϻ��', value: randomData() }
                                // ]//mapData
                            }
                        ]
                    };

                    myChart.setOption(option);
                });
                //�����¼�
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