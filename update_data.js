const fs = require('fs');
const path = require('path');

const files = [
  'anime_1771338685459.json',
  'series_1771340242683.json',
  'asian_1771340266137.json',
  'animation_1771340258075.json'
];

files.forEach(filename => {
  const filePath = path.join('attached_assets', filename);
  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updatedData = data.map(item => {
    if (!item.episodes) return item;

    const seasonsMap = {};
    item.episodes.forEach(ep => {
      const s = ep.season || 1;
      seasonsMap[s] = (seasonsMap[s] || 0) + 1;
    });

    const seasonsSummary = Object.keys(seasonsMap).map(s => ({
      season: parseInt(s),
      episodesCount: seasonsMap[s]
    })).sort((a, b) => a.season - b.season);

    // Remove episodes and add seasonsSummary
    const { episodes, ...rest } = item;
    return {
      ...rest,
      seasonsSummary
    };
  });

  const outputFilename = filename.split('_')[0] + '.json';
  fs.writeFileSync(path.join('client/src/data', outputFilename), JSON.stringify(updatedData, null, 2));
  console.log(`Updated ${outputFilename}`);
});
