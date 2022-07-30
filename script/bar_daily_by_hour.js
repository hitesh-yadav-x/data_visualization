const drawBarHourly = (nestedData, year_index, hour_index) => {

    //Append SVG
    const svg = d3.select('#chart_container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    //Append chart group
    const barGroup = svg.append('g')
        .attr('id', 'barGroup')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);



    // Create the color scale for gradient.
    const colorScale = get_linear_scale(
        [-d3.max(nestedData.values.map(d => d.values.map(x => x.value['total']))[year_index]), d3.max(nestedData.values.map(d => d.values.map(x => x.value['total']))[year_index]) / 2, d3.max(nestedData.values.map(d => d.values.map(x => x.value['total']))[year_index])],
        ["#FDEDEC", "#EC7063", "#78281F"]
    );

    //Create Scales for X and Y coordinates
    var xScale = get_band_scale([0, barGroupWidth - 200], 0.1);
    xScale.domain(nestedData.values.map(d => d.key));

    var yScale = get_linear_scale([0, d3.max(all_total_bar_hourly)], [barGroupHeight, 0]);

    //Create Axes
    var xAxis = d3.axisBottom(xScale).tickSize(0);
    var yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".1s"))
        .ticks(5, "%");

    //Append xAxis
    barGroup.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${barGroupHeight})`)
        .call(xAxis);

    //Append yAxis
    barGroup.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    // Add tooltip
    var divToolTip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    var average_crashes = 0;

    barGroup.selectAll('.bar')
        .data(nestedData.values)
        .enter()
        .append('g')
        .attr('class', 'gribBox')
        .attr('id', (d, i) => `bar_${d.key}`)
        .on('mouseenter', (node, i) => {
            divToolTip.style("opacity", 1).style('z-index', 10);

            divToolTip.html(`<b>Hour of the day: ${node.values[hour_index].key}</b>
                                <br/>Total crashes: ${node.values[hour_index].value['total'].toLocaleString('en')}
                                <hr/>
                                Injuries breakdown:<br/>
                                &nbsp;Fatal: ${node.values[hour_index].value['fatal'].toLocaleString('en')}<br/>
                                &nbsp;Incapacitating injury: ${node.values[hour_index].value['incapacit_injury'].toLocaleString('en')}<br/>
                                &nbsp;Non incapacitating: ${node.values[hour_index].value['n_incap'].toLocaleString('en')}<br/>
                                &nbsp;No indication of injury: ${node.values[hour_index].value['n_injury'].toLocaleString('en')}<br/>
                                &nbsp;Refused EMS: ${node.values[hour_index].value['refused_ems'].toLocaleString('en')}<br/>
                                &nbsp;Reported, not evident: ${node.values[hour_index].value['rptd_nt_evid'].toLocaleString('en')}<br/>
                                &nbsp;None: ${node.values[hour_index].value['none'].toLocaleString('en')}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 28) + "px")
                .attr('class', 'tooltip');

        })
        .on('mouseout', node => divToolTip.style('opacity', 0).style('left', null).style('top', null).style('z-index', -1)).classed('tooltip', false)
        .each((d, i) => {

            average_crashes = average_crashes + +d.values[hour_index].value['total'];

            d3.select(`#bar_${d.key}`)
                .selectAll('rect')
                .data(d3.entries(d.values[hour_index].value).splice(2)) // remove index element from the list
                .enter()
                .append('rect')
                .attr('x', node => xScale(d.key))
                .attr('y', barGroupHeight)
                .attr('stroke', 'black')
                .attr('stroke-width', '0.01')
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .attr('fill', node => colorScale(node.value))
                .transition()
                .duration(1500)
                .attr('height', node => barGroupHeight - yScale(node.value))
                .attr('y', node => yScale(node.value));
        });



    // Append Filter
    barGroup.append('text')
        .text('Year')
        .attr('class', 'filterTitle')
        .attr('transform', `translate(${barGroupWidth - 150}, 50)`)

    //Append Year filter
    barGroup.selectAll('hour')
        .data(years)
        .enter()
        .append('text')
        .attr('id', (d, i) => i)
        .attr('x', barGroupWidth - 150)
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
            updateBarHourly(i, hour_index)
        });

    // Hour Filter
    barGroup.append('text')
        .text('Hour')
        .attr('class', 'filterTitle')
        .attr('transform', `translate(${barGroupWidth - 100}, 50)`)

    // Hour values
    barGroup.selectAll('year')
        .data(nestedData.values[0].values)
        .enter()
        .append('text')
        .attr('id', (d, i) => i)
        .attr('x', (d, i) => {
            if (i < 6) return (barGroupWidth - 100)
            else if (i >= 6 & i < 12) return (barGroupWidth - 85)
            else if (i >= 12 & i < 18) return (barGroupWidth - 60)
            else return (barGroupWidth - 35)
        })
        .attr('y', (d, i) => {
            if (i < 6) return (50 + (i + 1) * 20)
            else if (i >= 6 & i < 12) return (50 + (i - 6 + 1) * 20)
            else if (i >= 12 & i < 18) return (50 + (i - 12 + 1) * 20)
            else return 50 + (i - 18 + 1) * 20
        })
        .attr('class', 'filterContent')
        .text(d => d.key)
        .attr('fill', (d, i) => {
            if (i == hour_index) {
                return '#B03A2E'
            }
            else {
                return 'black';
            }
        }).on('click', (d, i) => {
            updateBarHourly(year_index, i)
        });

    //Annotations
    //Append average line
    barGroup.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', yScale(average_crashes / 7))
        .attr('y2', yScale(average_crashes / 7))
        .attr('class', 'annotationLine')
        .transition()
        .duration(2000)
        .attr('x2', barGroupWidth - 200);

    barGroup.append('text')
        .attr('x', 30)
        .attr('y', yScale(average_crashes / 7) - 5)
        .text('Average traffic crash')
        .attr('class', 'annotationText');


    barGroup.append('rect')
        .attr('x', 5)
        .attr('y', barGroupHeight - 20)
        .attr('width', barGroupWidth - 200)
        .attr('height', 50)
        .attr('fill', 'none')
        .attr('class', 'annotationLine');

    barGroup.append('text')
        .attr('x', barGroupWidth - 190)
        .attr('y', barGroupHeight - 10)
        .text('Injury categories with low values have lighter shade. Hover over bars to see the category breakdown.')
        .attr('class', 'annotationText')
        .call(wrap, 200);
}

const dataBarHourly = get_csv_data("data/illinois_crash_ymd.csv").then(data => {


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
        .key(d => d.CRASH_YEAR)
        .key(d => d.CRASH_DAY)
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
            all_total_bar_hourly.push(total); // This is a small hack to get the max total for color scale domain.
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
// dataBarHourly.then(d => drawBarHourly(d[year_index], year_index, hour_index));

//Update Chart
const updateBarHourly = (year_index, hour_index) => {
    d3.select('#chart_container').select('svg').remove();
    d3.selectAll('#tooltip').remove()
    dataBarHourly.then(d => drawBarHourly(d[year_index], year_index, hour_index));
}