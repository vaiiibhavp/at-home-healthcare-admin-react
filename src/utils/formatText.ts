/**
 * Converts camelCase string to Title Case with spaces
 * Example: "generalPractice" -> "General Practice"
 */
export const camelCaseToTitleCase = (str: string): string => {
  if (!str) return '';
  
  // Insert space before uppercase letters and capitalize first letter
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};
