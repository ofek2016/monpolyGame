var playerarr = [];
var cellsarr = [40]; //all cells id's array
var specialcellsarr = [];
var steps = 0;
var availableProperties;
var player;
var player1;
var player2;
var dicecounter = 0; // counts the players queue
var playertempproperty;
var playertempwealth;
var tempdiv;
var tempwealth = 0;
var propval;
var prevplayer;
var gametype;

//shows the board and hides the main menu and initiates the game
function Init(game_type) {
    if (game_type == null) { //new game
        // get gametype decision
        var g = document.getElementById("gametype");
        gametype = g.value;

        setLocalStorage();
        //get the players names
        playername1 = $("#playername1").val();
        playername2 = $("#playername2").val();

        //get the start money choice
        startmoney = parseInt($("#Moneydropdown").val());

        createPlayers(playername1, playername2, startmoney);
        createBoard(gametype);
        setPlayers();
        Stats(); //initiate dices and display them 
        propertyDivs();

        availableProperties = cellsarr;

        $('#backgroundimg').hide();
        $('#mainmenu').hide();
        $('#head').hide();
        $('#refreshwaiter').hide();
        $('#buyproperty').hide();
        $("#board").show();
    } else { // continue game
        //initializes everything back to the exact same position and stats
        dicecounter = parseInt(localStorage.getItem('dicecounter'));
        player1 = playerarr[0];
        player2 = playerarr[1];
        player = JSON.parse(localStorage.getItem('prevplayer'));
        availableProperties = JSON.parse(localStorage.getItem('availableProperties'));

        createBoard(game_type); // recreate the board
        propertyDivs(); //creates the property divs
        setPlayers(); //set the playrs on all cels 
        Stats();

        //set user stats back
        //set back players money
        $(".statstable #player1money").prepend(playerarr[0].money);
        $(".statstable #player2money").prepend(playerarr[1].money);

        //set back players names
        $(".statstable #player1name").prepend(playerarr[0].name);
        $(".statstable #player2name").prepend(playerarr[1].name);

        //set back players wealth
        $(".statstable #player1wealth").prepend(playerarr[0].wealth);
        $(".statstable #player2wealth").prepend(playerarr[1].wealth);

        //set back players properties in the stats table
        for (let i = 0; i < playerarr.length; i++) {
            for (let j = 0; j < playerarr[i].properties.length; j++) {
                setStats(playerarr[i].id, playerarr[i].properties[j], "p", j);
            }
        }

        //set back players posisions
        $(cellsarr[0] + " " + playerarr[0].th).hide();
        $(cellsarr[0] + " " + playerarr[1].th).hide();
        $(cellsarr[player1.pos] + " " + playerarr[0].th).show();
        $(cellsarr[player2.pos] + " " + playerarr[1].th).show();
        returntoboard();
    }
}

