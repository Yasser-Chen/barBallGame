const speed          = 1    ,
      moveSpeed      = 3    ,
      resolusion     = 400  ,
      foodWidth      = 40   ,
      foodHeight     = 20   ,
      ballSize       = 10   ,
      boostTime      = 5    ,//secs
      barOffside     = 20   ,
      originalBarSize= 100  ,
      game = $('#game') ,
      ball = $("#ball") ,
      bar  = $("#bar")  ;
      
var barSize   = originalBarSize   ;

function Block(x,y,hp=1){
  this.x = x ;
  this.y = y ;
  this.hp = hp ;
  this.elem = $('<div>');
  this.elem.addClass('block');
  if(hp>1){
    this.elem.addClass('strong');
  }
  game.append(this.elem);
  this.elem.css({top:y*foodHeight,left:x*foodWidth,width:foodWidth,height:foodHeight});
}
var barTouchedCounter = 0 ;
var blockTouchedCounter = 0 ;
Block.prototype.wasTouched= function (indexToDelete) {
  blockTouchedCounter++;
  if(blockTouchedCounter==20){
    activeBoost = 'commet';
    ball.html(`<div class="fire"><div class="red flame"></div></div>`);
    setTimeout(function () {
      activeBoost     = 'none';
      blockTouchedCounter  = 0 ;
      ball.empty();
    },boostTime*1000);
  }
  this.hp -- ;
  if(this.hp==1){
    this.elem.removeClass('strong');
  }
  if(this.hp==0){
    this.elem.remove();
    delete currentBlocks[indexToDelete];
  }
}
// init
game.css({width:resolusion,height:resolusion});

bar.css({ top:resolusion - barOffside , width:barSize});
ball.css({width:ballSize,height:ballSize});

var ballX = parseInt(resolusion/2) ,
    activeBoost = 'none'    ,
    cntBlocks = 0    ,
    currentBlocks = {} ,
    ballY = 10  ,
    barX  = 10  ,
    direction  = 0 ;

function generateLevel(lvl=1){
 
  $('.block').remove();
  cntBlocks = 0 ;
  currentBlocks = {} ;

  if(lvl==1){
    for (let i = 0; i < (resolusion/foodWidth) ; i++) {
      for (let j = 0; j < ((resolusion/2) / foodHeight) ; j++) {
        currentBlocks [cntBlocks] = new Block(i,j,2);
        cntBlocks++;
      }
    }
  }

}

generateLevel(1);

var keyPressed = false;

$(document).on('keydown', function(e) {
  switch (e.key) {
    case 'ArrowRight':
        direction = 1 ;
        break;
    case 'ArrowLeft':
        direction = 3 ;
        break;
  }
  if(e.key=='ArrowRight'||e.key=='ArrowLeft'){
    var key;
    if (keyPressed === false) {
      keyPressed = true;
      key = String.fromCharCode(e.keyCode);
  
      //this is where you map your key
      if (key === 'X') {
        console.log(key);
        //or some other code
      }
    }
    $(this).on('keyup', function() {
      if (keyPressed === true) {
        keyPressed = false;
        console.log('Key no longer held down');
        //or some other code
      }
    });
  }
});

var ballMoveTypeX = ()=>{
      ballX ++;
    },
    ballMoveTypeY = ()=>{
      ballY --;
    };


function draw(){
  
  ball.css({
    left: ballX ,
    top : ballY
  });

}

const frames = setInterval(() => {

  for (const [k,block] of Object.entries(currentBlocks)) {
    var wasTouched = false ;
    if(ballX+1 == (block.x * foodWidth) && (block.y * foodHeight) <= ballY && ballY <= (block.y * foodHeight) + foodHeight ){
      wasTouched = true ;
      if(activeBoost!='commet'){
        ballMoveTypeX = function(){
          ballX--;
        }
      }
    }
    if(ballX-1 == (block.x * foodWidth) + foodWidth && (block.y * foodHeight) <= ballY && ballY <= (block.y * foodHeight) + foodHeight ){
      wasTouched = true ;
      if(activeBoost!='commet'){
        ballMoveTypeX = function(){
          ballX++;
        }
      }
    }
    if(ballY+1 == (block.y * foodHeight) && (block.x * foodWidth) <= ballX && ballX <= (block.x * foodWidth) + foodWidth ){
      wasTouched = true ;
      if(activeBoost!='commet'){
        ballMoveTypeY = function(){
          ballY--;
        }
      }
    }
    if(ballY-1 == (block.y * foodHeight)+foodHeight && (block.x * foodWidth) <= ballX && ballX <= (block.x * foodWidth) + foodWidth){
      wasTouched = true ;
      if(activeBoost!='commet'){
        ballMoveTypeY = function(){
          ballY++;
        }
      }
    }
    if(wasTouched ){
      block.wasTouched(k);
    }
  }

  if(ballX+ballSize==resolusion){
    ballMoveTypeX = function(){
      ballX--;
    }
  }
  if(ballX==0){
    ballMoveTypeX = function(){
      ballX++;
    }
  }
  if(ballY==0){
    ballMoveTypeY = function(){
      ballY++;
    }
  }

  if(ballY+ballSize == resolusion - barOffside ){ 
    if( barX <= ballX && ballX <= barX + barSize ){
      barTouchedCounter++;
      if(barTouchedCounter==5){
        barSize= barSize*2 ;
        if(barX + barSize > resolusion ){
          barX = resolusion - barSize - 1;
        }
        bar.css({left:barX,width:(barSize)});
        setTimeout(function () {
          barTouchedCounter  = 0 ;
          barSize= originalBarSize;
          bar.css({width:barSize});
        },boostTime*1000);
      }
      ballMoveTypeY = function(){
        ballY--;
      }
    }else{
      ball.fadeOut(210);
      setTimeout(()=>{
        window.location.reload();
      },1000);
    }
  }
  
  if(direction==1){
    if(barX+moveSpeed < resolusion - barSize ){
      barX+=moveSpeed;
      bar.css({
        left: barX ,
      });
    }
  }
  else if(direction==3){
    if(barX-moveSpeed > 0 ){
      barX-=moveSpeed;
      bar.css({
        left: barX ,
      },'slow');
    }
  }


  ballMoveTypeX();
  ballMoveTypeY(); 

  draw();

  if(!keyPressed){
    direction = 0 ;
  }
},speed);







