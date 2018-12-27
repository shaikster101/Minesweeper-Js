//Board Variables
var Gcoloums, Grows, Gbombs;

//count free cells
var freeCells, cellCounter;     

//Scores 
var timeCounter;
var attempts = 0;

var mineCount; 

var time;




function setBoard() {
    //Values are assigned 

    

    //get numbers 
    Gcoloums = document.getElementById("Coloums").value;
    Grows = document.getElementById("Rows").value;
    Gbombs = document.getElementById("Bombs").value;

    //reset free cell count
    freeCells = 0;
    cellCounter=0;

    timeCounter=0;

    mineCount = 0;

    document.getElementById("tagLine").innerHTML = ""; 
    document.getElementById("tagLine").append("Bombs: ") 

    mineCount = Gbombs; 
    document.getElementById("tagLine").append(mineCount);

    clearInterval(time); 

    time = setInterval(timer, 1000); 

    


    if (Gcoloums < 8 || Grows < 8 || Gcoloums > 40 || Grows > 30) { // test that grids are within bounds
        alert("Sorry, please enter a grid size between 8x8 and 30x40.");
    } else if (Gbombs >= (Gcoloums * Grows)) { // test that the number of mines does not exceed the grid area
        alert("Sorry, please enter a number of mines less than " + (Gcoloums * Grows));
    } else {
        drawBoard(Gcoloums, Grows, Gbombs);
    }
}

function setRBoard() {



    var maxR = Math.floor(30);
    var maxC = Math.floor(40);
    var minR = Math.ceil(8);
    var minC = Math.ceil(8);

    Grows = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
    Gcoloums = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

    var maxB = Math.floor((Grows * Gcoloums) - 1);
    var minB = Math.ceil(1);
    Gbombs = Math.floor(Math.random() * (maxB - minB + 1)) + minB;

    freeCells = 0;
    cellCounter = 0;

    timeCounter=0;

    mineCount = 0;

    document.getElementById("tagLine").innerHTML = ""; 
    document.getElementById("tagLine").append("Bombs: ") 

    mineCount = Gbombs; 
    document.getElementById("tagLine").append(mineCount);

    clearInterval(time); 

    time = setInterval(timer, 1000);
    

    drawBoard(Gcoloums, Grows, Gbombs);

}

function drawBoard(coloums, rows, bombs) {

    //Variables to create the board 
    var i, j;

    //Row of table
    var $row;

    //Individual Cell
    var btn;

    //Delete Older Board and Create new one

    //get conainer
    var container = document.getElementById("container");

    //deleate previous table
    var child = document.getElementById("holder");
    child.parentNode.removeChild(child);

    //create new empty table and append to container
    var table = document.createElement('table');
    table.setAttribute("id", "holder");
    table.setAttribute("class", "grid");
    container.append(table);


    for (i = 0; i < rows; i++) {
        //Create Table
        $row = document.createElement("tr");

        //Create Row
        $row.setAttribute("id", "Row" + i);

        //populate board
        for (j = 0; j < coloums; j++) {

            //create button
            btn = document.createElement("button");


            var td = document.createElement("td");
            td.setAttribute("class", "cell");

            //id reflects its position on board
            btn.setAttribute("id", i + "_" + j);


            //set button attributes
            btn.setAttribute("class", "butts");

            //revealed
            btn.setAttribute("revealed", "false");

            //x,y coordinates
            btn.setAttribute("x", i);
            btn.setAttribute("y", j);

            //neighboring bombcount 
            btn.setAttribute("bombcount", 0);

            //on click function
           // btn.onclick = function {}

            //btn.onclick = function () { mineClick(this.id); };
            btn.onclick = mineClick; 

            //attrbute to check if mine or not
            btn.name = "free";

            //add freeCell 
            freeCells++;
            cellCounter = freeCells;

            td.append(btn)

            //append button to row
            $row.append(td);

            //append row to table
            table.append($row);
        }
    }

    console.log("Initial", freeCells);
    setMines(bombs);
}

