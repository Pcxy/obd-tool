/**
 * 角度转换成弧度
 *
 * @param degree - 角度
 * @returns 弧度
 */
export const degreeToRadian = (degree: number) => {
  const radian = (Math.PI * degree) / 180;
  return radian;
};

/**
 * 弧度转角度
 * @param radian 弧度
 * @returns 
 */
export const radianToDegree = (radian: number) => {
  return radian * 180 / Math.PI;
}
