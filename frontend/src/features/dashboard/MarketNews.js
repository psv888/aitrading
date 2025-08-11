import React, { useState, useEffect } from 'react';

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFullArticle, setShowFullArticle] = useState(null);

  // Mock news data - in production, this would come from a news API
  const mockNews = [
    {
      id: 1,
      title: "Federal Reserve Signals Potential Rate Cuts in 2024",
      summary: "The Federal Reserve indicated today that it may consider interest rate reductions in the coming year as inflation continues to moderate.",
      category: "economy",
      source: "Financial Times",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      impact: "high",
      fullArticle: "The Federal Reserve's latest monetary policy meeting concluded with dovish signals that have markets anticipating potential rate cuts in 2024. Chair Jerome Powell noted that while inflation remains above the 2% target, recent data suggests a continued cooling trend. The central bank maintained its current federal funds rate but updated its forward guidance to reflect a more accommodative stance. Market participants interpreted these signals as confirmation that the Fed's tightening cycle may be nearing its end, with rate cuts potentially beginning as early as March 2024. This dovish pivot has already influenced Treasury yields and equity markets, with the S&P 500 reaching new highs on the announcement."
    },
    {
      id: 2,
      title: "Tech Giants Report Strong Q4 Earnings",
      summary: "Major technology companies exceeded analyst expectations in their fourth-quarter earnings reports, driven by AI investments and cloud services growth.",
      category: "technology",
      source: "Bloomberg",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      impact: "medium",
      fullArticle: "Technology sector leaders including Apple, Microsoft, and Alphabet reported robust fourth-quarter earnings that surpassed Wall Street estimates. The strong performance was primarily driven by continued growth in cloud computing services and strategic investments in artificial intelligence infrastructure. Apple's iPhone sales remained resilient despite economic headwinds, while Microsoft's Azure cloud platform saw accelerated adoption. Alphabet's advertising revenue rebounded strongly, and the company highlighted progress in its AI initiatives. These results suggest that the tech sector's recovery from the 2022 downturn is gaining momentum, with AI and cloud services emerging as key growth drivers. Analysts expect this trend to continue into 2024, supported by enterprise digital transformation initiatives."
    },
    {
      id: 3,
      title: "Oil Prices Surge on Middle East Tensions",
      summary: "Crude oil futures jumped 3% following escalating tensions in the Middle East, raising concerns about supply disruptions in the region.",
      category: "commodities",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sentiment: "negative",
      impact: "high",
      fullArticle: "Oil markets experienced significant volatility as geopolitical tensions in the Middle East intensified, with Brent crude futures rising 3% to $85 per barrel. The escalation follows recent developments in the region that have raised concerns about potential supply disruptions. Energy analysts note that while direct supply impacts have been minimal so far, the risk premium has increased significantly. The situation has also affected natural gas markets, with European gas prices rising on supply security concerns. Market participants are closely monitoring developments, as any significant disruption could have broader implications for global energy markets and inflation. The Federal Reserve has previously noted that energy price volatility could complicate its inflation management efforts."
    },
    {
      id: 4,
      title: "Retail Sales Show Strong Holiday Season Performance",
      summary: "December retail sales data exceeded expectations, indicating robust consumer spending during the holiday season despite economic uncertainties.",
      category: "retail",
      source: "CNBC",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      impact: "medium",
      fullArticle: "The Commerce Department's latest retail sales report revealed stronger-than-expected consumer spending in December, with sales rising 0.6% month-over-month. This performance exceeded economist forecasts and suggests that consumer confidence remains resilient despite concerns about inflation and economic growth. The strong holiday season performance was particularly notable in online retail, which saw a 1.1% increase, while traditional brick-and-mortar stores also showed solid growth. Analysts attribute this strength to several factors, including a strong labor market, moderating inflation, and pent-up demand from the pandemic period. The data suggests that consumer spending, which accounts for approximately 70% of U.S. economic activity, continues to support economic growth and may help the economy avoid a recession in 2024."
    },
    {
      id: 5,
      title: "Cryptocurrency Markets Face Regulatory Uncertainty",
      summary: "Digital asset prices declined as regulatory clarity remains elusive, with multiple jurisdictions considering new cryptocurrency regulations.",
      category: "cryptocurrency",
      source: "CoinDesk",
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      sentiment: "negative",
      impact: "medium",
      fullArticle: "Cryptocurrency markets faced downward pressure as regulatory uncertainty continues to weigh on investor sentiment. Bitcoin and Ethereum both declined by approximately 5% as market participants await clarity on regulatory frameworks in major jurisdictions. The SEC's ongoing enforcement actions and pending decisions on spot Bitcoin ETF applications have created a cautious trading environment. Meanwhile, international regulators are developing coordinated approaches to digital asset oversight, with the European Union's MiCA regulations set to take full effect in 2024. Industry participants emphasize the need for regulatory clarity to support institutional adoption and market development. Despite the current uncertainty, some analysts remain optimistic about the long-term prospects for digital assets, particularly as traditional financial institutions continue to explore blockchain technology applications."
    }
  ];

  const categories = [
    { key: 'all', label: 'All News', count: mockNews.length },
    { key: 'economy', label: 'Economy', count: mockNews.filter(n => n.category === 'economy').length },
    { key: 'technology', label: 'Technology', count: mockNews.filter(n => n.category === 'technology').length },
    { key: 'commodities', label: 'Commodities', count: mockNews.filter(n => n.category === 'commodities').length },
    { key: 'retail', label: 'Retail', count: mockNews.filter(n => n.category === 'retail').length },
    { key: 'cryptocurrency', label: 'Crypto', count: mockNews.filter(n => n.category === 'cryptocurrency').length }
  ];

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#1ecb98';
      case 'negative': return '#f36c6c';
      case 'neutral': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa500';
      case 'low': return '#4ecdc4';
      default: return '#9e9e9e';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const published = new Date(timestamp);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '1px solid #2a2a4a',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📰</div>
        <div>Loading market news...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      border: '1px solid #2a2a4a'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          📰 Market News
        </h2>
        <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
          Last updated: {formatTimeAgo(new Date().toISOString())}
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: selectedCategory === category.key ? '2px solid #4a90e2' : '1px solid #2a2a4a',
              background: selectedCategory === category.key ? '#4a90e2' : 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* News List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredNews.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#1a1a3a',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #2a2a4a',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setShowFullArticle(showFullArticle === item.id ? null : item.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.1rem',
                  color: '#fff'
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#ccc',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {item.summary}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{
                  background: getSentimentColor(item.sentiment),
                  color: '#fff',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '600'
                }}>
                  {item.sentiment}
                </span>
                <span style={{
                  background: getImpactColor(item.impact),
                  color: '#fff',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '600'
                }}>
                  {item.impact} impact
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#aaa' }}>
              <span>{item.source}</span>
              <span>{formatTimeAgo(item.publishedAt)}</span>
            </div>

            {/* Full Article (Expandable) */}
            {showFullArticle === item.id && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#23243a',
                borderRadius: '8px',
                border: '1px solid #2a2a4a'
              }}>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#ddd',
                  fontSize: '0.9rem',
                  lineHeight: '1.6'
                }}>
                  {item.fullArticle}
                </p>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullArticle(null);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #4a90e2',
                      background: 'transparent',
                      color: '#4a90e2',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Show Less
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#aaa',
          fontSize: '1.1rem'
        }}>
          No news available for the selected category.
        </div>
      )}
    </div>
  );
};

export default MarketNews; 