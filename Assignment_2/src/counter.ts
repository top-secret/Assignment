export function counter(num = 0) {
  const func1 = () => {
    return num;
  };
  const func2 = () => {
    num += 1;
  };
  return [func1, func2];
}

const [getA, nextA] = counter(1);
console.log(getA()); // 1
nextA();
console.log(getA()); // 2
const [getB, nextB] = counter(10);
nextB();
console.log(getA()); // 2
console.log(getB()); // 11
nextA();
console.log(getA()); // 3
console.log(getB()); // 11