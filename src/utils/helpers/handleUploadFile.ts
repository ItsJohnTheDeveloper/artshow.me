import axios from "axios";

export const handleUploadProfilePicture = async (
  file,
  loggedInUser,
  callback
) => {
  try {
    const res = await axios.post("/s3/uploadFile", {
      name: file.name,
      type: file.type,
      folder: `profile/${loggedInUser.id}`,
      userId: loggedInUser.id,
    });

    // finally, upload the file to S3 bucket
    const downloadURL = res?.data?.url || "";
    await axios.put(downloadURL, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*", // TODO: Change this later
      },
    });

    const imageUrl = /[^?]*/g.exec(downloadURL)[0]; // regex to cleanse url, getting it without query strings
    callback(imageUrl);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleUploadPaintingPicture = async (
  file,
  loggedInUser,
  callback
) => {
  try {
    // create and retrieve the signed download url from the server
    const res = await axios.post("/s3/uploadFile", {
      name: file.name,
      type: file.type,
      folder: `paintings/${loggedInUser.id}`,
      userId: loggedInUser.id,
    });
    // finally, upload the file to S3 bucket
    const downloadURL = res?.data?.url || "";
    await axios.put(downloadURL, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*", // TODO: Change this later
      },
    });

    const imageUrl = /[^?]*/g.exec(downloadURL)[0]; // regex to cleanse url, getting it without query strings
    callback(imageUrl);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
