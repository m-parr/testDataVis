


// set submit button to create data and money pie
var getMain = document.getElementById("get_main"),
    getIn = document.getElementById("get_in"),
    getOut = document.getElementById("get_out");

var dataInput = document.getElementById('inputData');

// get total of a row after change is made
dataInput.addEventListener("change", getRowTotal, false);

function getRowTotal(e) {
    var row = e.target.parentNode.parentNode,
        inputs = row.querySelectorAll('input'),
        newTotal = e.target.parentNode.parentNode.querySelector('.total'),
        toSum,
        result = 0;

    // create array of all input values
    toSum = [].slice.call(inputs).map(function (node) {
        return Number(node.value);
    });

    // remove the value for the total
    toSum.pop(3);

    // add remaining values
    for (var i = 0; i < toSum.length; i++) {
        result += toSum[i];
    }

    // change total input value
    newTotal.value = Math.round(result * 100) / 100;
}

// submit button event listenter
getMain.addEventListener("click", function() {setData("main");}, false);
getIn.addEventListener("click", function() {setData("in");}, false);
getOut.addEventListener("click", function() {setData("out");}, false);


function closeChart() {
    chart = e.target.parentNode.parentNode;

    console.log(chart);

    chart.parentNode.removeChild(chart);
}


// create data object and pass to d3 function to make the data vis
function setData(whichChart) {
    var form,
        inputs,
        newData;

    table = document.getElementById('inputData');
    inputs = table.querySelectorAll('input');

    // create array of keys from input id
    newKeys = [].slice.call(inputs).map(function (node) {
        return node.id;
    });

    // create array of values from input values
    newVals = [].slice.call(inputs).map(function (node) {
        return Number(node.value);
    });

    // console.log(newKeys);
    // console.log(newVals);

    // combine arrays to create one data object of key value pairs
    function createData (keys, props, start, finish) {
        if (keys == null) return {};
        var result = {},
            k = keys.length,
            i = start,
            finish = finish;

        for (i ; i <= finish; i++) {
          if (props) {
            result[keys[i]] = props[i];
          } else {
            result[keys[i][0]] = keys[i][1];
          }
        }
        return result;
      };

    // create object for all money
    moneyData = createData(newKeys, newVals, 0, 7);

    // create object for money in
    moneyInData = createData(newKeys, newVals, 0, 3);
    // create object for money out
    moneyOutData = createData(newKeys, newVals, 4, 7);

    // create object for toggle values
    toggleData = createData(newKeys, newVals, 8, 11);

    // call data vis function, passing money in and out objects
    // to be used as one data object
        makeDataVis(moneyData, toggleData, whichChart);
        //makeOtherVis(moneyInData, moneyOutData, toggleData);
};


