import axios from "axios";

export const handleUploadProfilePicture = async (
  file,
  loggedInUser,
  callback
) => {
  try {
    let { data } = await axios.post(
      "/s3/uploadFile",
      {
        name: file.name,
        type: file.type,
        folder: `profile/${loggedInUser.id}`,
      },
      { headers: { Authorization: `Bearer ${loggedInUser.accessToken}` } }
    );

    // finally, upload the file to S3 bucket
    const { url } = data;
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*", // TODO: Change this later
      },
    });

    const imageUrl = /[^?]*/g.exec(url)[0]; // regex to cleanse url, getting it without query strings
    callback(imageUrl);
  } catch (err) {
    console.log(err?.response?.data);
    throw err;
  }
};

export const handleUploadPaintingPicture = async (
  file,
  loggedInUser,
  callback
) => {
  console.log({ loggedInUser });
  try {
    let { data } = await axios.post(
      "/s3/uploadFile",
      {
        name: file.name,
        type: file.type,
        folder: `paintings/${loggedInUser.id}`,
      },
      { headers: { Authorization: `Bearer ${loggedInUser.accessToken}` } }
    );

    // finally, upload the file to S3 bucket
    const { url } = data;
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*", // TODO: Change this later
      },
    });

    const imageUrl = /[^?]*/g.exec(url)[0]; // regex to cleanse url, getting it without query strings
    callback(imageUrl);
  } catch (err) {
    console.log(err?.response?.data);
    throw err;
  }
};
