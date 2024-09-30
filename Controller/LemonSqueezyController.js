const crypto = require("crypto");
const User = require("../Models/User"); 

const lemonSqueezy = async (req, res) => {
  try {
    const secret = process.env.LEMON_SQUEEZY_SIGNING_SECRET;

    const rawBody = req.body;

    console.log({ rawBody });

    if (!rawBody) {
      throw new Error("No body");
    }

    const signature = req.get("X-Signature");
    console.log({ signature });
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (
      !signature ||
      !crypto.timingSafeEqual(
        Buffer.from(digest, "hex"),
        Buffer.from(signature, "hex")
      )
    ) {
      throw new Error("Invalid signature.");
    }

    // ! Parse the rawBody JSON
    const data = JSON.parse(rawBody);

    // ! Extract relevant information from Lemon Squeezy payload
    const {
      status,
      user_email,
    } = data.data.attributes;

    const {
      product_id,
      created_at,
      product_name,
      variant_name,
      variant_id,
    } = data.data.attributes.first_order_item;

    const event_name = data.meta.event_name;

    // ! Find the user in the database based on the provided email
    const user = await User.findOne({ email: user_email });

    if (user) {
      // ! Update the user's information in the database
      user.productId = product_id;
      user.variantId = variant_id;
      user.status = status;
      user.LemonSqueezyCreatedAt = created_at;
      user.productName = product_name;
      user.variantName = variant_name;
      user.eventName = event_name;

      // ! Save the updated user data
      await user.save();

      console.log("User data updated:", user);
    } else {
      console.log("User not found in the database");
    }

    // ! Respond with a 200 status to acknowledge successful receipt
    res.status(200).send("Webhook successfully captured");
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    res.status(400).send("Webhook verification failed");
  }
};

module.exports = lemonSqueezy;