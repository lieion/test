class PieChart {
    

    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }

    constructor(svg, tooltip, data, width = 250, height = 250) {
        this.svg = svg;
        this.tooltip = tooltip;
        this.data = data;
        this.width = width;
        this.height = height;
        this.handlers = {};
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.tooltip = d3.select(this.tooltip);
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
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        this.radius = Math.min(this.width, this.height) / 2;
        this.pie = d3.pie();
        this.arc = d3.arc().innerRadius(0).outerRadius(this.radius);
    }

    update(year,month) {
        // console.log(month)
        let subwayLine, sumPeople;
        if(+year===0)
        {

        }
        else
        {
            subwayLine = [...new Set(this.data[+year-2017].map(d=> d["호선"]))]
            if(month === "0")
            {
                sumPeople = subwayLine.map(s=>{
                    return {
                        subwayLine: s,
                        inSum: d3.sum(this.data[+year-2017].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"]),
                        outSum: d3.sum(this.data[+year-2017].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"]),
                        totalSum: d3.sum(this.data[+year-2017].filter(d=> (d["호선"] === s )), d=>d["Total"]),
                    }
                })
            }
            else
            {
                sumPeople = subwayLine.map(s=>{
                    return {
                        subwayLine: s,
                        inSum: d3.sum(this.data[+year-2017].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"]),
                        outSum: d3.sum(this.data[+year-2017].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"]),
                        totalSum: d3.sum(this.data[+year-2017].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"]),
                    }
                })
            }
        }
        // console.log(sumPeople)
        let idata = sumPeople.map(function(line){
            return line.inSum; 
        });

        let odata = sumPeople.map(function(line){
            return line.outSum; 
        });

        let tdata = sumPeople.map(function(line){
            return line.totalSum; 
        });
        
        // console.log(tdata)
        const g = this.svg
            .append("g")
            .attr(
            "transform",
            `translate(${this.width / 2}, ${this.height / 2})`
            );
        

        
        const arcs = g
            .selectAll("arc")
            .data(this.pie(tdata))
            .enter()
            .append("g")
            .attr("class", "arc");
        arcs
            .append("path")
            .attr("fill", (d, i) => this.color(i))
            .attr("d", this.arc);
       
        // console.log("Where?")
        

        
    }
}