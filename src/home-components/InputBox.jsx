import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const InputBox = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [allproduct, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  
   // State for products and pagination
  
    // Fetch products from API
    const fetchProducts = async (page = 1) => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/products/all-products`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    useEffect(() => {
      fetchProducts();
    }, []);

  // serach filter for product
  const handleInputChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm !== "") {
      const filteredData = allproduct.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      setFilterProduct(filteredData);
    } else {
      setFilterProduct([]);
    }
  };

  // to navigate to product page
  const searchProductClick = (e) => {
    const selectedProductId = e.target.id;
    const selectedProduct = allproduct.find((item) => item.id === parseInt(selectedProductId));
  
    if (selectedProduct) {
      navigate("/Product", {
        state: {
          allProducts: allproduct, 
          selectedProduct, 
        },
      });
    }
  };

  return (
    <>
      <section>
        <div className="searchContainer">
          <h3>FIND YOUR PAIR !</h3>
          <p className="col-12 col-md-6 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            eius eligendi quis obcaecati possimus vitae velit quae veniam totam
            doloremque?
          </p>
          <div className="searchFeald">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleInputChange}
            />
            <button>FIND</button>
          </div>
          {/* Dropdown for filtered products */}
          {filterProduct.length > 0 && (
            <div className="serachbox-dropdown dropdown-menu show">
              {filterProduct.map((product) => (
                <div
                  key={product.id}
                  className="serachbox-dropdown-child dropdown-item searchBarContentDiv"
                >
                  <div className="cardbarImg">
                  <img
                    src={`${baseUrl}/storage/app/public/product/thumbnail/${product.thumbnail}`}
                    alt={product.name}
                    id= {product.id}
                  onClick={searchProductClick}
                  />
                  </div>
                  <div className="searchBarHeadText">
                    <p>{product.name}</p>
                    <div className="searchCard">
                      <span
                       
                      >
                        ₹ {product.unit_price}/-
                      </span>{" "}
                      <div> <del>
                        ₹ {product.purchase_price}
                        </del>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default InputBox;