function setMines(bombs) {


    //Variables
    var locationI, locationJ;
    var btn;
    var id;

    for (let i = 0; i < bombs; i++) {

        //create random numbers to place bombs
        locationI = Math.floor(Math.random() * Grows);
        locationJ = Math.floor(Math.random() * Gcoloums);

        id = locationI + "_" + locationJ

        btn = document.getElementById(id);

        if (btn && btn.name == "mine") {
            i--;
        } else {
            btn.name = 'mine';
            freeCells--;
            cellCounter=freeCells;
        }
    }
    countMines(); 
}

function countMines(){
    
    var btn;
    var id;

    for (let i = 0; i < Grows; i++) {
        for (let j = 0; j < Gcoloums; j++) {
            id = i + "_" + j;
            btn = document.getElementById(id);
            countNeighbors(btn);
        }
    }
}

//Counts neighboring and tells if they are mines
function countNeighbors(btn){
    var top, topL, topR, left, right, down, downL, downR;

    var bcount = 0;

    var i = Number(btn.getAttribute("x"));
    var j = Number(btn.getAttribute("y"));

    top = document.getElementById((i - 1) + "_" + (j));
    topL = document.getElementById((i - 1) + "_" + (j - 1));
    topR = document.getElementById((i - 1) + "_" + (j + 1));
    left = document.getElementById(i + "_" + (j - 1));
    right = document.getElementById(i + "_" + (j + 1));
    downL = document.getElementById((i + 1) + "_" + (j - 1));
    downR = document.getElementById((i + 1) + "_" + (j + 1));
    down = document.getElementById((i + 1) + "_" + j);


    if (top && top.name == "mine") {
        bcount++;
    }
    if (topL && topL.name == "mine") {
        bcount++;
    }
    if (topR && topR.name == "mine") {
        bcount++;
    }
    if (left && left.name == "mine") {
        bcount++;
    }
    if (right && right.name == "mine") {
        bcount++;
    }
    if (downL && downL.name == "mine") {
        bcount++;
    }
    if (downR && downR.name == "mine") {
        bcount++;
    }
    if (down && down.name == "mine") {
        bcount++;
    }

    btn.setAttribute("bombcount", bcount);
}

