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
        const users = await fetch("/api/users/all").then((res) => res.json());
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
        <Spacer y={2} />
        <Typography variant="h5">
          {"Artist Profiles (current profiles)"}
        </Typography>
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
