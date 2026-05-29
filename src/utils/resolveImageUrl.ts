export const resolveImageUrl = (path: string | null | undefined, fallback?: string): string => {
  if (!path) {
    return fallback || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg';
  }
  if (path.startsWith('http')) {
    return path;
  }
  const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
  return `${baseUrl}/${path}`;
};
