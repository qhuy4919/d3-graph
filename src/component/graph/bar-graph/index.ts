import { Selection } from 'd3-selection';
import { nest } from 'd3-collection';
import { permute, sum } from 'd3-array';
import assign from 'lodash.assign';
import { Datum } from '../model';
export function groupBar() {
    let margin ={
        top: 40,
        right: 30,
        bottom: 60,
        left: 70,
    },
    width = 960,
    height = 500,

    xScale,
    xAxis,
    yScale,
    yAxis,

    xTick,
    yTick,

    isHorizontal = false,

    svg,
    chartWidth,
    chartHeight,
    data,
    transformedData,
    grid = null,

    nameLabel = 'name',
    valueLabel = 'value',
    stackLabel = 'stack',
      // getters
    getName = (data) =>  data[nameLabel],
    getValue = (data) => data[valueLabel],
    getStack = (data) => data[stackLabel],


    //events
    dispatcher = D3.dispatch(
        'customMouseOver',
        'customMouseOut',
        'customMouseMove',
        'customClick'
    );

    const uniq = (arr: any[]) => arr.filter((element, pos, arr) => arr.indexOf(element) == pos);

    function exports(_selection: Selection<any, Datum, any, Datum>){
        _selection.each(function(_data: Datum){
            chartWidth = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;

        })
    };

    function prepareData(data: Datum) {
        const stackList = uniq(data.map(({ stack}) => stack));

         transformedData = nest()
                .key(getName)
                .rollup(function(values) {
                    let ret = {};

                    values.forEach((entry) => {
                        if (entry && entry[stackLabel]) {
                            ret[entry[stackLabel]] = getValue(entry);
                        }
                    });
                    ret.values = values; //for tooltip

                    return ret;
                })
                .entries(data)
                .map(function(data){
                    return assign({}, {
                        total: sum( permute(data.value, stacks) ),
                        key:data.key
                    }, data.value);
                }); 
    };


            /**
         * @param  {HTMLElement} container DOM element that will work as the container of the graph
         * @private
         */
            function buildSVG(container) {
                if (!svg) {
                    svg = d3Selection.select(container)
                      .append('svg')
                        .classed('britechart stacked-bar', true);
    
                    buildContainerGroups();
                }
    
                svg
                    .attr('width', width)
                    .attr('height', height);
            }

}