const Constant = new function() {
    this.filename = 'worldCub2010.csv';
    this.categoryColumns = [ 'year', 'group', 'match',
        'LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LF', 'CF', 'RF', 'LA', 'CA', 'RA',
        'coner kicks', 'MPC', 'MPA', 'LPC', 'SPC', 'TPC'];
    this.mappingColumns = { team: true, formation: true, Opponent: true };
    this.columneByPathColor = 'team';
    this.color = {
        'South Korea': '#ec6c60',
        'Japan': '#ec6c60',
        'North Korea': '#ec6c60',
        'France': '#a4d086',
        'Greece': '#a4d086',
        'England': '#a4d086',
        'Slovenia': '#a4d086',
        'Serbia': '#a4d086',
        'Germany': '#a4d086',
        'Netherlands': '#a4d086',
        'Denmark': '#a4d086',
        'Cameroon': '#a4d086',
        'Italy': '#a4d086',
        'New Zealand': '#a4d086',
        'Slovakia': '#a4d086',
        'Ivory Coast': '#a4d086',
        'Portugal': '#a4d086',
        'Spain': '#a4d086',
        'Switzerland': '#a4d086',

        'South Africa': '#a6d9e1',
        'Nigeria': '#a6d9e1',
        'Algeria': '#a6d9e1',
        'Ghana': '#a6d9e1',
        'United States': '#f7bc83',
        'Mexico': '#5d68af',
        'Argentina': '#5d68af',
        'Paraguay': '#5d68af',
        'Brazil': '#5d68af',
        'Honduras': '#5d68af',
        'Chile': '#5d68af',
        'Australia': '#5d68af',
    }

    this.mappingData = {
        team: {
            'South Africa': 1,
            'Mexico': 2,
            'Uruguay': 3,
            'France': 4,
            'South Korea': 5,
            'Greece': 6,
            'Argentina': 7,
            'Nigeria': 8,
            'England': 9,
            'United States': 10,
            'Algeria': 11,
            'Slovenia': 12,
            'Serbia': 13,
            'Ghana': 14,
            'Germany': 15,
            'Australia': 16,
            'Netherlands': 17,
            'Denmark': 18,
            'Japan': 19,
            'Cameroon': 20,
            'Italy': 21,
            'Paraguay': 22,
            'New Zealand': 23,
            'Slovakia': 24,
            'Ivory Coast': 25,
            'Portugal': 26,
            'Brazil': 27,
            'North Korea': 28,
            'Honduras': 29,
            'Chile': 30,
            'Spain': 31,
            'Switzerland': 32,
        },
        Opponent: {
            'South Africa': 1,
            'Mexico': 2,
            'Uruguay': 3,
            'France': 4,
            'South Korea': 5,
            'Greece': 6,
            'Argentina': 7,
            'Nigeria': 8,
            'England': 9,
            'United States': 10,
            'Algeria': 11,
            'Slovenia': 12,
            'Serbia': 13,
            'Ghana': 14,
            'Germany': 15,
            'Australia': 16,
            'Netherlands': 17,
            'Denmark': 18,
            'Japan': 19,
            'Cameroon': 20,
            'Italy': 21,
            'Paraguay': 22,
            'New Zealand': 23,
            'Slovakia': 24,
            'Ivory Coast': 25,
            'Portugal': 26,
            'Brazil': 27,
            'North Korea': 28,
            'Honduras': 29,
            'Chile': 30,
            'Spain': 31,
            'Switzerland': 32,
        },
        formation: {
            334: 1,
            3421: 2,
            5131: 3,
            541: 4,
            523: 5,
            4123: 7,
            41212: 8,
            41221: 9,
            4132: 10,
            4141: 11,
            4231: 12,
            4312: 13,
            4321: 14,
            433: 15,
            442: 16,
        },
        image: {
            'South Africa': 'rsa.png',
            'Mexico': 'mex.png',
            'Uruguay': 'uru.png',
            'France': 'fra.png',
            'South Korea':'kor.png',
            'Greece': 'gre.png',
            'Argentina': 'arg.png',
            'Nigeria': 'nga.png',
            'England': 'eng.png',
            'United States': 'usa.png',
            'Algeria': 'alg.png',
            'Slovenia': 'svn.png',
            'Serbia': 'srb.png',
            'Ghana': 'gha.png',
            'Germany': 'ger.png',
            'Australia': 'aus.png',
            'Netherlands': 'ned.png',
            'Denmark': 'den.png',
            'Japan': 'jpn.png',
            'Cameroon': 'cmr.png',
            'Italy': 'ita.png',
            'Paraguay': 'par.png',
            'New Zealand': 'nzl.png',
            'Slovakia': 'svk.png',
            'Ivory Coast': 'civ.png',
            'Portugal': 'por.png',
            'Brazil': 'bra.png',
            'North Korea': 'prk.png',
            'Honduras': 'hon.png',
            'Chile': 'chi.png',
            'Spain': 'esp.png',
            'Switzerland': 'sui.png',
        }
    };
    this.pathActiveColor = '#3498DB';
    this.pathDisableColor = '#E0E0E0';
};

