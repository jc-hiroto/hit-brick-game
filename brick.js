var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -3;
var dxSet = 2;
var dySet = -3;
var ballRad = 10;
var speed = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRow = 1;
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
var speedVal = 3;
var senVal = 3;
for(var col = 0; col<brickCol; col++){
    bricks[col] = [];
    for(var row = 0; row<brickRow; row++){
        bricks[col][row] = {x: 0, y:0, status:1};
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove",mouseMoveHandler, false);

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
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
                ctx.fillStyle = "0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawball(){
    ctx.beginPath();
    ctx.arc(x, y, ballRad, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection(){
    for(var col = 0; col<brickCol; col++){
        for(var row = 0; row<brickRow; row++){
            var b = bricks[col][row];
            if(b.status == 1){
                if(x+ballRad>b.x && x-ballRad<b.x+brickWidth && y+ballRad>b.y && y-ballRad<b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score += hitPoint;
                    totalBrick++;
                    if(totalBrick == brickRow * brickCol){
                        alert("### YOU WIN! ###\n");
                        document.location.reload();
                    }
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

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawball();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;
    if(y + dy < ballRad){
        dy = -dy;
    }
    else if(y + dy + ballRad> canvas.height- paddleHeight){
        if(x+ballRad > paddleX && x - ballRad < paddleX+paddleWidth){
            dy = -dy;
        }
        else{
            lives--;
            if(!lives){
                alert("=== GAME OVER === \n [ Your Score: "+score+" ]");
                document.location.reload();
            }
            else{
                hitPoint = speedVal*2;
                x = canvas.width/2;
                y = canvas.height-30;
                dx = dxSet;
                dy = dySet;
                paddleX = (canvas.width-paddleWidth)/2;
            }

        }
    }
    if(x + dx < ballRad || x + dx + ballRad> canvas.width){
        dx = -dx;
    }
    if(rightPressed){
        paddleX += senVal*2;
        if(paddleX + paddleWidth > canvas.width)
            paddleX = canvas.width - paddleWidth;
    }
    if(leftPressed){
        paddleX -= senVal*2;
        if(paddleX < 0)
            paddleX = 0;
    }
    requestAnimationFrame(draw);
}
function start () {
    document.getElementById('StartScr').style.visibility = "hidden";
    document.getElementById('game').style.visibility = "visible";
    dx = dxSet;
    dy = dySet;
    hitPoint = speedVal*2;
    totalBrick = 0;
    draw();
};
function setup(){
    $("#speedSlider").on("change",function(){
        speedVal = $(this).val();
        dxSet = speedVal;
        dySet = speedVal*-1.5;
        $('#speedOut').html(speedVal)
    });
    $("#senSlider").on("change",function(){
        senVal = $(this).val();

        $('#senOut').html(senVal)
    });
}
setup();
