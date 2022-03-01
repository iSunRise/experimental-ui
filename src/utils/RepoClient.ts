import queryClient from "../queryClient";

const buildListClient = <Data>(queryName: string) => {
  return {
    key: queryName,
    invalidateList: () => queryClient.invalidateQueries(queryName),
    updateList: (updater: (prevList: Data[]) => Data[]) => {
      const list = queryClient.getQueryData<Data[]>(queryName);
      if (list) {
        const nextList = updater(list);
        queryClient.setQueryData(queryName, nextList);
      }
    },
  }
}

const buildItemClient = <Data>(queryName: string) => {
  const getKey = (id?: number) => [queryName, { id }];

  return {
    getKey,
    invalidateItem: (id: number) => queryClient.invalidateQueries(getKey(id)),
    applyItem: (id: number, data: Data) => queryClient.setQueryData(getKey(id), data),
    removeItem: (id: number) => queryClient.removeQueries(getKey(id))
  }
}

export { buildListClient, buildItemClient };
