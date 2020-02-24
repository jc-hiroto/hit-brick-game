var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var m = Math;
var x = canvas.width/2;
var y = canvas.height-40;
var startcheck = false;
var pause = false;
var speedVal = 3;
var dxReset = speedVal*1.5;
var dyReset = speedVal*(-1);
var ballSpeed = m.sqrt(dxReset**2 + dyReset**2);
var dx = dxReset;
var dy = dyReset;
var ballRad = 10;
var speed = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var downPressed = false;
var level = 3;
var brickRow = level;
var brickCol = 5;
var totalBrick = 0;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var hitPoint = 6;
var lives = 3;
var bricks = [];
var senVal = 3;
var deadFlag = false;
var KEYCODE_ESC = 27;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove",mouseMoveHandler, false);

function getRandom(min,max){
    return m.floor(m.random()*(max-min+1))+min;
};

function brickInit(){
    totalBrick = 0;
    level = document.getElementById("levelSel").value;
    brickRow = level;
    for(var col = 0; col<brickCol; col++){
        bricks[col] = [];
        for(var row = 0; row<brickRow; row++){
            bricks[col][row] = {x: 0, y:0, status:1};
            if(getRandom(0,10) == 7){
                bricks[col][row].status = 2;
            }
        }
    }
}

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
    else if(e.key == "Down" || e.key =="ArrowDown"){
        downPressed = true;
    }
}
function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
    else if(e.key == "Down" || e.key =="ArrowDown"){
        downPressed = false;
    }
}

function mouseMoveHandler(e){
    if(!pause && startcheck){
       var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width){
            paddleX = (relativeX - paddleWidth/2);
        }
    }

}

function konami(){
    var konamikeys = [38,38,40,40,37,39,37,39,66,65],
        started = false,
        count = 0;

    $(document).keydown(function(e){
        function reset(){
            started = false;
            count = 0;
            return;
        };
        key = e.keyCode;
        if(!started){
            if(key == 38){
                started = true;
            }
        }
        if(started){
            if (konamikeys[count] == key){
                count++;
            }
            else{
                reset();
            }
            if (count == 10){
                alert('Konami code? So what?');
                reset();
            }
        }
        else {
            reset();
        }
    });
}

