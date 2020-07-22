class Product {
  constructor(
    id,
    ownerId,
    title,
    imageUrl,
    description,
    price,
    imgName,
    isfeatured
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.imgName = imgName;
    this.isfeatured = isfeatured;
  }
}

export default Product;
