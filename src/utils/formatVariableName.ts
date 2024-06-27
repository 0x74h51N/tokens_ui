export function formatVariableName(name: string) {
  let words = name.replace(/([a-z])([A-Z])/g, "$1 $2").split(/(?=[A-Z])/);
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(" ");
}
