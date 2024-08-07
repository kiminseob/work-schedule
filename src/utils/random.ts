export const getRandomInt = (max: number, count: number = 1) => {
  const randomNum: number[] = [];

  while (randomNum.length !== count) {
    const _randomNum = Math.floor(Math.random() * max);

    if (randomNum.includes(_randomNum)) continue;

    randomNum.push(_randomNum);
  }

  return randomNum;
};
