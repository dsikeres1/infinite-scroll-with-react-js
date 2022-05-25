import { useState, useCallback, useEffect } from 'react';
import { getPostList } from '../../model/PostList';

import '../InfiniteScroll.css';
import LoadingView from '../LoadingView';

const InfiniteScroll = () => {
  const [page, setPage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(
    ({ page }) => {
      if (isLoading) {
        return;
      }

      setIsLoading(() => true);

      const pagination = getPostList(page);
      setPosts(posts.concat(pagination.posts));

      return setTimeout(function () {
        setPage({
          page: pagination.page,
          lastPage: pagination.lastPage,
        });

        setIsLoading(() => false);
      }, 2000);
    },
    [isLoading, posts],
  );

  useEffect(() => {
    if (!page) {
      fetch({ page: 1 });
    }
  }, [fetch, page]);

  const handleScroll = useCallback(() => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const { scrollTop } = document.documentElement;

    if (!page) {
      return;
    }

    if (isLoading) {
      return;
    }

    if (page?.page === page?.lastPage) {
      return;
    }

    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
      fetch({ page: page.page + 1 });
    }
  }, [page, isLoading, fetch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [handleScroll]);

  return (
    <div className="container">
      {posts.map((post, idx) => (
        <div className="post-item" key={idx}>
          <h3>{post.title}</h3>
          {post.contents}
          <br />
          {post.page} 페이지
        </div>
      ))}

      {isLoading && <LoadingView />}
    </div>
  );
};

export default InfiniteScroll;
