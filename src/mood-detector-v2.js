export function detectMood(text) {
  if (!text) return 'neutral';
  const positiveWords = ['happy','great','love','excellent'];
  const negativeWords = ['sad','angry','hate','bad'];

  const words = text.toLowerCase().split(' ');
  let score = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });

  if(score > 0) return 'positive';
  if(score < 0) return 'negative';
  return 'neutral';
}
