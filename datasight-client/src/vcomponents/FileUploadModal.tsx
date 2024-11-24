"use client";

import { useState, useRef, useEffect } from "react";
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

export default function Component({
  onUploadComplete,
}: FileUploadModalProps = { onUploadComplete: () => { } }) {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false); // New state variable
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 4;

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

    const formData = new FormData();
    selectedFiles.forEach((fileInfo) => {
      formData.append("files", fileInfo.file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const uploadedFiles = selectedFiles.map((file) => ({
          ...file,
          status: "uploaded" as const,
        }));
        setSelectedFiles(uploadedFiles);
        onUploadComplete(
          uploadedFiles.filter((file) => file.status === "uploaded")
        );
        setUploadComplete(true); // Indicate upload completion
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setSelectedFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "failed",
        }))
      );
    } finally {
      setIsUploading(false);
    }
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

  // Check if all required files are selected and ready
  const allFilesReady = requiredFiles.every((file) =>
    selectedFiles.some(
      (selectedFile) =>
        selectedFile.name === file.name && selectedFile.status === "ready"
    )
  );

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-green-900 text-white">
            Upload Enterprise Architecture Datasets
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle className="text-center mt-8 text-2xl font-bold mb-5 ">
              Upload Enterprise Architecture Datasets
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="mb-4">
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
                  className="w-full py-8 border-dashed border-2 hover:border-primary"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
                {!allFilesReady && (
                  <div className='flex justify-center bg-red-100 mt-2 mb-5 py-2 rounded-md'>
                    <p className="text-red-500 text-center font-medium">
                      Please select all required files before uploading.
                    </p>
                  </div>
                )}
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {uploadComplete && ( // Display success message
                <Alert className="mb-4">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    All files have been uploaded successfully!
                  </AlertDescription>
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
                            disabled={isUploading || uploadComplete} // Disable if upload complete
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
                    uploadComplete // Disable after upload
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
