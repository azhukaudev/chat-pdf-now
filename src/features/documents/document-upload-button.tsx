'use client';

import { Loader2, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { pdfjs } from 'react-pdf';

import { Button } from '@/components/ui/button';
import useDocumentUpload from '@/hooks/use-document-upload';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface DocumentUploadButtonProps {
  showToast?: boolean;
  onUploadSuccess?: () => void;
  onUploadError?: (error: unknown) => void;
}

export default function DocumentUploadButton(props: DocumentUploadButtonProps) {
  const { upload, isUploading } = useDocumentUpload({
    showToast: props.showToast,
    onUploadSuccess: props.onUploadSuccess,
    onUploadError: props.onUploadError,
  });

  const handleUpload = useCallback(
    function handleUpload() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf';
      fileInput.onchange = async (e) => {
        const selectedDocument = (e.target as HTMLInputElement).files?.[0];
        if (selectedDocument) {
          await upload(selectedDocument);
        }
      };
      fileInput.click();
    },
    [upload],
  );

  return (
    <Button
      className="text-primary-foreground w-40 bg-emerald-600 hover:bg-emerald-700"
      onClick={handleUpload}
      disabled={isUploading}
    >
      {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
      {isUploading ? 'Uploading...' : 'Upload'}
    </Button>
  );
}