function drawBricks(){
    for(var col = 0; col<brickCol; col++){
        for(var row = 0; row<brickRow; row++){
            if(bricks[col][row].status == 1){
                var brickX = (col*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
            else if(bricks[col][row].status == 2){
                var brickX = (col*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#4B0091";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawball(){
    ctx.beginPath();
    ctx.arc(x, y, ballRad, 0, m.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function speedCheck(){
    ballSpeed = m.sqrt(dx*dx + dy*dy);
    console.log("BALL speed: " + ballSpeed);
}

function randSpeed(){
    var rand = getRandom(7,10)/10.0;
    var pos = getRandom(0,1);
    dyReset = speedVal * rand * (-1);
    rand = getRandom(12,15)/10.0;
    if(pos){
        dxReset = speedVal * rand*(-1);
    }
    else{
        dxReset = speedVal * rand;
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function hitPaddle(){
    var prevSpeed = ballSpeed;
    if(rightPressed){
        if(m.abs(dx + senVal*0.1) > prevSpeed){
            console.log('delta EXCEED');
        }
        else{
            dx += senVal*0.1;
            console.log('More RIGHT');
        }
        dy = (-1) * m.sqrt(m.abs(m.pow(prevSpeed,2) - m.pow(dx,2))) - 0.05;
    }
    else if (leftPressed) {
        if(m.abs(dx - senVal*0.1) > prevSpeed){
            console.log('delta EXCEED');
        }
        else{
            dx -= senVal*0.1;
            console.log('More LEFT');
        }
        dy = (-1) * m.sqrt(m.abs(m.pow(prevSpeed,2) - m.pow(dx,2))) - 0.05;
    }
    console.log("prev SPEED: " + prevSpeed+" dx: "+dx+" dy: "+dy);
}

function collisionDetection(){
    for(var col = 0; col<brickCol; col++){
        for(var row = 0; row<brickRow; row++){
            var b = bricks[col][row];
            if(b.status == 1){
                if((x+ballRad>b.x && x+ballRad<b.x+brickWidth && y>b.y && y<b.y+brickHeight)||(x-ballRad>b.x && x-ballRad<b.x+brickWidth && y>b.y && y<b.y+brickHeight)){
                    dx=-dx;
                    b.status = 0;
                    score += hitPoint;
                    totalBrick++;
                    if(totalBrick == brickRow * brickCol){
                        alert("### YOU WIN! ###\n");
                        document.location.reload();
                    }
                }
                else if((x>b.x && x<b.x+brickWidth && y-ballRad>b.y && y-ballRad<b.y+brickHeight)||(x>b.x && x<b.x+brickWidth && y+ballRad>b.y && y+ballRad<b.y+brickHeight)){
                    dy=-dy
                    b.status = 0;
                    score += hitPoint;
                    totalBrick++;
                    if(totalBrick == brickRow * brickCol){
                        alert("### YOU WIN! ###\n");
                        document.location.reload();
                    }
                }
            }
            else if(b.status == 2){
                if((x+ballRad>b.x && x+ballRad<b.x+brickWidth && y>b.y && y<b.y+brickHeight)||(x-ballRad>b.x && x-ballRad<b.x+brickWidth && y>b.y && y<b.y+brickHeight)){
                    dx=-dx;
                    b.status = 1;
                    score += hitPoint;
                }
                else if((x>b.x && x<b.x+brickWidth && y-ballRad>b.y && y-ballRad<b.y+brickHeight)||(x>b.x && x<b.x+brickWidth && y+ballRad>b.y && y+ballRad<b.y+brickHeight)){
                    dy=-dy;
                    b.status = 1;
                    score += hitPoint;
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Score: " +score, 18, 20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Lives: " +lives, canvas.width-65, 20);
}

function drawStartMessage(){
    ctx.font = "20px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Press Any Key to Start", canvas.width/2-100, (brickRow*(brickHeight+brickPadding))+brickOffsetTop+50);
    ctx.fillText("Press Esc to Pause", canvas.width/2-90, (brickRow*(brickHeight+brickPadding))+brickOffsetTop+75);
}

function freezeGrow(){
    for(var col = 0; col<brickCol; col++){
        for(var row = 0; row<brickRow; row++){
            var b = bricks[col][row];
            if(b.status == 2){
                if(getRandom(0,500) == 1){
                    var freezeOrder = [1,2,3,4];
                    for(var cnt = 0;cnt<4;cnt++){
                        var firstMove = Math.floor(Math.random()*3.99);
                        var secondMove = Math.floor(Math.random()*3.99);
                        var temp = freezeOrder[firstMove];
                        freezeOrder[firstMove] = freezeOrder[secondMove];
                        freezeOrder[secondMove] = temp;
                    }
                    for(var cnt = 0 ; cnt<4 ; cnt++){
                        switch(freezeOrder[cnt]){
                            case 1:
                                if(col < brickCol-1 ){
                                    if(bricks[col+1][row].status != 0){
                                        bricks[col+1][row].status = 2;
                                        return;
                                    }
                                }
                                break;
                            case 2:
                                if(row < brickRow-1){
                                    if(bricks[col][row+1].status != 0){
                                        bricks[col][row+1].status = 2;
                                        return;
                                    }
                                }
                                break;
                            case 3:
                                if(col > 0 ){
                                    if(bricks[col-1][row].status != 0){
                                        bricks[col-1][row].status = 2;
                                        return;
                                    }
                                }
                                break;
                            case 4:
                                if(row > 0){
                                    if(bricks[col][row-1].status != 0){
                                      bricks[col][row-1].status = 2;
                                        return;
                                    }
                                }
                                break;
                        }
                    }
                }
            }
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();
    drawball();
    collisionDetection();
    pauseListener();
    konami();
    if(!startcheck){
        $(document).one("keydown",function(e) {
            if(e.keyCode != KEYCODE_ESC){
                startcheck = true;
                console.log( "Handler for .keydown() called." );
            }
        });
        drawStartMessage();
        x=paddleX+paddleWidth/2;
    }
    else if(pause){
        console.log('PAUSE');
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(128,128,128,0.5)";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.rect(canvas.width/2 - 20, canvas.height/2 - 20, 15, 40);
        ctx.rect(canvas.width/2 + 5, canvas.height/2 - 20, 15, 40);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();
        ctx.closePath();
        ctx.font = "20px Arial";
        ctx.fillText("Press Esc to Continue",canvas.width/2 - 100,canvas.height/2 + 50);
    }
    else{
        speedCheck();
        if(rightPressed){
            paddleX += senVal*1.5;
            if(paddleX + paddleWidth > canvas.width){
                paddleX = canvas.width - paddleWidth;
            }
        }
        if(leftPressed){
            paddleX -= senVal*1.5;
            if(paddleX < 0){
                paddleX = 0;
            }
        }
        x += dx;
        y += dy;
        if(y + dy < ballRad){
            dy = -dy;
        }
        else if(y + ballRad > canvas.height - paddleHeight  && lives!=0){
            if(x+ballRad > paddleX && x - ballRad < paddleX+paddleWidth && !deadFlag){
                deadFlag = false;
                dy = -dy;
                setTimeout(hitPaddle,10);
            }
            else{
                deadFlag = true;
            }
            if(y  > canvas.height && deadFlag){
                lives--;
                if(!lives){
                    alert("=== GAME OVER === \n [ Your Score: "+score+" ]");
                    document.location.reload();
                }
                else{
                    alert("=== YOU DIE === \n [ Live left: "+lives+" ]");
                    hitPoint = speedVal*2;
                    x = canvas.width/2;
                    y = canvas.height-30;
                    setSpeed();
                    console.log("speedVal:"+speedVal+" dx:"+dx+" dy:"+dy);
                    paddleX = (canvas.width-paddleWidth)/2;
                    startcheck = false;
                    leftPressed = false;
                    rightPressed = false;
                    downPressed = false;
                    deadFlag = false;
                    console.log('deadFlag RESET');
                }
            }
        }
        if(x + dx < ballRad || x + dx + ballRad> canvas.width){
            dx = -dx;
        }
        freezeGrow();
    }
    requestAnimationFrame(draw);
}

function setSpeed(){
    randSpeed();
    dy = dyReset;
    dx = dxReset;
    hitPoint = speedVal*2;
    console.log("speedVal:"+speedVal+" dx:"+dx+" dy:"+dy);
}
function setup(){
    $(document).on('change',"#speedSlider",function(){
        speedVal = $(this).val();
        $('#speedOut').html(speedVal)
        console.log("speedVal:"+speedVal+" dx:"+dx+" dy:"+dy);
    });
    $(document).on("change","#senSlider",function(){
        senVal = $(this).val();
        $('#senOut').html(senVal)
        console.log("speedVal:"+speedVal+" dx:"+dx+" dy:"+dy);
    });
}
function pauseListener(){
    if(!pause && startcheck){
        $(document).one("keydown", function(e) {
        if (e.keyCode == KEYCODE_ESC) {
            pause = true;
            console.log('You pressed Esc key');
        }
    });
    }
    if(pause){
        $(document).one("keydown",function(e) {
            if(e.keyCode == KEYCODE_ESC){
                pause = false;
                console.log( "KeyPRESSED, Continue." );
            }
        });
    }
}

setup();
$("#startBtn").click(function () {
    $("#startScr").hide();
    $("#game").show();
    setSpeed();
    brickInit();
    startcheck = false;
    draw();
});
