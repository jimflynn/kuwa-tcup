import React from 'react';
import error from '../img/error.png';
import Grid from '@material-ui/core/Grid';

/**
 * Shows loading Gif component
 * @export
 * @class Loading
 * @extends Component
 */
// export const Error = (props) => {
//   return (
//     <Container>
//         <Row className="row-kuwa-reg">
//             <Col>
//                 <h4>{props.errorMessage}</h4>
//             </Col>
//         </Row>
//         <Row className="row-kuwa-reg">
//             <Col>
//                 <img className="responsive-kuwa-img" src={error} alt="error" />
//             </Col>
//         </Row>
//     </Container>
//   );
// }

export const Error = props => (
    <Grid container>
        <Grid container justify="center" style={{flexGrow: 1}}>
            <img className="responsive-kuwa-img" src={error} alt="error" />
        </Grid>
        <Grid container justify="center" style={{flexGrow: 1}}>
            <h3 style={{textAlign: "center"}}>{props.errorMessage}</h3>
        </Grid>
    </Grid>
);