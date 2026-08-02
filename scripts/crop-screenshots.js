const sharp = require('sharp');
const files = [
  { src: 'apprenant-dashboard.png', dst: 'public/images/apercu-dashboard-apprenant.png', crop: { left: 0, top: 120, width: 1523, height: 900 } },
  { src: 'apprenant-certification.png', dst: 'public/images/apercu-certificat.png', crop: { left: 0, top: 120, width: 1523, height: 500 } },
  { src: 'apprenant-messagerie.png', dst: 'public/images/apercu-messagerie.png', crop: { left: 0, top: 120, width: 1523, height: 450 } },
  { src: 'centre-dashboard.png', dst: 'public/images/apercu-centre.png', crop: { left: 0, top: 120, width: 1523, height: 450 } },
];

(async () => {
  for (const file of files) {
    await sharp(file.src)
      .extract(file.crop)
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(file.dst);
    const metadata = await sharp(file.dst).metadata();
    console.log('Saved', file.dst, metadata.width, metadata.height);
  }
})();
