let imgs = []; // Store all face images
let avgImg; // Where we'll generate the average face
const numOfImages = 30; // Number of facees used
let currentImage;// Stores the current image so that a 'random' image is never one already being displayed
let imgAverages = []; // Store the average channels for each image
/**
 * P5 preload functionality
 *
 * @return void.
 */
function preload() {
  for (let i = 0; i < numOfImages; i++) {
    imgs = imgs.concat([loadImage(`./assets/${i}.jpg`)]);
  }
}

/**
 * P5 setup functionality
 *
 * @return void.
 */
function setup() {
  const firstImgWidth = imgs[0].width;
  const firstImgHeight = imgs[0].height;

  createCanvas(firstImgWidth * 2, firstImgHeight);
  pixelDensity(1);

  // Create average image
  avgImg = createGraphics(firstImgWidth, firstImgHeight);

  // Call the loadPixels function on relevant elements
  doLoadPixels();

  currentImage = getRandomImage();
  
}

/**
 * P5 draw functionality
 *
 * @return void.
 */
function draw() {
  background(125);

  // Draw first (left) image
  drawImage(currentImage);

  // Set the average image to red (gets overwritten later)
  // Commented out as it's not necessary for the further steps
  // setAverageImageToRed();

  // Generates the average face image
  generateAverageFace();

  // Intensive, so don't loop
  //noLoop();
}

/**
 * Draw the first (left) image
 *
 * @return void.
 */
function drawImage (index) {
  image(imgs[index], 0, 0);
}

function doLoadPixels () {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  const getSums = (img) => {
    img.loadPixels();
    const allPixels = img.width * img.height;
    for (let i = 0, j = allPixels; i < j; i++) {
      const x = floor(i / img.width); // X pixels
      const y = i % img.height; // Y pixels
      const index = ((img.width * y) + x) * 4; // Get pixel array
      imgAverages[index] = imgAverages[index] ? imgAverages[index] + img.pixels[index] : img.pixels[index]; 
      imgAverages[index + 1]= imgAverages[index + 1] ? imgAverages[index + 1] + img.pixels[index + 1] : img.pixels[index + 1]; 
      imgAverages[index + 2] = imgAverages[index + 2] ? imgAverages[index + 2] + img.pixels[index + 2] : img.pixels[index + 2]; 
      imgAverages[index + 3] = imgAverages[index + 3] ? imgAverages[index + 3] + img.pixels[index + 3] : img.pixels[index + 3]; 
    }
  }

  for (let i = 0, j = imgs.length; i < j; i++) {
    imgs[i].loadPixels();
    getSums(imgs[i]);
  }

  avgImg.loadPixels();
}



/**
 * Set the average image to red
 *
 * @return void.
 */
function setAverageImageToRed () {
  for (let i = 0; i < imgs[0].width; i++) {
    for (let j = 0; j < imgs[0].height; j++) {
      let index = ((imgs[0].width * j) + i) * 4;
      // Set channels to display red
      avgImg.pixels[index + 0] = 255;
      avgImg.pixels[index + 1] = 0;
      avgImg.pixels[index + 2] = 0;
      avgImg.pixels[index + 3] = 255;
    }
  }
  // Update average imageqsp
  avgImg.updatePixels();
  image(avgImg, imgs[0].width, 0);
}

/**
 * Generates the average face image
 *
 * @return void.
 */
function generateAverageFace () {

  let amount = 0;

  if (
    (mouseY > 0 && mouseY < height) &&
    (mouseX > width / 2)
  ) {
    amount = constrain(mouseX - avgImg.width, 0, avgImg.width);
  }
  
  //const amount = avgImg.width;
  
  //console.log(amount);

  const allPixels = imgs[0].width * imgs[0].height;
  for (let i = 0, j = allPixels; i < j; i++) {
    const x = floor(i / imgs[0].width); // X pixels
    const y = i % imgs[0].height; // Y pixels
    const index = ((imgs[0].width * y) + x) * 4; // Get pixel array


    avgImg.pixels[index + 0] = lerp(imgs[currentImage].pixels[index], imgAverages[index] / imgs.length, amount * (1 / avgImg.width));
    avgImg.pixels[index + 1] = lerp(imgs[currentImage].pixels[index + 1], imgAverages[index + 1] / imgs.length, amount * (1 / avgImg.width));
    avgImg.pixels[index + 2] = lerp(imgs[currentImage].pixels[index + 2], imgAverages[index + 2] / imgs.length, amount * (1 / avgImg.width));
    avgImg.pixels[index + 3] = 255;
  }



  //   avgImg.pixels[index + 0] = imgAverages[index] / imgs.length;
  //   avgImg.pixels[index + 1] = imgAverages[index + 1] / imgs.length;
  //   avgImg.pixels[index + 2] = imgAverages[index + 2] / imgs.length;
  //   avgImg.pixels[index + 3] = 255;
  // }

  // Update average image
  avgImg.updatePixels();
  image(avgImg, imgs[0].width, 0);
}

/**
 * P5 event listener - key presses
 *
 * @return void.
 */
function getRandomImage () {
  const randomImage = round(random(0, numOfImages - 1));
  if (currentImage && currentImage === randomImage) {
    return getRandomImage();
  }
  currentImage = randomImage;
  return randomImage;
}

/**
 * P5 event listener - key presses
 *
 * @return void.
 */
function keyPressed () {
  drawImage(getRandomImage());
}

// function _drawImage () {
//   if (
//     (mouseY > 0 && mouseY < height) &&
//     (mouseX > width / 2 && mouseX < width)
//   ) {
//     generateAverageFace();
//   }
// }

// function mouseMoved () {
//   _drawImage();
// }