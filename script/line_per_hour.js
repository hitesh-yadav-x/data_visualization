const drawLine = (nestedData, year_index) => {

    //Append SVG
    const svg = d3.select('#chart_container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    //Append chart group
    const lineGroup = svg.append('g')
        .attr('id', 'lineGroup')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.on('click', () => {
        if (d3.select(d3.event.target).classed('filterContent')) {
            return;
        }
        else {
            dispatch.call('unHighlight');
        }
    });

    //Create ordinal color scale
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    //Create Scales for X and Y coordinates
    var xScale = d3.scalePoint().domain(d3.range(24)).range([0, lineGroupWidth - 200]);

    var yScale = get_linear_scale([0, d3.max(all_total_line)], [lineGroupHeight, 0]);

    //Create Axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".1s"))
        .ticks(5, "%");

    //Append xAxis
    lineGroup.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${lineGroupHeight})`)
        .call(xAxis);

    //Append yAxis
    lineGroup.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    const line = d3.line()
        .x(d => xScale(d.index))
        .y(d => yScale(d.total))
        .curve(d3.curveMonotoneX);

    // Add tooltip
    var divToolTip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    const lines = lineGroup.selectAll('lines')
        .data(nestedData)
        .enter()
        .append('g')
        .attr('id', (d, i) => `lineGroup_${d.key}`)
        .each((d, i) => {

            line_data = d.values[year_index].values.map((x, k) => {
                return {
                    index: k,
                    total: x.value['total'],
                    fatal: x.value['fatal'],
                    n_injury: x.value['n_injury'],
                    refused_ems: x.value['refused_ems'],
                    rptd_nt_evid: x.value['rptd_nt_evid'],
                    incapacit_injury: x.value['incapacit_injury'],
                    none: x.value['none'],
                    n_incap: x.value['n_incap']
                }
            });

            var all_paths = lineGroup.select(`#lineGroup_${d.key}`)
                .append('path')
                .attr('id', `linePath_${d.key}`)
                .attr('d', line(line_data))
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', colorScale(i));

            // Path animation
            // Reference - https://observablehq.com/@onoratod/animate-a-path-in-d3
            all_paths.each(d => {
                var path = d3.select(`#linePath_${d.key}`);

                const length = path.node().getTotalLength();

                path.attr("stroke-dasharray", length + " " + length)
                    .attr("stroke-dashoffset", length)
                    .transition()
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0)
                    .duration(2500);


            })

            lineGroup.select(`#lineGroup_${d.key}`).selectAll('circle')
                .data(line_data)
                .enter()
                .append('circle')
                .attr('id', `circleGroup_${d.key}`)
                .attr('class', 'circle')
                .attr('r', 5)
                .attr('cx', node => xScale(node.index))
                .attr('cy', node => yScale(node.total))
                .attr('fill', colorScale(i))
                .attr('opacity', 0)
                .on('mouseenter', (node, i) => {
                    divToolTip.style("opacity", 1).style('z-index', 10);


                    divToolTip.html(`<b>Hour of the day: ${i}</b>
                                <br/>Total crashes: ${node.total.toLocaleString('en')}
                                <hr/>
                                Injuries breakdown:<br/>
                                &nbsp;Fatal: ${node.fatal.toLocaleString('en')}<br/>
                                &nbsp;Incapacitating injury: ${node.incapacit_injury.toLocaleString('en')}<br/>
                                &nbsp;Non incapacitating: ${node.n_incap.toLocaleString('en')}<br/>
                                &nbsp;No indication of injury: ${node.n_injury.toLocaleString('en')}<br/>
                                &nbsp;Refused EMS: ${node.refused_ems.toLocaleString('en')}<br/>
                                &nbsp;Reported, not evident: ${node.rptd_nt_evid.toLocaleString('en')}<br/>
                                &nbsp;None: ${node.none.toLocaleString('en')}`)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 28) + "px")
                        .attr('class', 'tooltip');

                })
                .on('mouseout', node => divToolTip.style('opacity', 0).style('left', null).style('top', null).style('z-index', -1)).classed('tooltip', false);
        });



    // Append Filter
    lineGroup.append('text')
        .text('Year')
        .attr('class', 'filterTitle')
        .attr('transform', `translate(${lineGroupWidth - 150}, 50)`);

    //Append Year filter
    lineGroup.selectAll('hour')
        .data(years)
        .enter()
        .append('text')
        .attr('id', (d, i) => i)
        .attr('x', lineGroupWidth - 150)
        .attr('y', (d, i) => 50 + (i + 1) * 20)
        .attr('class', 'filterContent')
        .text(d => d)
        .attr('fill', (d, i) => {
            if (i == year_index) {
                return '#B03A2E'
            }
            else {
                return 'black';
            }
        })
        .on('click', (d, i) => {
            update(i)
        });

    // Apped Day filter
    lineGroup.append('text')
        .text('Day')
        .attr('class', 'filterTitle')
        .attr('transform', `translate(${lineGroupWidth - 100}, 50)`);

    lineGroup.selectAll('days')
        .data(days)
        .enter()
        .append('text')
        .attr('id', day => day)
        .attr('x', lineGroupWidth - 100)
        .attr('y', (d, i) => {
            return (50 + (i + 1) * 20)
        })
        .attr('class', 'filterContent days')
        .text(day => day)
        .attr('fill', (day, i) => {
            if (i == day_index) {
                return '#B03A2E'
            }
            else {
                return 'black';
            }
        }).on('click', (day, i) => {
            dispatch.call('toggle', this, day);
        });

        lineGroup.selectAll('days')
        .data(days)
        .enter()
        .append('rect')
        .attr('class', 'legendRect')
        .attr('id', day => `${day}_color`)
        .attr('x', lineGroupWidth - 70)
        .attr('y', (d, i) => {
            return (38 + (i + 1) * 20)
        })
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', (d,i) => colorScale(i));

}



