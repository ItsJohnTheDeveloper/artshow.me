import React from "react";
import { Button, Chip } from "@mui/material";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import { useUser } from "../../contexts/user-context";
import Spacer from "../Spacer";
import { useCollection } from "../../utils/hooks/useQueryData";
import { useRouter } from "next/router";

const CollectionList = ({
  selectedCollection,
  setSelectedCollection,
  openEditDialog,
}) => {
  const router = useRouter();
  const artistId = router.query?.artist_id;

  const { getUser: loggedInUser } = useUser();
  const isMyProfile = loggedInUser && loggedInUser.id === artistId;

  const { data: usersCollections, isLoading } = useCollection({
    limited: true,
    userId: artistId,
  });

  const setCollection = (name, id) => {
    setSelectedCollection({ name, id });
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 81,
        padding: "5px 24px",
        backgroundColor: "#202225f2",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        <Chip
          size="medium"
          label={showAllOption.name}
          variant={
            selectedCollection?.name === showAllOption.name
              ? "filled"
              : "outlined"
          }
          onClick={() => setCollection(showAllOption.name, showAllOption.id)}
          style={{ fontSize: 16, height: 39 }}
        />
        <Spacer y={2} />
        {isLoading && <div>Loading...</div>}
        {usersCollections?.map((collection, i) => (
          <React.Fragment key={collection.id}>
            <Chip
              size="medium"
              key={i}
              label={collection.name}
              variant={
                selectedCollection?.name === collection.name
                  ? "filled"
                  : "outlined"
              }
              onClick={(e) => {
                setCollection(e.currentTarget.innerText, collection.id);
              }}
              style={{ fontSize: 16, height: 39 }}
            />
          </React.Fragment>
        ))}
      </div>

      {isMyProfile && selectedCollection?.id !== "all" && (
        <Button size="small" onClick={openEditDialog} style={{ marginTop: 12 }}>
          Edit this Collection
        </Button>
      )}
    </div>
  );
};

export default CollectionList;
