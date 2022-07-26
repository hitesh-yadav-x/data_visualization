const get_linear_scale = (domain, range) => {
    //Only set the range and let use set the domain
    return d3.scaleLinear()
        .domain(domain)
        .range(range);
}