function flood(btn){
    var top, topL, topR, left, right, down, downR, downL;


    var  i = Number(btn.getAttribute("x"));
    var j = Number(btn.getAttribute("y"));


    top = document.getElementById((i - 1) + "_" + (j));
    topL = document.getElementById((i - 1) + "_" + (j - 1));
    topR = document.getElementById((i - 1) + "_" + (j + 1));
    left = document.getElementById(i + "_" + (j - 1));
    right = document.getElementById(i + "_" + (j + 1));
    downL = document.getElementById((i + 1) + "_" + (j - 1));
    downR = document.getElementById((i + 1) + "_" + (j + 1));
    down = document.getElementById((i + 1) + "_" + j);



    if (top && top.getAttribute("bombcount") == 0 && top.getAttribute("revealed") == "false" && top.name != "mine") {
        top.disabled = true;
        btn.setAttribute("revealed", "true");
        top.style.backgroundColor = "green"
        //freeCells--;
        flood(top);
    } else {
        if (top && top.name != "mine" && top.getAttribute("revealed") == "false" && top.getAttribute("bombcount") != 0) {
            var b = top.getAttribute("bombcount");
            top.innerText = b;
            top.disabled = true;
            top.setAttribute("revealed", "true");
            //freeCells--; 
        }
    }

    if (topL && topL.getAttribute("bombcount") == 0 && topL.getAttribute("revealed") == "false" && topL.name != "mine") {
        topL.disabled = true;
        btn.setAttribute("revealed", "true");
        topL.style.backgroundColor = "green"
        //freeCells--; 
        flood(topL);
    } else {
        if (topL && topL.name != "mine" && topL.getAttribute("revealed") == "false" && topL.getAttribute("bombcount") != 0) {
            var b = topL.getAttribute("bombcount");
            topL.innerText = b;
            topL.disabled = true;
            topL.setAttribute("revealed", "true");
            //freeCells--; 
        }
    }

    if (topR && topR.getAttribute("bombcount") == 0 && topR.getAttribute("revealed") == "false" && topR.name != "mine") {
        topR.disabled = true;
        btn.setAttribute("revealed", "true");
        topR.style.backgroundColor = "green"
        //freeCells--;
        flood(topR);
    } else {
        if (topR && topR.name != "mine" && topR.getAttribute("revealed") == "false" && topR.getAttribute("bombcount") != 0) {
            var b = topR.getAttribute("bombcount");
            topR.innerText = b;
            topR.disabled = true; 
            topR.setAttribute("revealed", "true");
            //freeCells--;
        }
    }

    if (left && left.getAttribute("bombcount") == 0 && left.getAttribute("revealed") == "false" && left.name != "mine") {
        left.disabled = true;
        btn.setAttribute("revealed", "true");
        left.style.backgroundColor = "green"
        //freeCells--;
        flood(left);
    } else {
        if (left && left.name != "mine" && left.getAttribute("revealed") == "false" && left.getAttribute("bombcount") != 0) {
            var b = left.getAttribute("bombcount");
            left.innerText = b;
            left.disabled = true;
            left.setAttribute("revealed", "true");
           // freeCells--;
        }
    }

    if (right && right.getAttribute("bombcount") == 0 && right.getAttribute("revealed") == "false" && right.name != "mine") {
        right.disabled = true;
        btn.setAttribute("revealed", "true");
        right.style.backgroundColor = "green"
        //freeCells--;
        flood(right);
    } else {
        if (right && right.name != "mine" && right.getAttribute("revealed") == "false" && right.getAttribute("bombcount") != 0) {
            var b = right.getAttribute("bombcount");
            right.innerText = b;
            right.disabled = true;
            right.setAttribute("revealed", "true");
            //freeCells--;
        }
    }

    if (downL && downL.getAttribute("bombcount") == 0 && downL.getAttribute("revealed") == "false" && downL.name != "mine") {
        downL.disabled = true;
        btn.setAttribute("revealed", "true");
        downL.style.backgroundColor = "green"
        //freeCells--;
        flood(downL);
    } else {
        if (downL && downL.name != "mine" && downL.getAttribute("revealed") == "false" && downL.getAttribute("bombcount") != 0) {
            var b = downL.getAttribute("bombcount");
            downL.innerText = b;
            downL.disabled = true;
            downL.setAttribute("revealed", "true");
            //freeCells--;
        }
    }

    if (downR && downR.getAttribute("bombcount") == 0 && downR.getAttribute("revealed") == "false" && downR.name != "mine") {
        downR.disabled = true;
        btn.setAttribute("revealed", "true");
        downR.style.backgroundColor = "green"
        //freeCells--;
        flood(downR);
    } else {
        if (downR && downR.name != "mine" && downR.getAttribute("revealed") == "false" && downR.getAttribute("bombcount") != 0) {
            var b = downR.getAttribute("bombcount");
            downR.innerText = b;
            downR.disabled = true;
            //freeCells--;
            downR.setAttribute("revealed", "true");
        }
    }

    if (down && down.getAttribute("bombcount") == 0 && down.getAttribute("revealed") == "false" && down.name != "mine") {
        down.disabled = true;
        btn.setAttribute("revealed", "true");
        down.style.backgroundColor = "green"
        //freeCells--;
        flood(down);
    } else {
        if (down && down.name != "mine" && down.getAttribute("revealed") == "false" && down.getAttribute("bombcount") != 0) {
            var b = down.getAttribute("bombcount");
            down.innerText = b;
            down.disabled = true;
            down.setAttribute("revealed", "true");
            //freeCells--;
        }
    }
}