const dataLine = get_csv_data("data/illinois_crash_ymd.csv").then(data => {


    // Nest the data for heat map grid by
    var index = -1;

    // Create a nested array for the crash data.
    return d3.nest()
        .key(d => d.CRASH_DAY)
        .key(d => d.CRASH_YEAR)
        .key(d => d.CRASH_HOUR)
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
                n_incap = n_incap + +node.NONINCAPACITATING_INJURY;
                n_injury = n_injury + +node.NO_INDICATION_OF_INJURY;
                refused_ems = refused_ems + +node.REFUSED_EMS;
                rptd_nt_evid = rptd_nt_evid + +node.REPORTED_NOT_EVIDENT;
                incapacit_injury = incapacit_injury + +node.INCAPACITATING_INJURY;
                none = none + +node.NONE;

                total = total + +node.FATAL + +node.NONE + +node.NONINCAPACITATING_INJURY + +node.NO_INDICATION_OF_INJURY + +node.REFUSED_EMS + +node.REPORTED_NOT_EVIDENT + +node.INCAPACITATING_INJURY
            })
            index += 1;
            all_total_line.push(total); // This is a small hack to get the max total for color scale domain.
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
//dataLine.then(d => drawLine(d, year_index));

//Update Chart
const update = (year_index) => {
    d3.selectAll('svg').remove();
    d3.selectAll('#tooltip').remove()
    dataLine.then(d => drawLine(d, year_index));
}

//Create a dispatch function
// Reference - https://stackoverflow.com/questions/24704450/d3-js-click-equivalent-of-mouseout
var dispatch = d3.dispatch('unHighlight', 'toggle')
    .on('unHighlight', () => {
        d3.selectAll('.line').classed('unHighlight', false);
        d3.selectAll(`.circle`).attr('opacity', 0);
        d3.selectAll('.days').attr('fill', 'black');

    })
    .on('toggle', dayGroup => {
        d3.selectAll('.line').attr('class', 'line unHighlight');
        d3.selectAll(`.circle`).attr('opacity', 0);
        d3.selectAll('.days').attr('fill', 'black');

        d3.select(`#linePath_${dayGroup}`).classed('unHighlight', false);
        d3.selectAll(`#circleGroup_${dayGroup}`).attr('opacity', 100);
        d3.select(`#${dayGroup}`).attr('fill', '#B03A2E');
    });