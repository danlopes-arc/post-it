export const runSql = async (db: Database, statement: string, args: any[] = []): Promise<SQLResultSet> =>
  new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(statement,
        args,
        (t, result) => resolve(result),
        (t, e) => {
          reject(e);
          return false;
        });
    });
  });
