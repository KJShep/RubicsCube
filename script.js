var canvas = document.getElementById("myCanvas");
var cc = canvas.getContext("2d"); //cc = canvas content
var squareSide = 50

//         (BLUE)
//(ORANGE) (WHITE) (RED) (YELLOW)
//         (GREEN)

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});


class Corner{

    constructor(left,right,top){//String for colors
        this.left = left;
        this.right = right;
        this.top = top;
    }

}
class Edge{
    constructor(left,right){//String for colors
        this.left = left;
        this.right = right;
    }
}
class Center{
    constructor(color){
        this.color = color;
    }
}

//corner pieces: 8
var corner = [];
var cornerPiece0 = new Corner("orange0c","blue0c","white0c");//whites
var cornerPiece1 = new Corner("green1c","orange1c","white1c");
var cornerPiece2 = new Corner("red2c","green2c","white2c");
var cornerPiece3 = new Corner("blue3c","red3c","white3c");
var cornerPiece4 = new Corner("orange4c","blue4c","yellow4c");//yellows
var cornerPiece5 = new Corner("green5c","orange5c","yellow5c");
var cornerPiece6 = new Corner("red6c","green6c","yellow6c");
var cornerPiece7 = new Corner("blue7c","red7c","yellow7c");

corner.push(cornerPiece0);
corner.push(cornerPiece1);
corner.push(cornerPiece2);
corner.push(cornerPiece3);
corner.push(cornerPiece4);
corner.push(cornerPiece5);
corner.push(cornerPiece6);
corner.push(cornerPiece7);

//edges: 12
var edge = [];
var edge0 = new Edge("blue0e","white0e"); //all end in "e" for edge key
var edge1 = new Edge("orange1e","white1e");
var edge2 = new Edge("green2e","white2e");
var edge3 = new Edge("red3e","white3e");
var edge4 = new Edge("orange4e","blue4e");
var edge5 = new Edge("green5e","orange5e");
var edge6 = new Edge("red6e","green6e");
var edge7 = new Edge("blue7e","red7e");
var edge8 = new Edge("blue8e","yellow8e");
var edge9 = new Edge("orange9e","yellow9e");
var edge10 = new Edge("greenae","yellowae");//a = 10
var edge11 = new Edge("redbe","yellowbe");//b = 11

edge.push(edge0);
edge.push(edge1);
edge.push(edge2);
edge.push(edge3);
edge.push(edge4);
edge.push(edge5);
edge.push(edge6);
edge.push(edge7);
edge.push(edge8);
edge.push(edge9);
edge.push(edge10);
edge.push(edge11);

//centers: 6
var center = []; //never going to move, constant
var white = new Center("white0C");
var blue = new Center("blue1C");
var orange = new Center("orange2C");
var green = new Center("green3C");
var red = new Center("red4C");
var yellow = new Center("yellow5C");

center.push(white);
center.push(blue);
center.push(orange);
center.push(green);
center.push(red);
center.push(yellow);


//traverse through corner, edge, center and have a blueprint for where slots (0-7 for corner) would land.
//For example,corner[0] is a spot and the pieces going through that spot are changing

//                                     (corner[4]) (edge[8]) (corner[7])  
//                                     (edge[4])  (center[1])  (edge[7])
//                                     (corner[0]) (edge[0]) (corner[3])
//  (corner[4]) (edge[4])  (corner[0])(corner[0])  (edge[0])  (corner[3])(corner[3])  (edge[7])  (corner[7]) (corner[7]) (edge[8])  (corner[4])
//  (edge[9])  (center[2]) [(edge[1])  (edge[1])] (center[0]) [(edge[3])  (edge[3])] (center[4])  (edge[11])  (edge[11]) (center[5]) (edge[9])
//  (corner[5]) (edge[5])  (corner[1])(corner[1])  (edge[2])  (corner[2])(corner[2])  (edge[6])  (corner[6]) (corner[6]) (edge[10]) (corner[5])
//                                     (corner[1]) (edge[2]) (corner[2])
//                                     (edge[5])  (center[3])  (edge[6])
//                                     (corner[5]) (edge[10])(corner[6])


