---
layout: post
title: Make a Processing.js Ninja
permalink: make-an-html5-javascript-interactive-ninja-game-character-with-processing-js
feature_img: /img/feature/make-an-html5-javascript-interactive-ninja-game-character-with-processing-js.png
featured: false
date: '2010-06-23 10:15:00'
categories:
- article
tags:
- Processing.js
- Canvas
- HTML5
- Graphics
- JavaScript
- Ninja
- Magazine
- Animation
- Games
---

I was asked back at the start of the year by [.NET Magazine](https://www.creativebloq.com/net-magazine) to write a JavaScript article on the subject of my choice. .NET Magazine (called "Practical Web Design" in the USA), kindly agreed to let me reprint the article. So here it is, complete with working code examples:

## 🕹Try The Demo!

<iframe width="436" height="350" 
  style="max-width: 400px; width: 100%; overflow: hidden; border: none; margin-left: auto; margin-right: auto; display: block; margin-bottom: 2em;"
  src="/code/pjs-ninja/ninja-final-game">
</iframe>
 
Is your foo strong enough to beat the clock?

Build up your chi-force by thowing your arms into some crazy ninja spins. But don't throw them too quickly, or you will loose your chi! When you have built up enough chi-force for a big hit, fling those arms towards the punch-bags to unleash your foo upon the dojo. <span style="color:#800">Be careful not to hit yourself in the head!</span>  

## Master Canvas & Processing.js

- **Knowledge needed:** JavaScript, HTML, CSS
- **Requires Text editor:** any browser except Internet Explorer
- **Project time:** 2 hours

Rich interactive web content used to be available in two flavors, Flash or Java. Today, the technological landscape looks very different. One of the ideas popularized in the 1990s was that the desktop as we know it could be replaced by an entirely web-based operating system. At the time, the idea seemed ridiculous, but modern browsers are powerful enough to handle an ever-increasing array of tasks.

![Make an HTML5 JavaScript Interactive Ninja Game Character with Processing.js](/img/feature/make-an-html5-javascript-interactive-ninja-game-character-with-processing-js.png)

> Play anywhere: [Processing.js](http://processingjs.org/) gives web developers and artists a way of producing online games and animations, without having to use any Flash or Java applets.

jQuery broke down the boundaries between the old paradigm and the new, giving us rich interactivity that was simple to implement, great to look at, and loaded quicker than any plug-in could. But it didn’t end there.

One of the more interesting changes has been the advent of _immediate-mode-graphics_ in the browser, commonly referred to as the canvas element. Originally invented by Apple to power mini-applications such as desktop widgets, the canvas element sparked a phenomenal movement of web artists, data visualizers, UI experimentalists and game creators, who just needed a browser, some JavaScript and a healthy dose of creativity to change the web.

3D hardware support for the browser has already crossed the horizon and will be with us shortly, even on our mobile phones. With all these features being handed to the front-side, we need solid ways to harness this power.

> ### **Adding Depth**
> Our ninja is 2D, but the Copperlicht JavaScript 3D Engine can help you create scenes like this...
> 
> [![Screenshot of a level from the Quake game running in WebGL using the Copperlicht 3D Engine](/img/posts/copperlicht-javascript-3d-webgl-engine.png)](/img/posts/copperlicht-javascript-3d-webgl-engine.png "Screenshot of a level from the Quake game running in WebGL using the Copperlicht 3D Engine")
> 
> To start developing for the 3D HTML context, download the latest build of Firefox, enable WebGL in `about:config` and visit: [learningwebgl.com](http://learningwebgl.com).

### Processing Syntax

While the Processing language uses Java syntax, Processing.js supports both Java and JavaScript methods, enabling you to use JavaScript libraries such as jQuery in your code, adding a powerful DOM access layer between the visualization and the DOM. If you need help learning Processing.js, WebGL, or find bugs and missing features, point your IRC client to irc.mozilla.org, join the #processing.js channel and introduce yourself to the community.

## Sketching your Figure

Processing.js code is lightweight, simple to learn and ideal for developing web-based games. In this tutorial, we’re going to use Processing.js to create a ninja. Obviously you can adapt the skeleton we’ll build here to create all sorts of animated figures for your web projects. First, take a quick look at the HTML:

```html
<!-- index.html -->
<script src="processing.js"></script>
<canvas data-src="sketch.pjs" width="200" height="200"></script>
```

The first line loads `processing.js`. You can get it from this issue’s CD, or download a copy from [processingjs.org](http://processingjs.org). The `processing.js` file handles all the drawing events and interactions.

The second line contains a `canvas` element with the `width` and `height` attributes set. Being an arty environment, Processing projects are called "sketches". The `data-src` attribute points to the location of your sketch file and is loaded after the DOM content.

Next, create a file called `ninja.pjs` and copy in the following Processing code:

```java
// ninja.pjs
background(#00ff00);
```

Open your `index.html` document again. If you see a green square in your window, you’re up and running with Processing.js!

<iframe class="lifted" width="400" height="300"
  src="/code/pjs-ninja/ninja-step-by-step/ninja-step2">
</iframe>

> ## 🥳 Congratulations!
> 
> This green square means you’ve set up Processing.js successfully.

Now you can start building up your JavaScript ninja, but before you do: let’s extend Processing.js with some reusable classes to save time and effort.

Copy `ninja.classes.lib` into your working directory and update your HTML to this:

```html
<!-- index.html -->
<script src="processing.js"></script>
 <!-- Add "ninja.classes.lib" -->
<script src="ninja.classes.lib"></script>
<canvas data-src="ninja.pjs" width="400" height="300"></script>
```

The ninja classes are recycled from code examples found on the Processing website. This library import extends Processing.js to handle the cartoon physics and provide some shortcuts for styling the ninja with fewer lines of code.

![INCLUDE ZEN IMAGE - POSSIBLE MOVE TO BETTER LOCATION]()

Update the code in your sketch to include two functions called `setup()` and `draw()`. Processing sketches usually follow this simple pattern:

1. First, any variable or class definitions outside the main functions are set.
2. Then the `setup()` function is called, where the screen and environment are set up. The `setup()` function can also be recalled when a sketch starts over, to reinitialize variables.
3.  Finally, the `draw()` loop is called for every frame of your program, creating your animation.


```java
// Setup Screen
void setup(){
  frameRate(60);
  size(400, 300);
};

int ninjaX=width/2; ninjaY=height/2;

// Main Looping Draw Rountine
void draw(){
  background(#555658);
  noStroke();
  fill(#3e3e40);
  rect(0, height/2, width, height);
};
```

The statement `background(#555658)`, fills the background with a light shade of grey and `noStroke()` forces shapes to be drawn without borders around them. The `fill(#3e3e40)` statement, tells Processing.js that the following shape will be filled with a darker shade of grey.

The `rect(0, height/2, width, height)` statement draws the rectangle that will become the floor on which the ninja crouches. You may have noticed that global variables such as width and height, as well as `size()` and `frameRate()`, are automatically available to your sketch.

Coming equipped with an array of global variables and useful methods makes Processing.js a quick and powerful tool for developing visual interaction on the web.

Having set the stage, you need an actor. Update `ninja.pjs` with:

```java
// ninja.pjs

// Setup Screen
void setup(){
  frameRate(60);
  size(400, 300);
};

int ninjaX=width/2; ninjaY=height/2;
float trackAngle=0, trackX=0, trackY=0;

// Main Looping Draw Routine
void draw(){ 
  style({ background:#555658, noStroke:true, fill:#3e3e40 }); 
  rect(0, height/2, width, height);
  drawNinja();
};

void mouseMoved(){
  
  // Track Ninja to Mouse
  trackX = mouseX-ninjaX; trackY = mouseY-ninjaY;

  // Set the Track Angle
  trackAngle = -atan2(trackX, trackY);
};

void drawNinja(){
  pushMatrix();
    translate(ninjaX, ninjaY);
    pushMatrix();

      // Offset Ninja by Tracking Angle
      translate(-sin(trackAngle)*4,0);
      fill(0);
      rect(-20, 0, 40, 40); // Draw Body Box
      pushMatrix();
        translate(-sin(trackAngle), -40);

        // Draw Head
        arc(0, 0, 60, 0, TWO_PI, false);
      popMatrix();
    popMatrix();
  popMatrix();
}
```

This introduces some key features. Firstly, you’ve reduced the four lines needed to draw the background by using the `style()` function. This function isn’t native to Processing.js but is one of the extensions in `ninja.classes.lib`.

Second, you’ve added tracking variables so that your character can follow the movement of the mouse. This is computed in the `mouseMoved()` method, so that the variables are updated whenever the mouse moves on the canvas.

Thirdly, you’ve added the `drawNinja()` method, which draws the body and head of the ninja, offsetting the draw commands by the value stored in the tracking variable. This creates the effect that the ninja is commanded by the movement of your mouse pointer.

> ### 👊 Ninja style!
> 
> [![Spooner Graphics Ninjas](/img/posts/spooner-graphics-ninjas.jpg)](https://blog.spoongraphics.co.uk/videos/video-vector-ninja-characters-beginner-illustrator-tutorial "Spooner Graphics Ninja Tutorial")
> 
> The styles of our ninja are based on the excellent work of Chris Spooner as seen on his web site: [spoongraphics.co.uk](https://blog.spoongraphics.co.uk/videos/video-vector-ninja-characters-beginner-illustrator-tutorial).

You’re using the `fill()` command with a different type of variable here. Before, you passed in a hexadecimal colour as an argument. This time, it’s a single integer, creating a greyscale fill from `0-255`. You can also pass in three or four integers: `fill(255, 0, 0)` for red or `fill(0, 255, 0, 128)` for transparent green.

Also introduced is the `arc()` command, with the following arguments: `arc(x, y, width, height, start-angle, stop-angle)`. The angles are calculated in radians, but Processing.js, being the useful language it is, can convert between radians and degrees by calling `radians(degrees)` or `degrees(radians)`.

### Enter The Matrix

Matrix maths is a key component of any graphics language. Even if you’re more familiar with PhotoShop and Illustrator than with graphics programming languages, you’ll have used transformation matrices, whether you were aware of it or not. When you create a new layer, you’re creating a new transformation matrix. A transformation matrix enables you to apply transformations to a group of objects.

Transformation matrices are powerful tools. It’s far easier to calculate geometry locally and transform a group’s spacial coordinates than it is to account for all your transformations manually. Fortunately, the transformation matrix commands in Processing are simple to master.


- `pushMatrix()`
  
  Think of this command as creating a new layer. Every command, from this point onwards, will share the same coordinate space, and move in unison.

- `popMatrix()`
  
  Making a call to `popMatrix()` ends the current layer and returns Processing.js to the previous coordinate space.

- `translate(x, y)`

  Translating the matrix offsets the current set of coordinates by the x and y values passed.

- `rotate(radians)`

  This turns the current matrix about its origin. If you think of the current matrix as a sheet of paper, the origin would be the pin that tacks it to a board. If you turn the paper, it rotates around the position of the pin.
  
  The default origin for a matrix is `(0x, 0y)`, so to rotate a layer around its centre, there are two solutions. The first is to draw your objects around the origin, so the top-left coordinates of a 100-pixel wide box would become `(-50x, -50y)`.
  
  Sometimes, you don’t have the luxury of redefining every coordinate in your matrix this way, in which case you can combine `translate()` and `rotate()` to get the job done. To rotate a 100-pixel box around its center, shift the matrix like so:

  #### No Rotation  
  
  ![No Rotation](/img/posts/pjs-ninja-rotate-zero2.png)

  For no rotation of the box:

  ```java
  rotate(0);
  ```  
  
  #### Rotate Top-Left

  ![Rotate Top-Left](/img/posts/pjs-ninja-rotate-point-five.png)

  To rotate around origin of box [defaults origin is] `(0x, 0y)`:
  
  ```java
  rotate(0.5);
  ```
  
  ####  Rotate Center
  
  ![Rotate Center](/img/posts/pjs-ninja-rotate-translate.png)

  To translate the origin to `(50x, 50y)` [and rotate around the center]:
  
  ```java
  translate(50, 50);
  rotate(0.5);
  translate(-50, -50);
  ```

- `scale(x, y)`
  
  This changes the size of the current matrix. You can pass one argument to scale the matrix’s X and Y axes proportionally, or pass different values for X and Y to warp the image. The statement `scale(2)` will multiply the coordinates by 200% and `scale(0.5)` will halve the size of everything within your matrix.

### Stop Hitting Yourself!

An effective ninja wouldn’t be complete without limbs. So use the Limb class from `ninja.classes.lib` to add the following to the top of your sketch:

```java
// Something to hit with...
Limb armL = new Limb({ x: -30, y: 0, restX: 0, restY: 0, boneLength: 30 });
Limb armR = new Limb({ x: 30,  y: 0, restX: 400, restY: 0, boneLength: 30 });
Limb legL = new Limb({ x: -65, y: 75, restX: 25, restY: 40, boneLength: 30 });
Limb legR = new Limb({ x: 65,  y: 75, restX: 25, restY: 40, boneLength: 30 });
```

The Limb class handles the simple physics for your ninja’s arms. The `restX` and `restY` variables store the direction at which the arms come to rest.

For your ninja, the arms will always rest in the direction of the mouse. To achieve this, we add the following code to the beginning of our `drawNinja()` function.

```java
void drawNinja(){
   // Apply Tracking to Left Arm
  armL.restX = trackX; armL.restY = trackY;
  // Apply Tracking to Right Arm
  armR.restX = trackX; armR.restY = trackY;
  // Apply Tracking to Left Leg
  legL.restX = -25-sin(trackAngle);
   // Apply Tracking to Right Leg
  legR.restX = 25-sin(trackAngle);
  pushMatrix();
```

Now that the Limbs know where to point next, call the method that does the pointing: `limb.calc()`. After the limb’s position has been updated, you can call `limb.draw()` to render the object to the canvas.

Add the following code between the matrices in the `drawNinja()` function.

```java
void drawNinja(){
  armL.restX = trackX; armL.restY = trackY;
  armR.restX = trackX; armR.restY = trackY;
  legL.restX = -25-sin(trackAngle);
  legR.restX = 25-sin(trackAngle);
  ...
       popMatrix();
       armL.calc(); armL.draw();
       armR.calc(); armR.draw();
     popMatrix();
     legL.calc(); legL.draw();
     legR.calc(); legR.draw();
   popMatrix();
  }
}
```

The deepest nested matrix can be called "matrix 3". This contains the ninja’s head. The second deepest is for the body and the shallowest represents the whole ninja object, which is offset by the values of `ninjaX` and `ninjaY`.

Placing different parts of the body in different matrices enables you to control various parts of the character independently. So add the arms to the same matrix as the body – since the arms are primarily attached to the body, they should move when it moves.

The legs are primarily attached to the ground, so place the legs in the root matrix, and point them in the direction of the body to create the sense that your ninja behaves much like he would in the real world.

Now that your character can move like a ninja, it’s time you made him look like one. There’s a nice shortcut you can take when you want to apply an array of styles to multiple objects. Create a function to do just this.

```java
// Apply Common Styles Before Draw Callbacks
void ninjaStyle(Object callBack){
  style({ noFill:true, stroke:#000000, strokeWeight:20.5 });
  callBack();
  style({ stroke:#2a2a2b, strokeWeight:15 });
  callBack();
  style({ strokeJoin:ROUND, fill:#1d1d1e, stroke:#1d1d1e, strokeWeight:10 });
  callBack();
};
```

The `ninjaStyle()` function takes one argument: a function. The function you pass to your style method contains an arbitrary draw command. The styles for your ninja are created by stroking thinner grey lines over thicker black ones.

When the `ninjaStyle()` function receives a draw command, it applies the first style, then executes the command it was passed. Next, it applies the second style, and so on.

This significantly reduces the number of lines of code in the sketch \[making it easier to understand at a glance\].

Next, update the code in `drawNinja()` to apply some stealthy styles:

```java
void drawNinja(){
  ...
  popMatrix();  
  armL.calc();
  ninjaStyle(function(){ armL.draw(); });
  armR.calc();
  ninjaStyle(function(){ armR.draw(); });
  popMatrix();
  legL.calc();
  ninjaStyle(function(){ legL.draw(); });
  legR.calc();
  ninjaStyle(function(){ legR.draw(); });
  popMatrix();
}
```

Finally, add the finishing touches to the ninja. To reduce the total number of lines of code and make it easier to read, create an intermediary stage to handle the limbs.

The `drawLimbs()` function receives an array of Limb objects, calculates their positions and passes them to the `ninjaStyle()` function to draw.

```java
void drawLimbs(Object limbs){
  for (var i=0, l=limbs.length; i < l; i++) {
    limbs[i].calc();
    ninjaStyle(function(){ limbs[i].draw(); });
  }
};
```

With this intermediary function, you can calculate and draw the arms with:

```java
drawLimbs([armL, armR]);
```

Now things are neater, give the ninja a face with the `beginShape()`, `bezierVertex(x, y, x1, y1, x2, y2)` and `endShape()` commands. You can use the previously mentioned tracking variables to make the eyes follow the mouse, and even apply the common styles to his body.

Here’s the complete code:

```java
// Something to hit with...
Limb armL = new Limb({ x: -30, y: 0, restX: 0, restY: 0, boneLength: 30 });
Limb armR = new Limb({ x: 30, y: 0, restX: 400, restY: 0, boneLength: 30 });
Limb legL = new Limb({ x: -65, y: 75, restX: 25, restY: 40, boneLength: 30 });
Limb legR = new Limb({ x: 65, y: 75, restX: 25, restY: 40, boneLength: 30 });

// Setup Screen
void setup(){
  frameRate(60);
  size(400, 300);
};

int ninjaX=width/2; ninjaY=height/2;
float trackAngle=0, trackX=0, trackY=0;

// Main Looping Draw Routine
void draw(){
  style({ background:#555658, noStroke:true, fill:#3e3e40 });
  rect(0, height/2, width, height);
  drawNinja();
};

void mouseMoved(){
  // Track Ninja to Mouse
  trackX = mouseX-ninjaX; trackY = mouseY-ninjaY;
  // Set the Track Angle
  trackAngle = -atan2(trackX, trackY);
};

void drawNinja(){
  // Apply Tracking to Left Arm
  armL.restX = trackX; armL.restY = trackY;
  // Apply Tracking to Right Arm
  armR.restX = trackX; armR.restY = trackY;
  // Apply Tracking to Left Leg
  legL.restX = -25-sin(trackAngle);
  // Apply Tracking to Right Leg
  legR.restX = 25-sin(trackAngle);
  pushMatrix();
    translate(ninjaX, ninjaY);
    fill(#3a3a3c);
    // Shadow [on floor under the ninja]
    ellipse(0+sin(trackAngle)*2, 80, 160, 30);
    // Draw Legs
    drawLimbs([legL, legR]);
    pushMatrix();
      // Offset Ninja by Tracking Angle
      translate(-sin(trackAngle)*4,0);
      // Draw Body Box
      ninjaStyle(function(){ rect(-20, 0, 40, 40); });
      pushMatrix(); // Draw Mask
        translate(-sin(trackAngle), -40);
        // Draw Head
        ninjaStyle(function(){ arc(0, 0, 60, 0, TWO_PI, false); });
        style({ fill:#eac89e, stroke:#2a2a2b, strokeWeight:3 });
        // Draw Skin on Face
        beginShape();
          bezierVertex(-30, 0, -60, 0, -25, 25);
          bezierVertex(-15, 30, 25, 25, 30, 0);
        endShape();
        style({ fill:#000000, stroke:#caab8e, strokeWeight:3 });
        // Draw Left Eye
        arc(-10-sin(trackAngle)*7, 8, 6, 6, TWO_PI, 0);
        // Draw Right Eye
        arc( 10-sin(trackAngle)*7, 8, 6, 6, TWO_PI, 0);
        popMatrix();
        drawLimbs([armL, armR]);
    popMatrix();
  popMatrix();
};

void drawLimbs(Object limbs){
  for (var i=0, l=limbs.length; i < l; i++) {
    limbs[i].calc();
    ninjaStyle(function(){ limbs[i].draw(); });
  }
};

// Apply Common Styles Before Draw Callbacks
void ninjaStyle(Object callBack){
  style({ noFill:true, stroke:#000000, strokeWeight:20.5 });
  callBack();
  style({ stroke:#2a2a2b, strokeWeight:15 });
  callBack();
  style({ strokeJoin:ROUND, fill:#1d1d1e, stroke:#1d1d1e, strokeWeight:10 });
  callBack();
};
```

<iframe class="lifted" width="400" height="300"
  style="max-width: 400px; width: 100%;" 
  src="/code/pjs-ninja/ninja-step-by-step/ninja-step-8">
</iframe>

> ### ☝ Try The Demo
> 
> Try moving your mouse around over the Ninja above to see the complete code in action.

Congratulations on making your own JavaScript ninja without any browser plug-ins [like Flash]!

What you decide to do with your ninja is up to you. I turned mine into the main character of a dojo-smashing arcade game that updates the DOM with your score.

Try out the ninja-final-game find out ... is your foo strong enough to beat the clock?
