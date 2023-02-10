/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 60.43213430710021, "KoPercent": 39.56786569289979};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41741171378250097, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0255, 500, 1500, "http://35.223.43.28:8000/api/v1/order/lastorder"], "isController": false}, {"data": [0.98775, 500, 1500, "http://35.223.43.28:4200/user/category/home-28"], "isController": false}, {"data": [0.99675, 500, 1500, "http://35.223.43.28:4200/user/category/home-29"], "isController": false}, {"data": [0.9795, 500, 1500, "https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.02275, 500, 1500, "http://35.223.43.28:8000/api/v1/cart/add"], "isController": false}, {"data": [0.01475, 500, 1500, "http://35.223.43.28:8000/api/v2/order/create"], "isController": false}, {"data": [0.59325, 500, 1500, "http://35.223.43.28:4200/user/category/home-8"], "isController": false}, {"data": [0.44725, 500, 1500, "http://35.223.43.28:4200/user/category/home-9"], "isController": false}, {"data": [0.63975, 500, 1500, "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.40725, 500, 1500, "http://35.223.43.28:4200/user/category/home-6"], "isController": false}, {"data": [0.4515, 500, 1500, "http://35.223.43.28:4200/user/category/home-7"], "isController": false}, {"data": [0.99325, 500, 1500, "http://35.223.43.28:4200/user/category/home-4"], "isController": false}, {"data": [0.994, 500, 1500, "http://35.223.43.28:4200/user/category/home-5"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.99775, 500, 1500, "http://35.223.43.28:4200/user/category/home-2"], "isController": false}, {"data": [0.9995, 500, 1500, "http://35.223.43.28:4200/user/category/home-3"], "isController": false}, {"data": [0.94375, 500, 1500, "https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true"], "isController": false}, {"data": [0.5242621310655328, 500, 1500, "http://35.223.43.28:4200/user/category/home-0"], "isController": false}, {"data": [0.381, 500, 1500, "http://35.223.43.28:4200/user/category/home-26"], "isController": false}, {"data": [0.021666666666666667, 500, 1500, "http://35.223.43.28:8000/api/v1/cart/viewbycustomerid"], "isController": false}, {"data": [0.7056028014007003, 500, 1500, "http://35.223.43.28:4200/user/category/home-1"], "isController": false}, {"data": [0.65125, 500, 1500, "http://35.223.43.28:4200/user/category/home-27"], "isController": false}, {"data": [0.4115, 500, 1500, "http://35.223.43.28:4200/user/category/home-24"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.43.28:4200/user/category/home-25"], "isController": false}, {"data": [0.3575, 500, 1500, "http://35.223.43.28:4200/user/category/home-22"], "isController": false}, {"data": [0.0, 500, 1500, "http://35.223.43.28:4200/user/category/home"], "isController": false}, {"data": [0.48025, 500, 1500, "http://35.223.43.28:4200/user/category/home-23"], "isController": false}, {"data": [0.98825, 500, 1500, "http://35.223.43.28:4200/user/category/home-20"], "isController": false}, {"data": [0.9065, 500, 1500, "http://35.223.43.28:4200/user/category/home-21"], "isController": false}, {"data": [0.47175, 500, 1500, "http://35.223.43.28:4200/user/category/home-19"], "isController": false}, {"data": [0.9845, 500, 1500, "http://35.223.43.28:4200/user/category/home-17"], "isController": false}, {"data": [0.53225, 500, 1500, "http://35.223.43.28:4200/user/category/home-18"], "isController": false}, {"data": [0.0245, 500, 1500, "http://35.223.43.28:8000/api/v2/sub/products"], "isController": false}, {"data": [0.02725, 500, 1500, "http://35.223.43.28:8000/api/v1/customer/slot/viewall"], "isController": false}, {"data": [0.46275, 500, 1500, "http://35.223.43.28:4200/user/category/home-15"], "isController": false}, {"data": [0.845, 500, 1500, "http://35.223.43.28:4200/user/category/home-16"], "isController": false}, {"data": [0.8965, 500, 1500, "http://35.223.43.28:4200/user/category/home-13"], "isController": false}, {"data": [0.76275, 500, 1500, "http://35.223.43.28:4200/user/category/home-14"], "isController": false}, {"data": [0.939, 500, 1500, "http://35.223.43.28:4200/user/category/home-11"], "isController": false}, {"data": [0.6795, 500, 1500, "http://35.223.43.28:4200/user/category/home-12"], "isController": false}, {"data": [0.027, 500, 1500, "http://35.223.43.28:8000/api/v1/taxcharges/viewAll"], "isController": false}, {"data": [0.47925, 500, 1500, "http://35.223.43.28:4200/user/category/home-10"], "isController": false}, {"data": [0.0235, 500, 1500, "http://35.223.43.28:8000/api/v1/customer/userexist"], "isController": false}, {"data": [0.023, 500, 1500, "http://35.223.43.28:8000/api/v1/order/view"], "isController": false}, {"data": [0.026625, 500, 1500, "http://35.223.43.28:8000/api/v1/category/viewAll"], "isController": false}, {"data": [0.02725, 500, 1500, "http://35.223.43.28:8000/api/v1/customer/address/view"], "isController": false}, {"data": [0.02675, 500, 1500, "http://35.223.43.28:8000/api/v1/customer/address/viewbycustomer"], "isController": false}, {"data": [0.02625, 500, 1500, "http://35.223.43.28:8000/api/v1/subcategory/viewcan"], "isController": false}, {"data": [0.99475, 500, 1500, "https://www.instamojo.com/webapi/checkout-assets/"], "isController": false}, {"data": [0.027, 500, 1500, "http://35.223.43.28:8000/api/v1/product/view"], "isController": false}, {"data": [0.023625, 500, 1500, "http://35.223.43.28:8000/api/v1/order/precheck"], "isController": false}, {"data": [0.247, 500, 1500, "https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.989125, 500, 1500, "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.0265, 500, 1500, "http://35.223.43.28:8000/api/v1/banner/viewAll"], "isController": false}, {"data": [0.00875, 500, 1500, "http://35.223.43.28:8000/api/v1/order/viewbycustomer"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 131996, 52228, 39.56786569289979, 834.1566562623128, 0, 122049, 258.0, 1105.0, 1839.9000000000015, 8400.590000000066, 50.70415609977958, 17650.68820020732, 34.61095898269592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://35.223.43.28:8000/api/v1/order/lastorder", 4000, 3896, 97.4, 277.0289999999997, 247, 2160, 253.0, 271.0, 338.89999999999964, 748.0, 1.5457073388638742, 0.7203954718793328, 0.8664414184647108], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-28", 2000, 2, 0.1, 79.03750000000014, 0, 15509, 30.0, 60.0, 99.0, 1053.0, 0.7732310503299957, 16.62057575315604, 0.3009869823169791], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-29", 2000, 2, 0.1, 37.627999999999965, 0, 15282, 18.0, 45.0, 61.0, 279.95000000000005, 0.7732331429375592, 45.85325395354106, 0.3017421522635241], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 0, 0.0, 288.43049999999965, 201, 1441, 270.0, 411.0, 480.84999999999945, 852.99, 0.773299514367905, 0.5293778902069349, 0.41308089292894923], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/cart/add", 2000, 1954, 97.7, 275.0419999999995, 246, 1204, 253.0, 268.9000000000001, 308.0, 737.99, 0.7733724762922667, 0.29478972497811357, 0.5611481932472209], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v2/order/create", 2000, 1970, 98.5, 275.97950000000037, 246, 1218, 253.0, 274.0, 340.84999999999945, 738.99, 0.7733727753448759, 0.29994590922053693, 0.9591635006718676], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-8", 2000, 0, 0.0, 603.3464999999989, 492, 4664, 505.0, 550.8000000000002, 1513.8499999999995, 2363.99, 0.7734601086015338, 5.465583345547557, 0.2915582050001876], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-9", 2000, 1, 0.05, 1179.6624999999988, 745, 6629, 1013.0, 1570.6000000000004, 2342.499999999998, 3218.8, 0.7732923385288268, 44.957679416992676, 0.29512316964120006], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 0, 0.0, 564.8269999999995, 440, 2010, 524.0, 716.8000000000002, 783.0, 1121.0, 0.7732077334691086, 1.2655235950138926, 0.5889668282284226], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-6", 2000, 0, 0.0, 1490.585999999995, 982, 9650, 1272.0, 2327.5000000000005, 3050.2999999999975, 4901.280000000001, 0.7730152736222838, 121.94263325019875, 0.29063562533650317], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-7", 2000, 1, 0.05, 1165.4814999999992, 702, 6517, 1014.0, 1401.2000000000016, 2228.999999999982, 3211.7000000000003, 0.7722437077582691, 51.91112889396649, 0.2886928275404115], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-4", 2000, 0, 0.0, 52.25099999999999, 9, 7118, 19.0, 66.0, 91.94999999999982, 1051.89, 0.7734989961916777, 121.06770030626694, 0.303658785614311], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-5", 2000, 0, 0.0, 78.40250000000007, 15, 1331, 55.0, 127.0, 169.94999999999982, 1038.3000000000025, 0.7734936115228891, 18.600859554444476, 0.3066781311311455], "isController": false}, {"data": ["Test", 2000, 2000, 100.0, 23881.401499999985, 10684, 132429, 16109.0, 49727.80000000002, 63832.39999999998, 90180.22, 0.7682397399662129, 8776.44211863331, 24.929285032404355], "isController": true}, {"data": ["http://35.223.43.28:4200/user/category/home-2", 2000, 1, 0.05, 72.77650000000006, 2, 711, 47.0, 108.0, 134.94999999999982, 349.93000000000006, 0.7734900217853464, 5.475869356254227, 0.3080333368398214], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-3", 2000, 0, 0.0, 74.55550000000005, 39, 1126, 47.0, 107.0, 178.89999999999964, 357.0, 0.773490320928869, 0.9970773668223704, 0.2915695936313901], "isController": false}, {"data": ["https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true", 2000, 0, 0.0, 200.04100000000028, 38, 3070, 73.0, 276.0, 1136.0499999999965, 2587.67, 0.7732582551118171, 0.32168751628675196, 0.27335887534226344], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-0", 3998, 0, 0.0, 693.772886443222, 272, 5188, 513.0, 1270.1, 1520.0, 2495.1099999999974, 1.5431914109316467, 96.99638959841512, 0.5666398423130887], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-26", 2000, 2, 0.1, 1351.3000000000018, 0, 13400, 833.0, 2551.8, 4002.95, 7764.730000000001, 0.7730648736715363, 325.0705074421989, 0.274525603908616], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/cart/viewbycustomerid", 6000, 5849, 97.48333333333333, 352.1351666666664, 18, 3537, 255.0, 510.0, 540.8999999999996, 1234.0, 2.3086930373281036, 0.9079115735936307, 1.306350507508447], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-1", 3998, 0, 0.0, 753.9527263631833, 41, 9631, 996.5, 1333.1, 2126.0999999999995, 4194.899999999979, 1.5435000233571163, 143.81824453860912, 0.6955596348201714], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-27", 2000, 3, 0.15, 757.8249999999994, 0, 7147, 895.5, 1132.8000000000002, 1418.9499999999998, 1896.9, 0.7729797208770228, 53.90006314278095, 0.2856639406651104], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-24", 2000, 3, 0.15, 1182.7864999999988, 0, 11691, 810.0, 1889.1000000000017, 3267.2499999999973, 5963.540000000001, 0.7732011571728519, 260.5643029087779, 0.2766984154740361], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-25", 2000, 8, 0.4, 11608.288499999997, 0, 118419, 3322.0, 37323.50000000001, 51064.399999999994, 78347.55, 0.7724411535018234, 6860.607772329439, 0.2749830159501374], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-22", 2000, 3, 0.15, 1316.085500000002, 0, 12031, 1028.0, 2036.2000000000007, 3042.499999999998, 5586.250000000001, 0.7730107920036672, 228.97288579495077, 0.27813781325779213], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home", 2000, 12, 0.6, 14449.582999999999, 1831, 122049, 6433.5, 39981.4, 54395.049999999996, 81041.17, 0.7714799299496223, 8798.323900710413, 9.019761367997855], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-23", 2000, 2, 0.1, 955.3604999999992, 0, 5789, 774.0, 1532.8000000000002, 2100.449999999998, 3553.6200000000003, 0.7731102961669578, 133.8064253945665, 0.2760502051061616], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-20", 2000, 3, 0.15, 123.61299999999983, 0, 1754, 75.0, 207.0, 253.89999999999964, 1092.96, 0.7734290013446063, 64.31944489695411, 0.30091335378827455], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-21", 2000, 3, 0.15, 346.3229999999998, 0, 2866, 255.0, 507.0, 550.8999999999996, 1856.5500000000004, 0.7733470576657834, 10.457349202882186, 0.2767506275469702], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-19", 2000, 3, 0.15, 1033.7149999999983, 0, 3100, 974.0, 1227.3000000000006, 1540.6499999999987, 1900.8700000000001, 0.7731542295788706, 64.88124443147747, 0.28195892806611705], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-17", 2000, 3, 0.15, 149.82249999999974, 0, 5140, 116.0, 184.0, 295.3999999999978, 1158.0, 0.7735184414531627, 9.558409682826497, 0.27907472715103876], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-18", 2000, 3, 0.15, 711.7599999999999, 0, 5717, 516.0, 1035.9, 1448.9499999999925, 2778.9, 0.7732086302454474, 61.52077657498732, 0.2767010897940714], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v2/sub/products", 4000, 3891, 97.275, 277.3837500000005, 245, 1222, 253.0, 272.0, 350.0, 748.9899999999998, 1.5457073388638742, 0.7644613389854055, 0.9162542526273161], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/slot/viewall", 2000, 1944, 97.2, 277.64799999999934, 246, 1706, 252.0, 266.0, 293.9499999999998, 982.98, 0.7731942820736452, 0.30128640259085804, 0.35714931193440835], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-15", 2000, 2, 0.1, 912.7194999999998, 0, 5331, 642.0, 1434.0, 1826.3499999999976, 3045.0, 0.7726506398319949, 112.86958113546419, 0.7025295761006795], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-16", 2000, 3, 0.15, 443.9300000000003, 0, 5610, 260.0, 770.0, 955.7999999999956, 2498.960000000001, 0.7734086633371423, 20.1180764667937, 0.2880849084284143], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-13", 2000, 3, 0.15, 359.4785000000007, 0, 3125, 254.0, 514.0, 620.8499999999995, 1769.96, 0.7735118598705915, 1.556454294755396, 0.2843520998188048], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-14", 2000, 2, 0.1, 457.4469999999995, 0, 6021, 296.5, 534.0, 1161.5999999999985, 2141.99, 0.773390120791936, 6.73224166981501, 0.28595873137144884], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-11", 2000, 1, 0.05, 337.10849999999965, 168, 3562, 254.0, 501.0, 839.8499999999958, 1816.96, 0.7734681849331492, 2.583003423974459, 0.2868856946479096], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-12", 2000, 1, 0.05, 550.8315000000008, 0, 4359, 503.0, 758.0, 873.8499999999958, 2306.87, 0.7734316932198657, 19.884650880667998, 0.28309752589352627], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/taxcharges/viewAll", 2000, 1945, 97.25, 276.6904999999996, 246, 1586, 252.0, 268.0, 291.89999999999964, 928.99, 0.7731963744822001, 0.29194807793046257, 0.3548850546939785], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-10", 2000, 0, 0.0, 845.1440000000002, 250, 4688, 755.0, 870.0, 1645.2999999999975, 2320.94, 0.7734514342109945, 12.477191642315837, 0.2877783168304579], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/userexist", 2000, 1948, 97.4, 279.4890000000001, 246, 1565, 252.0, 272.0, 360.9499999999998, 821.99, 0.7730702523726491, 0.3021934636330359, 0.25743843365143887], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/order/view", 2000, 1954, 97.7, 278.12250000000097, 0, 1413, 252.0, 270.9000000000001, 317.7999999999993, 855.98, 0.7733793545607921, 0.3507264044134053, 0.4121621045179662], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/category/viewAll", 4000, 3892, 97.3, 276.95549999999974, 246, 2312, 253.0, 270.0, 310.0, 758.9799999999996, 1.5457073388638742, 0.5861264868738533, 0.7076335747148557], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/address/view", 4000, 3891, 97.275, 275.98625000000186, 246, 1284, 253.0, 269.0, 312.9499999999998, 770.0, 1.5457055469575685, 0.6047033314060317, 0.8619119797976285], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/address/viewbycustomer", 4000, 3893, 97.325, 274.60425000000004, 247, 1296, 253.0, 269.0, 315.9499999999998, 774.0, 1.5456446246150861, 0.6595355423638007, 0.8905569614481454], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/subcategory/viewcan", 4000, 3894, 97.35, 275.3704999999999, 246, 1239, 253.0, 268.0, 307.0, 750.0, 1.5457073388638742, 0.5948935456864718, 0.8271949430638702], "isController": false}, {"data": ["https://www.instamojo.com/webapi/checkout-assets/", 2000, 0, 0.0, 94.12399999999987, 31, 5099, 59.0, 152.0, 206.0, 494.50000000000045, 0.7732797811308908, 0.6966737321884668, 0.2612839885461799], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/product/view", 2000, 1946, 97.3, 274.84400000000045, 246, 1260, 253.0, 269.0, 307.89999999999964, 739.98, 0.7734038780790659, 0.3127455708368346, 0.4093602557801306], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/order/precheck", 4000, 3905, 97.625, 275.87424999999985, 246, 1232, 253.0, 270.9000000000001, 320.9499999999998, 744.9899999999998, 1.5461942940018871, 0.5812984641313848, 0.9407021925421638], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 1497, 74.85, 269.62049999999977, 205, 1323, 271.0, 300.0, 341.0, 647.98, 0.7733105773807429, 0.513386090675305, 0.8760158884391229], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 4000, 0, 0.0, 279.8307500000008, 210, 1352, 276.0, 331.0, 356.0, 655.9799999999996, 1.5455323489580215, 1.4519506670904, 2.2111375890854505], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/banner/viewAll", 2000, 1946, 97.3, 279.58300000000037, 246, 1792, 252.0, 266.0, 299.9499999999998, 997.99, 0.7731362969709293, 0.2977820519597845, 0.3518374163949737], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/order/viewbycustomer", 2000, 1946, 97.3, 314.90300000000013, 246, 5619, 252.0, 271.0, 856.0, 1549.7700000000002, 0.7732202885271506, 2.5124132060226128, 0.43720170611056663], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.43.28:8000 failed to respond", 7, 0.013402772459217277, 0.0053031910057880546], "isController": false}, {"data": ["400/Bad Request", 1511, 2.893084169411044, 1.144731658535107], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 40, 0.0765872711955273, 0.030303948604503167], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 0.0019146817798881826, 7.575987151125791E-4], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.0019146817798881826, 7.575987151125791E-4], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, 0.0019146817798881826, 7.575987151125791E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, 0.02297618135865819, 0.00909118458135095], "isController": false}, {"data": ["429/Too Many Requests", 50643, 96.96522937887723, 38.367071729446344], "isController": false}, {"data": ["Assertion failed", 12, 0.02297618135865819, 0.00909118458135095], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 131996, 52228, "429/Too Many Requests", 50643, "400/Bad Request", 1511, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 40, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, "Assertion failed", 12], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://35.223.43.28:8000/api/v1/order/lastorder", 4000, 3896, "429/Too Many Requests", 3896, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-28", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-29", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/cart/add", 2000, 1954, "429/Too Many Requests", 1954, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v2/order/create", 2000, 1970, "429/Too Many Requests", 1956, "400/Bad Request", 14, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-9", 2000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-7", 2000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-2", 2000, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-26", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/cart/viewbycustomerid", 6000, 5849, "429/Too Many Requests", 5843, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.43.28:8000 failed to respond", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-27", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-24", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-25", 2000, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-22", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home", 2000, 12, "Assertion failed", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-23", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-20", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-21", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-19", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-17", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-18", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v2/sub/products", 4000, 3891, "429/Too Many Requests", 3891, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/slot/viewall", 2000, 1944, "429/Too Many Requests", 1944, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-15", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-16", 2000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-13", 2000, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-14", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-11", 2000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:4200/user/category/home-12", 2000, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/taxcharges/viewAll", 2000, 1945, "429/Too Many Requests", 1945, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/userexist", 2000, 1948, "429/Too Many Requests", 1948, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/order/view", 2000, 1954, "429/Too Many Requests", 1953, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 35.223.43.28:8000 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/category/viewAll", 4000, 3892, "429/Too Many Requests", 3892, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/address/view", 4000, 3891, "429/Too Many Requests", 3891, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/customer/address/viewbycustomer", 4000, 3893, "429/Too Many Requests", 3893, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/subcategory/viewcan", 4000, 3894, "429/Too Many Requests", 3894, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/product/view", 2000, 1946, "429/Too Many Requests", 1946, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/order/precheck", 4000, 3905, "429/Too Many Requests", 3905, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 1497, "400/Bad Request", 1497, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/banner/viewAll", 2000, 1946, "429/Too Many Requests", 1946, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://35.223.43.28:8000/api/v1/order/viewbycustomer", 2000, 1946, "429/Too Many Requests", 1946, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
