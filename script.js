var canvas = document.getElementById("myCanvas");
var cc = canvas.getContext("2d"); //cc = canvas content
var squareSide = 50

//         (BLUE)
//(ORANGE) (WHITE) (RED) (YELLOW)
//         (GREEN)

var delayTime = 2 //ms

var solvingValues = [];

window.addEventListener('load', (event) => {
    let screenshot = localStorage["screenshot"];
    document.getElementById("cubeScreenshotInput").value = localStorage["screenshot"];
    drawScreenshot(screenshot);

    solvingValues = localStorage["turnNumbers"] ? localStorage["turnNumbers"].split(",").filter(x => x !== "") : [];
    console.log(solvingValues)
    graphChart();
});


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

class Debug{
    constructor(idSent){
        this.id = idSent;
    }

    addText(text){
        document.getElementById(this.id).value += text;
        debugBox.scrollTop = debugBox.scrollHeight;  // scroll to bottom
    }

    clear(){
        document.getElementById(this.id).value = "";
        debugBox.scrollTop = debugBox.scrollHeight;
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
var white = new Center("whiteCC");
var blue = new Center("blueCC");
var orange = new Center("orangeCC");
var green = new Center("greenCC");
var red = new Center("redCC");
var yellow = new Center("yellowCC");

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
var finishedCube = JSON.parse(JSON.stringify(squareDict));

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
}

async function printCubeLayout(){
    return //bc i want to build up my avg
    debugArea.addText("\n");
    debugArea.addText("Cube Screenshot:\n");
    for(let key in squareDict){
        debugArea.addText(key+":"+squareDict[key] + " ");
    }
}

//input to change main canvas
const mainCubeInput = document.getElementById("changeMainCanvasInput");

mainCubeInput.addEventListener("input", function(event) {
    //console.log("User typed:", event.target.value);\
    let content = event.target.value;
    // Split by spaces first
    content.split(" ").forEach(pair => {
        // Split each "x,y:value" into key and value
        const [key, value] = pair.split(":");
        if(value != null){
            squareDict[key] = value;
        }
    });
    drawCube();
});

//screenShot Canvas
const cubeScreenshotInput = document.getElementById("cubeScreenshotInput");

cubeScreenshotInput.addEventListener("input", function(event) {
    //console.log("User typed:", event.target.value);
    localStorage["screenshot"] = event.target.value; // only strings
    drawScreenshot(event.target.value);
});

var screenshotCanvas = document.getElementById("screenshotCanvas");
var scc = screenshotCanvas.getContext("2d"); //scc = screenshot canvas content
var sccSquareSide = 25;

function drawScreenshot(content){//content is String "x,y:spot"
    var map = {};
    // Split by spaces first
    content.split(" ").forEach(pair => {
        // Split each "x,y:value" into key and value
        const [key, value] = pair.split(":");
        map[key] = value;
    });

    for(const key in map){
        if(!map[key]) continue;
        const [x, y] = key.split(",").map(Number);
        scc.fillStyle = map[key].slice(0,-2);
        scc.fillRect(x * sccSquareSide, y * sccSquareSide, sccSquareSide, sccSquareSide);
        scc.strokeRect(sccSquareSide*x, sccSquareSide*y, sccSquareSide,sccSquareSide);
    }
}

//CHART
async function graphChart() {
  solvingValues = solvingValues.sort((a, b) => a - b);
  //const values = [113, 150, 130,115];

  const canvas = document.getElementById("avgChart");
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;

  const padding = 40;
  //const barWidth = (width - padding * 2) / solvingValues.length;

  //const maxVal = Math.max(...solvingValues);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  await ctx.stroke();


  if(solvingValues.length == 0){
    return
  }

  //map: {solve# : number of times solved that}
  let frequencyMap = {};
  for(let i of solvingValues){
    frequencyMap[i] = (frequencyMap[i] || 0) + 1;
  }

  const keys = Object.keys(frequencyMap);
const values = Object.values(frequencyMap);

const barWidth = (width - padding * 2) / values.length;
const maxVal = Math.max(...values);

values.forEach((val, i) => {
  const barHeight = (val / maxVal) * (height - padding * 2);

  const x = padding + i * barWidth;
  const y = height - padding - barHeight;

  ctx.fillStyle = "steelblue";
  ctx.fillRect(x, y, barWidth * 0.8, barHeight);


  // Frequency label
  ctx.fillStyle = "black";
  ctx.fillText(val, x + 10, y - 5);

  // Turn count label (IMPORTANT change)
  //ctx.fillText(keys[i], x + 10, height - padding + 15);
});


  var average = 0;
  for(var i of solvingValues){
    average+=Number(i);
  }
  average = average/solvingValues.length;
  average = Math.round(average);
  console.log(solvingValues);
  document.getElementById("averageLabel").innerText = average;


      // Calculate stats
const min = Math.min(...solvingValues);
const max = Math.max(...solvingValues);



// Draw only min/max labels
ctx.fillStyle = "black";

ctx.fillText(min, padding, height - padding + 20);

ctx.fillText(
  max,
  width - padding - 20,
  height - padding + 20
);

// Draw average marker
//const avgX = valueToX(average);
const avgIndex = keys.findIndex(k => Number(k) >= average);
const avgX = padding + avgIndex * barWidth + (barWidth - 10) / 2;
const avgVal = values[avgIndex];
const avgBarHeight = (avgVal / maxVal) * (height - padding * 2);
const avgBarTop = height - padding - avgBarHeight;

ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(avgX, avgBarTop);
ctx.lineTo(avgX, height - padding);
ctx.stroke();

// Average label
ctx.fillStyle = "red";
ctx.fillText(
  `Avg ${average}`,
  avgX - 20,
  height - padding + 20
);
}

//turnNumberLabel
var turnNumber = 0;
var turnNumberLabel = document.getElementById("turnNumberLabel");


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

var debugArea = new Debug("debugBox");

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

function getPieceFromId(id){//give "white3e" and get edge3
    if(id.at(-1) == "e"){//edge
        if(id.at(-2) == "0"){
            return edge0;
        }
        if(id.at(-2) == "1"){
            return edge1;
        }
        if(id.at(-2) == "2"){
            return edge2;
        }
        if(id.at(-2) == "3"){
            return edge3;
        }
        if(id.at(-2) == "4"){
            return edge4;
        }
        if(id.at(-2) == "5"){
            return edge5;
        }
        if(id.at(-2) == "6"){
            return edge6;
        }
        if(id.at(-2) == "7"){
            return edge7;
        }
        if(id.at(-2) == "8"){
            return edge8;
        }
        if(id.at(-2) == "9"){
            return edge9;
        }
        if(id.at(-2) == "a"){
            return edge10;
        }
        if(id.at(-2) == "b"){
            return edge11;
        }
    }
    else if(id.at(-1) == "c"){//corner
        if(id.at(-2) == "0"){
            return cornerPiece0;
        }
        if(id.at(-2) == "1"){
            return cornerPiece1;
        }
        if(id.at(-2) == "2"){
            return cornerPiece2;
        }
        if(id.at(-2) == "3"){
            return cornerPiece3;
        }
        if(id.at(-2) == "4"){
            return cornerPiece4;
        }
        if(id.at(-2) == "5"){
            return cornerPiece5;
        }
        if(id.at(-2) == "6"){
            return cornerPiece6;
        }
        if(id.at(-2) == "7"){
            return cornerPiece7;
        }
    }
}

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

