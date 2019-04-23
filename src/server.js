const url = require("url");
const express = require("express");
require("express-async-errors");
const fetch = require("node-fetch");
require("dotenv").config({ path: ".env.development" });

const {
  NODE_ENV,
  REACT_APP_API_URL,
  REACT_APP_CLIENT_ID,
  REACT_APP_CLIENT_SECRET,
  COOKIE_DOMAIN,
  AUTH_COOKIE_NAME = "authorization",
  META_COOKIE_NAME = "meta",
  REDIRECT_URL = "/"
} = process.env;

const app = express();

app.set("trust proxy", true);

app.get("/auth/redirect", async (req, res) => {
  const {
    protocol,
    path: pathname,
    headers: { host },
    query: { code }
  } = req;

  const redirect_uri = url.format({ protocol, host, pathname });

  const {
    value,
    user_id,
    expires_at,
    details: { scope }
  } = await authenticate({ code, redirect_uri });

  const expires = new Date(expires_at * 1000);
  const secure = NODE_ENV !== "development";

  res.cookie(AUTH_COOKIE_NAME, value, {
    domain: COOKIE_DOMAIN,
    expires,
    secure,
    httpOnly: true
  });

  const metadata = { scope, userId: user_id };

  res.cookie(META_COOKIE_NAME, JSON.stringify(metadata), {
    domain: COOKIE_DOMAIN,
    expires,
    secure
  });

  res.redirect(REDIRECT_URL);
});

const authenticate = async ({ code, redirect_uri }) => {
  const response = await fetch(`${REACT_APP_API_URL}/oauth/tokens`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: {
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id: REACT_APP_CLIENT_ID,
        client_secret: REACT_APP_CLIENT_SECRET
      }
    })
  });

  const { meta, error, data } = await response.json();

  if (error) throw { meta, error };
  return data;
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof Error) {
    next(error);
  } else {
    const { code = 500 } = error.meta || {};
    res.status(code).json(error);
  }
};

app.use(errorHandler);

app.listen(4000, () => {
  console.log(`Listening on http://0.0.0.0:4000`);
});
