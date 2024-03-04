"use strict"




//*************MODEL*************** */

const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;
let model = [];
let nextGen = [];




function createModel(){
    let grid=[];
    for (let row = 0; row < GRID_HEIGHT; row++) {
        let newRow = [];
        for (let col = 0; col < GRID_WIDTH; col++) {
            newRow[col] = 0;
            
        }   
        grid[row] = newRow;
    }
    return grid
}

function randomizeBoard(){
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if(Math.random()<0.15){
                writeToCell(row,col,1)
            }else{
                writeToCell(row,col,0)
            }
        }   
    }
}
function addRandomToBoard(){
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if(Math.random()<0.15){
                writeToCell(row,col,1)
            }
        }   
    }
}





function writeToCell(row,col,value){
    model[row][col] = value;
}
function readFromCell(row,col){
    return model[row][col];
}


function countNeighbors(row, col){
    let count = 0;
    for(let y =-1; y<=1; y++){
         for(let x =-1;x<=1;x++){

            if(x===0&&y===0)continue;//skip cell

            const nbRow = row+y;
            const nbCol = col + x;

            if(nbRow >= 0 && nbRow < GRID_HEIGHT &&
                nbCol >= 0 && nbCol < GRID_WIDTH){
                count +=readFromCell(nbRow,nbCol)
            }
        }
    }
    return count;
}

function mutate(row,col){
    const nbs = countNeighbors(row,col);
    if(nbs< 2 || nbs > 3){
        nextGen[row][col]=0
    }
    if(nbs == 3){
        nextGen[row][col]=1
    }
    if(nbs == 2){
        nextGen[row][col]=model[row][col]
    }
}


//************Controller**************** */
window.addEventListener("load",start())
let roundCounter = 0;

function start(){
    const btn = document.querySelector("#kill");
    const btn2 = document.querySelector("#reset");
    const btn3 = document.querySelector("#addRandom");
    btn.addEventListener("click",killAll)
    btn2.addEventListener("click",reset)
    btn3.addEventListener("click",addRandomToBoard)
    console.log('started');
    createBoard();
    model = createModel();
    randomizeBoard();
    updateView();
    setInterval(function(){
        playRound();
        incrRoundCount();
    },500);

}

function playRound(){
    nextGen = createModel();
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            mutate(row,col)
        }   
    }
    model = nextGen;
    updateView();
}
function killAll(){
    model = createModel();
    nextGen = createModel();
    updateView();
}

function reset(){
    model = createModel();
    randomizeBoard()
    roundCounter = 0;
}





//************************VIEW******************


function createBoard(){//VIEW**********
    const board = document.querySelector("#board");
    board.style.setProperty("--GRID_WIDTH",GRID_WIDTH)

    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            board.appendChild(cell)
        }   
    }
}

function updateView(){
    const cells = document.querySelectorAll(".cell")
    for (let index = 0; index < cells.length; index++) {
        if(model[Math.floor(index/GRID_WIDTH)][index%GRID_WIDTH]==1){
            cells[index].style.backgroundColor = "#000000";
        }else{
            cells[index].style.backgroundColor = "#888888";
        }
    }
}
function incrRoundCount(){
    roundCounter++; 
    const roundCountElement = document.querySelector("#roundCount");
    roundCountElement.textContent = roundCounter; 
}