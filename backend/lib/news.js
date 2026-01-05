export const fetchNewsByTopic = async (topic) => {
  const url = `https://newsapi.org/v2/everything?q=${topic}&pageSize=3&apiKey=${process.env.NEWS_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.articles.map(article => ({
    title: article.title,
    description: article.description || "Read full article",
    url: article.url,
    image: article.urlToImage || null,
    source: article.source.name,
    publishedAt: article.publishedAt,
  }));
};
