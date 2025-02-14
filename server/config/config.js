const options = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT || "", // Ensure `undefined` doesn't break the array
  ].filter(Boolean), // Removes any empty or falsy values
  credentials: true,
};

export default options;