var squareDict = {
    "3,0" : corner[4].right,
    "4,0" : edge[8].left,
    "5,0" : corner[7].left,

    "3,1" :edge[4].right,
    "4,1" :center[1].color,
    "5,1" : edge[7].left,

    "3,2" : corner[0].right,
    "4,2" : edge[0].left,
    "5,2" : corner[3].left,

    "0,3":corner[4].left,
    "1,3":edge[4].left,
    "2,3":corner[0].left,
    "3,3":corner[0].top,
    "4,3":edge[0].right,
    "5,3":corner[3].top,
    "6,3":corner[3].right,
    "7,3":edge[7].right,
    "8,3":corner[7].right,
    "9,3":corner[7].top,
    "10,3":edge[8].right,
    "11,3":corner[4].top,

    "0,4": edge[9].left,
    "1,4": center[2].color,
    "2,4": edge[1].left,
    "3,4": edge[1].right,
    "4,4": center[0].color,
    "5,4":edge[3].right,
    "6,4":edge[3].left,
    "7,4":center[4].color,
    "8,4":edge[11].left,
    "9,4":edge[11].right,
    "10,4":center[5].color,
    "11,4":edge[9].right,

    "0,5":corner[5].right,
    "1,5":edge[5].right,
    "2,5":corner[1].right,
    "3,5":corner[1].top,
    "4,5":edge[2].right,
    "5,5":corner[2].top,
    "6,5":corner[2].left,
    "7,5":edge[6].left,
    "8,5":corner[6].left,
    "9,5":corner[6].top,
    "10,5":edge[10].right,
    "11,5":corner[5].top,

    "3,6" : corner[1].left,
    "4,6" : edge[2].left,
    "5,6" : corner[2].right,

    "3,7" :edge[5].left,
    "4,7" :center[3].color,
    "5,7" : edge[6].right,

    "3,8" : corner[5].left,
    "4,8" :edge[10].left,
    "5,8" :corner[6].right
    
}

