export const transformToDate = (value: string, date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const vacations = value.split(",");

  return [
    ...new Set(
      vacations.flatMap((vacation: string) => {
        if (vacation.includes("-")) {
          const date = vacation.split("-");
          const start = Number(date[0].trim());
          const end = Number(date[1].trim());

          return Array.from(
            { length: end - start + 1 },
            (_, i) => `${year}-${month}-${start + i}`
          );
        } else {
          const date = Number(vacation.trim());
          return `${year}-${month}-${date}`;
        }
      })
    ),
  ];
};
