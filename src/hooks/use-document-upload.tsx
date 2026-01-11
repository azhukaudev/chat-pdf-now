import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { extractTextFromPdf } from '@/lib/pdf';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface UseDocumentUploadProps {
  showToast?: boolean;
  onUploadSuccess?: () => void;
  onUploadError?: (error: unknown) => void;
}

export default function useDocumentUpload({
  showToast = true,
  onUploadSuccess,
  onUploadError,
}: UseDocumentUploadProps = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFileUploadUrl = useMutation(
    api.documents.generateFileUploadUrl,
  );
  const processUploadedDocument = useMutation(
    api.documents.processUploadedDocument,
  );

  async function upload(file: File) {
    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const errorMessage = `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`;
      setError(errorMessage);
      if (showToast) {
        toast.error(errorMessage);
      }
      onUploadError?.(new Error(errorMessage));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      const postUrl = await generateFileUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });
      const { storageId } = await result.json();
      await processUploadedDocument({
        name: file.name,
        storageId,
        size: file.size,
        text,
      });
      if (showToast) {
        toast.success('Document uploaded successfully');
      }
      onUploadSuccess?.();
    } catch (error) {
      setError('Failed to upload document');
      if (showToast) {
        toast.error('Failed to upload document');
      }
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  }

  return { isUploading, error, upload };
}
