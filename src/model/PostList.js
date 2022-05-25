const totals = 20;

export const getPostList = page => ({
  // post = {
  //   title: string;
  //   contents: string;
  //   page: number;
  // };
  posts: postList.filter(post => post.page === page),
  page: page,
  lastPage: Math.round(Math.floor(totals / 3) + 1),
});

const postList = Array.from(Array(totals), (_, index) => ({
  title: `${index + 1}번째 제목`,
  contents: `${index + 1}번째 글`,
  page: Math.round(Math.floor(index / 3) + 1),
}));
