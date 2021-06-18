import s from './ProgressBar.module.scss';
import checkmark from '../../assets/img/sections/token-card/checkmark.svg';
import { CardConditions } from '../../types/index';

interface IBarProps {
  totalAmount: number;
  currentAmount: number;
  type: CardConditions;
}

const ProgressBar: React.FC<IBarProps> = ({ totalAmount, currentAmount, type }) => {
  let width = Math.round((currentAmount / totalAmount) * 100);
  if (width > 100) width = 100;

  return (
    <div className={s.bar_body} style={type === CardConditions.inVoting ? { width: '70%' } : {}}>
      <div style={{ width: `${width}%` }} className={s.bar_gradient} />
      {width === 100 && (
        <div className={s.checkmark}>
          <img src={checkmark} alt="checkmark" />
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
