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