// Artist's Statement: I think this piece is still a work in progress, but basically, when trying to make a different
// data visualizaiton, I wanted to look into different colors that have been used to show male/female classifications in 
// journalistic graphic design. 

// Most of the time, we just think about using pink and blue, but what else has been done?

// I found this fascinating so I wanted to turn it into a data visualization in itself.

// gathered data myself, using this article as inspiration https://blog.datawrapper.de/gendercolor/ 
// with more time would want to include more data

// used chatgpt a decent amount to help with the click states and the sorting

let data;
let layout = 'scattered'; // Default layout
let bars = []; // Array to store the bar objects
let transitionSpeed = 0.05; // Speed of the transition
let topBarHeight; // Height for the top black bar
let bottomBarHeight; // Height for the bottom black bar
let clickedOrganization = null; // Store the currently clicked organization

function preload() {
  data = loadTable('Binary Gender Colors - Sheet2-3.csv', 'csv', 'header');
	abril = loadFont('AbrilFatface-Regular.ttf');
	montserrat = loadFont('Montserrat-Regular.ttf');
	bold = loadFont('Montserrat-Bold.ttf');
}

function setup() {
  createCanvas(0.6 * windowHeight, 0.9 * windowHeight);
  topBarHeight = height * 0.15; // Set the height for the black bar at the top (15% of page)
  bottomBarHeight = height * 0.1; // Set the height for the black bar at the bottom (10% of page)
  createBars(); // Initialize bar objects
	
  noLoop(); // Disable looping until mouse is pressed to initiate animation
}

function draw() {
  background(255);
  
  // Draw the black bar at the top
  fill(0);
  noStroke();
	textFont(montserrat);
	textSize(13);
  rect(0, 0, width, topBarHeight); // Black bar at the top taking 15% of the page
  fill(255); // White text color for contrast
  textAlign(CENTER, CENTER);

  // Draw the black bar at the bottom
  fill(0);
  noStroke();
  rect(0, height - bottomBarHeight, width, bottomBarHeight); // Black bar at the bottom
  
  // Display the organization name in the bottom bar if one is clicked
  if (clickedOrganization !== null) {
    fill(255); // White text for the organization name
    textSize(height * 0.025); // Size relative to screen height
    textAlign(CENTER, CENTER);
    text(clickedOrganization + "\n (click to reset)", width / 2, height -  bottomBarHeight / 2); // Center text in the bottom bar
		
  }

  if (layout === 'scattered') {
    // First part of the descriptive text
    fill(255); // White text for the description
    textSize(height * 0.02); // Size relative to screen height
    textAlign(CENTER, CENTER);
    text("A look into different ways news organizations use color in \n graphics to visually depict binary gender classifications\n (men vs. women)", 
         width / 2, topBarHeight / 2);

    // Main title with colored words
    textFont(abril);
    textSize(height * 0.08); // Adjust the size of the text relative to height

    // "Beyond" in regular color
    fill(0); // Black for the word "Beyond"
    text("Beyond", width / 2, height / 2 - height * 0.1); // Position relative to height

    // "Pink" in pink color
    fill('#FF69B4'); // Pink color for "Pink"
    text("Pink", width / 2, height / 2);

    textAlign(CENTER, CENTER);
    fill(0); // Black for the "&" symbol
    text("&", width / 2 - textWidth("Blue") / 2 - height * 0.01, height / 2 + height * 0.1); // Adjust position to align with "Blue"

    fill('#1E90FF'); // Blue color for "Blue"
    text("Blue", width / 2 + textWidth("&") / 2 + height * 0.01, height / 2 + height * 0.1); // Same line as "&"

    // "CLICK TO ENTER" text
	  fill(0);
    textFont(montserrat);
    textSize(height * 0.025); // Smaller text relative to height
	  text("PRESS SPACE TO \nSWITCH BETWEEN \nSCREENS", width / 2, height * 0.75); // Relative positioning
  }

  else{
		fill(255);
		textFont(montserrat);
		textSize(15);
		if (layout === 'neatlyArranged'){
		text("DEPICT MEN", 
				 width / 4, 2*topBarHeight / 3); 
		text("DEPICT WOMEN", 
				 3 * width / 4, 2* topBarHeight / 3);
		textFont(abril);
		textSize(24);
		text("COLORS USED TO", width/2, topBarHeight/3)
		}
		if (layout === 'sortedByH'){
		text("DEPICT MEN", 
				 width / 4, 2*topBarHeight / 3); 
		text("DEPICT WOMEN", 
				 3 * width / 4, 2* topBarHeight / 3);
		textFont(abril);
		textSize(24);
		text("SORTED COLORS USED TO", width/2, topBarHeight/3)
		}
		if (layout === 'paired' ){
		text("COLOR FOR MEN", 
				 width / 4, 2*topBarHeight / 3); 
		text("COLOR FOR WOMEN", 
				 3 * width / 4, 2* topBarHeight / 3);
		textFont(abril);
		textSize(24);
		text("MATCHED PAIRS", width/2, topBarHeight/3)
		}
		if (layout === 'sortedByMenH' ){
		text("SORTED BY MEN", 
				 width / 4, 2*topBarHeight / 3); 
		textFont(abril);
		textSize(24);
		text("MATCHED PAIRS", width/2, topBarHeight/3)
		}
		if (layout === 'sortedByWomenH' ){
		text("SORTED BY WOMEN", 
				 3 * width / 4, 2* topBarHeight / 3);
		textFont(abril);
		textSize(24);
		text("MATCHED PAIRS", width/2, topBarHeight/3)
		}
	}

  let moving = false; // Track if any bar is still moving

  // Update and draw each bar below the black bar
  for (let bar of bars) {
    bar.update();
    bar.display();

    // Check if any bar is still moving
    if (!bar.isAtTarget()) {
      moving = true;
    }
  }

  // Stop looping if no bars are moving
  if (!moving) {
    noLoop();
  }
}

