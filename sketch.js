// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//        Letter.Matter v02
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//      a series of generative 
//        typographic worlds
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  - for Generative Type, 2020 -
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~





var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint


var engine
var world
var mConstraint
var wordBlock = []
var ground
var boundaries = []


const yAxis = 1
let prevX, prevY
let poemI = 0
let ptSize = 30
let nextWordTime = 0

let poem = 'A DAILY TEDIUM OF COMMUTING TO FIND REMOVE. YOU ARE RACING THE CLOCK ABOVE THE BAR KEEP TO CREATE AN IMPRESSION THAT CAN LAND ALL THE LITTLE DIALS SET TO; YES. YOU ARE TRAVELING ON A PIANO… STEPPING STRING TO STRING: YOU MUST PASS OVER ALL THE TRIP WIRE. MUST SOUND ONLY THOSE NOTES THAT BEAUTIFY THE CONVERSATION, AND NOT TOO PRACTICED IN THE PROCESS. HERE, YOUR BRAIN IS TOO FULL OF STATIC CHARGE TO PAY ANY NOTICE TO THE BUZZ OF APPREHENSION THAT VIBRATES YOUR SOBRIETY LIKE A NEVER ENDING TRAIN. THE GREATEST REMOVE THAT CAN BE OBTAINED BY LEGAL, MINIMUM WAGE MEANS; THE $3-DOLLAR AMERICAN CLASSIC-TOUCH CAR WASH. A CARWASH ADDRESSES THESE MOMENTS OF REMOVE AND VULNERABILITY DIRECTLY. A CAR WASH SAYS YES, THERE IS DANGER ALL ABOUT. YOU ARE IN THE EPICENTER OF A TRIPLE-COLOR FOAM TSUNAMI… BUT YOU? YOU ARE SURVIVING SPOT FREE. IN A DIVING BELL EQUIPPED WITH AN AM/FM STEREO & HEATED POWER LEATHER SEATS.'




function preload(){
  //font = loadFont('assets/Kvetch-01-RegularItalic.otf')
  //font = loadFont('assets/Obviously-NarrowBlack.otf')
  font = loadFont('assets/Obviously-NarrowMedium.otf')
}



function setup() {
  var canvas = createCanvas(windowWidth, windowHeight)
  
  engine = Engine.create()
  world = engine.world
  //nextWordTime = engine.timing.timestamp
  // Make Everything Float:
  engine.world.gravity.y = -1


  // make a floor (new Boundary (x, y, width, height, angle)
  boundaries.push(new Boundary (width/2, height-5, width, 10, 0))
  boundaries.push(new Boundary (width/2, 5, width, 10, 0))
  boundaries.push(new Boundary (5, height/2, 10, height, 0))
  boundaries.push(new Boundary (width-5, height/2, 10, height, 0))
  
   var canvasMouse = Mouse.create(canvas.elt)
  canvasMouse.pixelRatio = pixelDensity()
  var options = {
    mouse: canvasMouse
  
  }
  mConstraint = MouseConstraint.create(engine, options)
  World.add(world, mConstraint)

}





function draw() {
  Engine.update(engine)
  background(220)
  
  //if (wordBlock.length <= 140){
    let word = split(poem, ' ')
  
    if (engine.timing.timestamp >= nextWordTime){
      nextWordTime = engine.timing.timestamp + (800 + random(-100, 100))
      wordBlock.push(new Rectangle(
        windowWidth/2,
        (windowHeight/2) + random(-200, 200),
        this.w,
        this.h,
        word[poemI]
    )  )  

    poemI = (poemI + 1) % poem.length
}
    

  for (var i = 0; i < wordBlock.length; i++) {
    wordBlock[i].show();
    if (wordBlock[i].isOffScreen()){
      // splice removes objects from screen
      wordBlock[i].removeFromWorld()
      wordBlock.splice(i, 1)
      i--
    }
  }
  
    for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }  
  
}






function Rectangle(x, y, w, h, poem) {
  var options = {
    friction: .8,
    restitution: .4
    //density: .001
  }

  

  // textToPoints(glyph, x, y, ptSize)
  this.ptSize = ptSize
  this.poem = poemI
  let points = font.textToPoints(poem, 0, 0, this.ptSize)
  let bounds = font.textBounds(poem, 0, 0, this.ptSize)

  this.w = bounds.w
  this.h = bounds.h
  this.density = .001
  
  
  for (let pt of points){
    pt.x = pt.x - bounds.x - bounds.w/2
    pt.y = pt.y - bounds.y - bounds.h/2
  }
  
  
  // defining center, then defining bounds
  this.body = Bodies.rectangle(x + bounds.w/2, y + bounds.h/2, bounds.w, bounds.h, options)
  
  this.poem = poem
  this.bounds = bounds
  World.add(world, this.body)

  this.isOffScreen = function() {
    var pos = this.body.position
    return (pos.y > height + 20) 
  }
  
  this.removeFromWorld = function(){
    World.remove(world, this.body)
  }
  
  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle

    
    push()
    translate(pos.x, pos.y)
    rotate(angle)
    rectMode(CENTER)
    noFill()
    strokeWeight(1)
    rect(0, 0, this.bounds.w, this.bounds.h)

    // cycle letters with a loop here i think?
    fill(0)
    noStroke()
    textFont(font)
    textSize(15)
    textAlign(CENTER, CENTER)
    translate(0, 0)
    text(this.poem, 0, -this.bounds.h/5)
    //text(poem[i], 0, 0)
    pop()
    


  }
}



function Boundary(x, y, w, h, a) {
  var options = {
    friction: .3,
    restitution: .06,
    isStatic: true,
    angle: a
  }

  this.body = Bodies.rectangle(x, y, w, h, options)
  this.w = w
  this.h = h
  World.add(world, this.body)

  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle

    push()
    translate(pos.x, pos.y)
    rotate(angle)
    rectMode(CENTER)
    noStroke()
    fill(255)
    rect(0, 0, this.w, this.h)
    pop()

  }
}




