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
