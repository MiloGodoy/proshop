import Loader from "./Loader"
import Message from "./Message"
import { useGetTopProductsQuery } from "../slices/productsApiSlice"
import { Carousel, Image } from "react-bootstrap"
import { Link } from "react-router-dom"

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery()

  // Extraer un mensaje de texto del objeto de error
  const errorMessage = error?.data?.message || error?.error || "An error occurred"

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{errorMessage}</Message>
  ) : products && products.length > 0 ? (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <Message>No featured products found</Message>
  )
}

export default ProductCarousel
