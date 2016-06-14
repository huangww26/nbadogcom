var scoreData = new Array();
TEAMS = [
    "GSW-HOU", "LAC-POR", "MEM-SAS", "DAL-OKC", "GSW-POR", "OKC-SAS", "GSW-OKC", "CLE-TOR",
    "ATL-CLE", "MIA-TOR", "CLE-DET", "ATL-BOS", "IND-TOR", "CHA-MIA", "CLE-GSW"
];
NAMES = {
    "ATL": "老鹰", "CHA": "黄蜂", "MIA": "热火", "ORL": "魔术", "WAS": "奇才", "CHI": "公牛", "CLE": "骑士",
    "DET": "活塞", "MIL": "雄鹿", "BOS": "凯尔特人", "BKN": "篮网", "NYK": "尼克斯", "PHI": "76人", "TOR": "猛龙",
    "GSW": "勇士", "LAC": "快船", "LAL": "湖人", "PHX": "太阳", "SAC": "国王", "DEN": "掘金", "MIN": "森林狼", "OKC": "雷霆",
    "POR": "开拓者", "UTA": "爵士", "DAL": "小牛", "HOU": "火箭", "MEM": "灰熊", "NOP": "鹈鹕", "SAS": "马刺", "IND": "步行者"
};

function parseXML() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "http://qiumy.github.io/FE-Angles/others/nbadotcom/index.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    //text = "<playoff><games teams=\"GSW-HOU\">" +
    //    "<game>" +
    //    "<home name=\"GSW\">104</home>" +
    //    "<away name=\"HOU\">78</away>" +
    //    "<date>0417</date>" +
    //    "</game>" +
    //    "<game>" +
    //    "<home name=\"GSW\">115</home>" +
    //    "<away name=\"HOU\">106</away>" +
    //    "<date>0419</date>" +
    //    "</game>" +
    //    "</games>" +
    //    "<games teams=\"LAC-POR\">" +
    //    "<game>" +
    //    "<home name=\"LAC\">104</home>" +
    //    "<away name=\"POR\">78</away>" +
    //    "<date>0417</date>" +
    //    "</game>" +
    //    "<game>" +
    //    "<home name=\"LAC\">115</home>" +
    //    "<away name=\"POR\">106</away>" +
    //    "<date>0419</date>" +
    //    "</game>" +
    //    "</games></playoff>";

    //parser = new DOMParser();
    //xmlDoc = parser.parseFromString(getData(), "text/xml");

    var games = xmlDoc.getElementsByTagName("games");
    for (var i = 0; i < games.length; i++) {
        var game = games[i].getElementsByTagName("game");
        var teamVS = games[i].getAttribute("teams");
        var gameInfo = new Array();
        for (var j = 0; j < game.length; j++) {
            var gameData = game[j];
            var homeScore = gameData.getElementsByTagName("home")[0].childNodes[0].nodeValue;
            var home = gameData.getElementsByTagName("home")[0].getAttribute("name");
            var awayScore = gameData.getElementsByTagName("away")[0].childNodes[0].nodeValue;
            var away = gameData.getElementsByTagName("away")[0].getAttribute("name");
            var date = gameData.getElementsByTagName("date")[0].childNodes[0].nodeValue;

            var data = new Array();
            var homeTeam = new Array();
            var awayTeam = new Array();
            homeTeam[home] = homeScore;
            awayTeam[away] = awayScore;
            data.push(homeTeam, awayTeam, date);

            gameInfo.push(data);
        }
        scoreData[teamVS] = gameInfo;
    }
}

function dateFormat(date) {
    var month = parseInt(date.substr(0, 2));
    var day = parseInt(date.substr(2, 2));
    return month.toString() + "月" + day.toString() + "日";
}

