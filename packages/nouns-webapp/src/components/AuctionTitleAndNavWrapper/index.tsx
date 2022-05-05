import { PropsWithChildren } from 'react';
import { Col } from 'react-bootstrap';
import classes from './AuctionTitleAndNavWrapper.module.css';

const AuctionTitleAndNavWrapper: React.FC<PropsWithChildren<{}>> = (props: any) => {
  return (
    <Col lg={12} className={classes.auctionTitleAndNavContainer}>
      {props.children}
    </Col>
  );
};
export default AuctionTitleAndNavWrapper;
