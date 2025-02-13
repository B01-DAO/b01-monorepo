import React from 'react';
import { Image } from 'react-bootstrap';
import classes from './NounInfoRowButton.module.css';
import { useAppSelector } from '../../hooks';

interface NounInfoRowButtonProps {
  iconImgSource: string;
  btnText: string;
  onClickHandler: () => void;
}

const NounInfoRowButton: React.FC<NounInfoRowButtonProps> = (props: any) => {
  const { iconImgSource, btnText, onClickHandler } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  return (
    <div
      className={isCool ? classes.nounButtonCool : classes.nounButtonWarm}
      onClick={onClickHandler}
    >
      <div className={classes.nounButtonContents}>
        <Image src={iconImgSource} className={classes.buttonIcon} />
        {btnText}
      </div>
    </div>
  );
};

export default NounInfoRowButton;
