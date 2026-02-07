export const formatFightResultsGrid = (results) => {
  if (!Array.isArray(results)) {
    return [];
  }

  let currentColumn = 0;
  let currentRow = 0;

  return results
    .filter((result) => result === 'MERON' || result === 'WALA')
    .map((result, fightIndex, filteredResults) => {
      if (fightIndex > 0) {
        const previousResult = filteredResults[fightIndex - 1];
        if (result === previousResult) {
          currentRow += 1;
        } else {
          currentColumn += 1;
          currentRow = 0;
        }
      }

      return {
        result,
        column: currentColumn,
        row: currentRow,
        fightIndex,
      };
    });
};
