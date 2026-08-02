const { Jimp } = require('jimp');
const files = ['apprenant-dashboard.png','apprenant-certification.png','apprenant-messagerie.png','centre-dashboard.png'];
(async () => {
  for (const file of files) {
    const image = await Jimp.read(file);
    console.log(file, image.bitmap.width, image.bitmap.height);
  }
})();
