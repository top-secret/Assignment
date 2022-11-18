export function counter(num = 0) {
  const getNum = () => {
    return num;
  };
  const incrementNum = () => {
    num += 1;
  };
  return [getNum, incrementNum];
}

const [getA, nextA] = counter(1);
getA(); // 1
nextA();
getA(); // 2
const [getB, nextB] = counter(10);
nextB();
getA(); // 2
getB(); // 11
nextA();
getA(); // 3
getB(); // 11