import React from "react";
import { Button, Chip } from "@mui/material";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import { useSession } from "next-auth/react";
import Spacer from "../Spacer";
import { useArtistsCollections } from "../../utils/hooks/useQueryData";
import { useRouter } from "next/router";
import theme from "../../styles/theme";
import { Collection } from "@prisma/client";

const CollectionList = ({
  selectedCollection,
  setSelectedCollection,
  openEditDialog,
}) => {
  const router = useRouter();
  const artistId = router.query?.artist_id as string;
  const { data: session } = useSession();
  const isMyProfile = session?.user.id && session?.user.id === artistId;

  const { data: usersCollections, isLoading } = useArtistsCollections(artistId);

  const setCollection = (name, id) => {
    setSelectedCollection({ name, id });
    1;
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 68,
        padding: "5px 24px",
        backgroundColor: theme.palette.background.default + "f2",
      }}
    >
      <div style={{ display: "flex", gap: 6, overflow: "overlay" }}>
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
        {usersCollections?.map((collection: Collection, i) => (
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
