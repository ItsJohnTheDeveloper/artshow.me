import axios from "axios";

export const handleUploadProfilePicture = async (file, userId, callback) => {
  try {
    let { data } = await axios.post("/s3/uploadFile", {
      name: file.name,
      type: file.type,
      folder: `profile/${userId}`,
    });

    // finally, upload the file to S3 bucket
    const { url } = data;
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    const imageUrl = /[^?]*/g.exec(url)[0]; // regex to cleanse url, getting it without query strings
    callback(imageUrl);
  } catch (err) {
    console.log(err?.response?.data);
  }
};

export const handleUploadPaintingPicture = async (file, userId, callback) => {
  try {
    let { data } = await axios.post("/s3/uploadFile", {
      name: file.name,
      type: file.type,
      folder: `paintings/${userId}`,
    });

    // finally, upload the file to S3 bucket
    const { url } = data;
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    const imageUrl = /[^?]*/g.exec(url)[0]; // regex to cleanse url, getting it without query strings
    callback(imageUrl);
  } catch (err) {
    console.log(err?.response?.data);
  }
};