    turnNumber++;
    turnNumberLabel.innerText = turnNumber;

    drawCube();
    debugArea.addText(groups[4] + " Clockwise\n");
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

    turnNumber++;
    turnNumberLabel.innerText = turnNumber;

    drawCube();
    debugArea.addText(groups[4] + " CounterClockwise\n");
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
async function randomizeCube(){
    //let min = 30;
    //let max = 100;
    //let turnNum = Math.floor(Math.random() * (max - min + 1)) + min;
    let turnNum = 21;

    debugArea.clear();

    debugArea.addText("MIXING UP...\n");
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
    debugArea.addText("CUBE RANDOMIZED.\n");
    await printCubeLayout();
    turnStackUndo = [];

    //reset display to 0
    turnNumber = 0;
    turnNumberLabel.innerText = turnNumber;
    
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
        await delay(delayTime);
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
        await crossCFOP();
        await F2LCFOP();
        await OLLCFOP();
        await PLLCFOP();
        if(!(await isSolved())){
            autoPlay();
        }
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
    var updatePieces = [["blue0e","white0e"],["orange1e","white1e"],["green2e","white2e"],["red3e","white3e"]];

    debugArea.addText("\nSOLVING CROSS...\n")
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
            await delay(delayTime);

            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            wePos = updatePiecePos(we);
            await delay(delayTime);

            //turn piece back
            //purposly didnt update blue piece pos to remember which piece to turn back
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            bePos = updatePiecePos(be); //then we update it
            await delay(delayTime);

        }
        else if (blueSpotsFace == "yellow"){
            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);
            await delay(delayTime);

            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            await delay(delayTime);

            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//rotate yellow face
            await delay(delayTime);

            //undo the moves
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(delayTime);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);//then we update it
            wePos = updatePiecePos(we);
            await delay(delayTime);

        }
        else if(blueSpotsFace == "white"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);
            await delay(delayTime);

            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            await delay(delayTime);

            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//rotate yellow face
            await delay(delayTime);

            //undo the moves
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(delayTime);
            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            bePos = updatePiecePos(be);//then we update it
            wePos = updatePiecePos(we);
            await delay(delayTime);
        }
        else if(whiteSpotsFace != "white" && whiteSpotsFace != "yellow"){//(whiteSpotsFace == "blue" && blueSpotFace == "orange" || whiteSpotsFace == "green" && blueSpotFace == "red" || whiteSpotsFace == "orange" && blueSpotsFace == "green" || whiteSpotsFace == "red" && blueSpotsFace == "blue") 
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            wePos = updatePiecePos(we);
            await delay(delayTime);

            Rotate1DSquareMatrixClockwise(getFaceArray(wePos));
            wePos = updatePiecePos(we);
            await delay(delayTime);

            //turn piece back
            //purposly didnt update blue piece pos to remember which piece to turn back
            Rotate1DSquareMatrixClockwise(getFaceArray(bePos));
            bePos = updatePiecePos(be);//then we update it
            await delay(delayTime);
        }
        else if(whiteSpotsFace == "white" && blueSpotsFace != piece[0].slice(0,-2)){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(delayTime);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(delayTime);
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

                await delay(delayTime);
            }
            //white now on yellow face and blue is in blue. Turn twice
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(delayTime);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(bePos));
            await delay(delayTime);
        }
    }
    
    debugArea.addText("\nCROSS FINISHED")
    printCubeLayout();
}


