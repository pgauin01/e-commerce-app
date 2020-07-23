class Product {
  constructor(
    id,
    ownerId,
    title,
    imageUrl,
    description,
    price,
    imgName,
    isfeatured,
    inStock,
    oldprice
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.imgName = imgName;
    this.isfeatured = isfeatured;
    this.inStock = inStock;
    this.oldprice = oldprice;
  }
}

export default Product;
