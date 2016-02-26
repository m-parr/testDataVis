

// d3.json("money-data.json", function(data){
// 		console.log(data);
// });

// base chart
var Chart = {
    // initialize chart object with properties to be used throughout
    init: function(data, prop) {
        this.data = data || null;
        this.where = prop.where || "target-div";
        this.whichChart = prop.whichChart || "dataIn";
        this.width = 100;
        this.height = 100;

    },

    // insert chart to specified div ("where is a class or id")
    addChart: function() {
        this.container = d3.select(this.where).append("div")
            .attr("class","screen");

        this.chartBox = this.container.append("div")
            .attr("class","chart-box");
    },

    // create specific data objects for the various charts (total, moneyIn, moneyOut)
    // and set variable cases
    // ***** THIS WILL CHANGE ONCE the data creation methods are set
    // ***** determine if it should be handled prior to chart creation or as part of it
    refineData: function(rawData) {

        var objMoney = rawData[0],
            valMoneyIn = objMoney.moneyInTotal;
            valMoneyOut = objMoney.moneyOutTotal,
            valMoneyTotal = valMoneyIn + valMoneyOut,
            percMoneyIn = valMoneyIn/valMoneyTotal,
            percMoneyOut = valMoneyOut/valMoneyTotal,
            valDD = objMoney.dd,
            valChecks = objMoney.checks,
            valCB = objMoney.cashback,
            valEnt = objMoney.entertainment,
            valGroc = objMoney.groceries,
            valRest = objMoney.restaurants,
            valDifference = Math.round(Math.abs(valMoneyOut - valMoneyIn) * 100) / 100,
            moreIn = true,
            domPerc = percMoneyIn;

        //values to use elswhere
        this.valDifference = valDifference;
        this.moreIn = moreIn;
        this.domPerc = domPerc;
        this.valMoneyIn = valMoneyIn;
        this.valMoneyOut = valMoneyOut;

        // set variable cases
        if (valMoneyIn < valMoneyOut) {
            this.moreIn = false;
            this.domPerc = percMoneyOut;

            // to balance arc (and not start at angle 0),
            // subtract the dominant percentage from 50%
            // and divide by 2 to get the left or right overhang
            this.percOverhang = (0.5 - domPerc)/2;
        }

        // sort data min to max
        function sortData(dataBlock) {
            function compare(a,b) {
              if (a.count < b.count)
                return -1;
              else if (a.count > b.count)
                return 1;
              else
                return 0;
            }

            dataBlock.sort(compare);
        }

        // create data arrays for types of charts
        // (e.g. dataIn, dataOut, etc)
        this.dataIn = [
              { label: 'Cashback', count: valCB },
              { label: 'Checks', count: valChecks },
              { label: 'Direct Deposits', count: valDD }
            ];

        sortData(this.dataIn);

        this.dataOut = [
              { label: 'Groceries', count: valGroc },
              { label: 'Restaurants', count: valRest },
              { label: 'Entertainment', count: valEnt }
            ];

        sortData(this.dataOut);

    },

    // build out center money text
    circleText: function() {
        // set text element
        var text = this.svg.append("text")
            .attr("id","vis_text");

        // set dollar amount
        var textDollar = text.append("tspan")
            .text("$" + this.valCircle)
            .attr("text-anchor", "start")
            .style("font-size",fontSize+'px')
            .attr("fill", "#333")
            .attr("dy",fontSize/3)
            .attr("x",0);

        // set description text
        var textDesc = text.append("tspan")
            .attr("text-anchor", "start")
            .style("font-size",fontSize/fontDivsor+'px')
            .style("font-weight","500")
            .attr("fill", "#98a2a4")
            .attr("dy",fontSize/fontDivsor)
            .attr("x",0);


        textDesc.text(this.centerTextString);


        // position text element based on width and height
        var textWidth = document.getElementById('vis_text').getBoundingClientRect().width,
            textHeight = document.getElementById('vis_text').getBoundingClientRect().height,
            svgHeight = document.getElementById('money_vis').getBoundingClientRect().width;

        text.attr("transform", "translate(-" + textWidth/svgHeight * 50 + ",-" + textHeight / 10 + ")");
    },


    // build out CTA block -- text depends on spending
    createCTA: function() {

        if (this.moreIn) { // put in real logic!!! -- more in vs more out
            var ctaText = "ctaText1";
        } else {
            var ctaText = "ctaText3";
        }

        var cta = this.ctaTextOptions[ctaText];

        this.ctaInfo = this.container.append("div")
            .attr("class","cta-info")
            .attr("id","customId333");

        var ctaMessage = this.ctaInfo.append("span")
            .attr("id","cta_message");

        var ctaLink = this.ctaInfo.append("a")
            .attr("href", cta.href)
            .attr("id","cta_link");

        var ctaInfoEl = this.ctaInfo[0][0],
            messageText = document.createTextNode(cta.message),
            messageEl = ctaInfoEl.getElementsByTagName("span"),
            linkText = document.createTextNode(cta.link),
            linkEl = ctaInfoEl.getElementsByTagName("a");

        messageEl[0].appendChild(messageText);
        linkEl[0].appendChild(linkText);
    },

    // build out simple legend block
    createLegend: function() {
        var data = this.data;

        var legendBox = this.container.append("div")
            .attr("class","legend-box")
            .attr("id","customIddddd");


        var len = data.length;

        for (var i = 0; i < len; i++) {
            var legendBoxEl = document.getElementById("customIddddd"),
                label = document.createElement("p"),
                labelText = document.createTextNode(data[i]["label"]),
                amount = document.createElement("span"),
                amountText = document.createTextNode("$" + data[i]["count"]);
                circle = document.createElement("span");

            label.appendChild(labelText);
            amount.appendChild(amountText);

            amount.className = "label-amount";
            circle.className = "label-circle";
            circle.style.backgroundColor = this.colorArr[i];

            legendBoxEl.appendChild(label).appendChild(amount);
            label.appendChild(circle);
        }
    },

    // object to pull possible CTAs from
    ctaTextOptions: {
        "ctaText1" : {
            "message": "You're saving money, but not taking advantage!",
            "link": "Open a free 5% APY savings account",
            "href": "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=js%20add%20html%20to%20div"
        },
        "ctaText2" : {
            "message": "Bring more money in this month!",
            "link": "Learn about free direct deposit",
            "href": "test"
        },
        "ctaText3" : {
            "message": "Try out our money management tools!",
            "link": "create a budget",
            "href": "another link"
        }
    }

};