drawCube();
function drawCube(){

    cc.strokeStyle ="black"; //FOR BORDER LINES
    cc.lineWidth = 2;
    cc.fillStyle = "grey"; // Set your color
    cc.fillRect(0, 0, canvas.width, canvas.height);

    for(let key in squareDict){
        var arrCoord = key.split(",").map(Number); //[x,y]

        cc.fillStyle = squareDict[key].slice(0,-2);
        cc.fillRect(squareSide*arrCoord[0], squareSide*arrCoord[1], squareSide,squareSide);
        cc.strokeRect(squareSide*arrCoord[0], squareSide*arrCoord[1], squareSide,squareSide);
    }
    /*
    //FIRST LINE
    cc.fillStyle = squareDict["3,0"];
    cc.fillRect(squareSide*3,0,squareSide,squareSide)
    cc.strokeRect(squareSide*3,0,squareSide,squareSide);

    cc.fillStyle = edge[8].left;
    cc.fillRect(squareSide*4,0,squareSide,squareSide)
    cc.strokeRect(squareSide*4,0,squareSide,squareSide);

    cc.fillStyle = corner[7].left;
    cc.fillRect(squareSide*5,0,squareSide,squareSide)
    cc.strokeRect(squareSide*5,0,squareSide,squareSide);

    //SECOND LINE
    cc.fillStyle = edge[4].right;
    cc.fillRect(squareSide*3,squareSide*1,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*1,squareSide,squareSide);

    cc.fillStyle = center[1];
    cc.fillRect(squareSide*4,squareSide*1,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*1,squareSide,squareSide);

    cc.fillStyle = edge[7].left;
    cc.fillRect(squareSide*5,squareSide*1,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*1,squareSide,squareSide);

    //THIRD LINE
    cc.fillStyle = corner[0].right;
    cc.fillRect(squareSide*3,squareSide*2,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*2,squareSide,squareSide);

    cc.fillStyle = edge[0].left;
    cc.fillRect(squareSide*4,squareSide*2,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*2,squareSide,squareSide);

    cc.fillStyle = corner[3].left;
    cc.fillRect(squareSide*5,squareSide*2,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*2,squareSide,squareSide);

    //FOURTH LINE
    cc.fillStyle = corner[4].left;
    cc.fillRect(squareSide*0,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*0,squareSide*3,squareSide,squareSide);

    cc.fillStyle = edge[4].left;
    cc.fillRect(squareSide*1,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*1,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[0].left;
    cc.fillRect(squareSide*2,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*2,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[0].top;
    cc.fillRect(squareSide*3,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*3,squareSide,squareSide);

    cc.fillStyle = edge[0].right;
    cc.fillRect(squareSide*4,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[3].top;
    cc.fillRect(squareSide*5,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[3].right;
    cc.fillRect(squareSide*6,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*6,squareSide*3,squareSide,squareSide);

    cc.fillStyle = edge[7].right;
    cc.fillRect(squareSide*7,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*7,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[7].right;
    cc.fillRect(squareSide*8,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*8,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[7].top;
    cc.fillRect(squareSide*9,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*9,squareSide*3,squareSide,squareSide);

    cc.fillStyle = edge[8].right;
    cc.fillRect(squareSide*10,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*10,squareSide*3,squareSide,squareSide);

    cc.fillStyle = corner[4].top;
    cc.fillRect(squareSide*11,squareSide*3,squareSide,squareSide)
    cc.strokeRect(squareSide*11,squareSide*3,squareSide,squareSide);

    //FIFTH LINE
    cc.fillStyle = edge[9].left;
    cc.fillRect(squareSide*0,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*0,squareSide*4,squareSide,squareSide);

    cc.fillStyle = center[2];
    cc.fillRect(squareSide*1,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*1,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[1].left;
    cc.fillRect(squareSide*2,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*2,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[1].right;
    cc.fillRect(squareSide*3,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*4,squareSide,squareSide);

    cc.fillStyle = center[0];
    cc.fillRect(squareSide*4,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[3].right;
    cc.fillRect(squareSide*5,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[3].left;
    cc.fillRect(squareSide*6,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*6,squareSide*4,squareSide,squareSide);

    cc.fillStyle = center[4];
    cc.fillRect(squareSide*7,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*7,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[11].left;
    cc.fillRect(squareSide*8,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*8,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[11].right;
    cc.fillRect(squareSide*9,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*9,squareSide*4,squareSide,squareSide);

    cc.fillStyle = center[5];
    cc.fillRect(squareSide*10,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*10,squareSide*4,squareSide,squareSide);

    cc.fillStyle = edge[9].right;
    cc.fillRect(squareSide*11,squareSide*4,squareSide,squareSide)
    cc.strokeRect(squareSide*11,squareSide*4,squareSide,squareSide);

    //SIXTH LINE
    cc.fillStyle = corner[5].right;
    cc.fillRect(squareSide*0,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*0,squareSide*5,squareSide,squareSide);

    cc.fillStyle = edge[5].right;
    cc.fillRect(squareSide*1,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*1,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[1].right;
    cc.fillRect(squareSide*2,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*2,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[1].top;
    cc.fillRect(squareSide*3,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*5,squareSide,squareSide);

    cc.fillStyle = edge[2].right;
    cc.fillRect(squareSide*4,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[2].top;
    cc.fillRect(squareSide*5,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[2].left;
    cc.fillRect(squareSide*6,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*6,squareSide*5,squareSide,squareSide);

    cc.fillStyle = edge[6].left;
    cc.fillRect(squareSide*7,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*7,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[6].left;
    cc.fillRect(squareSide*8,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*8,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[6].top;
    cc.fillRect(squareSide*9,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*9,squareSide*5,squareSide,squareSide);

    cc.fillStyle = edge[10].right;
    cc.fillRect(squareSide*10,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*10,squareSide*5,squareSide,squareSide);

    cc.fillStyle = corner[5].top;
    cc.fillRect(squareSide*11,squareSide*5,squareSide,squareSide)
    cc.strokeRect(squareSide*11,squareSide*5,squareSide,squareSide);

    //SEVENTH LINE
    cc.fillStyle = corner[1].left;
    cc.fillRect(squareSide*3,squareSide*6,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*6,squareSide,squareSide);

    cc.fillStyle = edge[2].left;
    cc.fillRect(squareSide*4,squareSide*6,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*6,squareSide,squareSide);

    cc.fillStyle = corner[2].right;
    cc.fillRect(squareSide*5,squareSide*6,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*6,squareSide,squareSide);

    //EIGHTH LINE
    cc.fillStyle = edge[5].left;
    cc.fillRect(squareSide*3,squareSide*7,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*7,squareSide,squareSide);

    cc.fillStyle = center[3];
    cc.fillRect(squareSide*4,squareSide*7,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*7,squareSide,squareSide);

    cc.fillStyle = edge[6].right;
    cc.fillRect(squareSide*5,squareSide*7,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*7,squareSide,squareSide);

    //NINTH LINE
    cc.fillStyle = corner[5].left;
    cc.fillRect(squareSide*3,squareSide*8,squareSide,squareSide)
    cc.strokeRect(squareSide*3,squareSide*8,squareSide,squareSide);

    cc.fillStyle = edge[10].left;
    cc.fillRect(squareSide*4,squareSide*8,squareSide,squareSide)
    cc.strokeRect(squareSide*4,squareSide*8,squareSide,squareSide);

    cc.fillStyle = corner[6].right;
    cc.fillRect(squareSide*5,squareSide*8,squareSide,squareSide)
    cc.strokeRect(squareSide*5,squareSide*8,squareSide,squareSide);
    */
}

