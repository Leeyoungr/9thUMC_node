export const bodyToUser = (body) => {
  const birth = new Date(body.birth);

  return {
    email: body.email,
    name: body.name,
    nickname: body.nickname,
    password: body.password,
    gender: body.gender,
    birth: birth,
    address: body.address || "",
    detailAddress: body.detailAddress || "",
    phoneNumber: body.phoneNumber,
    preferences: body.preferences,
  };
};

export const responseFromUser = ({ user, preferences }) => {
  if (user === null) {
    return null;
  }
  const date = new Date(user.birth);
  let formattedBirth = date.toISOString().split("T")[0];

  const preferFoods = preferences.map((preference) => preference.foodCategory.name);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    gender: user.gender,
    birth: formattedBirth,
    address: user.address,
    detailAddress: user.spec_address,
    phoneNumber: user.phone_number,
    preferCategory: preferFoods,
  };
};
