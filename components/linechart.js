class LineChart {
    margin = {
        top: 50, right: 150, bottom: 50, left: 50
    }

    constructor(svg, data, width = 600, height = 250) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.xScales = d3.scaleLinear();
        this.yScales = d3.scaleLinear();
        this.legend = this.container.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${this.width}, ${this.height / 8})`);
        this.axes = this.container.append("g");
        this.titles = this.container.append("g");
        this.lines = this.container.append("g");
        this.focusedLines = this.container.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(clickedData,state=0) {
        //state 0-midweek 1-weedend total-01모두

        // console.log(clickedData[0]["역명"])
        let xw= clickedData.filter(d=>(d["구분"]==="승차" && this.getMonToSun(d["날짜"])===0));
        let xh= clickedData.filter(d=>(d["구분"]==="승차" && this.getMonToSun(d["날짜"])===1));
        let yw= clickedData.filter(d=>(d["구분"]==="하차" && this.getMonToSun(d["날짜"])===0));
        let yh= clickedData.filter(d=>(d["구분"]==="하차" && this.getMonToSun(d["날짜"])===1));
        let xmax=-1;
        let xdomain=["05~06","06~07","07~08","08~09","09~10","10~11","11~12","12~13","13~14","14~15","15~16","16~17","17~18","18~19","19~20","20~21","21~22","22~23","23~24","24~01"]
        let xdata = xdomain.map(d=>{
            return {
                clock: d,
                inmidweek : d3.mean(xw.map(e=>e[d])),
                inmweekend : d3.mean(xh.map(e=>e[d])),
                outmidweek : d3.mean(yw.map(e=>e[d])),
                outweekend : d3.mean(yh.map(e=>e[d]))
            }
        })

        

        xmax=d3.max([d3.max(xdata.map(d=>d.inmidweek)),d3.max(xdata.map(d=>d.inmweekend)),d3.max(xdata.map(d=>d.outmidweek)),d3.max(xdata.map(d=>d.outweekend))])
        // console.log(xdata.map(d=>d.inmidweek))
        this.xScales.domain([4,25]).range([0, this.width])
        this.yScales.domain([0,xmax]).range([this.height,0])

        let lineGenerator = d3.line()
            .x((d, i) => this.xScales(i + 5))
            .y(d => this.yScales(d));


        //circle
        this.container.selectAll(".inmidweek")
            .data(xdata)
            .join(
                enter => enter.append("circle")
                    .attr("class", "inmidweek")
                    .transition()
                    .attr("r", 3)
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.inmidweek))
                    .style("fill", "blue"),
                    
                update => update
                    .transition()
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.inmidweek))
            )
            .exit()
            .remove();

        this.container.selectAll(".inmweekend")
            .data(xdata)
            .join(
                enter => enter.append("circle")
                    .attr("class", "inmweekend")
                    .transition()
                    .attr("r", 3)
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.inmweekend))
                    .style("fill", "red"),
                update => update
                    .transition()
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.inmweekend))
            )
            .exit()
            .remove();

        this.container.selectAll(".outmidweek")
            .data(xdata)
            .join(
                enter => enter.append("circle")
                    .attr("class", "outmidweek")
                    .transition()
                    .attr("r", 3)
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.outmidweek))
                    .style("fill", "green"),
                    
                update => update
                    .transition()
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.outmidweek))
            )
            .exit()
            .remove();

        this.container.selectAll(".outmweekend")
            .data(xdata)
            .join(
                enter => enter.append("circle")
                    .attr("class", "outmweekend")
                    .transition()
                    .attr("r", 3)
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.outweekend))
                    .style("fill", "purple"),
                update => update
                    .transition()
                    .attr("cx", (d, i) => this.xScales(i + 5))
                    .attr("cy", d => this.yScales(d.outweekend))
            )
            .exit()
            .remove();


        //Line

        this.container.selectAll(".inmidweekline")
            .data([xdata.map(i => i.inmidweek)])
            .join(
                enter => enter.append("path")
                .attr("class", "inmidweekline")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("d", lineGenerator)
                .call(enter => enter.transition()
                    .attr("d", lineGenerator)),
                update => update.call(update => update.transition()
                .attr("d", lineGenerator))
            )
            .exit()
            .remove();
        
        this.container.selectAll(".inweekendline")
            .data([xdata.map(i => i.inmweekend)])
            .join(
                enter => enter.append("path")
                .attr("class", "inweekendline")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("d", lineGenerator)
                .call(enter => enter.transition()
                    .attr("d", lineGenerator)),
                update => update.call(update => update.transition()
                .attr("d", lineGenerator))
            )
            .exit()
            .remove();

        this.container.selectAll(".outmidweekline")
            .data([xdata.map(i => i.outmidweek)])
            .join(
                enter => enter.append("path")
                .attr("class", "outmidweekline")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 2)
                .attr("d", lineGenerator)
                .call(enter => enter.transition()
                    .attr("d", lineGenerator)),
                update => update.call(update => update.transition()
                .attr("d", lineGenerator))
            )
            .exit()
            .remove();
        
        this.container.selectAll(".outweekendline")
            .data([xdata.map(i => i.outweekend)])
            .join(
                enter => enter.append("path")
                .attr("class", "outweekendline")
                .attr("fill", "none")
                .attr("stroke", "purple")
                .attr("stroke-width", 2)
                .attr("d", lineGenerator)
                .call(enter => enter.transition()
                    .attr("d", lineGenerator)),
                update => update.call(update => update.transition()
                .attr("d", lineGenerator))
            )
            .exit()
            .remove();
        let legendData;
        if(state ===0)
        {
            this.container.selectAll(".inmweekend").style("display","none")
            this.container.selectAll(".inweekendline").style("display","none")
            this.container.selectAll(".inmidweek").style("display","")
            this.container.selectAll(".inmidweekline").style("display","")

            this.container.selectAll(".outmweekend").style("display","none")
            this.container.selectAll(".outweekendline").style("display","none")
            this.container.selectAll(".outmidweek").style("display","")
            this.container.selectAll(".outmidweekline").style("display","")

            legendData = [
                { label: "Get-On(WeekDay)", color: "blue" },
                { label: "Get-Off(WeekDay)", color: "green" }
            ];
              
              
        }
        else if(state===1)
        {
            this.container.selectAll(".inmweekend").style("display","")
            this.container.selectAll(".inweekendline").style("display","")
            this.container.selectAll(".inmidweek").style("display","none")
            this.container.selectAll(".inmidweekline").style("display","none")

            this.container.selectAll(".outmweekend").style("display","")
            this.container.selectAll(".outweekendline").style("display","")
            this.container.selectAll(".outmidweek").style("display","none")
            this.container.selectAll(".outmidweekline").style("display","none")

            legendData = [
                { label: "Get-On(WeekEnd)", color: "red" },
                { label: "Get-Off(WeekEnd)", color: "purple" }
            ];
        }
        else if(state===2)
        {
            this.container.selectAll(".inmweekend").style("display","")
            this.container.selectAll(".inweekendline").style("display","")
            this.container.selectAll(".inmidweek").style("display","")
            this.container.selectAll(".inmidweekline").style("display","")

            this.container.selectAll(".outmweekend").style("display","")
            this.container.selectAll(".outweekendline").style("display","")
            this.container.selectAll(".outmidweek").style("display","")
            this.container.selectAll(".outmidweekline").style("display","")

            legendData = [
                { label: "Get-On(WeekDay)", color: "blue" },
                { label: "Get-Off(WeekDay)", color: "green" },
                { label: "Get-On(WeekEnd)", color: "red" },
                { label: "Get-Off(WeekEnd)", color: "purple" }
            ];

        }

        
        
        this.legend.selectAll(".legend-item").remove();

        // 범례 항목 생성
        let legendItems = this.legend.selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        // 범례 색상 사각형
        legendItems.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => d.color);

        // 범례 텍스트
        legendItems.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text(d => d.label);

        


        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScales));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScales));
        
    }

    getMonToSun(dt){
        let dayweek= new Date(dt).getDay(); 
        return (dayweek>0 && dayweek<6) ? 0 : 1;
    }
}