// Function to create bar objects
function createBars() {
  let numBars = data.getRowCount();
  let availableHeight = height - topBarHeight - bottomBarHeight; // Adjust available height for the bars
  let barHeight = (availableHeight / numBars) * 0.9; // Height for each bar
  let verticalGap = (availableHeight / numBars) * 0.1; // Vertical gap between bars

  for (let i = 0; i < numBars; i++) {
    let org = data.getString(i, "Journalist Organization");
    let menColor = data.getString(i, "Men");
    let womenColor = data.getString(i, "Women");

    if (!org || !menColor || !womenColor) {
      continue; // Skip if any data is missing
    }

    // Initial positions for peeking bars
    let menX = random(width / 8, width / 4);
    let womenX = random(width / 8, width / 4);
    let yPos = topBarHeight + i * (barHeight + verticalGap); // Adjust starting Y position

    // Convert colors to H values for sorting
    let [rMen, gMen, bMen] = hexToRgb(menColor);
    let [hMen] = rgbToHsl(rMen, gMen, bMen);

    let [rWomen, gWomen, bWomen] = hexToRgb(womenColor);
    let [hWomen] = rgbToHsl(rWomen, gWomen, bWomen);

    // Create the bar object and add it to the array
    bars.push(new Bar(menX, womenX, yPos, barHeight, menColor, womenColor, hMen, hWomen, i, org));
  }
}

// Bar class to represent individual bars
class Bar {
  constructor(menX, womenX, yPos, barHeight, menColor, womenColor, hMen, hWomen, index, organization) {
    this.index = index;
    this.organization = organization; // Store the organization for this bar
    this.currentMenX = menX;
    this.currentWomenX = womenX;
    this.currentLeftY = yPos;
    this.currentRightY = yPos;
    this.targetMenX = menX;
    this.targetWomenX = womenX;
    this.targetLeftY = yPos;
    this.targetRightY = yPos;
    this.barHeight = barHeight;
    this.menColor = menColor;
    this.womenColor = womenColor;
    this.hMen = hMen;
    this.hWomen = hWomen;
  }
  
  update() {
    this.currentMenX = lerp(this.currentMenX, this.targetMenX, transitionSpeed);
    this.currentWomenX = lerp(this.currentWomenX, this.targetWomenX, transitionSpeed);
    this.currentLeftY = lerp(this.currentLeftY, this.targetLeftY, transitionSpeed);
    this.currentRightY = lerp(this.currentRightY, this.targetRightY, transitionSpeed);
  }
  
  display() {
    noStroke();
    
    let fadeAmount = (clickedOrganization === null || clickedOrganization === this.organization) ? 255 : 25;

    // Draw men's bar (left side)
    fill(red(this.menColor), green(this.menColor), blue(this.menColor), fadeAmount);
    rect(0, this.currentLeftY, this.currentMenX, this.barHeight);
    
    // Draw women's bar (right side)
    fill(red(this.womenColor), green(this.womenColor), blue(this.womenColor), fadeAmount);
    rect(width - this.currentWomenX, this.currentRightY, this.currentWomenX, this.barHeight);
  }
  
  moveTo(menX, womenX, leftY, rightY = leftY) {
    this.targetMenX = menX;
    this.targetWomenX = womenX;
    this.targetLeftY = leftY;
    this.targetRightY = rightY !== undefined ? rightY : leftY;
  }
  
  // Check if the bar has reached its target position
  isAtTarget() {
    return (
      Math.abs(this.currentMenX - this.targetMenX) < 0.1 &&
      Math.abs(this.currentWomenX - this.targetWomenX) < 0.1 &&
      Math.abs(this.currentLeftY - this.targetLeftY) < 0.1 &&
      Math.abs(this.currentRightY - this.targetRightY) < 0.1
    );
  }
  
  isMouseOver() {
    return (mouseY >= this.currentLeftY && mouseY <= this.currentLeftY + this.barHeight);
  }
}

