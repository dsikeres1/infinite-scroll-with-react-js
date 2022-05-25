import { useState, useCallback, useEffect, useRef } from 'react';
import { getPostList } from '../../model/PostList';

import '../InfiniteScroll.css';
import LoadingView from '../LoadingView';

const InfiniteScroll = () => {
  const loader = useRef(null);
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

  const handleObserver = useCallback(
    entries => {
      if (!page) {
        return;
      }

      if (isLoading) {
        return;
      }

      if (page.page === page.lastPage) {
        return;
      }

      if (entries[0].isIntersecting) {
        fetch({ page: page.page + 1 });
      }
    },
    [fetch, page, isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
    observer.observe(loader.current);

    return () => observer && observer.disconnect();
  }, [handleObserver]);

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
      <div ref={loader} />
    </div>
  );
};

export default InfiniteScroll;
