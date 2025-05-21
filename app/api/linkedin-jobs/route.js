// /app/api/linkedin-jobs/route.js
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const rawSkill = searchParams.get("skill") || "";
    const industry = searchParams.get("industry") || "";
    
    // Normalize the skill string
    const skill = rawSkill.replace(/[,\.]/g, " ").trim();
    
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !cx) {
      console.error("Missing API key or search engine ID");
      return Response.json({ 
        jobs: [], 
        error: "Missing API credentials" 
      }, { status: 500 });
    }
    // Make sure we have valid search terms
    if (!skill && !industry) {
      console.warn("No search parameters provided");
      return Response.json({ 
        jobs: [], 
        error: "Missing search parameters" 
      }, { status: 400 });
    }
    
    const query = `site:linkedin.com/jobs ${skill} ${industry}`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
    
    console.log("🔍 Google Jobs API Query:", query);
    
    try {
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error("Google Search API error response:", errorData);
        return Response.json({ 
          jobs: [], 
          error: `Google API responded with status ${res.status}` 
        }, { status: res.status });
      }
      
      const data = await res.json();
      
      if (!data.items || data.items.length === 0) {
        console.log("No search results found");
        return Response.json({ jobs: [] });
      }
      
      // Transform the items to extract the most relevant information
      const processedJobs = data.items.map(item => {
        return {
          title: item.title || "Job Position",
          link: item.link,
          snippet: item.snippet || "No description available",
          pagemap: item.pagemap // Keep the original pagemap for additional processing
        };
      });
      
      return Response.json({ 
        jobs: processedJobs,
        resultCount: processedJobs.length
      });
    } catch (error) {
      console.error("Google Search API error:", error);
      return Response.json({ 
        jobs: [], 
        error: error.message 
      }, { status: 500 });
    }
  }