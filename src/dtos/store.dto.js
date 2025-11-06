export const bodyToStore = (body) => {
  return {
    regionId: body.regionId,
    name: body.name,
    address: body.address,
  };
};

export const responseFromStore = (store) => {
  return {
    id: store.id,
    regionId: store.regionId,
    name: store.name,
    address: store.address,
  };
};
