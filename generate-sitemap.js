const fs = require('fs');
const animeData = require('./client/src/data/anime.json');
const movieData = require('./client/src/data/movies.json');
const seriesData = require('./client/src/data/series.json');
const asianData = require('./client/src/data/asian.json');
const animationData = require('./client/src/data/animation.json');

const baseUrl = 'https://anixo.netlify.app';

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const staticPages = [
  '',
  '/movies',
  '/series',
  '/anime',
  '/animation',
  '/asian'
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

staticPages.forEach(page => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}${page}</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

const allContent = [
  ...animeData.map(item => ({ ...item, type: 'anime' })),
  ...movieData.map(item => ({ ...item, type: 'movie' })),
  ...seriesData.map(item => ({ ...item, type: 'series' })),
  ...asianData.map(item => ({ ...item, type: 'asian' })),
  ...animationData.map(item => ({ ...item, type: 'animation' }))
];

allContent.forEach(item => {
  const slug = getSlug(item.title);
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/details/${item.id}/${slug}</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.6</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>';

fs.writeFileSync('./client/public/sitemap.xml', xml);
console.log('Sitemap generated with ' + allContent.length + ' dynamic links');
