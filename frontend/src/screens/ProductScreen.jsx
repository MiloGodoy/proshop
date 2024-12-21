import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import products from "../products";
import { Link, useParams } from "react-router-dom";
import Rating from "../components/Rating";

const ProductScreen = () => {
    const { id: productId } = useParams();
    const product = products.find(product => product._id === productId);
  
    if (!product) {
      return (
        <>
          <Link to='/' className='btn btn-light my-3'>
            Go Back
          </Link>
          <h2>Product not found</h2>
        </>
      );
    }
  
    return (
      <>
        <Link to='/' className='btn btn-light my-3'>
          Go Back
        </Link>
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
      </>
    );
  };
  
  export default ProductScreen;
  