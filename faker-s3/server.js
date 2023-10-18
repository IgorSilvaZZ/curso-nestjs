const S3rver = require("s3rver");

const serverS3 = new S3rver({
  port: 4000,
  address: "localhost",
  directory: "./tmp",
  silent: true,
  resetOnClose: true,
  configureBuckets: [{ name: "smartranking" }],
});

/* serverS3.run((req, res) => {
  console.log(res);
}); */

serverS3.run((error, { address, port } = {}) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`S3rver is listening at address ${address} and port ${port}`);
  }
});
