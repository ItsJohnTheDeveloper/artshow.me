import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../utils/api";
import { HandleAuthRequest } from "../auth/authMiddlware";

const s3 = new S3({
  region: "us-west-1",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  signatureVersion: "v4",
});

const createFile = async (req: NextApiRequest, res: NextApiResponse) => {
  await HandleAuthRequest(req, res, async () => {
    let { name, type, folder } = req.body;

    if (!name || !type || !folder) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fileParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${folder}/${name}`,
      Expires: 600,
      ContentType: type,
    };

    try {
      const url = await s3.getSignedUrlPromise("putObject", fileParams);
      return res.status(200).json({ url });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: err });
    }
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default apiHandler({
  POST: createFile,
});