function getScoreBoxInnerHtml(team1, team2) {
    var thhtml = "<td></td><td>" + NAMES[team1] + "</td><td>" + NAMES[team2] + "</td>";
    var trhtml = "";
    var data = team1 < team2 ? scoreData[team1 + "-" + team2] : scoreData[team2 + "-" + team1];
    //console.log(scoreData);
    //console.log(team1);
    for (var i = 0, len = data.length; i < len; i++) {
        var date = data[i][2];
        var home = "";
        var homeScore = "";
        var away = "";
        var awayScore = "";
        for (key in data[i][0]) {
            home = key;
            homeScore = data[i][0][key];
        }
        for (key in data[i][1]) {
            away = key;
            awayScore = data[i][1][key];
        }
        if (team1 == home) {
            trhtml += "<tr><td>" + dateFormat(date) + '</td><td class="homeScore">' + homeScore + "</td><td>" + awayScore + "</td></tr>"
        } else {
            trhtml += "<tr><td>" + dateFormat(date) + "</td><td>" + awayScore + '</td><td class="homeScore">' + homeScore + "</td></tr>"
        }
    }
    return "<table>" + thhtml + trhtml + "</table>";
}

function showScoreBox() {
    var playoffObj = document.getElementById("playoff");
    var scoreBoxes = new Array();
    for (var i in TEAMS) {
        var scoreBox = document.createElement("div");
        //scoreBox.innerText="test";
        //console.log(TEAMS[i]);
        var team1 = TEAMS[i].substr(0, 3);
        var team2 = TEAMS[i].substr(4, 3);
        //console.log(team1);
        //console.log(team2);
        scoreBox.innerHTML = getScoreBoxInnerHtml(team1, team2);
        //scoreBox.innerHTML = getScoreBoxInnerHtml("GSW", "HOU");
        //scoreBox.style.width="200px";
        //scoreBox.style.background="#f00"
        scoreBox.className = "scoreBox";

        var gamesObj = document.getElementById(TEAMS[i]);
        //console.log(gamesObj);
        var left = document.defaultView.getComputedStyle(gamesObj, null)["left"];
        var top = document.defaultView.getComputedStyle(gamesObj, null)["top"];

        scoreBox.style.position = "absolute";
        if (parseInt(left.substring(0, left.indexOf("px"))) > 500) {
            var selfWidth = document.defaultView.getComputedStyle(scoreBox, null)["width"];
            scoreBox.style.right = 900 - parseInt(left.substring(0, left.indexOf("px"))) + 5 + "px";
        } else {
            scoreBox.style.left = parseInt(left.substring(0, left.indexOf("px"))) + 135 + "px";
        }
        //scoreBox.style.left = parseInt(left.substring(0, left.indexOf("px"))) + 135 + "px";
        scoreBox.style.top = top;
        scoreBox.style.display = "none";
        playoffObj.appendChild(scoreBox);
        team1 < team2 ? scoreBoxes[team1 + "-" + team2] = scoreBox : scoreBoxes[team2 + "-" + team1] = scoreBox;
        //scoreBoxes.push(scoreBox);
    }
    return scoreBoxes;
}

function addEvent() {
    var scoreBoxes = showScoreBox();
    /*for (var i = 1; i < 16; i++) {
     (function () {
     var gamesObj = document.getElementById("round" + i.toString());
     var scoreBox = scoreBoxes[i - 1];
     gamesObj.onmouseover = function () {
     scoreBox.style.display = "block";
     }

     gamesObj.onmouseout = function () {
     scoreBox.style.display = "none";
     }
     })();
     var gamesObj = document.getElementById("round" + i.toString());
     var scoreBox = scoreBoxes[i - 1];
     gamesObj.onmouseover = function () {
     scoreBox.style.display = "block";
     }

     gamesObj.onmouseout = function () {
     scoreBox.style.display = "none";
     }
     }*/
    for (var i in TEAMS) {
        (function () {
            var gamesObj = document.getElementById(TEAMS[i]);
            var scoreBox = scoreBoxes[TEAMS[i]];
            gamesObj.onmouseover = function () {
                scoreBox.style.display = "block";
            }

            gamesObj.onmouseout = function () {
                scoreBox.style.display = "none";
            }

        })();
    }
}

parseXML();
addEvent();