async function F2LCFOP(){
    var pairNumber = 1;
    var updatePieces = [["orange0c","blue0c", "white0c", "orange4e", "blue4e"],["green1c","orange1c", "white1c","green5e","orange5e"],["red2c","green2c","white2c","red6e","green6e"],["blue3c","red3c","white3c","blue7e","red7e"]];
    debugArea.addText("\n\nSOLVING F2L...\n")


    var breakIteration = -1;
    for(let piece of updatePieces){
        breakIteration++;
        if(breakIteration == 0){}
        else if(breakIteration == 1){}
        else if(breakIteration == 2){}
        else if(breakIteration == 3){}


        //Corner("orange0c","blue0c","white0c");
        var oc = piece[0]
        var bc = piece[1];
        var wc = piece[2];

        var ocPos = updatePiecePos(oc);
        var bcPos = updatePiecePos(bc);
        var wcPos = updatePiecePos(wc);

        //Edge equivalent
        //Edge("orange4e","blue4e");
        var oe = piece[3];
        var be = piece[4];

        var oePos = updatePiecePos(oe);
        var bePos = updatePiecePos(be);
        for(let i = 0; i < 2; i++){//have to check twice because edge/corner can insert itself into the pocket
            if(getFaceString(oePos) != "yellow" && getFaceString(bePos) != "yellow"){//not on top with the corner piece, so you have to pull it out
                
                Rotate1DSquareMatrixCounterClockwise(getFaceArray(oePos));
                await delay(delayTime);

                bePos = updatePiecePos(be);
                var threeTurns = false;
                if(getFaceString(bePos) != "yellow"){
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(oePos));
                    await delay(delayTime);
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(oePos));
                    await delay(delayTime);
                    threeTurns = true;
                }

                Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//rotate yellow face with edge piece away
                if(threeTurns){
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(oePos));
                    await delay(delayTime);
                    threeTurns = true;
                }
                else{
                    Rotate1DSquareMatrixClockwise(getFaceArray(oePos));
                    await delay(delayTime);
                }
                oePos = updatePiecePos(oe);//now update
                bePos = updatePiecePos(be);
                ocPos = updatePiecePos(oc);
                bcPos = updatePiecePos(bc);
                wcPos = updatePiecePos(wc);

            }
            if(getFaceString(ocPos) != "yellow" && getFaceString(bcPos) != "yellow" && getFaceString(wcPos) != "yellow"){//corner is not on yellow top.
                var turnThisPos = null
                if(getFaceString(ocPos) != "white"){
                    turnThisPos = ocPos;
                } 
                else{//use bcPos because ocPos is on white 
                    turnThisPos = bcPos;
                }
                //rotate once...
                Rotate1DSquareMatrixCounterClockwise(getFaceArray(turnThisPos));
                await delay(delayTime);

                //updation
                ocPos = updatePiecePos(oc);
                bcPos = updatePiecePos(bc);
                wcPos = updatePiecePos(wc);

                var twoTurns = false;
                if(getFaceString(ocPos) != "yellow" && getFaceString(bcPos) != "yellow" && getFaceString(wcPos) != "yellow"){//still isnt there yet
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(turnThisPos));
                    await delay(delayTime);
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(turnThisPos));
                    await delay(delayTime);
                    twoTurns = true;
                }

                Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//rotate yellow face with edge piece away
                await delay(delayTime);
                //Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//twice to be safe
                //await delay(delayTime);

                if(twoTurns){
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(turnThisPos));
                    await delay(delayTime);
                }
                else{//undo the one turn
                    Rotate1DSquareMatrixClockwise(getFaceArray(turnThisPos));
                    await delay(delayTime);
                }

                //updation
                oePos = updatePiecePos(oe);//now update
                bePos = updatePiecePos(be);
                ocPos = updatePiecePos(oc);
                bcPos = updatePiecePos(bc);
                wcPos = updatePiecePos(wc);
            }//going to have to recheck the edge didnt just insert himself off of yellow. so now i++;
        }

        //now if theyre next to each other seperate them.
        //Ignore the edge color and corner color on yellow face.
        //if the other edge colors face == either of the other 2 corner colors face...
        //seperate them.

        var importantEdge = null;
        var importantEdgePos = null;
        if(getFaceString(oePos) != "yellow"){
            importantEdge = oe;
            importantEdgePos = oePos;
        }
        else{
            importantEdge = be;
            importantEdgePos = bePos;
        }

        var importantCorner1 = null;
        var importantCornerPos1 = null;
        var importantCorner2 = null;
        var importantCornerPos2 = null;

        if(getFaceString(ocPos) == "yellow"){
            importantCorner1 = bc;
            importantCornerPos1 = bcPos;
            importantCorner2 = wc;
            importantCornerPos2 = wcPos;
        }
        else if(getFaceString(bcPos) == "yellow"){
            importantCorner1 = oc;
            importantCornerPos1 = ocPos;
            importantCorner2 = wc;
            importantCornerPos2 = wcPos;
        }
        else{//wc == yellow
            importantCorner1 = oc;
            importantCornerPos1 = ocPos;
            importantCorner2 = bc;
            importantCornerPos2 = bcPos;
        }
        var turnThis = null;
        var turnThisPos = null;
        var needsToSeeYellowPos = null;//this var when put into getFaceString() needs to be white to know you turned the correct amount of times.
        var needsToSeeYellow = null

        var nextToEachOther = false;
        if(getFaceString(importantEdgePos) == getFaceString(importantCornerPos1)){//next to each other
            //importantCorner1 is the same, so turn that face
            nextToEachOther = true;
            turnThis = importantCorner1;
            turnThisPos = importantCornerPos1;
            needsToSeeYellowPos = importantCornerPos2;
            needsToSeeYellow = importantCorner2;
        }
        else if(getFaceString(importantEdgePos) == getFaceString(importantCornerPos2)){//next to each other
            //importantCorner2 is the same, so turn that face
            nextToEachOther = true;
            turnThis = importantCorner2;
            turnThisPos = importantCornerPos2;
            needsToSeeYellowPos = importantCornerPos1;
            needsToSeeYellow = importantCorner1;
        }
        if(nextToEachOther){
            //turn it clockwise, if 

                
            //corner needs to be pulled down where it doesnt mess up any other edges
            while(!((getFaceString(importantCornerPos1) == oc.slice(0,-2) || getFaceString(importantCornerPos1) == bc.slice(0,-2)) && (getFaceString(importantCornerPos2) == oc.slice(0,-2) || getFaceString(importantCornerPos2) == bc.slice(0,-2)))){
                Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                await delay(delayTime);

                importantCornerPos1 = updatePiecePos(importantCorner1);
                importantCornerPos2 = updatePiecePos(importantCorner2)
            }

            /*
            //corner needs to be pulled down where it doesnt mess up any other edges
            while(getFaceString(importantEdgePos) != importantEdge.slice(0,-2)){
                Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                await delay(delayTime);

                importantEdgePos = updatePiecePos(importantEdge);
            }*/
            //now its over right spot
            turnThisPos = updatePiecePos(turnThis);

            Rotate1DSquareMatrixClockwise(getFaceArray(turnThisPos));
            await delay(delayTime);

            needsToSeeYellowPos = updatePiecePos(needsToSeeYellow);

            var threeTurn = false;
            if(getFaceString(needsToSeeYellowPos) != "yellow"){//then spin it 2 more times.
                Rotate1DSquareMatrixClockwise(getFaceArray(turnThisPos));
                await delay(delayTime);
                Rotate1DSquareMatrixClockwise(getFaceArray(turnThisPos));
                await delay(delayTime);
                threeTurn = true;
            }

            //rotate yellow twice:
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//rotate yellow face with edge piece away
            await delay(delayTime);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));//twice to be safe
            await delay(delayTime);

            if(threeTurn){//go one more to make full loop to return everything back to normal
                Rotate1DSquareMatrixClockwise(getFaceArray(turnThisPos));
                await delay(delayTime);
            }
            else{//do one backwards to undo the one turn
                Rotate1DSquareMatrixCounterClockwise(getFaceArray(turnThisPos));
                await delay(delayTime);
            }

            //updation
            ocPos = updatePiecePos(oc);
            bcPos = updatePiecePos(bc);
            wcPos = updatePiecePos(wc);

            oePos = updatePiecePos(oe);
            bePos = updatePiecePos(be);
        }
        
        for(let i = 0; i < 2; i++){//twice because may put self in scenario where white is up after second if hits
            //Scenarios:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //white up-----------------
            if(getFaceString(wcPos) == "yellow"){
                var yellowUpEdge = null;
                var yellowUpEdgePos = null;
                if(getFaceString(oePos) == "yellow"){
                    importantEdge = be;
                    importantEdgePos = bePos;
                    yellowUpEdge = oe;
                    yellowUpEdgePos = oePos;
                }
                else{
                    importantEdge = oe;
                    importantEdgePos = oePos;
                    yellowUpEdge = be;
                    yellowUpEdgePos = bePos;
                }

                
                while(getFaceString(importantEdgePos) != importantEdge.slice(0,-2)){//get over right spot
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);

                    importantEdgePos = updatePiecePos(importantEdge);
                }
                //set over right spot now...
                
                //turn one direction...
                Rotate1DSquareMatrixClockwise(getFaceArray(importantEdgePos));
                await delay(delayTime);
                yellowUpEdgePos = updatePiecePos(yellowUpEdge);

                //update yeh
                ocPos = updatePiecePos(oc);
                bcPos = updatePiecePos(bc);
                wcPos = updatePiecePos(wc);

                oePos = updatePiecePos(oe);
                bePos = updatePiecePos(be);

                //check in right spot
                threeTurn = false;
                if(getFaceString(yellowUpEdgePos) ==  yellowUpEdge.slice(0,-2)){
                    //then turn 2 more times
                    threeTurn = true;
                    Rotate1DSquareMatrixClockwise(getFaceArray(importantEdgePos));
                    await delay(delayTime);
                    Rotate1DSquareMatrixClockwise(getFaceArray(importantEdgePos));
                    await delay(delayTime);
                    yellowUpEdgePos = updatePiecePos(yellowUpEdge);
                }

                //check which corner peice needs to line up
                if(importantEdge.slice(0,-2) == oc.slice(0,-2)){
                    importantCorner1 = oc;
                    importantCornerPos1 = ocPos;
                }
                else if(importantEdge.slice(0,-2) == bc.slice(0,-2)){
                    importantCorner1 = bc;
                    importantCornerPos1 = bcPos;
                }
                else{//importantEdge.slice(0,-2) == wc.slice(0,-2)
                    importantCorner1 = wc;
                    importantCornerPos1 = wcPos;
                }

                while(getFaceString(importantCornerPos1) != importantCorner1.slice(0,-2)){
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);

                    importantCornerPos1 = updatePiecePos(importantCorner1);
                }
                //now on top of each other, just need to undo the turn

                if(threeTurn){
                    Rotate1DSquareMatrixClockwise(getFaceArray(importantEdgePos));
                    await delay(delayTime);
                }
                else{
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(importantEdgePos));
                    await delay(delayTime);
                }
            }
            else if (i == 0){//For same up and opposite up...
                //what im thinking is pull down and put next to each other
                //if they make a perfect pair then awesome.
                //if they dont... then make it the whites up situtation by adding like 3 moves.

                //Same Up/Opposite Up------------------------------------------

                //first put them near each other.
                if(getFaceString(ocPos) == "yellow"){
                    importantCorner1 = bc;
                    importantCornerPos1 = bcPos;
                    importantCorner2 = oc;//on yellow face
                    importantCornerPos2 = ocPos;//on yellow face
                }
                else if(getFaceString(bcPos) == "yellow"){//// wc cant be yellow face because we wouldnt have made it here.
                    importantCorner1 = oc;
                    importantCornerPos1 = ocPos;
                    importantCorner2 = bc;//on yellow face
                    importantCornerPos2 = bcPos;//on yellow face
                }

                while(getFaceString(wcPos) != importantCorner1.slice(0,-2)){
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);

                    wcPos = updatePiecePos(wc);
                }
                //now were able to pull down to get edge and corner to each other.
                Rotate1DSquareMatrixClockwise(getFaceArray(wcPos));
                await delay(delayTime);
                //we try one direction and see if importantCorner is on face yellow, if so then turn 2 more times.
                importantCornerPos1 = updatePiecePos(importantCorner1);
                twoTurns = false;
                if(getFaceString(importantCornerPos1) == "yellow"){
                    //then turn 2 more times
                    Rotate1DSquareMatrixClockwise(getFaceArray(wcPos));
                    await delay(delayTime);
                    Rotate1DSquareMatrixClockwise(getFaceArray(wcPos));
                    await delay(delayTime);
                    importantCornerPos1 = updatePiecePos(importantCorner1);
                    twoTurns = true;
                }
                //update 
                importantCornerPos1 = updatePiecePos(importantCorner1);
                importantCornerPos2 = updatePiecePos(importantCorner2);//yellow face
                
                //updation
                ocPos = updatePiecePos(oc);
                bcPos = updatePiecePos(bc);
                wcPos = updatePiecePos(wc);

                oePos = updatePiecePos(oe);
                bePos = updatePiecePos(be);

                //now find where the edge. when the side of the edge that isnt on yellow face
                //is on the face that importantCornerPos2 is then stop

                var importantEdgeYellow = null;
                var importantEdgeYellowPos = null;
                if(getFaceString(oePos) == "yellow"){
                    importantEdge = be;
                    importantEdgePos = bePos;
                    importantEdgeYellow = oe;
                    importantEdgeYellowPos = oePos;
                }
                else{
                    importantEdge = oe;
                    importantEdgePos = oePos;
                    importantEdgeYellow = be;
                    importantEdgeYellowPos = bePos;
                }

                while(getFaceString(importantEdgePos) != getFaceString(importantCornerPos2) && getFaceString(importantEdgePos) != getFaceString(importantCornerPos1)){
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);

                    importantEdgePos = updatePiecePos(importantEdge);
                }
                //edge in right spot so go back up
                if(twoTurns){
                    Rotate1DSquareMatrixClockwise(getFaceArray(wcPos));
                    await delay(delayTime);
                }
                else{
                    Rotate1DSquareMatrixCounterClockwise(getFaceArray(wcPos));
                    await delay(delayTime);
                }
                //now they are back together.
                //if they are not mismatch then continue. if they are then turn it into case 1.

                //updation
                ocPos = updatePiecePos(oc);
                bcPos = updatePiecePos(bc);
                wcPos = updatePiecePos(wc);

                oePos = updatePiecePos(oe);
                bePos = updatePiecePos(be);
                //update 
                importantCornerPos1 = updatePiecePos(importantCorner1);
                importantCornerPos2 = updatePiecePos(importantCorner2);//yellow face
                
                if(importantEdgeYellow.slice(0,-2)!= importantCorner2.slice(0,-2)){//mismatch

                //corner needs to be pulled down where it doesnt mess up any other edges
                while(getFaceString(importantCornerPos1) != importantCorner1.slice(0,-2)){
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);

                    importantCornerPos1 = updatePiecePos(importantCorner1);
                }
                    
                    importantCornerPos1 = updatePiecePos(importantCorner1);
                    importantCornerPos2 = updatePiecePos(importantCorner2);//yellow face


                    Rotate1DSquareMatrixClockwise(getFaceArray(importantCornerPos1));
                    await delay(delayTime);

                    wcPos = updatePiecePos(wc);

                    twoTurns = false;
                    if(getFaceString(wcPos) != "yellow"){//rotated the wrong way so rotate twice
                        twoTurns = true;
                        Rotate1DSquareMatrixClockwise(getFaceArray(importantCornerPos1));
                        await delay(delayTime);
                        Rotate1DSquareMatrixClockwise(getFaceArray(importantCornerPos1));
                        await delay(delayTime);
                    }

                    //turn yellow away twice
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);
                    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                    await delay(delayTime);

                    if(twoTurns){
                        Rotate1DSquareMatrixClockwise(getFaceArray(importantCornerPos1));
                        await delay(delayTime);
                    }
                    else{
                        Rotate1DSquareMatrixCounterClockwise(getFaceArray(importantCornerPos1));
                        await delay(delayTime);
                    }

                }
            }

            //updation
            ocPos = updatePiecePos(oc);
            bcPos = updatePiecePos(bc);
            wcPos = updatePiecePos(wc);

            oePos = updatePiecePos(oe);
            bePos = updatePiecePos(be);
        }



        //PAIR MADE! : INSERT----------------------------------------------------
        //updation
        ocPos = updatePiecePos(oc);
        bcPos = updatePiecePos(bc);
        wcPos = updatePiecePos(wc);

        oePos = updatePiecePos(oe);
        bePos = updatePiecePos(be);
    

        var notYellow = null;
        var notYellowPos = null;
        if(getFaceString(oePos) == "yellow"){//important edge meaning this edge must match the edge that is getFaceString(notYellow).
            importantEdge = oe;
            importantEdgePos = oePos;
            notYellow = be;
            notYellowPos = bePos;
        }
        else{
            importantEdge = be;
            importantEdgePos = bePos;
            notYellow = oe;
            notYellowPos = oePos;
        }

        while(importantEdge.slice(0,-2) != getFaceString(notYellowPos)){
            //rotate yellow
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
            await delay(delayTime);

            notYellowPos = updatePiecePos(notYellow);
        }
        //now over right hole...
        //then rotate face of the color of notYellow
        Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos(notYellow.slice(0,-2) + "CC")));
        await delay(delayTime);

        //we started with clockwise turn. so yellow must turn counter clockwise to insert
        //however, after doing this, if not yellow is not in their corresponding face, then undo these moves.
        //we must then start with a counter clockwise turn instead. and a yellow clockwise turn.

        //do yellow turn
        Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
        await delay(delayTime);
        notYellowPos = updatePiecePos(notYellow);

        if(getFaceString(notYellowPos) != notYellow.slice(0,-2)){//we went the wrong way...
            //undo
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
            await delay(delayTime);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos(notYellow.slice(0,-2) + "CC")));
            await delay(delayTime);
            notYellowPos = updatePiecePos(notYellow);

            //then go the other way
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos(notYellow.slice(0,-2) + "CC")));
            await delay(delayTime);
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
            await delay(delayTime);
            
            //finish off with final turn back down
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos(notYellow.slice(0,-2) + "CC")));
            await delay(delayTime);
        }
        else{//we went the right way
            //finish off with final turn down
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos(notYellow.slice(0,-2) + "CC")));
            await delay(delayTime);

        }
        debugArea.addText("\n");
        debugArea.addText("PAIR " +pairNumber + " INSERTED - Corner: " + oc + ", " + bc + ", " + wc + " - Edge: " + oe + ", " + be)
        await printCubeLayout();
        debugArea.addText("\n");
        pairNumber++;
    }

    debugArea.addText("\nF2L FINISHED\n")
}


