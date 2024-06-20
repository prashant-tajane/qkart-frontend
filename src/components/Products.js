import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box, letterSpacing } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [masterProductsList, setMasterProductsList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [apiProgress, setApiProgress] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [noProductFoundState, setNoProductFoundState] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      setIsLoggedIn(true);
    }
  }, []);

  const performAPICall = async (searchQuery) => {
    setNoProductFoundState(false);
    setApiProgress((prev) => !prev); //true
    let URL = `${config.endpoint}/products`;
    console.log(config.endpoint);
    if (searchQuery) {
      URL = `${URL}/search?value=${searchQuery}`;
    }

    try {
      const productsData = await axios.get(URL);

      if (!searchQuery) setMasterProductsList(productsData.data);
      setProductsList(productsData.data);
      setApiProgress((prev) => !prev); //false
    } catch (error) {
      setNoProductFoundState(true);
      if (searchQuery) {
      } else {
        enqueueSnackbar("Error: Network Error", { variant: "error" });
      }

      setApiProgress((prev) => !prev); //false
    }
  };

  useEffect(() => performAPICall(searchKey), [searchKey]);

  const performSearch = async (text) => {
    setSearchKey(text);
  };

  const debounceSearch = (cb, debounceTimeout = 500) => {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, debounceTimeout);
    };
  };

  const debounce = debounceSearch((text) => {
    performSearch(text);
  }, 500);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const URL = `${config.endpoint}/cart`;
      const res = await axios.get(URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const token = localStorage.getItem("token");
  useEffect(() => fetchCart(token), []);

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const foundArr = items.filter((item) => item.productId === productId);
    if (foundArr.length) return true;
    else return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false, type: undefined }
  ) => {
    if (!isLoggedIn) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    if (isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
    } else {
      //call api to add product to cart
      if (options.preventDuplicate) {
        const foundArr = cartItems.filter(
          (item) => item.productId === productId
        );
        const currentQty = foundArr[0].qty;

        let payload;
        if (options.type === "add")
          payload = { productId: productId, qty: currentQty + 1 };
        else payload = { productId: productId, qty: currentQty - 1 };

        try {
          const URL = `${config.endpoint}/cart`;
          const res = await axios.post(URL, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(res.data);
        } catch (error) {
          enqueueSnackbar(error, { variant: "warning" });
        }
      } else {
        try {
          const URL = `${config.endpoint}/cart`;
          const res = await axios.post(
            URL,
            {
              productId: productId,
              qty: 1,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCartItems(res.data);
        } catch (error) {
          enqueueSnackbar(error, { variant: "warning" });
        }
      }
    }
  };

  return (
    <div>
      <Header hasHiddenAuthButtons={isLoggedIn} showUserDetails={isLoggedIn}>
        <TextField
          style={{ "margin-left": "25%", "margin-right": "25%" }}
          fullWidth
          onChange={(e) => debounce(e.target.value)}
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid
        container
        sx={{ flexDirection: { sm: "column", md: "row" } }}
        // justifyContent="space-between"
        // alignItems="center"
      >
        <Grid item md={isLoggedIn ? 9 : 12}>
          <Grid container className="hero-image-grid-container">
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          {apiProgress && (
            <Box alignItems="center" className="circular-progress-box">
              <div className="circular-progress-div">
                <CircularProgress className="circular-progress" />
              </div>
              <div className="circular-progress-div">
                <Typography>Loading Products...</Typography>
              </div>
            </Box>
          )}
          <Grid container spacing={2}>
            {!apiProgress &&
              (noProductFoundState ? (
                <Box className="no-product-found-box">
                  <Box className="no-product-found-box-item">
                    <SentimentDissatisfied className="emoji" />
                  </Box>
                  <Typography className="no-product-found-box-item">
                    No products found
                  </Typography>
                </Box>
              ) : (
                productsList.map((product) => {
                  const { name, category, cost, rating, image, _id } = product;
                  return (
                    <Grid item xs={6} md={3} key={_id}>
                      <ProductCard
                        token={localStorage.getItem("token")}
                        items={cartItems}
                        products={productsList}
                        productId={_id}
                        qty={null}
                        name={name}
                        category={category}
                        cost={cost}
                        rating={rating}
                        image={image}
                        onAddToCart={addToCart}
                        // id={_id}
                      />
                    </Grid>
                  );
                })
              ))}
          </Grid>
        </Grid>
        <Grid item md={isLoggedIn ? 3 : 0}>
          {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
          {isLoggedIn && (
            <Cart
              products={masterProductsList}
              items={cartItems}
              handleQuantity={addToCart}
            />
          )}
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
