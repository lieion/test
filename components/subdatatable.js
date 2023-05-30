class SubDataTable {
    constructor(id) {
        this.id = id;
    }

    update(data) {
        let table = d3.select(this.id);
        let columns = ["날짜","구분","05~06","06~07","07~08","08~09","09~10","10~11","11~12","12~13","13~14","14~15","15~16","16~17","17~18","18~19","19~20","20~21","21~22","22~23","23~24","24~01","Total"]

        let rows = table
            .selectAll("tr")
            .data(data)
            .join("tr");

        rows.selectAll("td")
            .data(d => columns.map(c => d[c]))
            .join("td")
            .text(d => d)
    }
}