var face0 = ["3,3","4,3","5,3",
             "3,4","4,4","5,4",
             "3,5","4,5","5,5"]//white

var face1 = ["3,0","4,0","5,0",
             "3,1","4,1","5,1",
             "3,2","4,2","5,2"]//blue

var face2 = ["0,3","1,3","2,3",
             "0,4","1,4","2,4",
             "0,5","1,5","2,5"]//orange

var face3 = ["3,6","4,6","5,6",
             "3,7","4,7","5,7",
             "3,8","4,8","5,8"]//green

var face4 = ["6,3","7,3","8,3",
             "6,4","7,4","8,4",
             "6,5","7,5","8,5"]//red

var face5 = ["9,3","10,3","11,3",
             "9,4","10,4","11,4",
             "9,5","10,5","11,5"]//yellow

var faces = [face0,face1,face2,face3,face4,face5];
var xSquare = null;
var ySquare = null;


//Logic Start >:)
var turnCounter = 0;
canvas.addEventListener("mousedown", function(event){
    var faceClicked = null;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //square(x,y) that i clicked
    xSquare = Math.floor(x / squareSide);
    ySquare = Math.floor(y / squareSide);

    for(let face of faces){
        for(let coord of face){
            var arrCoord = coord.split(",").map(Number); //[x,y]

            if(arrCoord[0] == xSquare && arrCoord[1] == ySquare){
                faceClicked = face;
                break;
            }
        }
        if(faceClicked != null){
            break;
        }
    }

    
    //console.log(faceClicked);
    var clockwise = true;
    if(event.button === 0){
        //left click
        //counter clockwise
        Rotate1DSquareMatrixCounterClockwise(faceClicked);
        clockwise = false;
    }
    if(event.button === 2){
        //Right click
        //clockwise
        Rotate1DSquareMatrixClockwise(faceClicked);
        clockwise = true;
    }


    var groups = getGroups(faceClicked);//groups[4] = color that was clicked... Used to know what color was clicked when displaying previous turns
    


    if(clockwise){
        turnStack.push([0,faceClicked]);
    }
    else{
        turnStack.push([1,faceClicked]);
    }

    turnCounter++;

    var turnCounterDisplay = document.getElementById("TurnCounter").innerHTML = turnCounter;
    /*
    drawCube();

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    findSquareClicked(x,y);
    */
   turnStackUndo = [];

   //for tracking turns but didnt end up working.
    /*
    var groupsPrevious = getGroups(turnStack.at(-2)[1]);
    if(turnStack.length > 0 && groupsPrevious[4] == groups[4]){
        if(turnStack.at(-2)[0] != turnStack.at(-1)[0]){
            var letterLength = groups[4].length;
            var turnLength = turnStack.at(-2)[0];
            document.getElementById("turns").innerHTML = document.getElementById("turns").innerHTML.substring(0,document.getElementById("turns").innerHTML.length - (letterLength + turnLength + 1));
            turnStack.pop();
        }
    }
    else{//not undoing it
        document.getElementById("turns").innerHTML += " "+groups[4];
        if(turnStack.at(-1)[0] == 0){//clockwise
            document.getElementById("turns").innerHTML += "C";
        }
        else{
            document.getElementById("turns").innerHTML += "CC";
        }
    }*/
});


