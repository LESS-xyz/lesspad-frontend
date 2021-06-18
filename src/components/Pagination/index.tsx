import { Dispatch, SetStateAction, useState } from 'react';
import s from './Pagination.module.scss';

interface IButtonProps {
  currentPage: number;
  page: number;
  onClick: Dispatch<SetStateAction<number>>;
}

const Button: React.FC<IButtonProps> = ({ page, currentPage, onClick }) => {
  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={() => onClick(page)}
      onClick={() => onClick(page)}
      className={`${s.button} ${currentPage === page && s.active}`}
    >
      {page}
    </div>
  );
};

const Pagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className={s.pagination}>
      <Button onClick={setCurrentPage} currentPage={currentPage} page={1} />
      <Button onClick={setCurrentPage} currentPage={currentPage} page={2} />
      <Button onClick={setCurrentPage} currentPage={currentPage} page={3} />
      <Button onClick={setCurrentPage} currentPage={currentPage} page={4} />
    </div>
  );
};

export default Pagination;
