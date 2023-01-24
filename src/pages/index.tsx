import { Typography } from "@mui/material";
import { User } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Spacer from "../components/Spacer";

const Home = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await fetch("/api/users/getAll").then((res) =>
          res.json()
        );
        setAllUsers(users);
        return;
      } catch (err) {
        console.log("error occurred getting all users: ", err);
      }
    };
    getUsers();
  }, []);

  return (
    <Layout>
      <main className="page">
        <Spacer y={1} />
        <Link href="/artist/6293dca2d671e0ad7d7878ea">testing profile</Link>

        <Spacer y={3} />

        <Typography variant="h5">{`Sample Artist Profiles`}</Typography>
        <ul>
          {allUsers.map(
            (user: User) =>
              user.id !== "6293dca2d671e0ad7d7878ea" && (
                <li>
                  <a href={`/artist/${user.id}`}>{user.name}</a>
                </li>
              )
          )}
        </ul>
      </main>
    </Layout>
  );
};

export default Home;
