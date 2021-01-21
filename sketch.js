let imgs = []; // Store all face images
let avgImg; // Where we'll generate the average face
const numOfImages = 30; // Number of facees used

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
}

/**
 * P5 draw functionality
 *
 * @return void.
 */
function draw() {
  background(125);

  // Draw first (left) image
  drawImage();

  // Call the loadPixels function on relevant elements
  doLoadPixels();

  // Set the average image to red (gets overwritten later)
  setAverageImageToRed();

  // Generates the average face image
  generateAverageFace();

  // Intensive, so don't loop
  noLoop();
}

/**
 * Draw the first (left) image
 *
 * @return void.
 */
function drawImage () {
  image(imgs[0], 0, 0);
}

/**
 * Call the loadPixels function on relevant elements
 *
 * @return void.
 */
function doLoadPixels () {
  for (let i = 0, j = imgs.length; i < j; i++) {
    imgs[i].loadPixels();
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
  // Update average image
  avgImg.updatePixels();
  image(avgImg, imgs[0].width, 0);
}

/**
 * Generates the average face image
 *
 * @return void.
 */
function generateAverageFace () {
  for (let i = 0; i < imgs[0].width; i++) {
    for (let j = 0; j < imgs[0].height; j++) {
      let index = ((imgs[0].width * j) + i) * 4;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      // Find the channel sum for each pixel of each image
      for (let k = 0; k < imgs.length; k++) {
        sumR += imgs[k].pixels[index + 0];
        sumG += imgs[k].pixels[index + 1];
        sumB += imgs[k].pixels[index + 2];
      }
      // Add the average of the channels to the channels of the avImg
      avgImg.pixels[index + 0] = sumR / imgs.length;
      avgImg.pixels[index + 1] = sumG / imgs.length;
      avgImg.pixels[index + 2] = sumB / imgs.length;
      avgImg.pixels[index + 3] = 255;
    }
  }
  // Update average image
  avgImg.updatePixels();
  image(avgImg, imgs[0].width, 0);
}
