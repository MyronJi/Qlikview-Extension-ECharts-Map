function ECharts3Map_Init() {
    if (document.charset) {
        document.charset = 'utf-8';
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

        //get qv value
        var mapData = [];
        var maxValue = 0;
        var minValue = 50;
        var colorParameter = [];

        try {
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

            var mapFile = _this.Layout.Text0.text.toString();
            var colors = _this.Layout.Text1.text.split(';');
            var colorType = _this.Layout.Text2.text.toString();
            var Piecewise_Lower = parseFloat(_this.Layout.Text3.text.split(';')[0]);
            var Piecewise_Upper = parseFloat(_this.Layout.Text3.text.split(';')[1]);


            //set default value
            if ('' == maxValue) maxValue = 100;
            if ('' == minValue) minValue = 0;
            if ('' == colors) colors = ['lightskyblue', 'yellow', 'orangered'];
            if ('' == colorType) colors = 0;

            //set colorParameter 
            if (colorType == 0) {
                colorParameter = {
                    type: 'continuous',
                    min: minValue,
                    max: maxValue,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: colors,//['lightskyblue','yellow', 'orangered'],
                        symbolSize: [30, 100]
                    }
                }
            }
            else {
                colorParameter = {
                    type: 'piecewise',
                    pieces: [
                        { min: Piecewise_Upper, color: colors[2] },
                        { min: Piecewise_Lower, max: Piecewise_Upper, color: colors[1] },
                        { max: Piecewise_Lower, color: colors[0] }
                    ],
                    left: 'left',
                    top: 'bottom'
                }
            }
            //Loading up the js files via the QlikView api that allows an array to be passed.   
            //After we load them up successfully, initialize the chart settings and append the chart
            Qv.LoadExtensionScripts(jsFiles, function () {
                InitSettings();
                Init();
                if ('' != mapFile) {

                    InitChart(mapFile, mapData, maxValue, minValue);
                } else {
                    $(mapchart).html('<div id="errormsg">There was an issue creating the map. Did you forget to set the MapFile?</div> ');
                }

            });
        }
        catch (err) {
            $(mapchart).html('<div id="errormsg">There was an issue creating the map. Did you forget to set the Extensions?</div> ');
        }

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

        function InitChart(mapFile, mapData, maxValue, minValue) {
            try {
                var myChart = echarts.init(document.getElementById('Chart_' + _this.ExtSettings.UniqueId));

                myChart.showLoading();
                $.ajaxSetup({
                    async: false
                });
                $.get(_this.ExtSettings.LoadUrl + 'Extensions/ECharts3Map/lib/maps/' + mapFile + '.json').done(function (geoJson) {
                    myChart.hideLoading();
                    echarts.registerMap(mapFile, geoJson);
                    option = {
                        tooltip: {
                            trigger: 'item'
                        },
                        toolbox: {
                            show: true,
                            left: 'left',
                            top: 'top',
                            feature: {
                                dataView: { readOnly: false }
                            }
                        },
                        visualMap: colorParameter,
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
                            }
                        ]
                    };

                    myChart.setOption(option);
                });
                //ckick 
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