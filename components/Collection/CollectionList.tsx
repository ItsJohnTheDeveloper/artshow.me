import React, { useState } from "react";
import { Chip, Menu, MenuItem } from "@mui/material";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import { useUser } from "../../contexts/user-context";
import Spacer from "../Spacer";

const CollectionList = ({
  artist,
  selectedCollection,
  setSelectedCollection,
  openEditDialog,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { getUser: loggedInUser } = useUser();
  const isMyProfile = loggedInUser && loggedInUser.id === artist?.id;

  const handleChipOnClick = (e, open, setOpen, collectionId) => {
    if (isMyProfile) {
      setAnchorEl(e.currentTarget);
      setOpen(!open);
      return;
    }
    const collectionName = e.currentTarget.innerText;
    setCollection(collectionName, collectionId);
  };

  const setCollection = (name, id) => {
    setSelectedCollection({ name, id });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          overflow: "auto",
          gap: 6,
          margin: "24px 0px 24px 0px",
          paddingBottom: 12,
          paddingLeft: 24,
        }}
      >
        <Chip
          size="medium"
          label={showAllOption.name}
          variant={
            selectedCollection?.name === showAllOption.name
              ? "filled"
              : "outlined"
          }
          onClick={(e) => setCollection(showAllOption.name, showAllOption.id)}
          style={{ fontSize: 16, height: 42 }}
        />
        <Spacer y={2} />
        {artist.collections.map((collection, i) => {
          const [menuOpen, setMenuOpen] = useState(false);

          return (
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
                onClick={(e) =>
                  handleChipOnClick(e, menuOpen, setMenuOpen, collection.id)
                }
                style={{ fontSize: 16, height: 42 }}
              />
              {isMyProfile && (
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setMenuOpen(false);
                      if (collection.id !== selectedCollection.id) {
                        setCollection(collection.name, collection.id);
                      }
                    }}
                  >
                    View
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setCollection(collection.name, collection.id);
                      openEditDialog();
                      setMenuOpen(false);
                    }}
                  >
                    Edit
                  </MenuItem>
                </Menu>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default CollectionList;
