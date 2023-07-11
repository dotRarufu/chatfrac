export default function showMessages<T>(
  delay: number,
  array: T[],
  callback: (item: T) => void
) {
  let index = 0;

  const intervalId = setInterval(() => {
    if (index >= array.length) {
      clearInterval(intervalId);
      return;
    }

    callback(array[index]);
    index++;
  }, delay);
}
