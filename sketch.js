// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//        Letter.Matter v1.0
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//      a series of generative 
//        typographic worlds
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  - for Generative Type, 2020 -
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// QUESTIONS/NEXT STEPS:
// ? array not working. 
// ? ^ always stops drawing @ c (obviously & kvetch but not oaks?)
// ? show animate : slow it down?
// ? how to not have it change all stroke colors?
// - make foamy letters


var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint

var engine
var world
var letters = []
var ground
var boundaries = []
//var mConstraint

const yAxis = 1
let prevX, prevY
let ptSize = 100
let poemI = 0
let poem = `ABDEFGHIJKLMNOPQRSTUVWXY&Z`
let nextWordTime = 0

//let poem = `abcdefghijklmnopqrstuvwxy&z`




function preload(){
  font = loadFont('assets/Kvetch-0.1-Bold.otf')
  //font = loadFont('assets/oaks_future_V2-BoldCondensed.otf')
  //font = loadFont('assets/Obviously-NarrowBlack.otf')
  //font = loadFont('assets/Obviously-ExtendedMedium.otf')
}



function setup() {
  var canvas = createCanvas(windowWidth, windowHeight)
  engine = Engine.create()
  world = engine.world
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
  
  background(220)
  Engine.update(engine)
  
   if (engine.timing.timestamp >= nextWordTime){
    nextWordTime = engine.timing.timestamp + (800 + random(-100, 100))
    glyph = split(poem, '')
    letters.push(new Letter(
      displayWidth/2 - random(-100, 100), 
      displayHeight/2 - random(-100, 100), 
      ptSize, 
      glyph[poemI]
      )
    )
    poemI = (poemI + 1) % poem.length
    
  }
    
    
  for (var i = 0; i < letters.length; i++) {
    letters[i].show();
    if (letters[i].isOffScreen()){
      // splice removes objects from screen
      letters[i].removeFromWorld()
      letters.splice(i, 1)
      i--
    }
  }
  
  
    for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }  

}


// function mouseClicked() {
  
//   if (mConstraint.body) {
//      return
//   } 
  
//   glyph = split(poem, '')
//   letters.push(new Letter(mouseX, mouseY, ptSize, glyph[poemI]))
//   poemI = (poemI + 1) % poem.length
  
// }



function Letter(x, y, ptSize, poem) {
  var options = {
    friction: .01,
    restitution: .7,
    angle : radians(0),
  }

  // textToPoints(glyph, x, y, ptSize)
  this.ptSize = ptSize
  this.poem = poem
  this.density = .001
  this.slop = 0.06
  let points = font.textToPoints(this.poem, 0, 0, this.ptSize)
  let bounds = font.textBounds(this.poem, 0, 0, this.ptSize)

  
  for (let pt of points){
    pt.x = pt.x - bounds.x - bounds.w/2
    pt.y = pt.y - bounds.y - bounds.h/2
  }
  
  this.pts = points
  this.body = Bodies.fromVertices(x, y, points, options)
  //this.body.angle = PI/4
  World.add(world, this.body)
  this.bounds = bounds

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
    // to visualize bounds
    //noStroke()
      for (let pt of this.pts){
        //colorMode(HSB)
        strokeWeight(1)
        //stroke((frameCount*1.5) % 360, 100, 100)
        stroke((frameCount*1.5) % 360, 100, 100)
        circle(pt.x, pt.y, 10)
        //circle(pt.x, pt.y, random(5, 15))
        }
    rectMode(CENTER)
    noStroke()
    fill("white")
    textFont(font)
    textSize(ptSize)
    textAlign(CENTER, CENTER)
    translate(0, displayWidth * .004)
    text(this.poem, 0, -this.bounds.h/4)
    pop()
    
    
    // !! FOR VISUALIZING WHERE MATTER IS DRAWING BOUNDS
    // fill ('red')
    //   for (let pt of this.body.vertices){
    //   push()
    //   translate(pt.x, pt.y)
    //   rotate(angle)
    //   ellipse(0, 0, 10)
    //   pop() 
    //  }
  }
}



function Boundary(x, y, w, h, a) {
  var options = {
    friction: 0.1,
    restitution: 0,
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