/**************
board creation
**************/
//initiates the board
function createBoard(game_type) {
    var bottomrowcounter = 10;
    var leftcolcounter = 19;
    var toprowcounter = 20;
    var rightcolcounter = 31;

    var goandjail = 0; //decides where the go and jail cells will be
    var bottomrowspecials = 0;
    var leftcolspecials = 0;
    var rightcolspecials = 0;
    var toprowspecials = 0;

    $("#board").hide();
    //bottom row
    for (let i = 0; i < 11; i++) {
        //regulars
        if (i == 1 || i == 2 || i == 4 || i == 7 || i == 9) {
            let idx;
            switch (i) {
                case 1:
                    idx = 0;
                    break;
                case 2:
                    idx = 1;
                    break;
                case 4:
                    idx = 2;
                    break;
                case 7:
                    idx = 3;
                    break;
                case 9:
                    idx = 4;
                    break;
            }
            buildCell("row1", "box box-x", null, null, info.subjects[0].contents[game_type].regularsbottomrow[idx].name, info.subjects[0].contents[game_type].regularsbottomrow[idx].value, info.subjects[0].contents[game_type].regularsbottomrow[idx].img, bottomrowcounter); //bottom row
        }
        //go&jail
        if (i == 0 || i == 10) {
            buildCell("row1", "box box-x", null, null, info.subjects[0].contents[game_type].startjailbottomrow[goandjail].name, info.subjects[0].contents[game_type].startjailbottomrow[goandjail].value, info.subjects[0].contents[game_type].startjailbottomrow[goandjail].img, bottomrowcounter); //bottom row jail
            goandjail++;

            if (goandjail > 1) {
                goandjail = 0;
            }
        }
        //specials
        else if (i == 3 || i == 5 || i == 6 || i == 8) {
            buildCell("row1", "box box-x", null, null, info.subjects[0].contents[game_type].specialsbottomrow[bottomrowspecials].name, info.subjects[0].contents[game_type].specialsbottomrow[bottomrowspecials].value, info.subjects[0].contents[game_type].specialsbottomrow[bottomrowspecials].img, bottomrowcounter); //bottom row  specials
            bottomrowspecials++;

            if (bottomrowspecials > info.subjects[0].contents[game_type].specialsbottomrow.length) {
                bottomrowspecials = 0;
            }
        }
        bottomrowcounter--;
    }
    // left column
    for (let i = 0; i < 9; i++) {
        //regulars
        if (i == 0 || i == 1 || i == 3 || i == 5 || i == 6 || i == 8) {
            let idx;
            switch (i) {
                case 0:
                    idx = 0;
                    break;
                case 1:
                    idx = 1;
                    break;
                case 3:
                    idx = 2;
                    break;
                case 5:
                    idx = 3;
                    break;
                case 6:
                    idx = 4;
                    break;
                case 8:
                    idx = 5;
                    break;
            }

            buildCell("col3", "box box-y", "col1 ", "cols left", info.subjects[0].contents[game_type].regularleftcol[idx].name, info.subjects[0].contents[game_type].regularleftcol[idx].value, info.subjects[0].contents[game_type].regularleftcol[idx].img, leftcolcounter);
        }
        //specials
        else if (i == 2 || i == 4 || i == 7) {
            buildCell("col3", "box box-y", "col1 ", "cols left", info.subjects[0].contents[game_type].specialleftcol[leftcolspecials].name, info.subjects[0].contents[game_type].specialleftcol[leftcolspecials].value, info.subjects[0].contents[game_type].specialleftcol[leftcolspecials].img, leftcolcounter);
            leftcolspecials++;

            if (leftcolspecials > info.subjects[0].contents[game_type].specialleftcol.length.length) {
                leftcolspecials = 0;
            }
        }
        leftcolcounter--;
    }
    //right column
    for (let i = 0; i < 9; i++) {
        //regulars
        if (i == 0 || i == 1 || i == 3 || i == 6 || i == 8) {
            switch (i) {
                case 0:
                    idx = 0;
                    break;
                case 1:
                    idx = 1;
                    break;
                case 3:
                    idx = 2;
                    break;
                case 6:
                    idx = 3;
                    break;
                case 8:
                    idx = 4;
                    break;
            }

            buildCell("col1", "box box-y", "col3", "cols right", info.subjects[0].contents[game_type].regularrightcol[idx].name, info.subjects[0].contents[game_type].regularrightcol[idx].value, info.subjects[0].contents[game_type].regularrightcol[idx].img, rightcolcounter);

        }
        //specials
        else if (i == 2 || i == 4 || i == 5 || i == 7) {
            buildCell("col1", "box box-y", "col3", "cols right", info.subjects[0].contents[game_type].specialrightcol[rightcolspecials].name, info.subjects[0].contents[game_type].specialrightcol[rightcolspecials].value, info.subjects[0].contents[game_type].specialrightcol[rightcolspecials].img, rightcolcounter);
            rightcolspecials++;

            if (rightcolspecials > info.subjects[0].contents[game_type].specialleftcol.length) {
                rightcolspecials = 0;
            }
        }
        rightcolcounter++;
    }
    //top row
    for (let i = 0; i < 11; i++) {
        //regulars
        if (i == 1 || i == 3 || i == 4 || i == 6 || i == 7 || i == 9) {
            let idx;
            switch (i) {
                case 1:
                    idx = 0;
                    break;
                case 3:
                    idx = 1;
                    break;
                case 4:
                    idx = 2;
                    break;
                case 6:
                    idx = 3;
                    break;
                case 7:
                    idx = 4;
                    break;
                case 9:
                    idx = 5;
                    break;
            }
            buildCell("row2", "box box-x", null, null, info.subjects[0].contents[game_type].regularstoprow[idx].name, info.subjects[0].contents[game_type].regularstoprow[idx].value, info.subjects[0].contents[game_type].regularstoprow[idx].img, toprowcounter); //bottom row
        }
        //gotojail&parking
        if (i == 0 || i == 10) {
            buildCell("row2", "box box-x", null, null, info.subjects[0].contents[game_type].gotojailparkingtoprow[goandjail].name, info.subjects[0].contents[game_type].gotojailparkingtoprow[goandjail].value, info.subjects[0].contents[game_type].gotojailparkingtoprow[goandjail].img, toprowcounter); //bottom row jail
            goandjail++;

            if (goandjail > 1)
                goandjail = 0;
        }
        //specials
        if (i == 2 || i == 5 || i == 8) {
            buildCell("row2", "box box-x", null, null, info.subjects[0].contents[game_type].specialstoprow[bottomrowspecials].name, info.subjects[0].contents[game_type].specialstoprow[bottomrowspecials].value, info.subjects[0].contents[game_type].specialstoprow[bottomrowspecials].img, toprowcounter); //bottom row  specials
            toprowspecials++;

            if (toprowspecials > info.subjects[0].contents[game_type].specialsbottomrow.length) {
                toprowspecials = 0;
            }
        }
        toprowcounter++;
    }
}

