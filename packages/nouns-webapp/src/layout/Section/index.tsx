import classes from './Section.module.css';
import { Container, Row } from 'react-bootstrap';
import { PropsWithChildren } from 'react';

const Section: React.FC<PropsWithChildren<{ fullWidth: boolean; className?: string }>> = (
  props: any,
) => {
  const { fullWidth, className, children } = props;
  return (
    <div className={`${classes.container} ${className}`}>
      <Container fluid={fullWidth ? true : 'lg'}>
        <Row className="align-items-center">{children}</Row>
      </Container>
    </div>
  );
};
export default Section;
