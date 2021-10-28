const stripe = require("stripe")(
  "sk_test_51JeEiFSGcLNz8NVfkLz9USWNsl4R3wbQ6TEJBzFK3Vo0eHNWiic2MNrK3GIzujuvgBqjbyXiqrEJwnP1OAnr65Ug00uGKMx4JT"
);
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
  const { token, products } = req.body;
  let amount = 0;
  products.map((product) => {
    amount = amount + product.price;
  });
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "A test acc hehe lesgo",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip
              }
            }
          },
          { idempotencyKey }
        )
        .then((response) => res.status(200).json(response))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
