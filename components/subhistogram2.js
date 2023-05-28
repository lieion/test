class SubHistogram2 {
    margin = {
        top: 10, right: 10, bottom: 40, left: 80
    }

    constructor(svg, data,width = 400, height = 300) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;
        this.handlers = {};
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");
        this.color = d3.scaleOrdinal([
            "#0052A4",
            "#00A84D",
            "#EF7C1C",
            "#00A5DE",
            "#996CAC",
            "#CD7C2F",
            "#747F00",
            "#E6186C",
            "#BB8336",
        ]);
        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    }

    update(da, year, month, state) {

        let categories = [];
        const counts_totalSum = {}       
        categories = [1,2,3,4,5,6,7,8,9,10,11,12]
        if(state===0)
        {
            categories.forEach(c => {
                counts_totalSum[c] = d3.sum(this.data[+year-2017].filter(d=> (+d["날짜"].split("-")[1]===c)),d=>d["Total"]);
            })
        }
        else{
            categories.forEach(c => {
                counts_totalSum[c] = d3.sum(this.data[+year-2017].filter(d=> (+d["날짜"].split("-")[1]===c) && +d["호선"]===+state),d=>d["Total"]);
            })
        }
        this.xScale.domain(categories).range([0, this.width]).padding(0.3);
        this.yScale.domain([0, d3.max(Object.values(counts_totalSum))]).range([this.height, 0]);

        this.container.selectAll("rect")
            .data(categories)
            .join("rect")
            .attr("x", d => this.xScale(d))
            .attr("y", d => this.yScale(counts_totalSum[d]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(counts_totalSum[d]))
            .attr("fill", "lightgray")
        
        let highlightedRect = this.container.selectAll("rect").filter((d,i) => i+1 === +month);
        highlightedRect.attr("fill","blue")

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));
        

            
    
    }

    fillingHighlight(justindex)
    {
        this.container.selectAll("rect")
                    .transition()
                    .attr("fill", "lightgray")

        let highlightedRect = this.container.selectAll("rect").filter((d,i) => i+1 === +justindex);
        highlightedRect
            .transition()
            .attr("fill","blue")
        

    }
}