"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";

export function BatchResumeUpload() {
  const { files, isProcessing, error, addFiles, removeFile, uploadResumes } = useResumeStore();

  // onDrop ONLY stores files locally — nothing is sent to the server here
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles);
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isProcessing,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getBadge = (name: string) => {
    if (name.endsWith(".pdf"))  return { label: "PDF", cls: "bg-red-50 text-red-500" };
    if (name.endsWith(".docx")) return { label: "DOC", cls: "bg-blue-50 text-blue-500" };
    return { label: "ZIP", cls: "bg-amber-50 text-amber-500" };
  };

  return (
    <div className="w-full space-y-4">

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Drop zone — selecting files does NOT upload, just queues them */}
      <div
        {...getRootProps()}
        className={cn(
          "relative group border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden",
          isDragActive
            ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/80",
          isProcessing && "opacity-50 pointer-events-none"
        )}
      >
        <input {...getInputProps()} />

        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-violet-50 opacity-0 transition-opacity duration-300",
          isDragActive ? "opacity-100" : "group-hover:opacity-60"
        )} />

        <div className="relative flex flex-col items-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
            isDragActive
              ? "bg-indigo-500 shadow-indigo-200 shadow-lg scale-110"
              : "bg-gradient-to-br from-indigo-100 to-violet-100 group-hover:scale-105"
          )}>
            <UploadCloud size={24} className={isDragActive ? "text-white" : "text-indigo-500"} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              {isDragActive ? "Drop them here!" : "Drag & drop resumes"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              or <span className="text-indigo-500 font-medium">browse files</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-medium">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">PDF / DOCX — up to 20</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-500 rounded-full">ZIP — 1 file</span>
          </div>
        </div>
      </div>

      {/* Queued files list */}
      {files.length > 0 && (
        <>
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3 px-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">
                {files.length} file{files.length !== 1 ? "s" : ""} queued
              </p>
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs text-gray-400 shrink-0">
                {formatSize(files.reduce((acc, f) => acc + f.file.size, 0))}
              </span>
            </div>

            {/* Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {files.map((fileObj) => {
                const badge = getBadge(fileObj.file.name);
                return (
                  <div
                    key={fileObj.id}
                    className="group flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-150"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black", badge.cls)}>
                      {badge.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{fileObj.file.name}</p>
                      <p className="text-[10px] text-gray-400">{formatSize(fileObj.file.size)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent dropzone from opening
                        removeFile(fileObj.id);
                      }}
                      disabled={isProcessing}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 
            UPLOAD BUTTON — this is the only thing that sends files to the server.
            Clicking the dropzone above only queues files locally.
          */}
          <button
            onClick={uploadResumes}
            disabled={isProcessing}
            className={cn(
              "relative w-full h-12 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300",
              "bg-gradient-to-r from-indigo-600 to-violet-600 text-white",
              "hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.01]",
              "disabled:opacity-60 disabled:pointer-events-none disabled:scale-100"
            )}
          >
            {!isProcessing && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Parsing resumes with AI...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Upload & Analyze {files.length} Resume{files.length !== 1 ? "s" : ""}
                </>
              )}
            </span>
          </button>
        </>
      )}

      <style>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}