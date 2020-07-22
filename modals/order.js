import moment from "moment";
class Order {
  constructor(id, items, totalAmount, date, address) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
    this.address = address;
  }
  get redableDate() {
    return moment(this.date).format("MMMM Do YYYY, hh:mm");
  }
}

export default Order;
