export const easyWords = [
  'banana', 'pepper', 'coffee', 'summer', 'butter', 'cheese', 
  'cotton', 'dinner', 'google', 'hammer', 'letter', 'mirror',
  'rabbit', 'school', 'soccer', 'tennis', 'yellow', 'bubble',
  'cookie', 'bottle', 'puppet', 'kitten', 'little', 'middle',
  'puddle', 'rubber', 'summer', 'tunnel', 'zipper', 'better'
];

export const mediumWords = [
  'address', 'balloon', 'bedroom', 'channel', 'college', 'command',
  'connect', 'correct', 'success', 'support', 'pattern', 'process',
  'program', 'account', 'arrange', 'battery', 'collect', 'current',
  'express', 'freedom', 'grammar', 'happen', 'lesson', 'message',
  'million', 'office', 'passion', 'possible', 'pressure', 'tomorrow'
];

export const hardWords = [
  'absolute', 'accident', 'addition', 'attention', 'attitude', 'baseball',
  'business', 'calendar', 'career', 'commerce', 'committee', 'community',
  'complete', 'condition', 'continue', 'decision', 'difference', 'difficult',
  'direction', 'education', 'engineer', 'essential', 'excellent', 'exercise',
  'feedback', 'football', 'freedom', 'happiness', 'immediate', 'innocent'
];

export const expertWords = [
  'accelerate', 'accessible', 'accordance', 'accomplish', 'accordance', 'additional',
  'aggressive', 'appearance', 'appreciate', 'assessment', 'assistance', 'associate',
  'attendance', 'collection', 'commission', 'commitment', 'committee', 'communicate',
  'competition', 'conference', 'confidence', 'connection', 'continuous', 'controlled',
  'discussion', 'efficiency', 'employment', 'excellence', 'expression', 'foundation'
];

// Combined array of all words
export const allWords = [...easyWords, ...mediumWords, ...hardWords, ...expertWords];

// Helper function to get a random word from a specific difficulty
export const getRandomWord = (difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'all' = 'all') => {
  let wordArray;
  switch (difficulty) {
    case 'easy':
      wordArray = easyWords;
      break;
    case 'medium':
      wordArray = mediumWords;
      break;
    case 'hard':
      wordArray = hardWords;
      break;
    case 'expert':
      wordArray = expertWords;
      break;
    default:
      wordArray = allWords;
  }
  return wordArray[Math.floor(Math.random() * wordArray.length)];
};