const Razorpay = require("razorpay");
const crypto = require("crypto");
var instance = new Razorpay({
  key_id: "rzp_test_UD3JsV70BFXM3F",
  key_secret: "pXbwTCdHwhhQOM01Y4MpBtOl"
});
exports.processRazorPayment = (req, res) => {
  const { products } = req.body;

  let amount = 0;
  //   console.log("A M O U N T ", req.body);
  //   console.log("A M O U N T ", products);
  products.map((product) => {
    amount = amount + product.price;
    // console.log("A M O U N T ", product.price);
  });
  //   console.log("A M O U N T ", amount);
  var options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR"
    // receipt: "order_rcptid_11"
  };
  instance.orders.create(options, (err, order) => {
    if (err) {
      return res.status(400).json({
        error: `Some Error ${err}`
      });
    }
    res.json(order);
  });
};

exports.successPayment = (req, res) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
  } = req.body.data;

  // Creating our own digest
  // The format should be like this:
  // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
  const shasum = crypto.createHmac("sha256", "pXbwTCdHwhhQOM01Y4MpBtOl");

  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

  const digest = shasum.digest("hex");

  // comaparing our digest with the actual signature
  //   console.log(digest);
  //   console.log(razorpaySignature);

  if (digest !== razorpaySignature)
    return res.status(400).json({ msg: "Transaction not legit!" });

  // THE PAYMENT IS LEGIT & VERIFIED
  // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

  res.json({
    msg: "success",
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId
  });
};
