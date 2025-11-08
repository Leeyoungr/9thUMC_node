export const bodyToReview = (body) => {
  return {
    score: body.score,
    content: body.content,
  };
};
export const responseFromReview = (review) => {
  return {
    id: review.id,
    score: review.score,
    content: review.content,
  };
};

export const responseFromUserReviews = (reviews) => {
  return reviews.map((r) => ({
    id: r.id,
    nickname: r.user?.nickname || null,
    storeName: r.store?.name || null,
    score: r.score,
    content: r.content,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
  }));
};
