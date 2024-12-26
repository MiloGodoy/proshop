import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import {useGetProductDetailsQuery} from '../slices/productsApiSlice'
import Loader from "../components/Loader";
import Message from "../components/Message";


export const ProductScreen = () => {

  const { id: productId } = useParams();

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)
  
    return (
      <>
        
        <Link to='/' className='btn btn-light my-3'>
          Go Back
        </Link>
          
        { isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{ error?.data.message || error.error }</Message>
        ) : (
          <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
  
              <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </ListGroup.Item>
  
              <ListGroup.Item>
                <h3>Price: ${product.price}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <h3>Description: {product.description}</h3>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <Row>
                            <Col>Price:</Col>
                            <Col><strong>${product.price}</strong></Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Status:</Col>
                            <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <button className='btn btn-dark' disabled={product.countInStock === 0}>Add to Cart</button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
          </Col>
        </Row>
        ) }

        
      </>
    );
  };
  