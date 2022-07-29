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
        function wrap(text, width) {
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