//this function builds the cells dynamicaly
function buildCell(id, class1, class2, class3, cellname, price, img, idx) { // board building
    $cell = $("#" + id);

    $maindiv = $("<div>").attr({
        "class": class1,
        "id": "cell" + idx
    });
    $spantitle = $("<span>").attr({
        "class": "title"
    }).text(cellname);
    $table = $("<table>");
    $th1 = $("<th>").attr({
        "class": "playerpos1"
    });
    $th2 = $("<th>").attr({
        "class": "playerpos2"
    });
    $runway = $("<div>").attr({
        "class": "runway"
    });
    $img = $("<img>").attr({
        "src": img,
        "height": "40",
        "width": "50"
    })
    $cardbody = $("<div>").attr({
        "class": "cardbody"
    });
    $spanprice = $("<span>").attr({
        "class": "price"
    }).text(price);

    if (class2 != null && class3 != null) {
        $secdiv = $("<div>").attr({
            "class": class2 + class3
        });
        $maindiv.append($secdiv)
    }

    $table.append($th1, $th2);
    $runway.append($table);
    $cardbody.append($img);
    $maindiv.append($spantitle, $runway, $cardbody, $spanprice);
    $cell.append($maindiv)


    //add cell id to an index array (player movement control)
    createCellsarr(idx);
    $(".board").prepend($cell); //prepend each element to the board
}

//creating the cells array in order, in order to acces each cell easily later for player control
function createCellsarr(idx) {
    cellsarr[idx] = "#cell" + idx; // creating it with the "#call" tag in order to catch it in an easy way later
}

/**************
 Dice functions
**************/

//create dices for the first time to greet the player
function initDices() {
    dice1 = Math.floor(Math.random() * 6) + 1;
    dice2 = Math.floor(Math.random() * 6) + 1;

    //append new dices to correct place
    $("#dice1").append($("<img>").attr("src", "./images/Dices/" + dice1 + ".jpg"));
    $("#dice2").append($("<img>").attr("src", "./images/Dices/" + dice2 + ".jpg"));
}

