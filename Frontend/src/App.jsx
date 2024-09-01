import { useEffect, useState } from 'react'
import ProductCard from './components/ProductCard/ProductCard';
import './App.css'
import Header from './components/Header/Header';
import LoadingIndicator from './components/Loader/LoadingIndicator';
import Pagination from './components/Pagination/Pagination'

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 10;
  const fetchProductUrl = `http://localhost:3000/products/fetch-products`;

  useEffect(() => {
    setLoading(true)
    fetch(`${fetchProductUrl}?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false)
        setTotalPages(data.totalPages || 1);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false)
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileClick = () => {
    console.log('Profile Page Work')
  }

  return (
    <div className='app-container'>
      <Header onProfileClick={handleProfileClick} />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {loading ? (
        <LoadingIndicator /> // loading
      ) : (
        <>
          <div className="product-grid">
            {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default App
