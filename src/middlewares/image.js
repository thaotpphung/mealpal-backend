const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');

const resizeBase64 = (base64Image, maxHeight = 640, maxWidth = 640) => {
  const destructImage = base64Image.split(';');
  const mimType = destructImage[0].split(':')[1];
  const imageData = destructImage[1].split(',')[1];
  let resizedImage = Buffer.from(imageData, 'base64');
  return new Promise(async function (resolve, reject) {
    resizedImage = await sharp(resizedImage)
      .resize(maxHeight, maxWidth)
      .toBuffer();
    const image = `data:${mimType};base64,${resizedImage.toString('base64')}`;
    resolve(image);
  });
};

module.exports = { resizeBase64 };
