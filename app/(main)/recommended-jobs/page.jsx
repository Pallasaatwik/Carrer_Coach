"use client";

import { useEffect, useState } from "react";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userRes = await fetch(`/api/user`);
        if (!userRes.ok) {
          throw new Error(`User API failed with status: ${userRes.status}`);
        }
        const user = await userRes.json();
        
        // Debug user data
        console.log("User data:", user);
        
        if (!user.skills || !user.industry) {
          setError("Skills or industry missing in your profile. Please update your profile information.");
          setLoading(false);
          return;
        }
        
        // Format skills correctly (handle both array or string)
        const formattedSkills = Array.isArray(user.skills)
          ? user.skills.join(" ")
          : user.skills.replace(/[,\.]/g, " ");
        
        // Debug query parameters
        console.log("Search parameters:", { 
          skills: formattedSkills, 
          industry: user.industry 
        });
        
        // Fetch jobs
        const jobRes = await fetch(
          `/api/linkedin-jobs?skill=${encodeURIComponent(formattedSkills)}&industry=${encodeURIComponent(user.industry)}`
        );
        
        if (!jobRes.ok) {
          throw new Error(`LinkedIn jobs API failed with status: ${jobRes.status}`);
        }
        
        const jobData = await jobRes.json();
        console.log("Job API response:", jobData);
        
        // Transform API response to expected format if necessary
        const processedJobs = jobData.jobs.map(job => ({
          title: job.title || job.pagemap?.job?.[0]?.title || job.pagemap?.metatags?.[0]?.['og:title'] || 'Job Position',
          link: job.link,
          snippet: job.snippet || job.pagemap?.metatags?.[0]?.['og:description'] || 'No description available'
        }));
        
        setJobs(processedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(`Failed to load jobs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recommended LinkedIn Jobs</h1>
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading jobs...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
          <p className="font-medium">No jobs found.</p>
          <p className="text-sm mt-1">Try updating your skills or industry in your profile.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                {job.title}
              </a>
              <p className="text-sm text-gray-600 mt-1">{job.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}