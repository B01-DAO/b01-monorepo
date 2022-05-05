import { PropsWithChildren } from 'react';
import classes from './AuctionActivityWrapper.module.css';

const AuctionActivityWrapper: React.FC<PropsWithChildren<{}>> = (props: any) => {
  return <div className={classes.wrapper}>{props.children}</div>;
};
export default AuctionActivityWrapper;
