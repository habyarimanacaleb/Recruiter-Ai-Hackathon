// app/dashboard/page.tsx
import { FAKE_CANDIDATES } from "@/constants";
import JobDescriptionForm from "@/features/dashboard/JobDescriptionForm";
import { BatchResumeUpload } from "@/features/dashboard/BatchResumeUpload";
import { RankingSection } from "@/features/dashboard/RankingSection";
import StatSection from "@/features/dashboard/StatSection";

async function fetchCandidates() {
  // Simulate a database/API delay
  // const res = await fetch('https://yourbackend.com', { cache: 'no-store' });
  // return res.json();
  
  return FAKE_CANDIDATES; 
}

export default async function Dashboard() {
  // This fetch happens on the server before the page hits the browser
  const candidates = await fetchCandidates();

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* ── Stats Overview Section ── */}
      <StatSection />
      {/* ── Input & Upload Section ── */}
      <section className="w-full flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full lg:w-1/2">
          <JobDescriptionForm />
        </div>
        <div className="w-full lg:w-1/2">
          <BatchResumeUpload />
        </div>
      </section>

      {/* ── Candidate Ranking Section (SSR Data passed to Client) ── */}
      <section className="w-full overflow-hidden">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Candidate Rankings</h2>
          <p className="text-sm text-gray-500">AI-powered evaluation based on job description fit.</p>
        </div>
        
        {/* We pass the server-fetched data to the Client Component */}
        <RankingSection candidates={candidates} />
      </section>

    </div>
  );
}
