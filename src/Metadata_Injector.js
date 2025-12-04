export function injectMetadata(data) {
  if (!data) return;
  const metaTag = document.createElement('meta');
  metaTag.name = 'user-mood';
  metaTag.content = data.mood || 'neutral';
  document.head.appendChild(metaTag);
}
