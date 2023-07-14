export default function showMessages<T>(
  delay: number,
  array: T[],
  callback: (item: T) => void,
  lastly?: () => void,
) {
  let index = 0;

  const intervalId = setInterval(() => {
    if (index >= array.length) {
      clearInterval(intervalId);
      lastly && lastly();
      return;
    }

    callback(array[index]);
    index++;
  }, delay);
}
