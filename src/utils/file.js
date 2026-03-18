export const MAX_UPLOAD_BYTES_2MB = 2 * 1024 * 1024;

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function isAllowedResumeType(file) {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  const ext = name.split('.').pop();
  return ext === 'pdf' || ext === 'doc' || ext === 'docx';
}

export function isAllowedImageType(file) {
  if (!file) return false;
  return file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/webp';
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

