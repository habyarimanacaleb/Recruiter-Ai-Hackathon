"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Eye, Pencil, Trash2, Filter, Search, Briefcase, Building2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJobStore, JobDescription } from "@/store/useJobStore";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({
  job,
  onClose,
}: {
  job: JobDescription;
  onClose: () => void;
}) {
  const { updateJob, isSaving } = useJobStore();
  const [form, setForm] = useState({
    jobTitle: job.jobTitle,
    department: job.department,
    description: job.description,
  });

  const handleSave = async () => {
    if (form.description.trim().length < 50) {
      return toast.error("Description too short", { description: "At least 50 characters required." });
    }
    try {
      await toast.promise(updateJob(job._id, form), {
        loading: "Updating job...",
        success: "Job updated!",
        error: (err) => err?.message || "Update failed.",
      });
      onClose();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Edit Job Description</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Job Title</label>
              <input
                value={form.jobTitle}
                onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Department</label>
              <input
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={5}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
            <p className="text-[10px] text-gray-400 text-right">{form.description.length} chars</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-all"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


function ViewModal({ job, onClose }: { job: JobDescription; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">{job.jobTitle}</h3>
            <p className="text-xs text-gray-400">{job.department}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between text-[10px] text-gray-400">
          <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
          <span>Updated {new Date(job.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Table ─────────────────────────────────────────────────────────────
export function JobsTable() {
  const { jobs, isLoading, fetchJobs, deleteJob } = useJobStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingJob, setViewingJob] = useState<JobDescription | null>(null);
  const [editingJob, setEditingJob] = useState<JobDescription | null>(null);

  useEffect(() => { fetchJobs(); }, []);

  const filtered = useMemo(() =>
    jobs.filter((j) =>
      j.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
    ), [jobs, search]);

  const paginated = useMemo(() =>
    filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // ── Selection helpers ────────────────────────────────────────────────────
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleAll = () => {
    const pageIds = paginated.map((j) => j._id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected
      ? selectedIds.filter((id) => !pageIds.includes(id))
      : Array.from(new Set([...selectedIds, ...pageIds]))
    );
  };

  // ── Delete one ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job description? All linked talents will also be removed.")) return;
    try {
      await toast.promise(deleteJob(id), {
        loading: "Deleting...",
        success: "Job deleted.",
        error: (err) => err?.message || "Delete failed.",
      });
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } catch {}
  };

  // ── Bulk delete ──────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} job descriptions? All linked talents will also be removed.`)) return;
    try {
      await toast.promise(
        Promise.all(selectedIds.map((id) => deleteJob(id))),
        {
          loading: "Deleting...",
          success: `${selectedIds.length} jobs deleted.`,
          error: "Some deletions failed.",
        }
      );
      setSelectedIds([]);
    } catch {}
  };

  return (
    <>
      {viewingJob && <ViewModal job={viewingJob} onClose={() => setViewingJob(null)} />}
      {editingJob && <EditModal job={editingJob} onClose={() => setEditingJob(null)} />}

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Job Descriptions</h2>
            <p className="text-xs text-gray-400">{jobs.length} total</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Filter size={14} /> Sorted by latest
          </div>
        </div>

        {/* Search / Bulk Actions Bar */}
        <div className="relative h-16 border-b border-gray-50 bg-white">

          {/* Normal bar */}
          <div className={cn(
            "absolute inset-0 px-4 flex items-center justify-between transition-all duration-300",
            selectedIds.length > 0 ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          )}>
            <div className="relative w-1/2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by title or department..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <span className="text-xs text-gray-400">{filtered.length} results</span>
          </div>

          {/* Bulk actions */}
          <div className={cn(
            "absolute inset-0 px-4 bg-indigo-600 flex items-center justify-between transition-all duration-300",
            selectedIds.length === 0 ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          )}>
            <div className="flex items-center gap-4 text-white">
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
              <span className="font-bold text-sm">{selectedIds.length} Selected</span>
            </div>
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all"
            >
              Delete All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" /> Loading jobs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <Briefcase size={32} className="text-gray-200" />
              <p className="text-sm font-medium">No job descriptions found</p>
              <p className="text-xs">Create one using the form above</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded accent-indigo-600"
                      checked={paginated.length > 0 && paginated.every((j) => selectedIds.includes(j._id))}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-4">Job Title</th>
                  <th className="px-4 py-4">Department</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((job) => (
                  <tr
                    key={job._id}
                    className={cn(
                      "transition-colors",
                      selectedIds.includes(job._id) ? "bg-indigo-50/30" : "hover:bg-gray-50/50"
                    )}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded accent-indigo-600"
                        checked={selectedIds.includes(job._id)}
                        onChange={() => toggleOne(job._id)}
                      />
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                          <Briefcase size={14} className="text-indigo-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{job.jobTitle}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600">{job.department}</span>
                      </div>
                    </td>

                    {/* Description preview */}
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-xs text-gray-400 truncate">{job.description}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewingJob(job)}
                          className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setEditingJob(job)}
                          className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>{filtered.length} job{filtered.length !== 1 ? "s" : ""}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-50 hover:text-indigo-600"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}