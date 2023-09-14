class Cannon {

  constructor(gameScreen, left, top, width, height, element) {

      this.gameScreen = gameScreen
      this.left = left
      this.top = top
      this.width = width
      this.height = height
      this.directionX = 0
      this.directionY = 0
      this.element = document.createElement('img')
      this.element.src = `${element}`
      this.element.style.position = 'absolute'
      this.element.style.width = `${width}px`;
      this.element.style.height = `${height}px`;
      this.element.style.left = `${left}px`;
      this.element.style.top = `${top}px`;

      this.gameScreen.appendChild(this.element)

  }
  move() {

      this.left += this.directionX 

      if (this.left < 10) {
          this.left = 10
      }

      if (this.left > this.gameScreen.offsetWidth - this.width - 10) {
          this.left = this.gameScreen.offsetWidth - this.width - 10;
        }
    
      this.updatePosition()

  }

  updatePosition() {

      this.element.style.left = `${this.left}px`

  }

  didCollide(enemyBall) {

      const cannonRect = this.element.getBoundingClientRect();
      const enemyBallRect = enemyBall.element.getBoundingClientRect();
  
      if (
        cannonRect.left < enemyBallRect.right &&
        cannonRect.right > enemyBallRect.left &&
        cannonRect.top < enemyBallRect.bottom &&
        cannonRect.bottom > enemyBallRect.top
      ) {
        return true;
      } else false;


  }


}
class Game {
  
  constructor() {

      this.startScreen = document.getElementById("game-intro");
      this.gameScreen = document.getElementById("game-screen");
      this.gameEndScreen = document.getElementById("game-end");
      this.victoryScreen = document.getElementById("victory");
      this.healthBoard = document.getElementById("health-board");
      this.startBackgroundMusic();
      this.cannon = new Cannon(
          this.gameScreen,
          250,
          700,
          66,
          100,
          "./images/cannon.png")
      this.height = 800
      this.width = 600
      this.enemyBalls = [];
      this.myBalls = [];
      this.shoots = [];
      this.firstAidKits = [];
      this.explosionArr = [];
      this.cannonFireArr = [];
      this.counter = 0;
      this.myHealth = 50;
      this.enemyHealth = 50;
      this.gameIsOver = false;
      this.myHealthElement = document.getElementById('my-health');
      this.enemyHealthElement = document.getElementById('enemy-health');

  }

  startBackgroundMusic() {
    const backgroundMusic = document.getElementById("background-music");
    backgroundMusic.play();
    backgroundMusic.volume = 0.1;
  }

  start() {

      this.gameScreen.style.height = `${this.height}px`
      this.gameScreen.style.width = `${this.width}px`
      this.startScreen.style.display = 'none'
      this.gameScreen.style.display = 'inherit'
      this.gameLoop()

  }

