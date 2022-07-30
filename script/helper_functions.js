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
                                The crashes happen for multiple reasons and there are multiple factors that contributetowards the rising number.  
                                As a general understanding Illinois roads are busiest during the rush hours and coincidently we would assume most of the crashes happen during rush hours. 
                                Lets answer that using the crash data from <a href="https://data.cityofchicago.org/">Chicago DataPortal</a>. The data used is the Traffic Crashes - People transportation data. Which can be downloaded <a href="https://data.cityofchicago.org/Transportation/Traffic-Crashes-People/u6pd-qa9d">here</a>.</p>
                                <p>The crash data used for visualization starts from year 2018 and ends in the month July 2022. Although the visualization primarily uses year 2021 data,
                                each scene in the visualization contains year (and more) filter(s) for further exploration making all years accessible to all the scenes.</p>`;