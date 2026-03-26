import { useState, useEffect, useCallback } from 'react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from './useDebounce'; // Path must match the file created above

export function useDataTable(fetcher: Function) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');


  const debouncedSearch = useDebounce(globalFilter, 500);


const load = useCallback(async () => {
    
    setLoading(true);
    
    // Map TanStack sorting to Spring Boot string: "name,asc"
    const sortParam = sorting.length 
      ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}` 
      : undefined;

    try {
      const result = await fetcher({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: sortParam,
        search: debouncedSearch
      });
      
      setData(result.content); // Spring Page 'content'
      setTotalElements(result.totalElements);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination, sorting, debouncedSearch, fetcher]);

  useEffect(() => { load(); }, [load]);

  return {
    data, loading, totalElements,
    pagination, setPagination,
    sorting, setSorting,
    globalFilter, setGlobalFilter,
    pageCount: Math.ceil(totalElements / pagination.pageSize)
  };
}