  gameLoop() {

      if (this.gameIsOver) return;

      this.counter++
      if (this.counter % 60 === 0) {
          this.enemyBalls.push(new EnemyBall(this.gameScreen));
          this.myBalls.push(new MyBall(this.gameScreen, this.cannon));
      }

      if (this.counter % 300 === 0) {
        this.shoots.push(new Shooter(this.gameScreen));
        this.firstAidKits.push(new FirstAid(this.gameScreen))
      }

      this.update()

      window.requestAnimationFrame(() => this.gameLoop())
  }

  
  playHealth() {
    const healthMusic = document.getElementById("health-music");
    healthMusic.volume = 0.2;
    healthMusic.play();
  }
  playShoot() {
    const shootMusic = document.getElementById("shoot-music");
    shootMusic.volume = 0.2;
    shootMusic.play();
  }
  playWin() {
    const winMusic = document.getElementById("win-music");
    winMusic.play();
  }
  playLose() {
    const loseMusic = document.getElementById("lose-music");
    loseMusic.play();
  }
  ballCollision(myBall,enemyBall) {
    
    if (!myBall || !enemyBall) return;
    const myBallRect = myBall.element.getBoundingClientRect();
    const enemyBallRect = enemyBall.element.getBoundingClientRect();

    if (
      myBallRect.left < enemyBallRect.right &&
      myBallRect.right > enemyBallRect.left &&
      myBallRect.top < enemyBallRect.bottom &&
      myBallRect.bottom > enemyBallRect.top
    ) {
      return true;
    } else false;
   }
   improverCollision(anyBall, improver) {
    if (!anyBall||!improver) return;
    const anyBallRect = anyBall.element.getBoundingClientRect();
    const improverRect = improver.element.getBoundingClientRect();

    if (
      anyBallRect.left < improverRect.right &&
      anyBallRect.right > improverRect.left &&
      anyBallRect.top < improverRect.bottom &&
      anyBallRect.bottom > improverRect.top
    ) {
      return true;
    } else false;

   }
  update() {

      for (let i = 0; i < this.enemyBalls.length; i++) {

          this.enemyBalls[i].move()
          // checking collision enemy's ball with my cannon
          if (this.cannon.didCollide(this.enemyBalls[i])) {
              this.enemyBalls[i].element.remove();
              this.enemyBalls.splice(i, 1);
              this.myHealth--;
              break
          }
          // cheking reaching enemy's ball to my side
          if (this.enemyBalls[i].top > this.height) {
            this.enemyBalls[i].element.remove();
            this.enemyBalls.splice(i, 1);
            this.myHealth--;
          }
          // checking collision of myBall and enemyBall
            for (let j=0;j<this.myBalls.length;j++){
              if (this.ballCollision(this.myBalls[j], this.enemyBalls[i])) {  
                this.explosionArr.push(new Explosion(this.gameScreen, this.enemyBalls[i], this.explosionArr));
                //console.log(this.explosionArr) ;
                this.enemyBalls[i].element.remove();
                this.enemyBalls.splice(i, 1);
                this.myBalls[j].element.remove();
                this.myBalls.splice(j, 1)
                break 
              }                         
          }
          //checking collision  enemy's ball with aim
          for (let j=0;j<this.shoots.length;j++){
            if (this.improverCollision(this.enemyBalls[i],this.shoots[j])){
               this.shoots[j].element.remove();
                this.shoots.splice(j, 1)
                this.playShoot()
                this.myHealth--;
            }
          }
          //checking collision  enemy's ball with firts aid kit
          for (let j=0;j<this.firstAidKits.length;j++){
            if (this.improverCollision(this.enemyBalls[i],this.firstAidKits[j])){
               this.firstAidKits[j].element.remove();
                this.firstAidKits.splice(j, 1)
                this.playHealth();
                this.enemyHealth ++;
            }
          }
        }

      for (let i = 0; i <this.myBalls.length; i++) {

        this.myBalls[i].move()

         // cheking reaching my ball to enemy's side
        if (this.myBalls[i].positionY + 50 <= 0) {
          this.myBalls[i].element.remove();
          this.myBalls.splice(i, 1)
          this.enemyHealth--;
        }
        //checking collision my ball with aim
        for (let j=0;j<this.shoots.length;j++){
          if (this.improverCollision(this.myBalls[i],this.shoots[j])){
             this.shoots[j].element.remove();
              this.shoots.splice(j, 1)
              this.playShoot()
              this.enemyHealth--;
          }
        }
          //checking collision my ball with first aid kit
        for (let j=0;j<this.firstAidKits.length;j++){
          if (this.improverCollision(this.myBalls[i],this.firstAidKits[j])){
             this.firstAidKits[j].element.remove();
              this.firstAidKits.splice(j, 1)
              this.playHealth();
              this.myHealth ++;
          }
        }
      }
      
      this.cannon.move()

      if (this.myHealth <= 0) {
        const backgroundMusic = document.getElementById("background-music");
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        this.endGameLose();
      } else if (this.enemyHealth <= 0) {
        const backgroundMusic = document.getElementById("background-music");
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        this.endGameVictory();
      }

      this.myHealthElement.innerHTML = this.myHealth;
      this.enemyHealthElement.innerHTML = this.enemyHealth;
  }

  endGameLose() {

      this.cannon.element.remove();
      this.enemyBalls.forEach((enemyBall) => {
        enemyBall.element.remove();
      });
       this.myBalls.forEach((myBall) => {
         myBall.element.remove();
       });
  
      this.gameIsOver = true;

      this.gameScreen.style.display = "none";
      this.healthBoard.style.display = "none"
      this.gameEndScreen.style.display = "block";
      
      this.playLose();
  }

