import Stripe from "stripe";
import config from "../config";

export const strpe = new Stripe(config.stripe_secret_key);
