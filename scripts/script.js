var servReq = new XMLHttpRequest();
/*arrey of dictionaries which contains all values that are used in table*/
var importInform = [];
/*request to server*/
servReq.open('GET', 'https://ws.fanteam.com/match_collections?sport=football&tab=admin_created&statuses[]=waiting&page=0&per_page=30&bearer[white_label]=fanteam');
/*If responce are resieved*/
servReq.onreadystatechange = function () {
    if (servReq.readyState != 4) return;
    if (servReq.status != 200) {
        alert('You have problems with connection!');
        return;
    }
    var jsonObj = JSON.parse(servReq.responseText);
    /*how much tournaments are in data fron server*/
    var amoutOfTournam = jsonObj.tournaments.length;
    /*how much matches are in data fron server*/
    var amountOfMatches = jsonObj.matchCollections.length;
    var tournament = jsonObj.tournaments;
    var matchCollection = jsonObj.matchCollections;
    var index = 0;
    /*loop for creating array of objescts where will be only useful data for table(Start date, end date, buy in, gameweeks, budget, prize, maximum members in one team*/
    while (index < amoutOfTournam) {
        importInform.push(new Object());
        var i = 0;
        while (i < amountOfMatches) {
            if (tournament[index].matchCollectionId == matchCollection[i].id) {
                var dateSt = new Date(matchCollection[i].startTime);
                var dateEnd = new Date(matchCollection[i].endTime);
                var gameWeeks = matchCollection[i].gameweeks.length;
                importInform[index].Start_date = dateSt;
                importInform[index].End_date = dateEnd;
                importInform[index].Gameweek = gameWeeks;
            }
            i++;
        }
        importInform[index].Buy_in = tournament[index].buyIn;
        importInform[index].Budget = tournament[index].budget;
        importInform[index].Prize = tournament[index].prizePoolAmount;
        importInform[index].Team_members = tournament[index].maxPlayersPerTeam;
        importInform[index].Status = tournament[index].status;
        index++;
    }
    /*sorting by buy_in (increasing) and rendering the table with sorted values*/
    /*byBuyInSort(array with all values which are in the table)*/
    function byBuyInSort(array) {
        array.sort(function (a, b) {
            return a.Buy_in - b.Buy_in
        });

        return array;
    }
    /*sorting by Max Players in one team (increasing)*/
    function byMaxPlayerSort(array) {
        array.sort(function (a, b) {
            return a.Team_members - b.Team_members
        });
        return array;
    }
    /*sorting by gameweeks (increasing)*/
    function byGameWeekSort(array) {
        array.sort(function (a, b) {
            return a.Gameweek - b.Gameweek
        });
        return array;
    }
    /*sorting by prize amount (increasing)*/
    function prizeSort(array) {
        array.sort(function (a, b) {
            return a.Prize - b.Prize
        });
        return array;
    }
    /*sorting by budget (increasing)*/
    function budgetSort(array) {
        array.sort(function (a, b) {
            return a.Budget - b.Budget
        });
        return array;
    }
    /*sorting by day when tournament starts (increasing)*/
    function startDaySort(array) {

        array.sort(function (a, b) {
            var dateA = new Date(a.Start_date),
                dateB = new Date(b.Start_date)
            return dateA - dateB
        });

        return array
    }
    /*sorting by day when tournament ends (increasing)*/
    function endDaySort(array) {

        array.sort(function (a, b) {
            var dateA = new Date(a.End_date),
                dateB = new Date(b.End_date)
            return dateA - dateB
        });
        return array
    }

    /*to display only in_process/waiting/canseled tournaments*/
    /*checkingStatus(array with all values which are in the table, array which we will receive, key word (in_process/waiting/canseled))*/
    function checkingStatus(array, outputarray, searchString) {
        index = 0;
        while (index < array.length) {
            if (array[index].Status == searchString) {
                outputarray.push(array[index])
            }

        }
        return outputarray
    }
    /*This function in invoked inside function tableCreate(arr,arr) uses for filling the table*/
    function fillTheTable(key, whereToInsert, iterator, matherialForRender) {
        whereToInsert.appendChild(document.createTextNode(matherialForRender[iterator][key]));
    }

    function fillTheTableHead(arr, whereToInsert, iterator) {
        whereToInsert.appendChild(document.createTextNode(arr));
    }
    /*This function in invoked inside function tableCreate(arr,arr) uses for filling the table with weel-formated Date data*/
    function fillTheTableDate(key, whereToInsert, iterator, matherialForRender) {
        whereToInsert.appendChild(document.createTextNode(matherialForRender[iterator][key].toISOString().slice(0, 10) + " " + matherialForRender[iterator][key].toISOString().slice(12, 19)));
    }

    var keys = Object.keys(importInform[0]);
    var keysForTablet = ['Start_date', 'Prize', 'Buy_in', 'Status'];
    var keysForMobile = ['Start_date', 'Prize', 'Status'];


    /*This function creates a table*/
    /*tableCreate(keys/keysForTablet/keysForMobile, array with all information from table)*/
    function tableCreate(arrOfKeys, inputArr) {

        var body = document.body,
            div = document.createElement('div'),
            tbl = document.createElement('table'),
            divScroll = document.createElement('div');

        for (var i = -1; i < inputArr.length; i++) {
            var tr = tbl.insertRow();

            if (i % 2 == 0) {
                tr.style.backgroundColor = 'white';
                tr.style.color = '#004d00';
            } else {
                tr.style.backgroundColor = '#004d00';
                tr.style.color = 'white';
            }
            for (var j = 0; j < arrOfKeys.length; j++) {

                var td = tr.insertCell();
                if (i == -1) {
                    fillTheTableHead(arrOfKeys[j], td, j);
                } else {
                    if (arrOfKeys[j] == 'Start_date' || arrOfKeys[j] == 'End_date') {
                        fillTheTableDate(arrOfKeys[j], td, i, inputArr);
                    } else {
                        fillTheTable(arrOfKeys[j], td, i, inputArr);
                    }
                }
                td.style.border = '1px solid rgba(0,0,0,0)';
            }
        }
        divScroll.appendChild(tbl);
        div.appendChild(divScroll);
        body.appendChild(div);
    }
    //  
    var options = document.getElementsByTagName('option');

    function tableDelete() {
        var tables = document.getElementsByTagName('table');
        var div = document.getElementsByTagName('div');
        while (tables.length > 0)
            tables[0].parentNode.removeChild(tables[0]);
        div[0].remove();
    }

    function tableRender(matherialForRender) {

        var w = window.screen.availWidth;
        console.log(w);
        if (w >= 1210) {

            tableCreate(keys, matherialForRender);
        } else if (w < 1210 && w >= 620) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].value != 'Start_date' && options[i].value != 'Buy_in' && options[i].value != 'Status' && options[i].value != 'Prize') {
                    options[i].className = 'hidden';
                }
            }

            tableCreate(keysForTablet, matherialForRender);

        } else {
            for (let i = 0; i < options.length; i++) {
                if (options[i].value != 'Start_date' && options[i].value != 'Prize') {
                    options[i].className = 'hidden';
                }
            }

            tableCreate(keysForMobile, matherialForRender);
        }
        var div = document.getElementsByTagName("div")[0];
        var divScroll = document.getElementsByTagName("div")[1];
        div.className = 'wrap';
        divScroll.className = 'scrollbar';
        divScroll.id = 'styleForScrollBar';
    }

    tableRender(importInform);


    function getSelectedOption(sel) {
        var opt;
        for (var i = 0, len = sel.options.length; i < len; i++) {
            opt = sel.options[i];
            if (opt.selected === true) {
                break;
            }
        }
        return opt.value;
    }


    document.getElementsByClassName('submit')[0].addEventListener('click', function () {
        tableDelete();
        function getSelectedChackBoxes() {
            var cheks = document.getElementsByName('Status');
            let output = [];
            for (let i = 0; i < cheks.length; i++) {
                if (cheks[i].checked == true) {
                    output.push(cheks[i].value);
                }

            }

            return output;
        }


        function impotInformationSort(selcted) {
            let sel = selcted;
            let output = [];
            for (let i = 0; i < importInform.length; i++) {
                for (let j = 0; j < sel.length; j++) {
                    if (importInform[i]['Status'] == sel[j]) {
                        output.push(importInform[i]);
                    }
                }
            }
            return output;
        }
        //        debugger;
        //        tableRender(impotInformationSort(getSelectedChackBoxes()));
        switch (getSelectedOption(document.getElementsByTagName('select')[0])) {
        case 'Start_date':
            startDaySort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;
        case 'End_date':
            endDaySort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;
        case 'Gameweeks':
            byGameWeekSort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;
        case 'Buy_in':
            byBuyInSort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;
        case 'Budget':
            budgetSort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;
        case 'Prize':
            prizeSort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;
        case 'Team_members':
            byMaxPlayerSort(importInform);
            tableRender(impotInformationSort(getSelectedChackBoxes()));
            break;

        }

    })

}

servReq.send();