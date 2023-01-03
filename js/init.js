function init() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  var rect = canvas.getBoundingClientRect();

  // float class
  class floatObject {
    constructor() {
      this.startX = 480;
      this.startY = 230;
      this.x = this.startX;
      this.y = this.startY;
      this.floatWidth = 32;
      this.floatHeight = 32;
      this.sourceFloatWidth = 32;
      this.sourceFloatHeight = 32;
      this.sourceFloatX = 64;
      this.sourceFloatY = 0;
    }
  }

  var float = new floatObject();

  class playerObject {
    constructor() {
      this.startX = 480;
      this.startY = 340;
      this.x = this.startX;
      this.y = this.startY;
      this.playerWidth = 32;
      this.playerHeight = 32;
      this.sourcePlayerWidth = 32;
      this.sourcePlayerHeight = 32;
      this.sourcePlayerX = 38;
      this.sourcePlayerY = 100;
    }
  }

  var playerOne = new playerObject();

  class playerRod {
    constructor() {
      this.x = (playerOne.x + 16);
      this.y = (playerOne.y - 20);
    }
  }

  var playerOneRod = new playerRod();

  // utilities and counters
  var i = 0;
  var resetFloatPosition = 0;
  var showCatch = 0;
  var showInventory = 0;

  // difficulty 300 = hard, 200 = normal, 100 = easy
  var difficulty = 200; 

  // mouse position and status
  var mposX = 0;
  var mposY = 0;
  var mouse = 0;

  // score
  var totCatch = 0;
  var totKg = 0;
  var catchedFish;
  var listFish = [];

  // status 0 = wait, 1 = fish, 2 = return, 3 = catch
  var status = 0;
  var frequency = 1000;

  // game 0 = time attack, 1 = catch, 2 = main menu, 3 = location menu, 4 = resume, 5 = options
  var game = 2;

  // var for fps
  var t = Date.now();
  var timePassed = 0;
  var fps = 0;
  var speed = 3;

  // timer
  var t0 = 0;
  var t1 = 0;
  var countT = 0;
  var d0 = 0;
  var d1 = 0;

  // images src
  let fishFloat = new Image();
  fishFloat.src = "img/float_01.png";
  let player = new Image();
  player.src = "img/player_01.png";
  let rod = new Image();
  rod.src = "img/rod_01.png";
  let bgMain = new Image();
  bgMain.src = "img/bg_main.png";
  let bgLocation = new Image();
  bgLocation.src = "img/bg_location.png";
  let bgRiver = new Image();
  bgRiver.src = "img/bg_river.png";
  let bgCatch = new Image();
  bgCatch.src = "img/bg_catch.png";
  let bgOptions = new Image();
  bgOptions.src = "img/bg_options.png";

  function main() {
    // control FPS
    timePassed = (Date.now() - t) / 1000;
    t = Date.now();
    fps = Math.round(1 / timePassed);

    // handle mouse click
    document.onmousedown = function (event) {
      mposX = event.clientX - rect.left;
      mposY = event.clientY - rect.top;

      mouse = mouseEvent(mposX, mposY, game, mouse);
    };

    // status event
    i += speed * timePassed * 1.1;

    // time attack
    if (game == 0) {
      if (countT == 0) {
        t0 = Date.now();
        countT = 1;
      }

      t1 = Math.round((Date.now() - t0) / 1000);

      if (t1 > 119) {
        game = 4;
        mouse = 0;
      }

      // float movement
      if (status == 0) {
        float.sourceFloatX = floatMovement(float.sourceFloatX, resetFloatPosition);
        resetFloatPosition = 1;

        if (mouse == 1) {
          i = 0;
          mouse = 0;
        }

        if (i > frequency * Math.random()) {
          if (Math.random() < 0.2) {
            status = 1;
            i = 0;
          }
        }
      }

      // if mouse down in this status you catch the fish
      if (status == 1) {
        float.sourceFloatX = floatCatch(float.sourceFloatX);
        resetFloatPosition = 0;

        if (mouse == 1) {
          status = 0;
          mouse = 0;
          showCatch = 1;
          d0 = Date.now();

          // random fish
          catchedFish = getRandomFish();

          listFish.push(catchedFish);

          console.log(listFish.length);

          totCatch++;
          totKg += catchedFish.weight;
        }

        if (i > (frequency / difficulty) * Math.random()) {
          if (Math.random() < 0.2) {
            status = 0;
            i = 0;
          }
        }
      }

      if (mouse == 3) {
        game = 4;
        mouse = 0;
      }

      if (mouse == 2 && showInventory == 0) {
        showInventory = 1;
        mouse = 0;
        }
      if (mouse == 2 && showInventory == 1){
          showInventory = 0;
          mouse = 0;
        }

    }

    // after catch
    if (showCatch == 1) {
      d1 = Date.now() - d0;
      if (d1 > 3000) {
        showCatch = 0;
      }
    }

    // main menu handle events
    if (game == 2) {
      if (mouse == 1) {
        game = 3;
        mouse = 0;
      }
      if (mouse == 2) {
        game = 5;
        mouse = 0;
      }
    }

    // location menu handle events
    if (game == 3) {
      if (mouse == 1) {
        game = 0;
        mouse = 0;
      }
    }

    // resume
    if (game == 4) {
      if (mouse == 1) {
        mouse = 0;
        status = 0;
        countT = 0;
        totKg = 0;
        totCatch = 0;
        listFish.length = 0;
        game = 2;
      }
    }

    // main menu handle events
    if (game == 5) {
      if (mouse == 1) {
        game = 2;
        mouse = 0;
      }
      if (mouse == 2) {
        difficulty = 100;
      }
      if (mouse == 3) {
        difficulty = 200;
      }
      if (mouse == 4) {
        difficulty = 300;
      }
    }

    mouse = 0;

    // drawing
    if (game == 2) {
      drawMainMenu(context, bgMain);
    }
    if (game == 3) {
      drawSubMenuTA(context, bgLocation);
    }
    if (game == 0) {
      drawFishTA(
        context,
        bgRiver,
        t1,
        fishFloat,
        float,
        player,
        playerOne,
        rod,
        playerOneRod,
        totCatch,
        totKg,
        catchedFish,
        showCatch,
        showInventory,
        listFish
      );
    }
    if (game == 4) {
      drawResume(context, bgCatch, totCatch, totKg);
    }
    if (game == 5) {
      drawOptions(context, bgOptions, fishFloat, player, difficulty);
    }

    window.requestAnimationFrame(main);
  }

  main();
}
