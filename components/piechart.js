class PieChart {
    

    margin = {
        top: 10, right: 100, bottom: 40, left: 40
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
        this.color = d3.scaleOrdinal()
        .domain(["1호선","2호선","3호선","4호선","5호선","6호선","7호선","8호선","9호선"])
        .range([
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
        this.legend = this.svg.append("g").style("font-size", ".8em")
        .attr("transform", `translate(${this.width + this.margin.left + 10}, ${this.height / 8})`)
        .call(d3.legendColor().scale(this.color));
        this.arcs;
    }

    update(year,month) {
        // console.log(month)
        let subwayLine, sumPeople;
        // console.log(year)
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
                // console.log(sumPeople)
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

        // console.log(this.pie(tdata))
        //this.color.domain(subwayLine);
        

        this.arcs = this.g
            .selectAll("arc")
            .data(this.pie(tdata))
            .enter()
            .append("g")
            .attr("class", "arc");
        this.arcs
            .append("path")
            .attr("fill", (d, i) => this.color(i))
            .attr("d", this.arc)
            .on("click",(e,d)=>{
                this.clickedPie(d.index,(this.pie(tdata).findIndex((element)=>element.index === (d.index))),subwayLine.map(s=>{return this.data[+year-2017].filter(d=> (d["호선"] === s) && ((+d["날짜"].split("-")[1])=== +month))})[(this.pie(tdata).findIndex((element)=>element.index === (d.index)))],e);
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

    clickedPie(tindex,ai,dt,event){
        this.arcs
            .select("path")
            .attr("fill","lightgray")
        this.arcs
                .filter(d=>d.index === tindex)
                .select("path")
                .attr("fill", this.color(ai))
                

        // let highlightedRect = this.arcs.selectAll("arc").filter((d,i) => i+1 === +index);
        // highlightedRect.attr("fill",this.color(index))
        if(this.handlers.click){
            this.handlers.click(dt)
        }
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }
}