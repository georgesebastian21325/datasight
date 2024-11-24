"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/vcomponents/file-upload-components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/vcomponents/file-upload-components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/vcomponents/file-upload-components/table";
import {
  Upload,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  FileUp,
  Check,
  CircleCheck,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/vcomponents/file-upload-components/alert";
import { Badge } from "@/vcomponents/file-upload-components/badge";
import { ScrollArea } from "./file-upload-components/scroll-area";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  status: "ready" | "uploaded" | "failed" | "uploading";
  file: File;
}

interface FileUploadModalProps {
  onUploadComplete: (files: FileInfo[]) => void;
}

export default function FileUploadModal({
  onUploadComplete,
}: FileUploadModalProps = { onUploadComplete: () => { } }) {
  const [dragging, setDragging] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 4;

  const router = useRouter();

  const allowedFileNames = [
    "backup_and_recovery_systems.csv",
    "cloud_infrastructure.csv",
    "communication_infrastructure_uptime.csv",
    "communication_infrastructure.csv",
    "computer.csv",
    "date.csv",
    "expenses.csv",
    "failure_records.csv",
    "ip_address.csv",
    "manufacturer.csv",
    "network_equipment.csv",
    "offering_product_mapping.csv",
    "offering_product_performance.csv",
    "offering.csv",
    "product_service_mapping.csv",
    "product_service_performance.csv",
    "product.csv",
    "resource_maintenance.csv",
    "resource_metric_values.csv",
    "resource_metrics.csv",
    "revenue.csv",
    "server.csv",
    "service_level_agreement.csv",
    "service_resource_mapping.csv",
    "service.csv",
    "storage_devices.csv",
    "user_groups.csv",
    "virtual_infrastructure.csv",
  ];

  const [requiredFiles, setRequiredFiles] = useState<
    { name: string; uploaded: boolean }[]
  >(allowedFileNames.map((name) => ({ name, uploaded: false })));

  useEffect(() => {
    const updatedRequiredFiles = requiredFiles.map((file) => ({
      ...file,
      uploaded: selectedFiles.some(
        (selectedFile) =>
          selectedFile.name === file.name && selectedFile.status === "uploaded"
      ),
    }));
    setRequiredFiles(updatedRequiredFiles);
  }, [selectedFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      const validFiles = fileList.filter((file) =>
        allowedFileNames.includes(file.name)
      );
      const invalidFiles = fileList.filter(
        (file) => !allowedFileNames.includes(file.name)
      );

      if (invalidFiles.length > 0) {
        setError(
          `Some files were not allowed: ${invalidFiles
            .map((f) => f.name)
            .join(", ")}`
        );
      }

      const fileInfos = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: "ready" as const,
        file,
      }));

      setSelectedFiles((prev) => [...prev, ...fileInfos]);
      setCurrentPage(
        Math.ceil((selectedFiles.length + fileInfos.length) / itemsPerPage)
      );
    } else {
      setError("No files selected");
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);

    for (const fileInfo of selectedFiles) {
      if (fileInfo.status !== "uploaded") {

        setSelectedFiles((prev) =>
          prev.map((file) =>
            file.id === fileInfo.id ? { ...file, status: "uploading" } : file
          )
        );

        const formData = new FormData();
        formData.append("files", fileInfo.file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            setSelectedFiles((prev) =>
              prev.map((file) =>
                file.id === fileInfo.id ? { ...file, status: "uploaded" } : file
              )
            );
          } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to upload the file.");
            setSelectedFiles((prev) =>
              prev.map((file) =>
                file.id === fileInfo.id ? { ...file, status: "failed" } : file
              )
            );
          }
        } catch (err) {
          console.error("Upload error:", err);
          setError("Failed to upload the file.");
          setSelectedFiles((prev) =>
            prev.map((file) =>
              file.id === fileInfo.id ? { ...file, status: "failed" } : file
            )
          );
        }
      }
    }

    setIsUploading(false);

    const allFilesUploaded = allowedFileNames.every((name) =>
      selectedFiles.some(
        (file) => file.name === name && file.status === "uploaded"
      )
    );

    setUploadComplete(true);
  };


  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
    const newTotalPages = Math.ceil((selectedFiles.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusBadge = (status: FileInfo["status"]) => {
    const statusConfig = {
      ready: { className: "bg-yellow-500", label: "Ready" },
      uploaded: { className: "bg-green-500", label: "Uploaded" },
      failed: { className: "bg-red-500", label: "Failed" },
      uploading: { className: "bg-blue-500", label: "Uploading" },
    };
    const { className, label } = statusConfig[status];
    return <Badge className={`${className} text-white`}>{label}</Badge>;
  };

  const totalPages = Math.ceil(selectedFiles.length / itemsPerPage);
  const paginatedFiles = selectedFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isFileSelected = (fileName: string) => {
    return selectedFiles.some(
      (file) =>
        file.name === fileName &&
        (file.status === "ready" || file.status === "uploaded")
    );
  };

  const allFilesReady = requiredFiles.every((file) =>
    selectedFiles.some(
      (selectedFile) =>
        selectedFile.name === file.name && selectedFile.status === "ready"
    )
  );

  const handleViewDashboard = () => {
    router.push('/dashboard/resources');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-green-900 text-white">
            Upload Enterprise Architecture Datasets
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`sm:max-w-${uploadComplete ? "[500px]" : "[1000px]"
            }`}
        >
          <DialogHeader>
            {!uploadComplete && (
              <DialogTitle className="text-center mt-8 text-2xl font-bold mb-5">
                Upload Enterprise Architecture Datasets
              </DialogTitle>
            )}
          </DialogHeader>
          {uploadComplete ? (
            <div className="flex flex-col items-center justify-center p-10">
              <CircleCheck className="h-16 w-16 text-green-700 mb-4" />
              <h2 className="text-2xl font-semibold text-green-700 text-center mb-6">
                You have successfully uploaded your dataset.
              </h2>
              <Button
                onClick={handleViewDashboard}
                className="bg-green-800 text-white py-3 px-6 rounded hover:bg-green-700   transition-transform transform hover:scale-105 font-semibold"
              >
                View Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex-1">
                  <div
                    className={`mb-4 w-full py-8 border-dashed border-2 flex flex-col items-center justify-center ${dragging ? "border-primary bg-slate-100" : "border-gray-300"
                      }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);

                      const files = Array.from(e.dataTransfer.files);
                      const validFiles = files.filter((file) => allowedFileNames.includes(file.name));
                      const invalidFiles = files.filter((file) => !allowedFileNames.includes(file.name));

                      if (invalidFiles.length > 0) {
                        setError(
                          `Some files were not allowed: ${invalidFiles.map((f) => f.name).join(", ")}`
                        );
                      }

                      const fileInfos = validFiles.map((file) => ({
                        id: Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        size: file.size,
                        status: "ready" as const,
                        file,
                      }));

                      setSelectedFiles((prev) => [...prev, ...fileInfos]);
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      ref={fileInputRef}
                      aria-label="Select files to upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center"
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Drag and Drop Files or Click to Select
                    </Button>
                  </div>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell>{getStatusBadge(file.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                              disabled={isUploading || uploadComplete}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
                <div className="flex flex-col items-center mt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={
                      isUploading ||
                      !allFilesReady ||
                      uploadComplete
                    }
                    className="bg-green-900"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload Datasets"}
                  </Button>
                </div>
              </div>
              <div className="w-66 border-l pl-4">
                <h3 className="font-semibold mb-2">Required Files</h3>
                <ScrollArea className="h-[400px] pr-5">
                  {requiredFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1"
                    >
                      <span
                        className={
                          isFileSelected(file.name)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {file.name}
                      </span>
                      {isFileSelected(file.name) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-300" />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