//thow dice function
function ThrowDice() {
    //check if the playr havent lost all his money
    setLocalStorage();
    if (dicecounter > 1) {
        if (player.money <= 0)
            displayMessages(player.name + " cannot buy any more properties!!!");
    }
    //decides on winner base on if someone lost all their money
    dice1 = Math.floor(Math.random() * 6) + 1;
    dice2 = Math.floor(Math.random() * 6) + 1;
    dicecounter++ //+1 whenever the function is called
    //remove old dices
    $("#dicecontainer img").remove()

    //append new dices to correct place
    $("#dice1").append($("<img>").attr("src", "./images/Dices/" + dice1 + ".jpg"));
    $("#dice2").append($("<img>").attr("src", "./images/Dices/" + dice2 + ".jpg"));

    checkPlayers(dice1, dice2);
}

/**************
player controls
**************/

//creates players elements
function createPlayers(playername1, playername2, startmoney) {
    playerarr = [{
            "id": 1,
            "name": playername1,
            "money": startmoney,
            "img": "./images/Players/player1.png",
            "th": ".playerpos1", //initial th
            "pos": 0, //initial cell position
            "properties": [],
            "wealth": 0,
            "propertiesvalue": 0
        },
        {
            "id": 2,
            "name": playername2,
            "money": startmoney,
            "img": "./images/Players/player2.png",
            "th": ".playerpos2", //initial th
            "pos": 0, //initial cell position
            "properties": [],
            "wealth": 0,
            "propertiesvalue": 0
        }
    ]

    player1 = playerarr[0]; //sets player1
    player2 = playerarr[1]; //sets player2

    // initiate user money and name according to user choice and placing it at the stats
    $("#player1money").prepend(startmoney);
    $("#player2money").prepend(startmoney);
    $("#player1name").prepend(playerarr[0].name);
    $("#player2name").prepend(playerarr[1].name);

}

//set players images on all cells
function setPlayers() {
    for (let i = 0; i < cellsarr.length; i++) {
        $(cellsarr[i] + " " + playerarr[0].th).append($("<img>").attr("src", playerarr[0].img).addClass("playerimg")).hide();
        $(cellsarr[i] + " " + playerarr[1].th).append($("<img>").attr("src", playerarr[1].img).addClass("playerimg")).hide();
    }
    //initialize the players to the GO cell
    $(cellsarr[0] + " " + playerarr[0].th).show();
    $(cellsarr[0] + " " + playerarr[1].th).show();
}

//flow control to decide which player is playing
function checkPlayers(dice1, dice2) {
    var steps = dice1 + dice2;

    //sets active player
    if (dicecounter == 1) {
        player = player1;
        prevplayer = player2;
    } //player1 begins
    else { //flow control to decide who's turn
        if (dicecounter % 2 == 0) {
            player = player1;
            prevplayer = player2;
        } else if (dicecounter % 2 == 1) {
            player = player2;
            prevplayer = player1;
        } else //code should not get here
            displayMessages("error! no player to move!");
    }
    if (dice1 == dice2)
        movePlayer(player, steps, prevplayer);
    else
        movePlayer(player, steps, prevplayer);

    setLocalStorage();
    $("#playerturn").text(player.name + "'s turn"); //shows on the stats wich player is now playing

}

//"moves" the relevant player
function movePlayer(playertomove, stepstomove, prevplayer) {
    var oldpos = playertomove.pos;
    var newpos = (oldpos + stepstomove) % cellsarr.length;

    $("#cell" + oldpos + " " + playertomove.th).hide();
    $("#cell" + newpos + " " + playertomove.th).show();

    playertomove.pos = newpos;
    //checks if the current player stepped on the other player's property. if yes, 10% of the player money will go to the second player.
    if (availableProperties[playertomove.pos] == "bought") {
        for (let i = 0; i < 40; i++) {
            if ($("#cell" + playertomove.pos + " .title").html() == $("#player" + prevplayer.id + "property #propDiv" + i).html()) {
                payUp(parseInt($("#cell" + playertomove.pos + " .price").html()));
            }
        }
    }

    //checks if the player passed by the GO cell
    if (newpos < oldpos) {
        if (playertomove.pos == 0) {
            playertomove.money += 200;
        } // if the player got lucky and stepped excatly on the GO cell, he will get an extra 200 (total of 400)
        playertomove.money += 200;
        displayMessages(playertomove.name + " got a bonus! now you have: " + playertomove.money);
        setStats(playertomove.id, playertomove.money, "m");
        setStats(playertomove.id, playertomove.wealth, "w");
        moneyControl(playertomove, playertomove.id);
    }
    setLocalStorage();
    propertyControl(playertomove);
}