function getGroups(face){
    if(face == face0){//WHITE
        group1 = ["2,5","2,4","2,3"];
        group2 = ["3,2","4,2","5,2"];
        group3 = ["6,3","6,4","6,5"];
        group4 = ["5,6","4,6","3,6"];
        group5 = "White";
    }
    else if(face == face1){ //BLUE
        group1 = ["9,3","10,3","11,3"];
        group2 = ["6,3","7,3","8,3"];
        group3 = ["3,3","4,3","5,3"];
        group4 = ["0,3","1,3","2,3"];
        group5 = "Blue";
    }
    else if(face == face2){// orange
        group1 = ["3,3","3,4","3,5"];
        group2 = ["3,6","3,7","3,8"];
        group3 = ["11,5","11,4","11,3"];
        group4 = ["3,0","3,1","3,2"];
        group5 = "Orange";
    }
    else if(face == face3){// green
        group1 = ["0,5","1,5","2,5"];
        group2 = ["3,5","4,5","5,5"];
        group3 = ["6,5","7,5","8,5"];
        group4 = ["9,5","10,5","11,5"];
        group5 = "Green";
    }
    else if(face == face4){// red
        group1 = ["5,8","5,7","5,6"];
        group2 = ["5,5","5,4","5,3"];
        group3 = ["5,2","5,1","5,0"];
        group4 = ["9,3","9,4","9,5"];
        group5 = "Red";
    }
    else if(face == face5){// yellow
        group4 = ["8,3","8,4","8,5"];
        group3 = ["5,8","4,8","3,8"];
        group2 = ["0,5","0,4","0,3"];
        group1 = ["3,0","4,0","5,0"];
        group5 = "Yellow";
    }


    return [group1,group2,group3,group4,group5];
}

function Rotate1DSquareMatrixClockwise(matrix){
    var size = Math.sqrt(matrix.length);
    var result = new Array(matrix.length);

    for (var i = 0; i < size; ++i)
    {
        for (var j = 0; j < size; ++j)
        {
            result[i * size + j] = matrix[(size - j - 1) * size + i];
        }
    }

    var oldMapping = {};
    for(let key of matrix){
        oldMapping[key] = squareDict[key];
    }

    var index = 0;
    for(let key of matrix){
        squareDict[key] = oldMapping[result[index]];
        index++;
    }
    
    //rotation done so now turn the other pieces that need to be swapped

    var groups = getGroups(matrix);//groups[4] = color that was clicked... Used to know what color was clicked when displaying previous turns
    swapSections(groups[0],groups[1],groups[2],groups[3]);

    drawCube();
    //return result;
}

function Rotate1DSquareMatrixCounterClockwise(matrix){
    var size = Math.sqrt(matrix.length);
    var result = new Array(matrix.length);

    for (var i = 0; i < size; ++i)
    {
        for (var j = 0; j < size; ++j)
        {
            result[i * size + j] = matrix[j* size + (size - i - 1)];
        }
    }

    var oldMapping = {};
    for(let key of matrix){
        oldMapping[key] = squareDict[key];
    }

    var index = 0;
    for(let key of matrix){
        squareDict[key] = oldMapping[result[index]];
        index++;
    }

    //rotation done so now turn the other pieces that need to be swapped

    var groups = getGroups(matrix);//groups[4] = color that was clicked... Used to know what color was clicked when displaying previous turns
    swapSections(groups[3],groups[2],groups[1],groups[0]);

    drawCube();
    //return result;
}

function swapSections(group1, group2, group3, group4){//group1 -> group2 -> group3 ->group4 -> group1
    var groups = [group1,group2,group3,group4];

    var group4Temp = {};
    for(let key of group4){
        group4Temp[key] = squareDict[key];
    }

    var previousGroup = group3;
    for(let i = groups.length-1; i >= 0; i--){
        previousGroup = groups[i-1];
        if(groups[i] == group1){
            previousGroup = group4;
        }
        var index = 0;
        for(let key of groups[i]){
            if(groups[i] == group1){
                squareDict[key] = group4Temp[previousGroup[index]];
            }
            else{
                squareDict[key] = squareDict[previousGroup[index]];
            }
            index++;
        }
    }

    drawCube();
}