// object for donut-specifc methods (delegate to Chart)
var basicDonut = Object.create(Chart);

// setup a basic chart with varibale input
basicDonut.setup = function(data, prop) {
    // delegate to Chart
    this.init(data, prop);

    // set variables (e.g. colors and some text
    // dependent on which chart is set in build call
    var whichChart = this.whichChart;

    if (whichChart == "moneyIn") {
        this.colorArr = ["#1799bf", "#507640", "#85bb08"];
        this.valCircle = this.valMoneyIn;
        this.centerTextString = "Money In";
    } else if (whichChart == "moneyOut") {
        this.colorArr = ["#1799bf", "#FF8200", "#CF4520"];
        this.valCircle = this.valMoneyOut;
        this.centerTextString = "Money Out";
    } else {
        this.colorArr = ["#1799bf", "#137d9c", "#094050"];
        this.valCircle = "$$$";
        this.centerTextString = "Specify Type";
    }

};

// build the basic chart
basicDonut.build = function(data, prop) {
    //delegate to basicDonut
    this.setup(data, prop)

    // delegate to Chart
    this.addChart();


    // d3 script specifc to kind of chart (e.g. donut, bar, etc)
    var chartBox = this.chartBox,
        width = this.width,
        height = this.height,
        data = this.data,
        outerRadius = Math.min(width,height)/2,
        innerRadius = (outerRadius/5)*4.1;

        rad = 2 * Math.PI,
        fontSize = (Math.min(width,height)/8),
        fontDivsor = 1.4,
        color = d3.scale.ordinal()
            .range(this.colorArr);


    this.svg = chartBox.append("svg")
        .attr({
            id: "money_vis",
            width: "100%",
            height: "100%",
            viewBox: '0 0 '+Math.min(width,height) +' '+Math.min(width,height),
            preserveAspectRatio: "none"
        }).append("g")
        .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

    var svg = this.svg;

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(function(d) {return d.startAngle + 0.05 * rad }) // 0.025 if no cornerRadius
        .endAngle(function(d) {return d.endAngle + 0.05 * rad })  // 0.025 if no cornerRadius
        .cornerRadius(0);

    var pie = d3.layout.pie()
        .value(function(d) {
            return d.count;
        }).sort(null); // add .padAngle(.03) for padding between sections

    var path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {
            return color(d.data.label);
        });

    // delegate to Chart object
    this.createCTA();
    this.createLegend();
    this.circleText();
};






(function(){
    // this represents an aggregate of all transaction category amounts
    var dataset = [
      {
        "cashback": 51.02,
        "checks": 234.5,
        "dd": 845.97,
        "entertainment": 401.43,
        "groceries": 689.23,
        "moneyInTotal": 1131.49,
        "moneyOutTotal": 1503.55,
        "restaurants": 412.89
      }
    ];

    // choose kind of chart (e.g. donut, bar, etc)
    var chart1 = Object.create(basicDonut);

    // will integrate once data manipulation method is set
    chart1.refineData(dataset);

    // each kind of chart will have its own setup and build methods
    chart1.build(chart1.dataIn, {
        whichChart: "moneyIn", // options: moneyIn, moneyOut
        where: "#moniesId" // class or ID where you want to insert chart
    });

}());
