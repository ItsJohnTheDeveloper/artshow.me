import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Spacer from "./Spacer";
import { Button } from "@mui/material";
import SignUpModal from "./Auth/SignUpModal";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  const { data: session, status } = useSession();

  console.log(session);
  const handleOpenSignUpModal = () => {
    setSignUpModalOpen(!signUpModalOpen);
  };

  const LeftNav = () => {
    return (
      <div>
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            home
          </a>
        </Link>
        <span style={{ paddingRight: 12 }} />
        {session && (
          <Link href="/drafts">
            <a data-active={isActive("/drafts")}>My drafts</a>
          </Link>
        )}
      </div>
    );
  };

  const RightNav = () => {
    if (status === "loading") {
      return <div>...loading</div>;
    }

    if (!session) {
      return (
        <div style={{ display: "flex" }}>
          <Link href="/api/auth/signin">
            <a
              data-active={isActive("/signup")}
              style={{ alignSelf: "center" }}
            >
              Log in
            </a>
          </Link>
          <Spacer x={1.5} />
          <Button variant="text" onClick={handleOpenSignUpModal}>
            Sign up
          </Button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex" }}>
        <h4>
          {session?.user?.name} ({session?.user?.email})
        </h4>
        <div style={{ alignSelf: "center", paddingLeft: 12 }}>
          <Link href="/create">
            <button>New post</button>
          </Link>
          <span style={{ paddingRight: 8 }} />
          <button onClick={() => signOut()}>Log out</button>
        </div>
      </div>
    );
  };

  return (
    <nav
      style={{
        display: "flex",
        padding: "1rem",
        alignItems: "center",
        backgroundColor: "#14171c",
        justifyContent: "space-between",
      }}
    >
      <LeftNav />
      <RightNav />
      <SignUpModal open={signUpModalOpen} setOpen={setSignUpModalOpen} />
    </nav>
  );
};

export default Header;
