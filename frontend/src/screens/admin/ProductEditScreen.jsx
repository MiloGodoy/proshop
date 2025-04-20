import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, FormControl } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from "../../slices/productsApiSlice";

function ProductEditScreen() {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('0');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');

    const {
        data: product,
        isLoading,
        refetch,
        error
    } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            const updatedProductData = {
                productId,
                name,
                price: Number(price),
                image,
                brand,
                category,
                countInStock: Number(countInStock),
                description,
            };
    
            const result = await updateProduct(updatedProductData);
            
            if(result.error) {
                toast.error(result.error?.data?.message || result.error);
            } else {
                toast.success('Product updated');
                refetch();  // Refrescar los datos del producto
                navigate('/admin/productlist');
            }
        } catch (err) {
            console.error('Error updating product:', err);
            toast.error(err?.data?.message || err.error || 'An error occurred');
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

  return (
    <>
     <Link to='/admin/productlist' className="btn btn-light my-3">
        Go Back
     </Link>
     <FormContainer>
        <h1>Edit Product</h1>
        { loadingUpdate && <Loader />}

        {isLoading ? <Loader /> : 
            error ? 
            <Message variant='danger'>
                {error}
            </Message> : (
                <Form onSubmit={ submitHandler }>
                    <Form.Group controlId="name" className="my-2">
                        <Form.Label>Name</Form.Label>
                        <FormControl
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></FormControl>
                    </Form.Group>

                    <Form.Group  controlId='price' className="my-2">
                        <Form.Label>Price</Form.Label>
                        <FormControl
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></FormControl>
                        </Form.Group>     

                        <Form.Group controlId='image' className='my-2'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" placeholder="Enter image url" value={image} onChange={(e) =>  setImage(e.target.value)}></Form.Control>
                            <Form.Control type="file" Label='Chose file' onChange={uploadFileHandler}></Form.Control>
                        </Form.Group>
                    
                    <Form.Group controlId='brand' className="my-2">
                        <Form.Label>Brand</Form.Label>
                        <FormControl
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></FormControl>
                    </Form.Group>

                    {loadingUpload && <Loader />}

                    <Form.Group controlId='countInStock' className="my-2">
                        <Form.Label>countInStock</Form.Label>
                        <FormControl
                            type="number"
                            placeholder="Count in Stock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></FormControl>
                    </Form.Group>    

                    <Form.Group controlId='category' className="my-2">
                        <Form.Label>Category</Form.Label>
                        <FormControl
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></FormControl>
                    </Form.Group>

                    <Form.Group controlId='description' className="my-2">
                        <Form.Label>Description</Form.Label>
                        <FormControl
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></FormControl>
                    </Form.Group>        

                    <Button type="submit" variant="primary" className="my-2">
                        Update
                    </Button>
                </Form>
            )}
     </FormContainer> 
    </>
  )
}

export default ProductEditScreen
