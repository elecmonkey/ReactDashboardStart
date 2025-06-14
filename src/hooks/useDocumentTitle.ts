import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - 管理系统`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}; 