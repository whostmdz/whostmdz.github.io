// Configuration RSS - Remplacez par vos flux
const RSS_FEEDS = [
  'https://www.lemondeinformatique.fr/flux-rss/thematique/toutes-les-actualites/rss.xml',
  'https://korben.info/feed',
  'https://www.undernews.fr/feed',
  // Ajoutez d'autres flux RSS ici
];

// Pour Inoreader, vous pouvez utiliser leur API ou flux public
// Exemple : 'https://www.inoreader.com/stream/user/VOTRE_USER_ID/tag/VOTRE_TAG'

// Fonction pour charger les flux RSS via un proxy CORS
async function loadRSSFeed(feedUrl) {
  try {
    // Utilisation de rss2json (service gratuit pour convertir RSS en JSON)
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.status === 'ok') {
      return data.items;
    } else {
      console.error('Erreur RSS:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Erreur lors du chargement du flux:', error);
    return [];
  }
}

// Fonction pour charger tous les flux
async function loadAllFeeds() {
  const loading = document.getElementById('loading');
  const rssFeed = document.getElementById('rss-feed');
  const fallback = document.getElementById('fallback-articles');
  
  loading.style.display = 'block';
  rssFeed.innerHTML = '';
  
  try {
    // Charger tous les flux en parallèle
    const feedPromises = RSS_FEEDS.map(url => loadRSSFeed(url));
    const feedResults = await Promise.all(feedPromises);
    
    // Combiner tous les articles
    let allArticles = [];
    feedResults.forEach(items => {
      if (items && items.length > 0) {
        allArticles = allArticles.concat(items);
      }
    });
    
    if (allArticles.length === 0) {
      // Si aucun article, afficher le contenu de secours
      rssFeed.style.display = 'none';
      fallback.style.display = 'grid';
      loading.style.display = 'none';
      return;
    }
    
    // Trier par date (plus récent en premier)
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    // Limiter à 12 articles
    allArticles = allArticles.slice(0, 12);
    
    // Afficher les articles
    rssFeed.style.display = 'grid';
    fallback.style.display = 'none';
    
    allArticles.forEach(article => {
      const articleEl = createArticleElement(article);
      rssFeed.appendChild(articleEl);
    });
    
  } catch (error) {
    console.error('Erreur générale:', error);
    rssFeed.style.display = 'none';
    fallback.style.display = 'grid';
  }
  
  loading.style.display = 'none';
}

// Fonction pour créer un élément article
function createArticleElement(article) {
  const articleDiv = document.createElement('article');
  articleDiv.className = 'veille-item';
  
  // Formater la date
  const date = new Date(article.pubDate);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Nettoyer la description (enlever les tags HTML)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = article.description || article.content || '';
  let description = tempDiv.textContent || tempDiv.innerText || '';
  
  // Limiter la description à 200 caractères
  if (description.length > 200) {
    description = description.substring(0, 200) + '...';
  }
  
  articleDiv.innerHTML = `
    <h3>${article.title}</h3>
    <div class="date">${formattedDate}</div>
    <p>${description}</p>
    <a href="${article.link}" target="_blank" rel="noopener">Lire l'article →</a>
  `;
  
  return articleDiv;
}

// Charger les flux au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadAllFeeds();
  
  // Bouton de rafraîchissement
  const refreshBtn = document.getElementById('refresh-feed');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadAllFeeds();
    });
  }
});

// Actualiser automatiquement toutes les 15 minutes
setInterval(() => {
  loadAllFeeds();
}, 15 * 60 * 1000);