var foundKey = null; //key is the coord of the color. so like "3,4" and the value is a color
function findSquareClicked(x,y){

    foundKey = null;
    for(let key in squareDict){
        if(key == xSquare + "," + ySquare){
            foundKey = key;
            break;
        }
    }
    if(foundKey != null){
        cc.strokeStyle ="purple";
        cc.lineWidth = 6;
        cc.strokeRect(squareSide * xSquare, squareSide * ySquare, squareSide,squareSide);
    }
    //awesome the key can be found and it maps to a block

    var testFoundKey = document.getElementById("TESTING")
    testFoundKey.innerText = squareDict[foundKey];
}

var turnStack = [];
var turnStackUndo = [];

//Now randomize the cube through a button click
function randomizeCube(){
    let min = 21;
    let max = 100;
    let turnNum = Math.floor(Math.random() * (max - min + 1)) + min;

    for(var i = 0; i < turnNum; i++){
        //get randomFace
        let min = 0;
        let max = 5; //inclusive
        let faceNum = Math.floor(Math.random() * (max - min + 1)) + min;
        //random face selected
        min = 0;
        max = 1; //inclusive
        let clockwiseTurn = Math.floor(Math.random() * (max - min + 1)) + min;
        //if 0, clockwise, if 1 cc turn.


        var groups = getGroups(faces[faceNum]);


        if(clockwiseTurn == 0){ //clockwise
            Rotate1DSquareMatrixClockwise(faces[faceNum]);
            //swapSections(groups[0],groups[1],groups[2],groups[3]);
            turnStack.push([0,faces[faceNum]]);
        }
        else{
            Rotate1DSquareMatrixCounterClockwise(faces[faceNum]);
            //swapSections(groups[3],groups[2],groups[1],groups[0]);
            turnStack.push([1,faces[faceNum]]);
        }

    }
    turnStackUndo = [];
}


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function solve(){
    while(turnStack.length != 0){
        var movement = turnStack.pop();
        var groups = getGroups(movement[1]);
        if(movement[0] == 0){//originally turned clockwise so now go cc
            Rotate1DSquareMatrixCounterClockwise(movement[1]);
            //swapSections(groups[3],groups[2],groups[1],groups[0]);
        }
        else{
            Rotate1DSquareMatrixClockwise(movement[1]);
            //swapSections(groups[0],groups[1],groups[2],groups[3]);
        }
        await delay(100);
    }
    turnStack = [];
    turnStackUndo = [];
}

function undoTurn(){
    if(turnStack.length != 0){
        var movement = turnStack.pop();
        var groups = getGroups(movement[1]);
        if(movement[0] == 0){//originally turned clockwise so now go cc
            Rotate1DSquareMatrixCounterClockwise(movement[1]);
            //swapSections(groups[3],groups[2],groups[1],groups[0]);
            turnStackUndo.push([1,movement[1]]);
        }
        else{
            Rotate1DSquareMatrixClockwise(movement[1]);
            //swapSections(groups[0],groups[1],groups[2],groups[3]);
            turnStackUndo.push([1,movement[1]]);
        }
    }
}

function redoTurn(){
    if(turnStackUndo.length != 0){
        var movement = turnStackUndo.pop();
        var groups = getGroups(movement[1]);
        if(movement[0] == 0){//undoing the undo
            Rotate1DSquareMatrixCounterClockwise(movement[1]);
            //swapSections(groups[3],groups[2],groups[1],groups[0]);
            turnStack.push([1,movement[1]]);
        }
        else{
            Rotate1DSquareMatrixClockwise(movement[1]);
            //swapSections(groups[0],groups[1],groups[2],groups[3]);
            turnStack.push([0,movement[1]]);
        }
    }
}