  endGameVictory() {

    this.cannon.element.remove();
      this.enemyBalls.forEach((enemyBall) => {
        enemyBall.element.remove();
      });
       this.myBalls.forEach((myBall) => {
         myBall.element.remove();
       });
  
      this.gameIsOver = true;

      this.gameScreen.style.display = "none";
      this.healthBoard.style.display = "none"
      this.victoryScreen.style.display = "block";
      
      this.playWin();
  }
}
class EnemyBall {
  constructor(gameScreen) {

      this.gameScreen = gameScreen;
      this.left = Math.abs(Math.random() * 600-50);
      this.top = 100;
      this.width = 50;
      this.height = 50;
      this.element = document.createElement("img")
      this.element.src = './images/ball.png';
      this.element.style.position = "absolute";
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;
      this.element.style.left = `${this.left}px`;
      this.element.style.top = `${this.top}px`;
      this.gameScreen.appendChild(this.element);

      this.cannon = document.createElement('img')
      this.cannon.src = './images/enemy-cannon.png'
      this.cannon.style.position = "absolute";
      this.cannon.style.width = `66px`;
      this.cannon.style.height = `100px`;
      this.cannon.style.left = `${this.left-10}px`;
      this.cannon.style.top = `0px`;

      this.gameScreen.appendChild(this.cannon);

      setTimeout(()=> {
        this.cannon.remove();
      }, 1000);

  }

  move() {
      this.top += 2
      this.updatePosition()

  }

  updatePosition() {
      this.element.style.left = `${this.left}px`;
      this.element.style.top = `${this.top}px`;
  }
}
class MyBall  {
constructor(gameScreen, cannon) {

  this.gameScreen = gameScreen;
  this.gameRect = gameScreen.getBoundingClientRect();
  this.width = 50;
  this.height = 50;
  this.positionX = cannon.left + 8;
  this.positionY = this.gameRect.height - cannon.height-40;
  // this.left = this.positionX
  // this.top = this.positionY
  this.element = document.createElement("img");
  this.element.style.position = "absolute";
  this.element.src = './images/ball.png';
  this.element.style.width = `${this.width}px`;
  this.element.style.height = `${this.height}px`;
  this.element.style.left = `${this.positionX}px`;
  this.element.style.top = `${this.positionY}px`;
  this.gameScreen.appendChild(this.element);
}

move() {
  this.positionY -=2;
  this.updatePosition()
}
updatePosition() {
  this.element.style.left = `${this.positionX}px`;
  this.element.style.top = `${this.positionY}px`;
}
}
class Shooter {
constructor(gameScreen) {

  this.gameScreen = gameScreen
  this.left = Math.abs(Math.random() * 600 - 50);
  this.top = Math.abs(Math.random()* 550 + 100);
  this.width = 50
  this.height = 50
  this.element = document.createElement("img");
  this.element.style.position = "absolute";
  this.element.src = './images/shoot.png';
  this.element.style.width = `${this.width}px`;
  this.element.style.height = `${this.height}px`;
  this.element.style.left = `${this.left}px`;
  this.element.style.top = `${this.top}px`;
  this.gameScreen.appendChild(this.element)
}

}
class FirstAid {
  constructor(gameScreen) {
  
    this.gameScreen = gameScreen
    this.left = Math.abs(Math.random() * 600 - 50);
    this.top = Math.abs(Math.random() * 550 + 100);
    this.width = 50
    this.height = 50
    this.element = document.createElement("img");
    this.element.style.position = "absolute";
    this.element.src = './images/health.png';
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  
    this.gameScreen.appendChild(this.element)
  }
  
  }
class Explosion {

  constructor(gameScreen, enemyBall, arr) {
      this.gameScreen = gameScreen;
      this.left = enemyBall.left;
      this.top = enemyBall.top;
      this.width = 50;
      this.height = 50;
      this.element = document.createElement("img")
      this.element.src = './images/explosion.gif';
      this.element.style.position = "absolute";
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;
      this.element.style.left = `${this.left}px`;
      this.element.style.top = `${this.top}px`;
      this.gameScreen.appendChild(this.element);

      this.arr = arr;
      setTimeout(()=> {
        this.element.remove();
        this.arr.pop();
      }, 1000);
    }
}
window.onload = () => {
  const startButton = document.getElementById("start-button");
  const restartButtonWin = document.getElementById("restart-button-win");
  const startMusic = document.getElementById("start-music");
  const restartButtonLose = document.getElementById("restart-button-lose");

  let game;

  function restartGame() {
   location.reload();
  }

  startButton.addEventListener("click", () => {
    startGame();
  });
  
  function startGame() {
    console.log("start game");
    game = new Game();
    game.start()

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        game.cannon.directionX = -3;
      }
      if (e.key === 'ArrowRight') {
        game.cannon.directionX = 3;
      }
    })
  }
  restartButtonWin.addEventListener("click", () => {    
    restartGame();
  });
  restartButtonLose.addEventListener("click", () => {    
    restartGame();
  });
};