/**************
properties control
**************/

//properties control
function propertyControl(p) {
    var specialcellsarr = [
        "#cell0", "#cell2", "#cell5", "#cell7", "#cell10", "#cell12", "#cell15", "#cell17", "#cell20",
        "#cell22", "#cell25", "#cell28", "#cell30", "#cell33", "#cell35", "#cell36", "#cell38"
    ]
    if (availableProperties.includes("#cell" + JSON.parse(p.pos))) {
        temp = "#cell" + JSON.parse(p.pos);
        if (!specialcellsarr.includes(temp) && p.money > 0) {
            showBuyOption(availableProperties[p.pos], p);
        } //else - do nothing and continue
    } //else - do nothing and continue
}

//shows the buy menu
function showBuyOption(propertycell, p) {
    var tempdiv = ($(propertycell)).clone();
    $('#buypropertyplayername').html(p.name + " would you like to buy this property?");
    $('#buyproperty .property').html(tempdiv); //clones the cell to the buy option menu

    //hide the players in the buy options
    $('.property .playerpos1').hide();
    $('.property .playerpos2').hide();

    $('.board').hide();
    $('#buyproperty').show();
}
//gives the player his new property and calculates the wealth
function BuyProperty() {
    if (player.money <= 0)
        returntoboard();
    else {
        player.properties.push($('#buyproperty .title').text());
        player.money = player.money - parseInt($('#buyproperty .price').text());
        player.propertiesvalue += parseInt($('#buyproperty .price').text());
        availableProperties[player.pos] = "bought";
        calcWealth(player);
        setStats(player.id, player.money, "m");
        for (let i = 0; i < player.properties.length; i++) {
            setStats(player.id, player.properties[i], "p", player.pos);
        }
        //setStats(player.id, player.wealth, "w");
        setLocalStorage();
        returntoboard();
    }

}

/**************
 Money controls
**************/

//controls each player's money
function moneyControl(player, id) {
    setStats(id, JSON.stringify(player.money, "m")) //update user money
    setLocalStorage(); //update users stats in the memory

    //decide on the winner based on player money amount
    if (player.money >= 10000) {
        winnerAlert(player);
        resetBoard();
    }
}

//money transfers between players
function payUp(prop_val) {
    //if player has 0 money or beneath,  he cannot pay the fee and therefor he lost the game. (endgame condition)
    if (player.money <= 0 || player.money < parseInt($('#cell' + player.pos + ' .price').html())) {
        displayMessages(player.name + " has no way to pay!\n" + player.name + "Lost!");
        EndGame();
    } else if (player.id == 1) { //if player == player1
        player2.money += prop_val * 0.1;
        calcWealth(player2);

        player.money = player.money - (prop_val * 0.1);
        calcWealth(player);

        setStats(player.id, player.money, "m");
        setStats(player2.id, player2.money, "m");
        setStats(player2.id, player2.wealth, "w");

    } else if (player.id == 2) { //if player == player2

        player1.money += prop_val * 0.1;
        calcWealth(player1);

        player.money = player.money - (prop_val * 0.1);
        calcWealth(player);

        setStats(player.id, player.money, "m");
        setStats(player1.id, player1.money, "m");
        setStats(player1.id, player1.wealth, "w");

    } else //code should not get here
        displayMessages("ERROR! - no transaction been made!");
}

