export const setData = (data) => {
  return {
    type: "DATA",
    payload: { data: data },
  };
};

export const setGroup = (data) => {
  return {
    type: "GROUP",
    payload: { group: data },
  };
};
