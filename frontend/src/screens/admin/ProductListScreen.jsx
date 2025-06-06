import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Message from '../../components/Message'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import {
  useGetProductsQuery, 
  useCreateProductMutation,
  useDeleteProductMutation
} from '../../slices/productsApiSlice'
import { toast } from 'react-toastify'


const ProductListScreen = () => {
  const {pageNumber} = useParams()

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if( window.confirm('Are you sure?')){
      try {
       await deleteProduct(id);
       refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } 
  }



  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader /> 
      ) : error ? (
        <Message variant="danger">
          {typeof error === 'string' ? error : error?.error || 'Ocurrió un error'}
        </Message>
       ) : (
          <>
            <Table striped hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Button 
                        variant='light' 
                        className='btn-sm mx-2'
                        onClick={() => window.location.href = `/admin/product/${product._id}/edit`}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant='danger' 
                        className='btn-sm'
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash style={{ color: 'white'}}/>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </>
      )}
    </>
  )
}

export default ProductListScreen
