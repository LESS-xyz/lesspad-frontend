import React, { useState } from 'react';

import s from './Pagination.module.scss';

type TypePaginationProps = {
  countOfPages: number;
  onChange: (page: number) => void;
};

interface IButtonProps {
  currentPage: number;
  page: number;
  onClick: (page: number) => void;
}

const Button: React.FC<IButtonProps> = ({ page, currentPage, onClick }) => {
  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={() => {}}
      onClick={() => onClick(page)}
      className={`${s.button} ${currentPage === page && s.active}`}
    >
      {page + 1}
    </div>
  );
};

const Pagination: React.FC<TypePaginationProps> = (props) => {
  const { countOfPages = 0, onChange = () => {} } = props;
  const [currentPage, setCurrentPage] = useState<number>(0);
  console.log('Pagination:', currentPage, countOfPages);

  const arrayOfPages = new Array(countOfPages).fill(0);

  const handleChange = (page: number) => {
    setCurrentPage(page);
    onChange(page);
  };

  return (
    <div className={s.pagination}>
      {countOfPages > 1 &&
        countOfPages <= 5 &&
        currentPage < 5 &&
        arrayOfPages.map((item: number, ii: number) => {
        /*eslint-disable*/
        return (
          <Button
            key={`button-${ii}`}
            onClick={handleChange}
            currentPage={currentPage}
            page={ii}
          />
        )
        /* eslint-enable */
        })}
      {countOfPages > 5 && currentPage < 4 && (
        <>
          <Button onClick={handleChange} currentPage={currentPage} page={0} />
          <Button onClick={handleChange} currentPage={currentPage} page={1} />
          <Button onClick={handleChange} currentPage={currentPage} page={2} />
          <Button onClick={handleChange} currentPage={currentPage} page={3} />
          <Button onClick={handleChange} currentPage={currentPage} page={4} />
        </>
      )}
      {countOfPages > 5 && currentPage >= 4 && (
        <>
          <Button onClick={handleChange} currentPage={currentPage} page={0} />
          <Button onClick={handleChange} currentPage={currentPage} page={currentPage - 1} />
          <Button onClick={handleChange} currentPage={currentPage} page={currentPage} />
          {currentPage + 1 < countOfPages && (
            <Button onClick={handleChange} currentPage={currentPage} page={currentPage + 1} />
          )}
        </>
      )}
    </div>
  );
};

export default Pagination;
