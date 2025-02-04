function generateRandomNumber(end = 100, start = 1) {
  if (start >= end) {
    start++;
    const diff = Math.abs(start - end);
    const randomNumber = Math.floor(Math.random() * diff);
    const ans = randomNumber + end;
    return ans;
  } else {
    end++;
    const diff = start - end;
    const randomNumber = Math.floor(Math.random() * diff);
    const ans = randomNumber + end;
    return ans;
  }
}

export default generateRandomNumber;
