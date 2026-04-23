import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} | TaskSync`;

    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
