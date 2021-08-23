import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cacheActions } from '../redux/actions';

interface InterfaceUseCacheProps {
  key: string;
  data: any;
  delay: number; // ms
}

const useCache = (props: InterfaceUseCacheProps) => {
  const { key, data, delay } = props;
  const [status, setStatus] = useState<string>('');
  const [dataNew, setDataNew] = useState<any>();

  const dispatch = useDispatch();
  const setCache = useCallback((params: any) => dispatch(cacheActions.setCache(params)), [
    dispatch,
  ]);

  const cachedData = useSelector(({ cache }: any) => cache);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setCache(data);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [data, delay, setCache], // Only re-call effect if value or delay changes
  );

  useEffect(() => {
    if (!key) return;
    const fetchData = async () => {
      setStatus('fetching');
      if (cachedData[key]) {
        const dataNewNew = cachedData[key];
        setDataNew(dataNewNew);
        setStatus('fetched');
      } else {
        setCache({ key: data }); // set response in cache;
        setStatus('fetched');
      }
    };
    fetchData();
  }, [key, data]);

  return { status, dataNew };
};

export default useCache;