const parallel = new function() {
    const root = d3.select('#renderer');
    const width = 1040;
    const height = 824;

    const g = root.append('g');
    const nationDiv = root.append('a');
    g.attr('transform', 'translate(20,20)');
    nationDiv.attr('transform', 'translate(20,12)');

    const range = {};
    const axies = {};
    let filters = [];
    let nodes = [];
    let selectNodes = [];

    const line = d3.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .curve(d3.curveLinear);

    this.actionInit = function(data, columns) {
        const resetBtn = d3.select('.reset-btn');
        const colorDropDown = d3.selectAll('.item');
        const colorBtn = d3.selectAll('.color-picker');

        resetBtn.on("click", function() {
            selectNodes = [];
            _.forEach(nodes, node => {
                node.recoveryColor();
            });
            _.forEach(filters, filter => {
                console.log(filter);
                filter.attrs({
                    opacity: 0,
                });
            });
            filters = [];
        });

        colorDropDown.on("click", function() {
            const seperator = d3.select(this).text();
            const seperateData = _.map(data, d => d[ seperator ]);
            const orderedData = _.orderBy(seperateData);
            const bound = {
                oneThird: orderedData[ orderedData.length / 3 ],
                twoThird: orderedData[ orderedData.length * 2 / 3 ],
            }
            _.forEach(seperateData, (d, i) => {
                if (d <= bound.oneThird)
                    nodes[ i ].setColor(Constant.color[ 'low' ]);
                else if (d <= bound.twoThird)
                    nodes[ i ].setColor(Constant.color[ 'medium' ]);
                else
                    nodes[ i ].setColor(Constant.color[ 'high' ]);
            });
        });
        colorBtn.on("click", function() {
            _.forEach(nodes, node => {
                node.recoveryColor();
            });
        });

    };

    const Axis = function(min, max, index, axisCount, column) {
        const diff = max - min;
        const x = width * index / axisCount + 60;

        this.getCoord = function(val) {
            return {
                x,
                y: height - ((val - min) / diff * height),
            }
        };

        this.render = function() {
            g.append('line').attrs({
                x1: x,
                y1: 0,
                x2: x,
                y2: height,
                stroke: '#414e5e',
            });
            g.append('text').attrs({
                x: x - 16,
                y: height + 24,
                fill: '#414e5e',
            }).text(column);
        };

        return this;
    }

    const NationAxis = function(nations) {
        const imageWidth = 60;
        const padding = 4;
        const imageHeight = height/32 - 3.5;


        var svg = nationDiv.append('svg').attrs({
            width: imageWidth,
            height: height + 30,
            border: '3px solid #ccc'
        });

        var svg2 = nationDiv.append('svg').attrs({
            x: width - 30,
            width: imageWidth,
            height: height + 30,
            border: '3px solid #ccc'
        });

        this.render = function() {
            _.forEach(nations, (nation, i)=>{
                svg.append('svg:image').attrs({
                    'xlink:href': 'image/'+Constant.mappingData['image'][nation],
                    x: 0,
                    y: (imageHeight + padding) * i,
                    width: imageWidth,
                    height: imageHeight,
                });
                svg2.append('svg:image').attrs({
                    'xlink:href': 'image/'+Constant.mappingData['image'][nation],
                    x: 0,
                    y: (imageHeight + padding) * i,
                    width: imageWidth,
                    height: imageHeight,
                });
            });
        }
    }

    const FilterEvent = function(axis, nodes) {
        const x = axis.getCoord(0).x;
        let filterSection = null;
        let filter;

        this.render = function() {
            filterSection = g.append('rect').attrs({
                x: x - 10,
                y: 0,
                width: 20,
                height: height,
                opacity: '0',
            });

            let CreateYPosition = 0;
            let selectRange = {
                start: 0,
                end: 0,
            };
            filterSection.call(d3.drag()
                .on('start', function() {
                    filter = g.append('rect').attrs({
                        x: x - 10,
                        y: d3.event.y,
                        width: 20,
                        height: 0,
                        fill: '#e8a8a8',
                        opacity: '0.3'
                    });
                    CreateYPosition = d3.event.y;
                })
                .on('drag', function() {
                    let diffY = d3.event.y - CreateYPosition;
                    selectRange.start = (diffY > 0) ? CreateYPosition : d3.event.y;
                    selectRange.end = selectRange.start + Math.abs(diffY);

                    filter.attrs({
                        y: selectRange.start,
                        height: Math.abs(diffY),
                    });
                    filter.x = x;

                })
                .on('end', function() {
                    _.forEach(nodes, node => {
                        node.setColor(Constant.pathDisableColor);
                    });

                    if (_.find(filters, filter => filter.x == x)) { // x축에 대하여 중복의 드레그를한 경우
                        _.forEach(nodes, node => {
                            const coordY = node.getCoordYByX(x);

                            if (selectRange.start <= coordY && coordY <= selectRange.end)
                                selectNodes.push(node);
                        });
                    }

                    const compareNodes = (selectNodes.length == 0) ? nodes : selectNodes;

                    if (!(_.find(filters, filter => filter.x == x)))
                        selectNodes = [];

                    _.forEach(compareNodes, node => {
                        const coordY = node.getCoordYByX(x);

                        if (selectRange.start <= coordY && coordY <= selectRange.end)
                            selectNodes.push(node);
                    });
                    _.forEach(selectNodes, node => {
                        node.setColor(Constant.pathActiveColor);
                    });

                    filters.push(filter);
                }))
        }
    }

    const Node = function(data) {
        const color = Constant.color[ data[ Constant.columneByPathColor ] ];
        let path;

        const coords = _.chain(data).map(function(v, k) {
            for (var i = 0; i < Constant.categoryColumns.length; i++)
                if (k === Constant.categoryColumns[ i ]) return null;
            if (Constant.mappingColumns[ k ])
                v = Constant.mappingData[ k ][ v ];
            return axies[ k ].getCoord(v);
        }).value();

        _.remove(coords, function(d) {
            return d === null;
        });

        this.getCoordYByX = function(x) {
            return (_.find(coords, coord => x == coord.x)).y;
        }

        this.render = function() {
            console.log(coords)
            path = g.append('path').attrs({
                d: line(coords),
                stroke: color,
                opacity: 0.7,
                fill: 'none',
            });
        };

        this.setColor = function(color) {
            path.attrs({ stroke: color });
        };

        this.recoveryColor = function() {
            this.setColor(color);
        }

        return this;
    }

    this.draw = function() {
        d3.csv(Constant.filename, data => {
            const columns = data.columns;
            const nations = _.uniq(_.map(data, d => d['team']));

            _.forEach(Constant.categoryColumns, rc => {
                _.remove(columns, function(column) {
                    return rc === column;
                });
            });
            _.forEach(columns, (column, i) => {
                let r = {};

                if (Constant.mappingColumns[ column ]) {
                    r = {
                        max: _.maxBy(data, d => Constant.mappingData[ column ][ d[ column ] ] * 1)[ column ],
                        min: _.minBy(data, d => Constant.mappingData[ column ][ d[ column ] ] * 1)[ column ],
                    };

                    r.max = Constant.mappingData[ column ][ r.max ];
                    r.min = Constant.mappingData[ column ][ r.min ];

                }
                else {
                    r = {
                        max: _.maxBy(data, d => d[ column ] * 1)[ column ],
                        min: _.minBy(data, d => d[ column ] * 1)[ column ],
                    };
                }

                range[ column ] = r;
                axies[ column ] = new Axis(r.min, r.max, i, columns.length, column);


                this.actionInit(data, columns);
            });

            const nationAxis = new NationAxis(nations);
            nodes = _.map(data, d => new Node(d));

            nationAxis.render();

            const filterEvents = {};
            _.forEach(columns, column => {
                filterEvents[ column ] = new FilterEvent(axies[ column ], nodes);
            });

            _.forEach(axies, axis => {
                axis.render();
            });

            _.forEach(nodes, node => {
                node.render();
            });

            _.forEach(filterEvents, filterEvent => {
                filterEvent.render();
            });

        })
    };

};

parallel.draw();