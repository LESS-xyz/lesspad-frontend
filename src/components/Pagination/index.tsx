import React, { useState } from 'react';
import s from './Pagination.module.scss';

type TypePaginationProps = {
  countOfPages: number;
  onChange: (page: number) => void;
}

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
      {page}
    </div>
  );
};

const Pagination: React.FC<TypePaginationProps> = (props) => {
  const {
    countOfPages = 0,
    onChange = () => {},
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  console.log('Pagination:', currentPage);

  const arrayOfPages = new Array(countOfPages).fill(0);

  const handleChange = (page: number) => {
    setCurrentPage(page);
    onChange(page);
  }

  return (
    <div className={s.pagination}>
      {countOfPages > 1 && currentPage < 4 && arrayOfPages.map((item: number, ii: number) => {
        return (<Button onClick={handleChange} currentPage={currentPage} page={ii + 1}/>)
      })}
      {countOfPages > 4 && currentPage >= 4 &&
        <>
          <Button onClick={handleChange} currentPage={currentPage} page={1} />
          <Button onClick={handleChange} currentPage={currentPage} page={currentPage - 1} />
          <Button onClick={handleChange} currentPage={currentPage} page={currentPage} />
          {currentPage < countOfPages &&
            <Button onClick={handleChange} currentPage={currentPage} page={currentPage + 1} />
          }
        </>
      }
      {countOfPages > 0 && currentPage >= 4 &&
        <Button onClick={handleChange} currentPage={currentPage} page={countOfPages} />
      }
    </div>
  );
};

export default Pagination;