// calc the player total wealth
function calcWealth(p) {
    p.propertiesvalue += parseInt($('#buyproperty .price').text());
    p.wealth = p.money + (p.propertiesvalue * 0.5);
    if (p.properties.length > 0) {
        setStats(p.id, p.wealth, "w");
    }
}
/**************
   User Stats
**************/

// initialize stats for the first time
function Stats() {
    $("#stats").show();
    initDices(); //dice initiation for the first time  //review
    $("#playerturn").text(player1.name + "'s turn");
}

//update users stats during the game
function setStats(id, atrr, type, idx) {
    // m==money | p==properties | w==wealth
    switch (type) {
        case "m":
            $("#player" + id + "money").text(Math.round(atrr)); //update user money
            break;
        case "p":
            $("#player" + id + "property " + "#propDiv" + idx).text(atrr); //update user money
            break;
        case "w":
            $("#player" + id + "wealth").text(Math.round(atrr)); //update user money
            break;
    }
}

/**************
 misc functions
**************/
//ends the game
function EndGame() {
    if (playerarr[0].money > playerarr[1].money)
        winnerAlert(playerarr[0]);
    else if (playerarr[0].money == playerarr[1].money) {
        displayMessages("its a Draw!\n");
        resetBoard();
    } else
        winnerAlert(playerarr[1]);

}

//refreshes the local Storage
function setLocalStorage() {
    localStorage.setItem("players", JSON.stringify(playerarr));
    localStorage.setItem('gametype', gametype);
    localStorage.setItem('dicecounter', dicecounter);
    localStorage.setItem('prevplayer', JSON.stringify(prevplayer));
    localStorage.setItem("availableProperties", JSON.stringify(availableProperties));
}

//resets the board and starts an entierly new game.
function resetBoard() {
    displayMessages("board will be refreshed!\nenjoy with the new game!");
    clearStorage() //clears local storage
    window.location.reload(); //reloads the page
}

//clears local storage
function clearStorage() {
    localStorage.clear();
}

//returns to board
function returntoboard() {
    $('#refreshwaiter').hide();
    $('#buyproperty').hide();
    $('.continueGame').hide();
    $('#backgroundimg').hide();
    $('.board').show();
    $('.stats').show();
}

//shows relevant message
function displayMessages(message) {
    alert(message);
}

//wait for user decision weather to reset or not
function refreshWaiter() {
    $('.board').hide();
    $('#refreshwaiter').show();
}

//declare on the winner
function winnerAlert(player_win) {
    displayMessages(player_win.name + " is the Winner!");
    resetBoard();
}

function propertyDivs() {
    for (let i = 0; i < cellsarr.length; i++) {
        $tempdiv = $('<div>').attr({
            "id": "propDiv" + i
        });
        $('#player1property').append($tempdiv);
    }
    for (let i = 0; i < cellsarr.length; i++) {
        $tempdiv = $('<div>').attr({
            "id": "propDiv" + i
        });
        $('#player2property').append($tempdiv);
    }
}

/**************
  page control
**************/
//continue from previous page
function continueFromPrevGame() {
    if (localStorage.getItem('players') != null && localStorage.getItem('gametype') != null) {
        playerarr = JSON.parse(localStorage.getItem('players'));
        gametype = parseInt(localStorage.getItem('gametype'));

        $('.board').show();
        $('.continueGame').hide();
        $('.mainmenu').hide();
        Init(gametype);
    } else {
        displayMessages("An error has occured while trying to load your saved game\nThe page will reset.");
        resetBoard();
    }
}

//if player chose to start a new game
function startNewGame() {
    $('.board').hide()
    $('.continueGame').hide();
    $('.mainmenu').show();
}

//disables F5 keyress
function disableF5(event) {
    switch (event.keyCode) {
        case 116: // 'F5'
            event.preventDefault();
            event.keyCode = 0;
            window.status = "F5 disabled";
            refreshWaiter()
            break;
    }
}