function keyPressed() {
  if (key === ' ') {
  let numBars = data.getRowCount();
  let availableHeight = height - topBarHeight - bottomBarHeight; // Adjust height to account for black bars
  let barHeight = availableHeight / numBars; // Dynamically adjust bar height

  if (layout === 'scattered') {
    layout = 'neatlyArranged';
    
    for (let i = 0; i < bars.length; i++) {
      let menX = width / 2 - 50; // Offset men slightly left from center
      let womenX = width / 2 - 50; // Offset women slightly left from center
      let yPos = i * barHeight + topBarHeight; // Adjust Y position to account for the top bar
      bars[i].moveTo(menX, womenX, yPos);
    }

    loop(); // Restart the animation loop
  } else if (layout === 'neatlyArranged') {
    layout = 'sortedByH';
    
    // Create independent arrays for men and women sides
    let leftSide = bars.map((bar, index) => ({
      originalBar: bar,
      hValue: bar.hMen,
      index: index
    }));
    
    let rightSide = bars.map((bar, index) => ({
      originalBar: bar,
      hValue: bar.hWomen,
      index: index
    }));
    
    // Sort both arrays independently by H value
    leftSide.sort((a, b) => a.hValue - b.hValue);
    rightSide.sort((a, b) => a.hValue - b.hValue);
    
    // Create a mapping of original indices to new sorted positions
    let leftPositions = new Map();
    let rightPositions = new Map();
    
    leftSide.forEach((item, index) => {
      leftPositions.set(item.originalBar, index);
    });
    
    rightSide.forEach((item, index) => {
      rightPositions.set(item.originalBar, index);
    });
    
    // Update each bar's position based on its sorted position in both arrays
    bars.forEach(bar => {
      let leftY = leftPositions.get(bar) * barHeight + topBarHeight;
      let rightY = rightPositions.get(bar) * barHeight + topBarHeight;
      
      bar.moveTo(
        width / 2 - 50,  // Men slightly left of center
        width / 2 - 50,  // Women slightly left of center
        leftY,           // Y position based on men's sort
        rightY           // Y position based on women's sort
      );
    });

    loop(); // Restart the animation loop
  } else if (layout === 'sortedByH') {
    layout = 'paired';

    // Step 1: Sort the bars vertically and then move horizontally
    for (let i = 0; i < bars.length; i++) {
      // Sort vertically first
      let yPos = i * barHeight + topBarHeight; // Sorted vertically by their index
      bars[i].moveTo(bars[i].currentMenX, bars[i].currentWomenX, yPos); // Move to sorted vertical position
      
      // Then move horizontally to the center
      let menX = width / 2; // Move men to center
      let womenX = width / 2; // Move women to center
      bars[i].moveTo(menX, womenX, yPos); // Move horizontally after vertical sort
    }
    
    loop(); // Continue the animation
  } else if (layout === 'paired') {
    layout = 'sortedByMenH';
    
    // Sort the entire pairings based on men's H values
    bars.sort((a, b) => a.hMen - b.hMen);
    
    // Move the pairings to their new sorted positions
    for (let i = 0; i < bars.length; i++) {
      let menX = width / 2; // Men will extend to the center
      let womenX = width / 2; // Women extend to the center
      let yPos = i * barHeight + topBarHeight; // Sorted based on men’s H
      bars[i].moveTo(menX, womenX, yPos);
    }
    
    loop();
  } else if (layout === 'sortedByMenH') {
    layout = 'sortedByWomenH';
    
    // Sort the entire pairings based on women's H values
    bars.sort((a, b) => a.hWomen - b.hWomen);
    
    // Move the pairings to their new sorted positions
    for (let i = 0; i < bars.length; i++) {
      let menX = width / 2; // Left side for men, extending to the center
      let womenX = width / 2; // Right side for women, extending to the center
      let yPos = i * barHeight + topBarHeight; // Sorted based on women’s H
      bars[i].moveTo(menX, womenX, yPos);
    }
    
    loop();
  } else if (layout === 'sortedByWomenH') {
    layout = 'scattered'; // Transition back to scattered layout
    
    for (let i = 0; i < bars.length; i++) {
      let menX = random(width / 8, width / 4); // Random X for men
      let womenX = random(width / 8, width / 4); // Random X for women
      let yPos = i * barHeight + topBarHeight; // Original vertical position
      bars[i].moveTo(menX, womenX, yPos);
    }
    
    loop();
  }
}
}

function mousePressed() {
   if (mouseY >= height - bottomBarHeight) {
    clickedOrganization = null; // Reset if the bottom bar is clicked
    loop(); // Redraw to remove any fade effects
    return;
  }
  
  // Check if any bar is clicked
  for (let bar of bars) {
    if (bar.isMouseOver()) {
      clickedOrganization = bar.organization; // Set the clicked organization
      loop(); // Redraw the bars to reflect the highlight/fade
      return;
    }
  }
  
  clickedOrganization = null; // Reset if no bar is clicked
  loop(); // Redraw to remove any fade effects
	
}

// Helper functions to convert hex to RGB and RGB to HSL
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}
