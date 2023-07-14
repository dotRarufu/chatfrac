const randomNumber = (x: number, y: number): number => {
  const min = Math.min(x, y);
  const max = Math.max(x, y);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default randomNumber;
