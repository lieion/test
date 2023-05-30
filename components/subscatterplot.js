class SubScatterplot {
    margin = {
        top: 10, right: 10, bottom: 40, left: 80
    }

    constructor(svg, tooltip, width = 600, height = 600) {
        this.svg = svg;
        this.tooltip = tooltip;
        this.width = width;
        this.height = height;
        this.handlers = {};
        this.resultofin =  0;
        this.resultofout = 0;
        this.inPeople = {};
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.tooltip = d3.select(this.tooltip);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");
        
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

       
    }

    update(indata,type) {
        let stationname = [...new Set(indata.map(d=> d["역명"]))]
        let gdatax={},gdatay={}
        if(type==="total"){
            this.gdatax = indata.filter(d=> d["구분"]==="승차")
            this.gdatay = indata.filter(d=> d["구분"]==="하차")
        }
        else if(type==="midweek"){
            this.gdatax = indata.filter(d=> (d["구분"]==="승차" && this.getMonToSun(d["날짜"])===0))
            this.gdatay = indata.filter(d=> (d["구분"]==="하차" && this.getMonToSun(d["날짜"])===0))
        }
        else if(type==="weekend"){
            this.gdatax = indata.filter(d=> (d["구분"]==="승차" && this.getMonToSun(d["날짜"])===1))
            this.gdatay = indata.filter(d=> (d["구분"]==="하차" && this.getMonToSun(d["날짜"])===1))
        }
        let nowindex=0
        this.inPeople = stationname.map(
            s=>{
                return {
                    line: indata[0]["호선"],
                    name: s,
                    index: nowindex++,
                    outvalue: d3.sum(this.gdatay.filter(d=>(d["역명"]===s)),d=>d["Total"]),
                    invalue: d3.sum(this.gdatax.filter(d=>(d["역명"]===s)),d=>d["Total"])
        }});

        
        this.xScale.domain(d3.extent(this.inPeople.map(d=> d.invalue))).range([0, this.width]);
        this.yScale.domain(d3.extent(this.inPeople.map(d=> d.outvalue))).range([this.height, 0]);
        this.zScale.domain(stationname)

        this.circles = this.container.selectAll("circle")
            .data(this.inPeople)
            .join("circle")
            .on("click",(e,d)=>{
                this.resultofin = d.invalue;
                this.resultofout = d.outvalue;
                this.circleclick(indata,d,e);
            })
            .on("mouseover", (e, d) => {
                this.tooltip.select(".tooltip-inner")
                    .html(`${d.name}<br/>승차: ${d.invalue}<br />하차: ${d.outvalue}`);

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
        this.circles
            .transition()
            .attr("cx", (d,i)=>this.xScale(d.invalue))
            .attr("cy", (d,i)=>this.yScale(d.outvalue))
            .attr("fill", "black")
            .attr("r", 3)
            

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

    }


    circleclick(alldata,clickedData, event){
        this.circles
            .transition()
            .attr("fill","black")
            .attr("r", 3)
        this.circles
                .filter(d=>d.index === clickedData.index)
                .transition()
                .attr("fill", "red")
                .attr("r", 5)
        if(this.handlers.click){

            this.handlers.click(alldata.filter(d=>d["역명"] ===clickedData.name))
        }
    }
    getMonToSun(dt){
        let dayweek= new Date(dt).getDay(); 
        return (dayweek>0 && dayweek<6) ? 0 : 1;
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }


  

}