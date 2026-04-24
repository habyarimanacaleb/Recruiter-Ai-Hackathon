"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJobStore } from "@/store/useJobStore";

export function BatchResumeUpload() {
  const { files, isProcessing, error, addFiles, removeFile } = useJobStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > 50) return alert("Max 50 files");
    addFiles(acceptedFiles);
  }, [files.length, addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isProcessing,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
  });

  return (
    <div className="w-full space-y-4">
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md flex gap-2 text-sm"><AlertCircle size={16}/>{error}</div>}

      <div {...getRootProps()} className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
        isDragActive ? "border-blue-500 bg-primary/5" : "border-blue-300 bg-transparent hover:border-indigo-600 tracking-normal transition-all",
        isProcessing && "opacity-50 pointer-events-none"
      )}>
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-16 w-16 text-blue-600 mb-2 hover:scale-110" strokeWidth={2} />
        <p className="text-md text-gray-600 font-medium">Upload Resumes or use Drop Down</p>
        <p className="text-xs text-gray-500 italic">PDF/DOCX/CSVs/ZIP files up to 50 files</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
          {files.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center gap-3 p-2 bg-gray-50 border rounded-lg">
              <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
              <p className="text-xs font-medium truncate flex-1">{fileObj.file.name}</p>
              <button onClick={() => removeFile(fileObj.id)} disabled={isProcessing} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
