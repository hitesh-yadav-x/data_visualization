const drawHeatMap = (nestedByDay, year_index, redraw) => {

    //Append SVG
    var svg = d3.select('#chart_container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

    var heatGroup = svg.append('g')
        .attr('id', 'heatGroup')
        .attr('transform', 'translate(20,20)');


    // Create the color scale for gradient.
    const colorScale = get_linear_scale(
        [0, d3.max(all_total_heat) / 2, d3.max(all_total_heat)],
        ["#FDEDEC", "#EC7063", "#78281F"]
    );

    // Append Row Lables
    // Day names are used as row label
    var rowLabels = heatGroup.selectAll('.rowLabel')
        .data(nestedByDay)
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', (d, i) => (i + 1) * gridSize)
        .text(d => d.key)
        .attr('transform', `translate(0, ${gridSize / 1.5})`)
        .attr('class', 'rowLabel')
        .attr('opacity', () => {
            if (redraw) { return 100; }
            else { return 0; }
        })
        .transition()
        .duration(5000)
        .attr('opacity', 100);

    // Append column lables
    var colLabels = heatGroup.selectAll('.colLabel')
        .data(nestedByDay[0].values)
        .enter()
        .append('text')
        .style("text-anchor", "middle")
        .attr('x', (d, i) => i * gridSize + gridSize)
        .attr('y', gridSize / 2 + 7)
        .text(d => d.key)
        .attr('transform', `translate(${gridSize / 2},0)`)
        .attr('class', 'colLabel')
        .attr('opacity', () => {
            if (redraw) { return 100; }
            else { return 0; }
        })
        .transition()
        .duration(5000)
        .attr('opacity', 100);

    // Append heatMap
    var heatMapGroups = heatGroup.selectAll('.crashGroup')
        .data(nestedByDay)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
            group_data_index = i;
            y = (i + 1) * gridSize
            return `translate(${gridSize},${y})`
        })
        .attr('id', (d, i) => `heatGroup_${i}`);

    // Add tooltip
    var divToolTip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Append data
    heatMapGroups.each((group, i) => {
        d3.select(`#heatGroup_${i}`)
            .selectAll('rect')
            .data(group.values)
            .enter()
            .append('rect')
            .attr('id', (node, j) => `heatGroup_${i}_${j}`)
            .attr('x', (node, j) => j * gridSize)
            .attr('y', 0)
            .attr('class', 'gribBox')
            .attr('height', node => {
                if (redraw) {
                    return gridSize
                }
                else {
                    return 0
                }
            })
            .attr('width', gridSize)
            .style("stroke", "white")
            .style("stroke-opacity", 0.5)
            .attr('fill', (node, j) => {
                return colorScale(node.values[year_index].value['total']);
            })
            .on('mouseenter', (node, i) => {
                divToolTip.style("opacity", 1).style('z-index', 10);

                divToolTip.html(`<b>Year: ${node.values[year_index].key}</b>
                                <br/>Total crashes: ${node.values[year_index].value['total'].toLocaleString('en')}
                                <hr/>
                                Injuries breakdown:<br/>
                                &nbsp;Fatal: ${node.values[year_index].value['fatal'].toLocaleString('en')}<br/>
                                &nbsp;Incapacitating injury: ${node.values[year_index].value['incapacit_injury'].toLocaleString('en')}<br/>
                                &nbsp;Non incapacitating: ${node.values[year_index].value['n_incap'].toLocaleString('en')}<br/>
                                &nbsp;No indication of injury: ${node.values[year_index].value['n_injury'].toLocaleString('en')}<br/>
                                &nbsp;Refused EMS: ${node.values[year_index].value['refused_ems'].toLocaleString('en')}<br/>
                                &nbsp;Reported, not evident: ${node.values[year_index].value['rptd_nt_evid'].toLocaleString('en')}<br/>
                                &nbsp;None: ${node.values[year_index].value['none'].toLocaleString('en')}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 28) + "px");

            })
            .on('mouseout', node => divToolTip.style('opacity', 0).style('left', 1000).style('top', 1000).style('z-index', -1))
            .transition()
            .duration(1500)
            .delay((node, j) => j * 75)
            .ease(d3.easeElasticOut)
            .attr('height', gridSize);

        //Annotate the rectangles
        d3.select(`#heatGroup_${i}`)
            .selectAll('circle')
            .data(group.values)
            .enter()
            .append('circle')
            .attr('cx', (node, j) => j * gridSize + (gridSize - 5))
            .attr('cy', gridSize -5)
            .attr('r', 2)
            .attr('fill', (node, j) => {
                if (node.values[year_index].value['total'] > 1000) {
                    return 'gray'
                }
                else {
                    return 'none'
                }
            });

    });

    // Legend
    // Append legend group
    // Below code is adopted from Nadieh Bremer's Block in gradient scale.
    legendGroup = svg.append('g')
        .attr('id', 'legendGroup')
        .attr('transform',
            `translate(265, 320)`);

    // Legend description
    legendGroup.append('text')
        .attr('x', 14)
        .text('Total hourly traffic crashes by day for the year')
        .attr('class', 'legendText')
        .attr('opacity', () => {
            if (redraw) { return 100; }
            else { return 0; }
        })
        .transition()
        .delay(2000)
        .duration(10000)
        .attr('opacity', 100);

    // Legend scale
    var countScale = get_linear_scale([0, d3.max(all_total_heat)], [0, width]);

    // Calculate 
    var numStops = 10;
    countRange = countScale.domain();
    countRange[2] = countRange[1] - countRange[0];
    countPoint = [];
    for (var i = 0; i < numStops; i++) {
        countPoint.push(i * countRange[2] / (numStops - 1) + countRange[0]);
    }

    // Gradient definitions
    svg.append("defs")
        .append("linearGradient")
        .attr("id", "legend-traffic")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data(d3.range(numStops))
        .enter().append("stop")
        .attr("offset", function (d, i) {
            return countScale(countPoint[i]) / width;
        })
        .attr("stop-color", function (d, i) {
            return colorScale(countPoint[i]);
        });

    // Create legend marker
    var legendMarker = legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', 10)
        .attr('height', 10)
        .attr('width', () => {
            if (redraw) { return gridSize * 12; }
            else { return 0; }
        })
        .style('fill', 'url("#legend-traffic")')
        .transition()
        .delay(2000)
        .duration(1500)
        .attr('width', gridSize * 12);

    var legendScale = d3.scaleLinear()
        .domain([0, d3.max(all_total_heat)])
        .range([0, gridSize * 12]);

    var legendAxis = d3.axisBottom()
        .ticks(5)
        .tickSize(0)
        .scale(legendScale);
    
    // Append legend scale
    legendGroup.append('g')
        .attr('class', 'legendAxis')
        .attr('stroke-width', 0)
        .attr('transform', `translate(2, 20)`)
        .call(legendAxis)
        .attr('opacity', () => {
            if (redraw) { return 100; }
            else { return 0; }
        })
        .transition()
        .delay(2000)
        .duration(10000)
        .attr('opacity', 100);

    // Append Filter
    var filterSvg = svg.append('g')
                    .attr('id', 'filterGroup')
                    .attr('transform', `translate(${gridSize * 27}, 76)`);


    filterSvg.append('text')
        .text('Year')
        .attr('class', 'filterTitle');

    filterSvg.selectAll('year')
        .data(nestedByDay[0].values[0].values)
        .enter()
        .append('text')
        .attr('id', d => d.value['index'])
        .attr('x', 0)
        .attr('y', (d, i) => (i + 1) * 20)
        .attr('class', 'filterContent')
        .text(d => d.key)
        .attr('fill', d => {
            if (d.value['index'] == year_index) {
                return '#B03A2E'
            }
            else {
                return 'black';
            }
        })
        .on('click', d => {
            updateHeatMap(d.value['index'])
        });
}

const dataHeatMap = get_csv_data("data/illinois_crash_ymd.csv").then(data => {


    // Nest the data for heat map grid by
    // NESTING_KEYS
    //  1: DAY_OF_WEEK
    //  2: HOUR_OF_DAY
    //  3: YEAR
    // ROLL_UP
    //  1:
    var index = -1;

    // Create a nested array for the crash data.
    return d3.nest()
        .key(d => d.CRASH_DAY)
        .key(d => d.CRASH_HOUR)
        .key(d => d.CRASH_YEAR)
        .rollup(d => {
            var total = 0;
            var fatal = 0
            var n_incap = 0;
            var n_injury = 0;
            var refused_ems = 0;
            var rptd_nt_evid = 0;
            var incapacit_injury = 0;
            var none = 0;

            d.forEach(node => {
                fatal = fatal + +node.FATAL;
                n_incap = +node.NONINCAPACITATING_INJURY;
                n_injury = +node.NO_INDICATION_OF_INJURY;
                refused_ems = +node.REFUSED_EMS;
                rptd_nt_evid = +node.REPORTED_NOT_EVIDENT;
                incapacit_injury = +node.INCAPACITATING_INJURY;
                none = node.NONE;

                total = total + +node.FATAL + +node.NONE + +node.NONINCAPACITATING_INJURY + +node.NO_INDICATION_OF_INJURY + +node.REFUSED_EMS + +node.REPORTED_NOT_EVIDENT + +node.INCAPACITATING_INJURY
            })
            index += 1;
            all_total_heat.push(total); // This is a small hack to get the max total for color scale domain.
            return {
                'index': index,
                'total': total,
                'fatal': fatal,
                'n_incap': n_incap,
                'n_injury': n_injury,
                'refused_ems': refused_ems,
                'rptd_nt_evid': rptd_nt_evid,
                'incapacit_injury': incapacit_injury,
                'none': none
            };

        })
        .entries(data);



});

// Draw initial chart
// dataHeatMap.then(d => drawHeatMap(d, year_index, false));

const updateHeatMap = (year_index) => {
    d3.select('#chart_container').select('svg').remove();
    d3.selectAll('.tooltip').remove()
    dataHeatMap.then(d => drawHeatMap(d, year_index, true));
}