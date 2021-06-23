import s from './Table.module.scss';
import thumbUpGreen from '../../../assets/img/icons/thumb-up-green.svg';
import thumbUpRed from '../../../assets/img/icons/thumb-up-red.svg';

interface ITableRow {
  logo: string;
  name: string;
  priceBNB: number;
  softcap: number;
  hardcap: number;
  daysBeforeOpen: number;
  likesPercent: number;
  dislikesPercent: number;
}

interface ITableRowProps extends ITableRow {
  index: number;
}

const TableRow: React.FC<ITableRowProps> = ({
  index,
  name,
  logo,
  priceBNB,
  softcap,
  hardcap,
  daysBeforeOpen,
  likesPercent,
  dislikesPercent,
}) => {
  return (
    <div className={`${s.row} ${index % 2 === 1 && s.filled}`}>
      <div className={`${s.row_cell} ${s.img}`}>
        <img src={logo} alt="logo" />
      </div>
      <div className={`${s.row_cell} ${s.name}`}>{name}</div>
      <div className={`${s.row_cell} ${s.price}`}>{priceBNB}</div>
      <div className={s.row_cell}>{softcap} BNB</div>
      <div className={s.row_cell}>{hardcap} BNB</div>
      <div className={s.row_cell}>
        {daysBeforeOpen} {daysBeforeOpen > 1 ? 'days' : 'day'}
      </div>
      <div className={`${s.row_cell} ${s.likes}`}>
        <div className={s.likes}>
          <div className={s.likes_img}>
            <img src={thumbUpGreen} alt="thumbUpGreen" />
          </div>
          <div className={s.likes_data}>
            {(likesPercent < 10 ? +`0${likesPercent}` : likesPercent).toFixed(2)}%
          </div>
        </div>
        <div className={s.likes}>
          <div className={s.likes_img}>
            <img src={thumbUpRed} alt="thumbUpRed" />
          </div>
          <div className={s.likes_data}>
            {(likesPercent < 10 ? +`0${likesPercent}` : dislikesPercent).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

interface ITableProps {
  data: Array<ITableRow>;
}

const Table: React.FC<ITableProps> = ({ data }) => {
  return (
    <div className={s.table}>
      <div className={s.inner}>
        <div className={s.table_header}>
          <div className={s.cell} />
          <div className={`${s.name} ${s.cell}`}>Name</div>
          <div className={s.cell}>Price (BNB)</div>
          <div className={s.cell}>Softcap</div>
          <div className={s.cell}>Hardcap</div>
          <div className={s.cell}>Opens in</div>
          <div className={`${s.voting} ${s.cell}`}>Voting</div>
        </div>
        <div className={s.table_body}>
          {data.map((row, index) => (
            <TableRow index={index + 1} {...row} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