function endGame(){
    var id; 
    var btn; 

    for(let i = 0; i<Grows; i++){
        for(let j = 0; j<Gcoloums; j++){
            id = i + "_" + j;
            btn = document.getElementById(id);
            btn.disabled = true;
            if (btn.name == "mine" && btn) {
                btn.style.backgroundColor = "red";
            } else {
                btn.style.backgroundColor = "green";
                btn.innerHTML = btn.getAttribute("bombcount");  
            }
        }
    }

    freeCells = 0; 
    timeCounter=0;

    endT();

    alert("Game Over. Press Start Game or Start Random Game to Play Again");

}

function mineClick(event) {
    var btn = this;

    var btnColor = btn.style.backgroundColor;

    if(event.shiftKey){
        if(btn.name == "mine"){
            if(btnColor == "yellow"){
                btn.style.backgroundColor = "grey"
                mineCount++;
                tag = document.getElementById("tagLine");
                tag.innerHTML = "";
                tag.append("Bombs: ");
                tag.append(mineCount);
            }else{
                btn.style.backgroundColor = "yellow"
                if (mineCount <= 0) {
                    mineCount = 0;
                } else {
                    mineCount--;
                }
    
                tag = document.getElementById("tagLine");
                tag.innerHTML = "";
                tag.append("Bombs: ");
                tag.append(mineCount);
            }
        }else{
            if(btnColor == "yellow"){
                btn.style.backgroundColor = "grey"
                mineCount++;
                tag = document.getElementById("tagLine");
                tag.innerHTML = "";
                tag.append("Bombs: ");
                tag.append(mineCount);
            }else{
                btn.style.backgroundColor = "yellow"
                if (mineCount <= 0) {
                    mineCount = 0;
                } else {
                    mineCount--;
                }
    
                tag = document.getElementById("tagLine");
                tag.innerHTML = "";
                tag.append("Bombs: ");
                tag.append(mineCount);
            }
        }
    }else{

        if(btn.name == "mine"){
            btn.style.backgroundColor = "red"
            endGame(); 
        }else{
            if (btn && btn.getAttribute("bombcount") != 0 && btn.getAttribute("revealed") == "false" && btn.name != "mine" ) {
                var b = btn.getAttribute("bombcount");
                btn.style.backgroundColor = "grey"
                btn.innerText = b;
                btn.disabled = true;
                freeCells--;
                console.log("onePress", freeCells);
                btn.setAttribute("revealed", "true");
                checkAll(); 
            } else {
                btn.style.backgroundColor = "green";
                btn.disabled = true;
                btn.setAttribute("revealed", "true");
                flood(btn);
                checkAll(); 
                console.log("after flood", freeCells);
            }
            
        }
    }
}

function checkAll(){

    var id; 
    var btn;

    var temp;

    freeCells = cellCounter;


    for(let i =0; i<Grows; i++){
        for(let j=0; j<Gcoloums; j++){
            id = i+"_"+j; 
            btn = document.getElementById(id); 

            temp = btn.disabled;
            console.log(btn);
            console.log(temp); 

            console.log("pre", freeCells);
            if(btn.disabled == true){
                freeCells--;
                console.log("subs",freeCells);
            }
        }
    }

    if(freeCells == 0){
        winner(); 
    }

}

function winner(){

    var id; 
    var btn; 

    for(let i = 0; i<Grows; i++){
        for(let j = 0; j<Gcoloums; j++){
            id = i + "_" + j;
            btn = document.getElementById(id);
            btn.disabled = true;
            if (btn.name == "mine" && btn) {
                btn.style.backgroundColor = "red";
            } else {
                btn.style.backgroundColor = "green";
                btn.innerHTML = btn.getAttribute("bombcount");  
            }
        }
    }

    freeCells = 0;



    attempts++;

    document.getElementById("scoreB").append("Attempt " + attempts+ ": "+ (timeCounter-1)+ " || ");

    timeCounter = 0; 
    
    endT();

    alert("You Have Won the Game");

}

function timer() {
    document.getElementById("timer").innerHTML = timeCounter;
    timeCounter++;
}

function endT(){
    clearInterval(time);
}