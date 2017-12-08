//Return an array of [WorldXDelta, WorldYDelta]
  export default calculateVector = (speed, angle) => {
    return [
      (speed * Math.sin(angle * Math.PI / 180)),
      (speed * Math.cos(angle * Math.PI / 180)),
    ]
  }