async function yellowEdgeOrientateL(edge0,edge1){//edge0: wrong edge facing you, edge1: wrong edge on right side
    var ye0 = edge0.right;
    var ye1 = edge1.right;
    var ye0Pos = updatePiecePos(ye0);
    var ye1Pos = updatePiecePos(ye1);

    Rotate1DSquareMatrixClockwise(getFaceArray(ye0Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(ye1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(ye1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(ye0Pos));
    await delay(delayTime);
}

async function yellowEdgeOrientateStraight(edge0,edge1){//edge0: wrong edge facing you, edge1: correct edge on right side
    var ye0 = edge0.right;
    var ye1 = edge1.left;
    var ye0Pos = updatePiecePos(ye0);
    var ye1Pos = updatePiecePos(ye1);

    Rotate1DSquareMatrixClockwise(getFaceArray(ye0Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(ye1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(ye1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(ye0Pos));
    await delay(delayTime);

}

//DRULDRU,
async function yellowCornerRotation(corner0,corner1){
    var notYellowCorner0 = null
    var notYellowCorner0Pos = null;
    if(getFaceString(updatePiecePos(corner0.right)) != "yellow"){//then save this side
        notYellowCorner0 = corner0.right;
    }
    else{
        notYellowCorner0 = corner0.left;
    }
    notYellowCorner0Pos = updatePiecePos(notYellowCorner0);


    //save coord of where notYellowCord is because need to put yellow piece there later
    var oldNotYellowCorner0Pos = notYellowCorner0Pos;


    //DRULDRU

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(notYellowCorner0Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("whiteCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(notYellowCorner0Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("whiteCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(notYellowCorner0Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("whiteCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(notYellowCorner0Pos));
    await delay(delayTime);


    var notYellowCorner1 = null;
    var notYellowCorner1Pos = null;
    var yellowCorner1 = corner1.top;
    var yellowCorner1Pos = updatePiecePos(yellowCorner1);

    /*
    if(getFaceString(yellowCorner1Pos) != "yellow"){//then save this side
        notYellowCorner1 = corner1.right;
    }
    else{
        notYellowCorner1 = corner1.left;
    }
    notYellowCorner1Pos = updatePiecePos(notYellowCorner1);*/
    //notYellowCorner1Pos dodesnt even need to be used

    while(yellowCorner1Pos != oldNotYellowCorner0Pos){
        //keep rotating yellow till its there
        Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
        await delay(delayTime);

        yellowCorner1Pos = updatePiecePos(yellowCorner1);
    }
    yellowCorner1Pos = updatePiecePos(yellowCorner1);

    //Then DLURDLU

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(yellowCorner1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("whiteCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(yellowCorner1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("whiteCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(yellowCorner1Pos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("whiteCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(yellowCorner1Pos));
    await delay(delayTime);

}

//three on left side... start with the middle left piece
//DLULDLLU
async function threePieceCornerRotationLeft(cornerPos){
    //send them in the order where corner0 is the corner we need to do the operation on.

    //var yellowCorner = corner0.top;
    //var yellowCornerPos = updatePiecePos(yellowCorner);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

}


//URDRURRD
//send in the yellow middle corner found, thats the face moving
async function threePieceCornerRotationRight(cornerPos){

    Rotate1DSquareMatrixClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(cornerPos));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
    await delay(delayTime);

    Rotate1DSquareMatrixCounterClockwise(getFaceArray(cornerPos));
    await delay(delayTime);
}

async function OLLCFOP(){
    debugArea.addText("\nSTARTING OLL");

    //first is getting edges facing up
    //3 scenarios: L, Straight, None

    var yellowEdge0 = edge8;//blue //.right is yellow side
    var yellowEdge1 = edge9;//orange
    var yellowEdge2 = edge10;//green
    var yellowEdge3 = edge11;//red

    var yellowEdges = [yellowEdge0,yellowEdge1,yellowEdge2,yellowEdge3];
    var edgesFacingRightWay = [];
    var edgesFacingWrongWay = [];

    for(let edge of yellowEdges){
        if(getFaceString(updatePiecePos(edge.right)) == "yellow"){
            edgesFacingRightWay.push(edge);
        }
        else{
            edgesFacingWrongWay.push(edge);
        }
    }

    if(edgesFacingRightWay.length == 0){

        //let oneEdge = yellowEdge0;
        //let ye0
        let wrongFacingForward = squareDict["4,0"];
        let edgeFacingForward = getPieceFromId(wrongFacingForward);
        let wrongFacingRight = squareDict["8,4"];
        let edgeFacingRight = getPieceFromId(wrongFacingRight);

        await yellowEdgeOrientateL(edgeFacingForward,edgeFacingRight);
        //recalculate:
        edgesFacingRightWay.length = 0;
        edgesFacingWrongWay.length = 0;
        for(let edge of yellowEdges){
            if(getFaceString(updatePiecePos(edge.right)) == "yellow"){
                edgesFacingRightWay.push(edge);
            }
            else{
                edgesFacingWrongWay.push(edge);
            }
        }
    }

    if(edgesFacingRightWay.length != 4){
        var ye0 = edgesFacingRightWay[0].right;
        var ye1 = edgesFacingRightWay[1].right;
        var ye0Pos = updatePiecePos(ye0);
        var ye1Pos = updatePiecePos(ye1);

        //L: x and y position only differ by 1
        let arr0 = ye0Pos.split(',').map(Number);
        let arr1 = ye1Pos.split(',').map(Number);

        let dx = Math.abs(arr0[0] - arr1[0]);
        let dy = Math.abs(arr0[1] - arr1[1]);
        if(dx == 1 && dy == 1){//L orientation
            //turn yellow top till these pieces are on left and top
            while(!((ye0Pos == "9,4" || ye0Pos == "10,3") && (ye1Pos == "9,4" || ye1Pos == "10,3"))){
                Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                await delay(delayTime);

                ye0Pos = updatePiecePos(ye0);
                ye1Pos = updatePiecePos(ye1);
            }
            //orientated correctly

            let wrongEdge0 = edgesFacingWrongWay[0].left;
            let wrongEdge1 = edgesFacingWrongWay[1].left;
            let wrongEdge0Pos = updatePiecePos(wrongEdge0);
            let wrongEdge1Pos = updatePiecePos(wrongEdge1);

            let wrongArr0 = wrongEdge0Pos.split(',').map(Number);
            let wrongArr1 = wrongEdge1Pos.split(',').map(Number);

            if(wrongArr0[0] > wrongArr1[0]){//if x of 0 is greater, then wrongEdge0 is on right side
                await yellowEdgeOrientateL(edgesFacingWrongWay[1], edgesFacingWrongWay[0]);
            }
            else{
                await yellowEdgeOrientateL(edgesFacingWrongWay[0], edgesFacingWrongWay[1]);
            }

        }
        else{//were dealing with straight
            //turn yellow till its going left to right
            while(!((ye0Pos == "9,4" || ye0Pos == "11,4") && (ye1Pos == "9,4" || ye1Pos == "11,4"))){
                Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
                await delay(delayTime);

                ye0Pos = updatePiecePos(ye0);
                ye1Pos = updatePiecePos(ye1);
            }
            //orientated correctly

            arr0 = ye0Pos.split(',').map(Number);
            arr1 = ye1Pos.split(',').map(Number);


            let sendRightSideEdge = null
            if(arr0[0] < arr1[0]){//arr1's x is greater so its on the right side and needs to be sent into function
                sendRightSideEdge = edgesFacingRightWay[1];
            }
            else{
                sendRightSideEdge = edgesFacingRightWay[0];
            }

            //get wrong side facing you:
            let wrongEdge0 = edgesFacingWrongWay[0].left;
            let wrongEdge1 = edgesFacingWrongWay[1].left;
            let wrongEdge0Pos = updatePiecePos(wrongEdge0);
            let wrongEdge1Pos = updatePiecePos(wrongEdge1);

            let wrongArr0 = wrongEdge0Pos.split(',').map(Number);
            let wrongArr1 = wrongEdge1Pos.split(',').map(Number);

            let sendBottomSideEdge = null;
            if(wrongArr0[1] < wrongArr1[1]){//arr0 is higher so send in the other one
                sendBottomSideEdge = edgesFacingWrongWay[1];
            }
            else{
                sendBottomSideEdge = edgesFacingWrongWay[0];
            }

            await yellowEdgeOrientateStraight(sendBottomSideEdge, sendRightSideEdge);

        }

    }

    debugArea.addText("\nYELLOW EDGES FINISHED");
    await printCubeLayout();


    //then corners facing up
    var yellowCorner1 = cornerPiece4; //top is yellow
    var yellowCorner2 = cornerPiece5;
    var yellowCorner3 = cornerPiece6;
    var yellowCorner4 = cornerPiece7;
    var yellowCorners = [cornerPiece4,cornerPiece5,cornerPiece6,cornerPiece7];

    var notFacingRightWay = []
    var rightSide = [];//facing wrong way but yellow is facing you on the right side
    var leftSide = [];
    
    for(let corner of yellowCorners){
        if(getFaceString(updatePiecePos(corner.top)) != "yellow"){
            notFacingRightWay.push(corner);
            var yellowLocation = updatePiecePos(corner.top);
            if(yellowLocation == "5,0" || yellowLocation == "0,3" ||yellowLocation == "3,8" ||yellowLocation == "8,5"){
                rightSide.push(corner);
            }
            else{
                leftSide.push(corner);
            }
        }
    }
    if(rightSide.length == leftSide.length){
        debugArea.addText("\n\nEVEN CORNERS\n");
        for(let i = 0 ; i < rightSide.length; i++){
            await yellowCornerRotation(rightSide[i],leftSide[i]);
        }
    }
    else if(leftSide.length > rightSide.length){//DLULDLLU, Just need to know where to start, probably make an new function...
        debugArea.addText("\n\nLEFT CORNERS\n");
        arrOrder = [];
        //3,0  8,3  5,8  0,5
        var leftCorners = ["3,0","8,3","5,8","0,5"];

        let startAdding = false;
        while(arrOrder.length != 4){
            for(let corner of leftCorners){
                if(!arrOrder.includes(corner)){
                    if(squareDict[corner].slice(0,-2) != "yellow"){
                        startAdding = true;
                        arrOrder.push(corner);
                    }
                    else if(startAdding){
                        arrOrder.push(corner);
                    }
                }
            }
        }

        //arrOrder: {Right, Wrong, Wrong, Wrong} where ther 2nd wrong is the one i need to start the operation on

        await threePieceCornerRotationLeft(arrOrder[2]);
    }
    else if(rightSide.length > leftSide.length){//URDRURRD
        debugArea.addText("\n\nRIGHT CORNERS\n");

        arrOrder = [];
        //3,0  8,3  5,8  0,5
        var rightCorners = ["5,0","8,5","3,8","0,3"];

        let startAdding = false;
        while(arrOrder.length != 4){
            for(let corner of rightCorners){
                if(!arrOrder.includes(corner)){
                    if(squareDict[corner].slice(0,-2) != "yellow"){
                        startAdding = true;
                        arrOrder.push(corner);
                    }
                    else if(startAdding){
                        arrOrder.push(corner);
                    }
                }
            }
        }

        //arrOrder: {Right, Wrong, Wrong, Wrong} where ther 2nd wrong is the one i need to start the operation on

        await threePieceCornerRotationRight(arrOrder[2]);
    }
    debugArea.addText("\nCORNERS/EDGES ORIENTED")
    await printCubeLayout();
    debugArea.addText("\n\n")

}

function getData(){
    var data = "";
    //var locations = ["3,0","4,0","5,0","8,3","8,4","8,5","5,8","4,8","3,8","0,5","0,4","0,3"];
    var locations = ["3,8","4,8","5,8","8,5","8,4","8,3","5,0","4,0","3,0","0,3","0,4","0,5"];
    for(let loc of locations){
        data+=(squareDict[loc])[0];
    }

    //debugArea.addText(data);
    return data;
}

function makeSequence(data){//data = "BBGROGBO..." turned into "WWXYZXWZ...""
    //WXYZ
    var ordering = [];
    for(var color of data){
        if(!ordering.includes(color)){
            ordering.push(color);
        }
        if(ordering.length == 4){
            break;
        }
    }

    //now ordering has the 4 colors in the order they appear in sequence

    var ans = data;
    ans = ans.replaceAll(ordering[0], "W");
    ans = ans.replaceAll(ordering[1], "X");
    ans = ans.replaceAll(ordering[2], "Y");
    ans = ans.replaceAll(ordering[3], "Z");

    //debugArea.addText(ans);
    return ans;
}

function matchSequence(sequence){
    //Aa
    if(sequence == "WXYZWWYYZXZX"){
        //debugArea.addText("Aa");
        return "Aa-L L B B L' F' L B B L' F L'";
    }
    //Ab
    if(sequence == "WXXYYWXZYZWZ"){
        //debugArea.addText("Ab");
        return "Ab-L L F F L B L' F F L B' L";
    }
    //F
    if(sequence == "WXYXYWYWXZZZ"){
        //debugArea.addText("F");
        return "F-R' U' F' R U R' U' R' F R R U' R' U' R U R' U R";
    }
    //Ga
    if(sequence == "WXYXZWYYXZWZ"){
        //debugArea.addText("Ga");
        //return "Ga-U U R R U R' U R' U' R U' R R U' D R' U R D'";
        return "Ga-R R U R' U R' U' R U' R R U' D R' U R D'";
    }
    //Gb
    if(sequence == "WXYZZWYWZXYX"){
        //debugArea.addText("Gb");
        return "Gb-R' U' R U D' R R U R' U R U' R U' R R D";
    }
    //Gc
    if(sequence == "WXXYZWXWYZYZ"){
        //debugArea.addText("Gc");
        return "Gc-R R U' R U' R U R' U R R U D' R U' R' D";
    }
    //Gd
    if(sequence == "WXYXWWYZXZYZ"){
        //debugArea.addText("Gd");
        return "Gd-R U R' U' D R R U' R U' R' U R' U R R D'";
    }
    //Ja
    if(sequence == "WXXYWWXYYZZZ"){
        //debugArea.addText("Ja");
        return "Ja-R R D R D' R F F L' U L F F";
        return "Ja-x R R F R F' R U U r' U r U U"
        //return "Ja-R R D R D' R F F L U L' F F";
        //return "Ja-R R D R D' R F F U F F";
    }
    //Jb
    if(sequence == "WWXYYWXXYZZZ"){
        //debugArea.addText("Jb");
        return "Jb-R U R' F' R U R' U' R' F R R U' R'";
    }
    //Ra
    if(sequence == "WXYZYWYZZXWX"){
        //debugArea.addText("Ra");
        return "Ra-R U' R' U' R U R D R' U' R D' R' U U R'";
    }
    //Rb
    if(sequence == "WWXYXWXZYZYZ"){
        //debugArea.addText("Rb");
        return "Rb-R R F R U R U' R' F' R U U R' U U R";
    }
    //T
    if(sequence == "WWXYZWXYYZXZ"){
        //debugArea.addText("T");
        return "T-R U R' U' R' F R R U' R' U' R U R' F'";
    }
    //E
    if(sequence == "WXYZYXYZWXWZ"){
        //debugArea.addText("E");
        return "E-L' B L F' L' B' L F L' B' L F' L' B L F";
    }
    //Na
    if(sequence == "WWXYYZXXWZZY"){
        //debugArea.addText("Na");
        return "Na-R U R' U R U R' F' R U R' U' R' F R R U' R' U U R U' R'";
    }
    //Nb
    if(sequence == "WXXYZZXWWZYY"){
        //debugArea.addText("Nb");
        return "Nb-R' U R U' R' F' U' F R U R' F R' F' R U' R";
    }
    //V
    if(sequence == "WXYXYZYWWZZX"){
        //debugArea.addText("V");
        return "V-R' U R' U' B' R' B B U' B' U B' R B R";
    }
    //Y
    if(sequence == "WXYZZXYWWXYZ"){
        //debugArea.addText("Y");
        return "Y-F R U' R' U' R U R' F' R U R' U' R' F R F'";
    }
    //H
    if(sequence == "WXWYZYXWXZYZ"){
        //debugArea.addText("H");
        return "H-M M D M M U U M M D M M";
    }
    //Ua
    if(sequence == "WWWXYXZXZYZY"){
        //debugArea.addText("UA");
        return "Ua-M M D M F F M' D M M";
    }

    //Ub
    if(sequence == "WWWXYXYZYZXZ"){
        //debugArea.addText("Ub");
        return "Ub-M M D' M F F M' D' M M";
    }
    //Z
    if(sequence == "WXWXWXYZYZYZ"){
        //debugArea.addText("Z");
        return "Z-M' F M M B M M F M' D D M M";
    }

    return "";
}

async function doInstruction(PLLSequence){
    let sequence = PLLSequence.split("-")[0];
    let instr = PLLSequence.split("-")[1];

    let instructions = instr.split(" ")
    for(let currInstr of instructions){
        if(currInstr == "L"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("orangeCC")));
            await delay(delayTime);
        }
        else if(currInstr == "L'"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("orangeCC")));
            await delay(delayTime);
        }
        else if(currInstr == "R"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("redCC")));
            await delay(delayTime);
        }
        else if(currInstr == "R'"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("redCC")));
            await delay(delayTime);
        }
        else if(currInstr == "F"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("blueCC")));
            await delay(delayTime);
        }
        else if(currInstr == "F'"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("blueCC")));
            await delay(delayTime);
        }
        else if(currInstr == "U"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
            await delay(delayTime);
        }
        else if(currInstr == "U'"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
            await delay(delayTime);
        }
        else if(currInstr == "D"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("whiteCC")));
            await delay(delayTime);
        }
        else if(currInstr == "D'"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("whiteCC")));
            await delay(delayTime);
        }
        else if(currInstr == "B"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("greenCC")));
            await delay(delayTime);
        }
        else if(currInstr == "B'"){
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("greenCC")));
            await delay(delayTime);
        }
        else if(currInstr == "M"){//top goes down
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("orangeCC")));
            await delay(delayTime);
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("redCC")));
            await delay(delayTime);

        }
        else if(currInstr == "M'"){
            Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("orangeCC")));
            await delay(delayTime);
            Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("redCC")));
            await delay(delayTime);
        }
        else{
            throw error();
        }
    }
    

}