var isAutoPlay = false;
async function autoPlay(){
    
    isAutoPlay = !isAutoPlay;
    if(isAutoPlay){
        document.getElementById("autoPlay").innerText = "Auto Play: ON";
    }
    else{
        document.getElementById("autoPlay").innerText = "Auto Play: OFF";
    }
    while(isAutoPlay){
        randomizeCube();
        await solve();
        await delay(1000);
    }
}

function getFaceString(myCoord){//"3,4" -> "white"
    for(let face of faces){
        for(let coord of face){
            if(myCoord == coord){
                return squareDict[face[4]].slice(0,-2);
            }
        }
    }
}

function getFaceArray(myCoord){
    for(let face of faces){
        for(let coord of face){
            if(myCoord == coord){
                return face;
            }
        }
    }
}

function updatePiecePos(name){
    for(let key in squareDict){
        if(squareDict[key] == name){
            return key;
        }
    }
}

//now attempting to add my own solving algorithm.
async function crossCFOP(){
    //blue, orange, green, red
    var updatePieces = [["blue0e","white0e"],["orange1e","white1e"],["green2e","white2e"],["red3e","white3e"]]

    for(let piece of updatePieces){
        //edge[0] = blue/white
        var be = piece[0];//blue edge
        var bePos = updatePiecePos(be); //"4,2" at start for example
        var we = piece[1]; //white edge
        var wePos = updatePiecePos(we);

        //if white is on yellow face, turn till over blue and then rotate twice.
        var whiteSpotsFace = getFaceString(wePos);
        var blueSpotsFace = getFaceString(bePos);

        //if white on : blue/green -> up down rotation
        //if white on : orange/red -> left right rotation
        if(whiteSpotsFace == "blue" && blueSpotsFace == "red" || whiteSpotsFace == "green" && blueSpotsFace == "orange" || whiteSpotsFace == "orange" && blueSpotsFace == "blue" || whiteSpotsFace == "red" && blueSpotsFace == "green"){
            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            wePos = updatePiecePos(we);
            await delay(100);

            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            wePos = updatePiecePos(we);
            await delay(100);

            //turn piece back
            //purposly didnt update blue piece pos to remember which piece to turn back
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            bePos = updatePiecePos(be); //then we update it
            await delay(100);

        }
        else if (blueSpotsFace == "yellow"){
            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);
            await delay(100);

            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            await delay(100);

            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellow5C")));//rotate yellow face
            await delay(100);

            //undo the moves
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(100);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);//then we update it
            wePos = updatePiecePos(we);
            await delay(100);

        }
        else if(blueSpotsFace == "white"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);
            await delay(100);

            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            await delay(100);

            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellow5C")));//rotate yellow face
            await delay(100);

            //undo the moves
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(100);
            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);//then we update it
            wePos = updatePiecePos(we);
            await delay(100);
        }
        else if(whiteSpotsFace != "white" && whiteSpotsFace != "yellow"){//(whiteSpotsFace == "blue" && blueSpotFace == "orange" || whiteSpotsFace == "green" && blueSpotFace == "red" || whiteSpotsFace == "orange" && blueSpotsFace == "green" || whiteSpotsFace == "red" && blueSpotsFace == "blue") 
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            wePos = updatePiecePos(we);
            await delay(100);

            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            wePos = updatePiecePos(we);
            await delay(100);

            //turn piece back
            //purposly didnt update blue piece pos to remember which piece to turn back
            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            bePos = updatePiecePos(be);//then we update it
            await delay(100);
        }
        else if(whiteSpotsFace == "white" && blueSpotsFace != piece[0].slice(0,-2)){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(100);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(100);
            wePos = updatePiecePos(we);//then we update it
        }
        
        //twist from top into position
        whiteSpotsFace = getFaceString(wePos);
        blueSpotsFace = getFaceString(bePos);
        if(whiteSpotsFace == "yellow"){ //on yellow face.
            //now put blue in blue territory and rotate blue twice
            while(getFaceString(bePos) != piece[0].slice(0,-2)){
                Rotate1DSquareMatrixCounterClockwise(getFaceArray(wePos));

                //update bePos
                bePos = updatePiecePos(be);

                await delay(100);
            }
            //white now on yellow face and blue is in blue. Turn twice
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(100);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(100);
        }
    } 
}
