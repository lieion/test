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
        this.g = this.svg
            .append("g")
            .attr("transform",`translate(${this.width / 2}, ${this.height / 2})`);
        this.legend = this.svg.append("g")
            .style("display", "inline")
            .style("font-size", ".8em")
            .attr("transform", `translate(${this.width + this.margin.left + 10}, ${this.height / 2})`);
    }

    update(year,month) {
        // console.log(month)
        let subwayLine, sumPeople;
        console.log(year)
        if(year==="all")
        {
            subwayLine = [...new Set(this.data[5].map(d=> d["호선"]))]
            if(month === "0")
            {
                sumPeople = subwayLine.map(s=>{
                    return {
                        subwayLine: s,
                        inSum: d3.sum(this.data[0].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"])+
                        d3.sum(this.data[1].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"])+
                        d3.sum(this.data[2].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"])+
                        d3.sum(this.data[3].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"])+
                        d3.sum(this.data[4].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"])+
                        d3.sum(this.data[5].filter(d=> (d["호선"] === s && d["구분"] === "승차")), d=>d["Total"]),
                        outSum: d3.sum(this.data[0].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"])+
                        d3.sum(this.data[1].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"])+
                        d3.sum(this.data[2].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"])+
                        d3.sum(this.data[3].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"])+
                        d3.sum(this.data[4].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"])+
                        d3.sum(this.data[5].filter(d=> (d["호선"] === s && d["구분"] === "하차")), d=>d["Total"]),
                        totalSum: d3.sum(this.data[0].filter(d=> (d["호선"] === s )), d=>d["Total"])+
                        d3.sum(this.data[1].filter(d=> (d["호선"] === s )), d=>d["Total"])+
                        d3.sum(this.data[2].filter(d=> (d["호선"] === s )), d=>d["Total"])+
                        d3.sum(this.data[3].filter(d=> (d["호선"] === s )), d=>d["Total"])+
                        d3.sum(this.data[4].filter(d=> (d["호선"] === s )), d=>d["Total"])+
                        d3.sum(this.data[5].filter(d=> (d["호선"] === s )), d=>d["Total"]),
                    }
                })
                console.log(sumPeople)
            }
            else
            {
                sumPeople = subwayLine.map(s=>{
                    return {
                        subwayLine: s,
                        inSum: d3.sum(this.data[0].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[1].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[2].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[3].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[4].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[5].filter(d=> (d["호선"] === s && d["구분"] === "승차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"]),
                        outSum: d3.sum(this.data[0].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[1].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[2].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[3].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[4].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[5].filter(d=> (d["호선"] === s && d["구분"] === "하차") && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"]),
                        totalSum: d3.sum(this.data[0].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[1].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[2].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[3].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[4].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"])+
                        d3.sum(this.data[5].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month)), d=>d["Total"]),
                    }
                })
            }
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
        
        console.log(sumPeople)
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

        console.log(this.pie(tdata))
        const arcs = this.g
            .selectAll("arc")
            .data(this.pie(tdata))
            .enter()
            .append("g")
            .attr("class", "arc");
        arcs
            .append("path")
            .attr("fill", (d, i) => this.color(i))
            .attr("d", this.arc)
            .on("click",(e,d)=>{
                console.log((this.pie(tdata).findIndex((element)=>element.index === (d.index)))+1);
                clickedNum=(this.pie(tdata).findIndex((element)=>element.index === (d.index)));
                this.clickedPie(tdata,d,e);
            })
            .on("mouseover", (e, d) => {
                // console.log(d)
                // console.log(e)
                this.tooltip.select(".tooltip-inner")
                    .html(`Line: ${(this.pie(tdata).findIndex((element)=>element.index === (d.index)))+1}<br /> 
                    승차: ${sumPeople[(this.pie(tdata).findIndex((element)=>element.index === (d.index)))].inSum}<br /> 
                    하차: ${sumPeople[(this.pie(tdata).findIndex((element)=>element.index === (d.index)))].outSum}<br /> 
                    Total: ${sumPeople[(this.pie(tdata).findIndex((element)=>element.index === (d.index)))].totalSum}`);

                Popper.createPopper(e.target, this.tooltip.node(), {
                    placement: 'top',
                    modifiers: [
                        {
                            name: 'arrow',
                            options: {
                                element: this.tooltip.select(".tooltip-arrow").node(),
                            },
                        },
                    ],
                });

                this.tooltip.style("display", "block");
            })
            .on("mouseout", (d) => {
                this.tooltip.style("display", "none");
            });
        // console.log("Where?")
        
        
        
    }

    clickedPie(tdata,d,event){
        if(this.handlers.click){
            this.handlers.click((this.pie(tdata).findIndex((element)=>element.index === (d.index))))
        }
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }
}