import json
import os
import re

def get_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^\u0600-\u06FFa-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

def create_sitemap(urls, filename):
    content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in urls:
        content += '  <url>\n'
        content += f'    <loc>{url["loc"]}</loc>\n'
        content += f'    <lastmod>2026-02-21</lastmod>\n'
        content += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
        content += f'    <priority>{url["priority"]}</priority>\n'
        content += '  </url>\n'
    content += '</urlset>'
    with open(f'client/public/{filename}', 'w') as f:
        f.write(content)

base_url = "https://anixo.netlify.app"

# Main Index
index_urls = [
    {"loc": f"{base_url}/", "changefreq": "daily", "priority": "1.0"},
    {"loc": f"{base_url}/movies", "changefreq": "daily", "priority": "0.9"},
    {"loc": f"{base_url}/series", "changefreq": "daily", "priority": "0.9"},
    {"loc": f"{base_url}/anime", "changefreq": "daily", "priority": "0.9"},
    {"loc": f"{base_url}/animation", "changefreq": "daily", "priority": "0.8"},
    {"loc": f"{base_url}/asian", "changefreq": "daily", "priority": "0.8"},
]

data_files = {
    "movies": "client/src/data/movies.json",
    "series": "client/src/data/series.json",
    "anime": "client/src/data/anime.json",
    "animation": "client/src/data/animation.json",
    "asian": "client/src/data/asian.json"
}

sitemap_index = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
sitemap_index += f'  <sitemap><loc>{base_url}/sitemap-main.xml</loc></sitemap>\n'

create_sitemap(index_urls, "sitemap-main.xml")

for key, path in data_files.items():
    if os.path.exists(path):
        with open(path, 'r') as f:
            items = json.load(f)
            urls = []
            # Limit to 1000 items per sitemap for performance in this mockup
            for item in items[:1000]:
                raw_id = str(item['id'])
                clean_id = raw_id.replace("tmdb-anime-", "").replace("tmdb-series-", "").replace("tmdb-movie-", "")
                slug = get_slug(item['title'])
                urls.append({"loc": f"{base_url}/details/{clean_id}/{slug}", "changefreq": "weekly", "priority": "0.6"})
                urls.append({"loc": f"{base_url}/watch/{clean_id}/{slug}", "changefreq": "weekly", "priority": "0.5"})
            
            filename = f"sitemap-{key}.xml"
            create_sitemap(urls, filename)
            sitemap_index += f'  <sitemap><loc>{base_url}/{filename}</loc></sitemap>\n'

sitemap_index += '</sitemapindex>'
with open('client/public/sitemap.xml', 'w') as f:
    f.write(sitemap_index)