async function PLLCFOP(){

    var foundSequence = false;
    var PLLSequence = ""
    var count = 0;
    while(PLLSequence == ""){
        count++;
        if(count == 5){//already solved just maybe 1-2 turns of yellow away
            break;
        }
        Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
        await delay(delayTime);

        var data = getData();
        var sequence = makeSequence(data);

        PLLSequence = matchSequence(sequence);

    }
    

    //Rotate1DSquareMatrixCounterClockwise(getFaceArray(updatePiecePos("yellowCC")));
    //await delay(delayTime);

    if(count != 5){
        debugArea.addText("\nFound PLL Pattern: " + PLLSequence+"\n");
        await doInstruction(PLLSequence);
    }

    //turn till right
    while(squareDict["3,0"].slice(0,-2) != "blue"){
        Rotate1DSquareMatrixClockwise(getFaceArray(updatePiecePos("yellowCC")));
        await delay(delayTime);
    }
}

async function isSolved(){
    for(let key in squareDict){
        if(squareDict[key] !== finishedCube[key]){
            return false;
        }
    }
    solvingValues.push(document.getElementById("turnNumberLabel").textContent);

    let localStorageTurns = localStorage["turnNumbers"];
    if(localStorageTurns == undefined){
        localStorageTurns = document.getElementById("turnNumberLabel").textContent + ",";
    }
    else{
        localStorageTurns += document.getElementById("turnNumberLabel").textContent + ",";
    }
    localStorage["turnNumbers"] = localStorageTurns; 

    await graphChart();
    return true;
}