function makeDataVis(moneyData, toggles, whichChart) {
    var whichChart = whichChart;


    // combines to data that looks something like this:
            // {
            //     "moneyin": {
            //         "dd": 494.58,
            //         "checks": 234.50,
            //         "cashback": 21.02
            //         "moneyInTotal": 750.10,
            //     },
            //
            //     "moneyout" : {
            //         "groceries": 589.23,
            //         "restaurants": 412.89,
            //         "entertainment": 201.43
            //         "moneyOutTotal": 1245.09,
            //     }
            // }
    var toggleData = {toggles};

    // set variables
    var rad = 2 * Math.PI,
        width = 100,
        height = 100,
        outerRadius = Math.min(width,height)/2,
        innerRadius = (outerRadius/5)*4.1,
        fontSize = (Math.min(width,height)/8),
        objMoney = moneyData,
        valMoneyIn = objMoney.moneyInTotal;
        valMoneyOut = objMoney.moneyOutTotal,
        valMoneyTotal = valMoneyIn + valMoneyOut,
        percMoneyIn = valMoneyIn/valMoneyTotal,
        percMoneyOut = valMoneyOut/valMoneyTotal,
        valDD = moneyData.dd,
        valChecks = moneyData.checks,
        valCB = moneyData.cashback,
        valEnt = moneyData.entertainment,
        valGroc = moneyData.groceries,
        valRest = moneyData.restaurants,
        valDifference = Math.round(Math.abs(valMoneyOut - valMoneyIn) * 100) / 100,
        moreIn = true,
        domPerc = percMoneyIn,
        objToggles = toggleData["toggles"],
        transDelay = objToggles.transDelay;
        animateDelay = objToggles.animateDelay,
        cornerRadius = objToggles.cornerRadius; // outerRadius - innerRadius

    console.log(percMoneyIn + " " + percMoneyOut);


    // create data arrays for charts
    var dataIn = [
          { label: 'Cashback', count: valCB },
          { label: 'Checks', count: valChecks },
          { label: 'Direct Deposits', count: valDD }
        ];

    sortData(dataIn);

    var dataOut = [
          { label: 'Groceries', count: valGroc },
          { label: 'Restaurants', count: valRest },
          { label: 'Entertainment', count: valEnt }
        ];

    sortData(dataOut);


    // CTA messages
    var ctaText1 = {
            "message": "You're saving money, but not taking advantage!",
            "link": "Open a free 5% APY savings account",
            "href": "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=js%20add%20html%20to%20div"
        },
        ctaText2 = {
            "message": "Bring more money in this month!",
            "link": "Learn about free direct deposit",
            "href": "test"
        },
        ctaText3  = {
            "message": "Try out our money management tools!",
            "link": "create a budget",
            "href": "another link"
        };


    // set variable cases
    if (valMoneyIn < valMoneyOut) {
        moreIn = false;
        domPerc = percMoneyOut;

        // to balance arc (and not start at angle 0),
        // subtract the dominant percentage from 50%
        // and divide by 2 to get the left or right overhang
        var percOverhang = (0.5 - domPerc)/2;
    }

    // sort data min to max
    function sortData(data) {
        function compare(a,b) {
          if (a.count < b.count)
            return -1;
          else if (a.count > b.count)
            return 1;
          else
            return 0;
        }

        data.sort(compare);
    }

    function createCTA(container, cta) {
        var customId = "cta_info" + Math.floor(Math.random() * (1000 - 0)) + 0;
        var ctaInfo = container.append("div")
            .attr("class","cta-info")
            .attr("id",customId);

        var ctaMessage = ctaInfo.append("span")
            .attr("id","cta_message");

        var ctaLink = ctaInfo.append("a")
            .attr("href", cta.href)
            .attr("id","cta_link");

        var ctaInfoEl = document.getElementById(customId),
            messageText = document.createTextNode(cta.message),
            messageEl = ctaInfoEl.getElementsByTagName("span"),
            linkText = document.createTextNode(cta.link),
            linkEl = ctaInfoEl.getElementsByTagName("a");
        messageEl[0].appendChild(messageText);
        linkEl[0].appendChild(linkText);
    }


    function createLegend(container, data, colorArr) {
        var customId = "legend_box" + Math.floor(Math.random() * (1000 - 0)) + 0;

        var legendBox = container.append("div")
            .attr("class","legend-box")
            .attr("id",customId);


        var len = data.length;

        for (var i = 0; i < len; i++) {
            var legendBoxEl = document.getElementById(customId),
                label = document.createElement("p"),
                labelText = document.createTextNode(data[i]["label"]),
                amount = document.createElement("span"),
                amountText = document.createTextNode("$" + data[i]["count"]);
                circle = document.createElement("span");

            label.appendChild(labelText);
            amount.appendChild(amountText);

            amount.className = "label-amount";
            circle.className = "label-circle";
            circle.style.backgroundColor = colorArr[i];

            legendBoxEl.appendChild(label).appendChild(amount);
            label.appendChild(circle);
        }
    }

    function createFullLegend(container, dataIn, dataOut) {
        var customId = "legend_box" + Math.floor(Math.random() * (1000 - 0)) + 0;

        var legendBox = container.append("div")
            .attr("class","legend-full-box")
            .attr("id",customId);

        var legendBoxEl = document.getElementById(customId),
            boxIn = document.createElement("div"),
            amountIn = document.createElement("p"),
            amountInText = document.createTextNode("$" + valMoneyIn),
            labelIn = document.createElement("span"),
            labelInText = document.createTextNode("Money in"),
            boxOut = document.createElement("div"),
            amountOut = document.createElement("p"),
            amountOutText = document.createTextNode("$" + valMoneyOut),
            labelOut = document.createElement("span"),
            labelOutText = document.createTextNode("Money out"),
            circleIn = document.createElement("span"),
            circleInText = document.createTextNode("+"),
            circleOut = document.createElement("span"),
            circleOutText = document.createTextNode("-");



        legendBoxEl.appendChild(boxIn);
        legendBoxEl.appendChild(boxOut);

        boxIn.className = "box-in";
        boxOut.className = "box-out";
        amountIn.className = "in-total";
        amountOut.className = "out-total";
        circleIn.className = "label-circle";
        circleOut.className = "label-circle";

        circleIn.appendChild(circleInText);
        circleOut.appendChild(circleOutText);

        amountIn.appendChild(amountInText);
        labelIn.appendChild(labelInText);
        amountIn.appendChild(circleIn);
        amountOut.appendChild(amountOutText);
        labelOut.appendChild(labelOutText);
        amountOut.appendChild(circleOut);

        boxIn.appendChild(amountIn).appendChild(labelIn);
        boxOut.appendChild(amountOut).appendChild(labelOut);



        // money in
        var len = dataIn.length - 1;

        for (var i = len; i >= 0; i--) {
            var amount = document.createElement("p"),
                amountText = document.createTextNode(" $" + dataIn[i]["count"]),
                label = document.createElement("span"),
                labelText = document.createTextNode(dataIn[i]["label"]);

            amount.appendChild(amountText);
            label.appendChild(labelText);

            boxIn.className = "box-in";
            label.className = "full-label";

            boxIn.appendChild(amount).appendChild(label);
        }


        // money out
        var len = dataOut.length - 1;

        for (var i = len; i >= 0; i--) {
            var amount = document.createElement("p"),
                amountText = document.createTextNode(" $" + dataOut[i]["count"]),
                label = document.createElement("span"),
                labelText = document.createTextNode(dataOut[i]["label"]);

            amount.appendChild(amountText);
            label.appendChild(labelText);

            label.className = "full-label";

            boxOut.appendChild(amount).appendChild(label);
        }



    }


    // create footer
    function createFooter(container) {
        var customId = "footer_box" + Math.floor(Math.random() * (1000 - 0)) + 0;

        var footerBox = container.append("div")
            .attr("class","footer")
            .attr("id",customId);

        var footerBoxEl = document.getElementById(customId),
            footer1 = document.createElement("a"),
            footerText1 = document.createTextNode("Savings Goals"),
            footer2 = document.createElement("a"),
            footerText2 = document.createTextNode("Budgets"),
            footerClose = document.createElement("a"),
            footerTextClose = document.createTextNode("X");

        footerClose.className = "footer-close";
        footerClose.href = "#";
        footer1.href = "#";
        footer2.href = "#";

        footer1.appendChild(footerText1);
        footer2.appendChild(footerText2);
        footerClose.appendChild(footerTextClose);
        footerBoxEl.appendChild(footerClose);
        footerBoxEl.appendChild(footer2);
        footerBoxEl.appendChild(footer1);

    }


    function makeTotalChart() {
        var customId = "screen_box" + Math.floor(Math.random() * (1000 - 0)) + 0;

        var screenBox = d3.select(".monies").append("div")
            .attr("class","screen-box")
            .attr("id",customId);

        var screenBg = screenBox.append("div")
            .attr("class","screen-bg");

        function addBlur() {
            screenBg.attr("class","screen-bg blur")
        }


        window.setTimeout(addBlur, 1000);

        window.setTimeout(finishChart, 1250);


        function finishChart(){

            var fontDivsor = 2,
                centerTextString;
            // set arc creation
            function arcSetup(startAngle){
                return d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .cornerRadius(0)
                    .startAngle(startAngle * rad)
            }

            var arc = arcSetup(0);

            var arcIn = arcSetup(0.75);

            var arcOut = arcSetup(0.25);


            // set and create svg element and position
            var container = d3.select("#" + customId).append("div")
                .attr("class","screen");

            var chartBox = container.append("div")
                .attr("class","chart-box")

            var svg = chartBox.append("svg")
                .attr("id","money_vis")
                .attr("width", '100%')
                .attr("height", '100%')
                .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
                .attr('preserveAspectRatio','xMinYMin')
                .append("g")
                .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");


            // create text element inside circle
            if (moreIn){
                centerTextString = "more money in";
            } else {
                centerTextString = "more money out";
            }

            circleText(svg, valDifference, fontDivsor, centerTextString);


            // create CTA text
            if (moreIn) {
                var ctaText = ctaText1;
            } else {
                var ctaText = ctaText3;
            }

            createCTA(container, ctaText);

            createFullLegend(container, dataIn, dataOut);

            createFooter(container);



            // create initial gray path to fill
            var baseCircle = svg.append("path")
                .datum({endAngle: 2 * rad})
                .style("fill", "transparent")
                .attr("d", arc);


            // create base (less) money circle)
            // var moneyIn = svg.append("path")
            //     .datum({endAngle: rad})
            //     .style("fill", "#86bc07")
            //     .attr("d", arc);



            // create and grow money in paths -- will refactor for DRY
            function buildMoneyIn() {

                var fill = "#86bc07";

                var moneyInTop = svg.append("path")
                    .datum({endAngle: 0.75 * rad})
                    .style("fill", fill)
                    .attr("d", arc);

                var moneyInBottom = svg.append("path")
                    .datum({endAngle: 0.75 * rad})
                    .style("fill", fill)
                    .attr("d", arc);

                moneyInTop.transition()
                    .duration(transDelay)
                    .call(arcTween, (0.75 + percMoneyIn/2) * rad, arcIn, fill);

                moneyInBottom.transition()
                    .duration(transDelay)
                    .call(arcTween, (0.75 - percMoneyIn/2) * rad, arcIn, fill);
            }



            // create and grow money out paths  -- will refactor for DRY
            function buildMoneyOut() {

                var fill = "#CB4525";

                var moneyOutTop = svg.append("path")
                    .datum({endAngle: 0.25 * rad})
                    .style("fill", fill)
                    .attr("d", arc);

                var moneyOutBottom = svg.append("path")
                    .datum({endAngle: 0.25 * rad})
                    .style("fill", fill)
                    .attr("d", arc);


                moneyOutTop.transition()
                    .duration(transDelay)
                    .call(arcTween, (0.25 - percMoneyOut/2) * rad, arcOut, fill);

                moneyOutBottom.transition()
                    .duration(transDelay)
                    .call(arcTween, (0.25 + percMoneyOut/2) * rad, arcOut, fill);

            }


            // define order of path creation
            function buildOrder(first, second, delay) {
                first();
                window.setTimeout(second, delay);
            }

            // determine which should happen first (or at the same time???)
            if (moreIn) {
                buildOrder(buildMoneyOut, buildMoneyIn, animateDelay);
            } else {
                buildOrder(buildMoneyIn, buildMoneyOut, animateDelay);
            }

            // create cricles for rounded ends
            function makeCircle(color) {
                return svg.append("circle")
                                  .attr("cx", 0)
                                  .attr("cy", -(cornerRadius-0.5))
                                  .attr("r", cornerRadius - 0.5)
                                  .style("fill", color);
            }


            // set transtion to grow paths
            function arcTween(transition, newAngle, arcType, color) {

                var circle = makeCircle(color);

                transition.attrTween("d", function(d) {

                    var interpolate = d3.interpolate(d.endAngle, newAngle);

                    return function(t) {

                        d.endAngle = interpolate(t);

                        var path = arcType(d);

                        var coords = path.split("L")[1].split("A")[0]
                        circle.attr('transform', 'translate(' + coords + ')' + 'rotate(' + (d.endAngle * 180/Math.PI) + ')');


                        return path;
                    };
                });
            }
        }
    }


    function circleText(svg, val, fontDivsor, centerTextString) {

        // set text element
        var text = svg.append("text")
            .attr("id","vis_text");

        // set dollar amount
        var textDollar = text.append("tspan")
            .text("$" + val)
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


        textDesc.text(centerTextString);


        // position text element based on width and height
        var textWidth = document.getElementById('vis_text').getBoundingClientRect().width,
            textHeight = document.getElementById('vis_text').getBoundingClientRect().height,
            svgHeight = document.getElementById('money_vis').getBoundingClientRect().width;
        text.attr("transform", "translate(-" + textWidth/svgHeight * 50 + ",-" + textHeight / 10 + ")");
    }


    function makeFocusChart(customId, data, val, centerTextString, colorArr) {
        var //r = 400,
            rad = 2 * Math.PI,
            fontSize = (Math.min(width,height)/8),
            fontDivsor = 1.4,
            color = d3.scale.ordinal()
                .range(colorArr);

        var container = d3.select("#" + customId).append("div")
            .attr("class","screen");

        var chartBox = container.append("div")
            .attr("class","chart-box")

        var svg = chartBox.append("svg")
            .attr("id","money_vis")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
            .attr('preserveAspectRatio','none')
            .append("g")
            .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(function(d) {return d.startAngle + 0.05 * rad }) // 0.025 if no cornerRadius
            .endAngle(function(d) {return d.endAngle + 0.05 * rad })  // 0.025 if no cornerRadius
            .cornerRadius(0);

        var pie = d3.layout.pie()
            .value(function(d) {
                return d.count;
            }).sort(null);

        var path = svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d, i) {
                return color(d.data.label);
            });

        //console.log(pie(data));

        // create CTA text
        if (moreIn) {
            var ctaText = ctaText1;
        } else {
            var ctaText = ctaText2;
        }

        createCTA(container, ctaText);

        createLegend(container, data, colorArr);

        createFooter(container);




        // create text element inside circle
        circleText(svg, val, fontDivsor, centerTextString);

        // Legend
        // var legendBox = container.append("div")
        //     .attr("class","legend-box")
        //
        // var svgLegend = legendBox.append("svg")
        //     .attr("width", '100%')
        //     .attr("height", '100%')
        //     .attr('viewBox','0 0 205 300' )
        //     .attr('preserveAspectRatio','none')
        //     .append("g")
        //     .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");
        //
        // var legendRectSize = 15;
        // var legendSpacing = 5;
        //
        // var legend = svgLegend.selectAll('.legend')
        //     .data(color.domain())
        //     .enter()
        //     .append('g')
        //     .attr('class', 'legend')
        //     .attr('transform', function(d, i) {
        //         var height = legendRectSize + legendSpacing,
        //             offset =  height * color.domain().length / 2,
        //             horz = -2 * legendRectSize,
        //             vert = i * height - offset;
        //
        //         return 'translate(' + horz + ',' + vert + ')';
        //     });
        //
        // legend.append('circle')
        //     .attr("cx", 5)
        //     .attr("cy", 5)
        //     .attr("r", 5)
        //     .style("fill", color);
        //
        // legend.append('text')
        //     .attr('x', legendRectSize + legendSpacing)
        //     .attr('y', legendRectSize - legendSpacing)
        //     .append('tspan')
        //     .text(function(d) { return d; });
        //
        // legend.selectAll("text")
        //     .append("tspan")
        //     .attr("x","180")
        //     .attr("text-anchor","end")
        //     .text("$XXX.XX");

    }

    // make chart for Money In
    function makeInChart() {

        var colorArr = ["#1799bf", "#507640", "#85bb08"],
            centerTextString = "Money In";

        var customId = "screen_box" + Math.floor(Math.random() * (1000 - 0)) + 0;

        var screenBox = d3.select(".monies").append("div")
            .attr("class","screen-box")
            .attr("id",customId);

        makeFocusChart(customId, dataIn, valMoneyIn, centerTextString, colorArr);

    }


    // make chart for Money Out
    function makeOutChart() {
        var colorArr = ["#1799bf", "#FF8200", "#CF4520"],
            centerTextString = "Money Out";

        var customId = "screen_box" + Math.floor(Math.random() * (1000 - 0)) + 0;

        var screenBox = d3.select(".monies").append("div")
            .attr("class","screen-box")
            .attr("id",customId);

        makeFocusChart(customId, dataOut, valMoneyOut, centerTextString, colorArr);
    }

    // call function depending on which chart is needed
    if (whichChart == "main") {
        makeTotalChart();
    } else if (whichChart == "in") {
        makeInChart();
    } else {
        makeOutChart();
    }



}
