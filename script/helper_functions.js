const get_linear_scale = (domain, range) => {
    return d3.scaleLinear()
        .domain(domain)
        .range(range);
}

const get_band_scale = (range, padding) => {
    return d3.scaleBand().rangeRound(range).padding(padding);
}

const get_log_scale = (domain, range) => {
    return d3.scaleLinear()
        .domain(domain)
        .range(range);
}

// The text wrap function is taken from StackOverflow.
// Reference - https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
const wrap = (text, width) => {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}

const initialDescription = `<p>Illinois witnesses it's fair share of car crashes everyday on the roads. 
                                The crashes happen for multiple reasons and there are multiple factors that contribute towards the rising number.  
                                As a general understanding Illinois roads are busiest during the rush hours and coincidently we see most of the crashes happen during rush hours. 
                                Let's answer that using the crash data from <a href="https://data.cityofchicago.org/" target="_blank">Chicago DataPortal</a>.</p>
                                <p>The data used is the Traffic Crashes - People transportation data. The data can be downloaded from <a href="https://data.cityofchicago.org/Transportation/Traffic-Crashes-People/u6pd-qa9d" target="_blank">here</a>.
                                The crash data used for visualization starts from year 2018 and ends in the month of July 2022. Although the visualization primarily uses year 2021 data,
                                each scene in the visualization contains year (and more) filter(s) for further exploration making all years accessible to all the scenes.</p>`;

const hourlyDescription = `<p>Visualizing the data hourly reveals that the number of car crashes on Sunday and Saturday are higher than the average crash per day from midnight to 5:00 A.M. As the day progresses, the number of crashes follows the usual trend with higher numbers during the day on weekdays. Total crashes follow an uptrend path with the peak number of crashes happening on Friday and Saturday.</p>
                                <p>The data from the chart reveal that a higher number of crashes do happen outside of the rush hour, especially on weekends, with numbers going to more than 1000 crashes/hour at midnight.</p>`

const heatDescription =`<p>Plotting a heat map for every hour reveals a similar detail from the previous scene. We can see that the hourly data for weekends from midnight to 5 A.M. have a darker gradient as the crash numbers rise. Use >1000 filter to highlight all the daily hours that have more than 1000 crashes.</p>
                             <p>Even though the crash numbers are higher during the rush hour, we can clearly see a pattern where the cars crashing are in the higher range at night on weekends.</p>`

const lineDescription = `<p>The observation becomes more evident looking at the chart below. Sunday and Saturday crash numbers start higher during the midnight hours and drop by 5:00 A.M. This is evident in the data for all years. The crashes are higher during rush hours on weekdays.</p>
                            <p>The pattern becomes interesting for weekends. We see more crashes happening as the weekend hits and the crash counts are higher during the night as compared to weekdays.</p>`;