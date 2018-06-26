function myfunction2() {
    var x = document.getElementById("canvas");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "loop");
    this.sound.style.display = "none";
    this.sound.loop=true;
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
        mySound.sound.loop=false;

    }
    this.stop = function(){
      this.sound.pause();
    }
}
var myGamePiece;
var myBackground;
var myMusic;
var coin;
var myCurrency=[];
function startGame2() {
  coin = new component(45, 45, "harsh-coin.png", 540, 15,"image");
    myGamePiece = new component(140, 140, "harsh.png", 10, 260, "image");
    myGamePiece.gravity = 0.05;
    myBackground = new component(680, 470, "maxresdefault.jpg", 0, 0, "background");
    myMusic = new sound("Guns_N_Roses_-_Sweet_Child_OMine_instrumental[SaveFrom.online].mp3");
    mySound = new sound("Mario-coin-sound.mp3");

        myMusic.play();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 680;
        this.canvas.height = 470;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        updateGameArea();
        window.addEventListener('keydown', function (e) {
                    e.preventDefault();
                    myGameArea.keys = (myGameArea.keys || []);
                    myGameArea.keys[e.keyCode] = (e.type == "keydown");
                })
                window.addEventListener('keyup', function (e) {
                    myGameArea.keys[e.keyCode] = (e.type == "keydown");
                })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image,
                this.x + this.width,
                this.y,
                this.width, this.height);
        }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
}
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.gravitySpeed += this.gravity;
        this.hitBottom();
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
}

function updateGameArea() {

    myGameArea.clear();
    myBackground.speedX = -1;
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    myGameArea.frameNo += 1;

    myBackground.newPos();
    myBackground.update();
    myGamePiece.update();
    coin.update();
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX= 2; }
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX= -2; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY= 2; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY= -2; }

    if (myGameArea.keys && myGameArea.keys[32]) {
        myGamePiece.speedY= -5;
    }

    myGamePiece.newPos();

}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function accelerate(n) {
    if (!myGameArea.interval) {
      myGameArea.interval = setInterval(updateGameArea, 20);
    }
    myGamePiece.gravity = n;
}
