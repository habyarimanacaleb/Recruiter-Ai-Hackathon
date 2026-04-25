// features/dashboard/CandidateView.tsx
import { RankingSection } from "@/features/dashboard/RankingSection";

interface CandidateViewProps {
  title: string;
  subtitle: string;
  candidates: any[];
}

export default function CandidateView({ title, subtitle, candidates }: CandidateViewProps) {
  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      
      <section className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <RankingSection candidates={candidates} />
      </section>
    </div>
  );
}
