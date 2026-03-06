const fs = require('fs');
const path = require('path');

function getSlug(title) {
    let slug = title.toLowerCase();
    slug = slug.replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '');
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/-+/g, '-');
    return slug.trim();
}

function createSitemap(urls, filename) {
    let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
    content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const url of urls) {
        content += '  <url>\n';
        content += `    <loc>${url.loc}</loc>\n`;
        content += `    <lastmod>2026-02-21</lastmod>\n`;
        content += `    <changefreq>${url.changefreq}</changefreq>\n`;
        content += `    <priority>${url.priority}</priority>\n`;
        content += '  </url>\n';
    }
    content += '</urlset>';
    fs.writeFileSync(path.join('client/public', filename), content);
}

const baseUrl = "https://anixo.netlify.app";

const indexUrls = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/movies`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/series`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/anime`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/animation`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/asian`, changefreq: 'daily', priority: '0.8' },
];

const dataFiles = {
    "movies": "client/src/data/movies.json",
    "series": "client/src/data/series.json",
    "anime": "client/src/data/anime.json",
    "animation": "client/src/data/animation.json",
    "asian": "client/src/data/asian.json"
};

let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
sitemapIndex += `  <sitemap><loc>${baseUrl}/sitemap-main.xml</loc></sitemap>\n`;

createSitemap(indexUrls, "sitemap-main.xml");

for (const [key, filePath] of Object.entries(dataFiles)) {
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const items = JSON.parse(rawData);
        const urls = [];
        // Limit items to avoid huge files in mockup
        for (const item of items.slice(0, 1000)) {
            const rawId = String(item.id);
            const cleanId = rawId.replace("tmdb-anime-", "").replace("tmdb-series-", "").replace("tmdb-movie-", "");
            const slug = getSlug(item.title);
            urls.push({ loc: `${baseUrl}/details/${cleanId}/${slug}`, changefreq: 'weekly', priority: '0.6' });
            urls.push({ loc: `${baseUrl}/watch/${cleanId}/${slug}`, changefreq: 'weekly', priority: '0.5' });
        }
        
        const filename = `sitemap-${key}.xml`;
        createSitemap(urls, filename);
        sitemapIndex += `  <sitemap><loc>${baseUrl}/${filename}</loc></sitemap>\n`;
    }
}

sitemapIndex += '</sitemapindex>';
fs.writeFileSync('client/public/sitemap.xml', sitemapIndex);
