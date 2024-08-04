export const validator = {
  /**
   * common
   */
  isPositive: {
    validate: (v: string | number) =>
      Number.isInteger(Number(v)) && Number(v) > 0,
    message: "0보다 큰 숫자를 입력해주세요.",
  },
  isLessEqualThan: {
    validate: (v: string | number, max: number | string) =>
      Number.isInteger(Number(v)) && Number(v) <= Number(max),
    message: (max: number) => `${max}보다 작거나 같은 숫자를 입력해주세요.`,
  },
  isLessThan: {
    validate: (v: string | number, max: number | string) =>
      Number.isInteger(Number(v)) && Number(v) < Number(max),
    message: (max: number) => `${max}보다 작은 숫자를 입력해주세요.`,
  },

  /**
   * 특정 form field
   */
  vacations: {
    validate: (date: Date, value: string) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const lastDay = new Date(year, month, 0).getDate();
      const vacations = value.split(",");

      return vacations.every((vacation: string) => {
        if (vacation.includes("-")) {
          const [start, end] = vacation.split("-");
          if (
            validator.isPositive.validate(start) &&
            validator.isLessEqualThan.validate(start, lastDay) &&
            validator.isPositive.validate(end) &&
            validator.isLessEqualThan.validate(end, lastDay) &&
            validator.isLessThan.validate(start, end)
          ) {
            return true;
          }
        } else if (
          validator.isPositive.validate(vacation) &&
          validator.isLessEqualThan.validate(vacation, lastDay)
        ) {
          return true;
        }
        return false;
      });
    },
    message: "올바른 날짜 형식이 아닙니다.",
  },
};
