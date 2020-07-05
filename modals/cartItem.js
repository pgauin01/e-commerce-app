class CartItem {
  constructor(quantity, title, price, total) {
    (this.quantity = quantity),
      (this.title = title),
      (this.price = price),
      (this.total = total);
  }
}

export default CartItem;
