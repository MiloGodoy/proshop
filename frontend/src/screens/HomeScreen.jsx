import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import Product from "../components/Product";

const HomeScreen = () => {
  const [products, setProducts] = useState([]); // Estado inicial como array vacío
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        console.log(data); // Asegúrate de que `data` sea un array
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {Array.isArray(products) && products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
