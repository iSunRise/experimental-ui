const waitFor = (miliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, Math.random() * miliseconds * 10 + miliseconds / 3)
  })
}

export default waitFor;
