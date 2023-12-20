import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductsScreen.module.css';
// import FormTextInput from '../../components/FormTextInput/FormTextInput';
// import FormTextArea from '../../components/FormTextArea/FormTextArea';
import { AxiosError } from 'axios';
import FormButton from '../../components/FormButton/FormButton';
import FormImage from '../../components/FormImage/FormImage';
import FormSearchBar from '../../components/FormSearchBar/FormSearchBar';
import HorizontalSeparator from '../../components/HorizontalSeparator/HorizontalSeparator';
import { NavigationBarPage } from '../../components/NavigationBar/NavigationBar';
import Modal from '../../containers/Modal/Modal';
import Page from '../../containers/Page/Page';
import Table from '../../containers/Table/Table';
import { Product, Restaurant } from '../../utils/api';
import { generateTemporaryId } from '../../utils/id_util';
import ProductEditor from './ProductEditor/ProductEditor';
import { IProduct } from '@yori/types/src/core/product';

type ProductData = {
  imagePendingUpload: File | null;
  product: IProduct;
};

export default function ProductScreen() {
  const { restaurantId } = useParams();
  // TODO: show 404 page
  if (restaurantId === undefined) throw new Error('restaurantId is undefined');

  const [productQuery, setProductQuery] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [newProduct, setNewProduct] = useState<ProductData | null>(null);
  const [editedProduct, setEditedProduct] = useState<ProductData | null>(null);

  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [uploadProductError, setUploadProductError] = useState<string | null>(null);
  const [savingProductChanges, setSavingProductChanges] = useState(false);
  const [saveProductChangesError, setSaveProductChangesError] = useState<string | null>(null);

  const fetchRestaurant = async () => {
    const response = await Restaurant.readProducts(restaurantId);
    setProducts(response.products);
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) => {
        return product.name.toLowerCase().includes(productQuery.toLowerCase());
      })
    );
  }, [productQuery, products]);

  useEffect(() => {
    setUploadProductError(null);
  }, [newProduct]);

  useEffect(() => {
    setSaveProductChangesError(null);
  }, [editedProduct]);

  const handleNewProductChange = (updatedProduct: IProduct) => {
    if (newProduct !== null) {
      setNewProduct({ ...newProduct, product: updatedProduct });
    }
  };

  const handleNewProductImageChange = (file: File) => {
    if (newProduct !== null) {
      setNewProduct({
        ...newProduct,
        product: { ...newProduct.product, imageUrl: URL.createObjectURL(file) },
        imagePendingUpload: file
      });
    }
  };

  const createProduct = async () => {
    if (newProduct !== null) {
      try {
        await Product.create(
          Object.assign({}, newProduct.product, { id: undefined }),
          newProduct.imagePendingUpload || undefined
        );
        await fetchRestaurant();
        setNewProduct(null);
      } catch (error) {
        const axiosError = error as AxiosError;
        setUploadProductError(axiosError.message);
      }
    }
  };

  const handleEditedProductChange = (updatedProduct: IProduct) => {
    if (editedProduct !== null) {
      setEditedProduct({ ...editedProduct, product: updatedProduct });
    }
  };

  const handleEditedProductImageChange = (file: File) => {
    if (editedProduct !== null) {
      setEditedProduct({
        ...editedProduct,
        product: { ...editedProduct.product, imageUrl: URL.createObjectURL(file) },
        imagePendingUpload: file
      });
    }
  };

  const saveProductChanges = async () => {
    if (editedProduct !== null) {
      try {
        await Product.update(editedProduct.product, editedProduct.imagePendingUpload || undefined);
        await fetchRestaurant();
        setEditedProduct(null);
      } catch (error) {
        const axiosError = error as AxiosError;
        setSaveProductChangesError(axiosError.message);
      }
    }
  };

  return (
    <>
      <Page activePage={NavigationBarPage.Products}>
        <div className={styles.container}>
          <h2>Products</h2>
          <HorizontalSeparator />
          <div className={styles.tableHeader}>
            <FormSearchBar
              placeholder="Search Products"
              value={productQuery}
              onChange={setProductQuery}
            />
            <FormButton
              text="Create New Product"
              onClick={() => {
                setNewProduct({
                  product: {
                    id: generateTemporaryId(),
                    name: '',
                    description: '',
                    dollarPrice: 4,
                    restaurantId,
                    options: []
                  },
                  imagePendingUpload: null
                });
              }}
            />
          </div>
          <Table
            rowVerticalPadding="1rem"
            rowHorizontalPadding="1rem"
            columns={[
              { field: 'image', headerName: '' },
              { field: 'name', headerName: 'Name', width: '30%' },
              { field: 'description', headerName: 'Description', width: '50%' },
              { field: 'price', headerName: 'Price', width: '%' }
            ]}
            rows={filteredProducts.map((product) => {
              return {
                key: product.id,
                data: {
                  image: (
                    <div className={styles.productListImageContainer}>
                      <FormImage imageUrl={product.imageUrl} />
                    </div>
                  ),
                  name: product.name,
                  description: product.description,
                  price: '$' + (Math.round(product.dollarPrice * 100) / 100).toFixed(2)
                },
                onClick: () => {
                  setEditedProduct({ product, imagePendingUpload: null });
                }
              };
            })}
          />
        </div>
      </Page>
      {editedProduct !== null && (
        <Modal
          title="Edit Product"
          onClose={() => {
            setEditedProduct(null);
          }}>
          <div className={styles.productEditorContainer}>
            <ProductEditor
              onChange={(value) => handleEditedProductChange(value)}
              onChangeImage={(value) => handleEditedProductImageChange(value)}
              product={editedProduct.product}
            />
            <FormButton
              floating
              loading={savingProductChanges}
              text={'Save Changes'}
              error={saveProductChangesError || undefined}
              onClick={async () => {
                setSavingProductChanges(true);
                await saveProductChanges();
                setSavingProductChanges(false);
              }}
            />
          </div>
        </Modal>
      )}
      {newProduct !== null && (
        <Modal
          title="Create New Product"
          visible={newProduct !== null}
          onClose={() => {
            setNewProduct(null);
          }}>
          <div className={styles.productEditorContainer}>
            <ProductEditor
              onChange={handleNewProductChange}
              onChangeImage={handleNewProductImageChange}
              product={newProduct.product}
            />
            <FormButton
              loading={uploadingProduct}
              text={'Save Changes'}
              error={uploadProductError || undefined}
              onClick={async () => {
                setUploadingProduct(true);
                await createProduct();
                setUploadingProduct(false);
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
