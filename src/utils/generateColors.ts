export const generateColors = (word: string): { [key: string]: string } => {
  const colors: { [key: string]: string } = {};
  const uniqueLetters = Array.from(new Set(word.toLowerCase().split('')));
  const colorOptions = [
    'rgba(255, 182, 193, 0.3)', // Light pink
    'rgba(152, 251, 152, 0.3)', // Pale green
    'rgba(135, 206, 235, 0.3)', // Sky blue
    'rgba(221, 160, 221, 0.3)', // Plum
    'rgba(240, 230, 140, 0.3)', // Khaki
    'rgba(230, 230, 250, 0.3)', // Lavender
    'rgba(255, 160, 122, 0.3)', // Light salmon
    'rgba(176, 224, 230, 0.3)', // Powder blue
  ];
  
  const shuffledColors = [...colorOptions].sort(() => Math.random() - 0.5);
  uniqueLetters.forEach((letter, index) => {
    if (letter !== ' ') {
      colors[letter] = shuffledColors[index % shuffledColors.length];
    }
  });
  
  return colors;
};
