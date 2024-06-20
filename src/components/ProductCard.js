import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

// const testData = {
//   name: "Tan Leatherette Weekender Duffle",
//   category: "Fashion",
//   cost: 150,
//   rating: 4,
//   image:
//     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   _id: "PmInA797xJhMIPti",
// };

// const ProductCard = ({ product, handleAddToCart }) => {
const ProductCard = (props) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="180"
        image={props.image}
        alt={props.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {props.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          ${props.cost}
        </Typography>
        <Rating name="read-only" value={props.rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button
          className="card-button"
          onClick={() =>
            props.onAddToCart(
              props.token,
              props.items,
              props.products,
              props.productId,
              props.qty
            )
          }
        >
          <AddShoppingCartOutlined />
          <Typography style={{ color: "white" }}>
            &nbsp; ADD TO CART{" "}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
