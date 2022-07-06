import { useState } from "react";
import { Chip, Menu, MenuItem } from "@mui/material";
import { showAllOption } from "../../utils/helpers/getDefaultValues";
import { useUser } from "../../contexts/user-context";
import EditCollectionDialog from "../Modal/EditCollectionDialog";

const CollectionList = ({
  artist,
  collections,
  selectedCollection,
  setSelectedCollection,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
          margin: "24px 0px 24px 24px",
          paddingBottom: 12,
        }}
      >
        <Chip
          label={showAllOption.name}
          variant={
            selectedCollection?.name === showAllOption.name
              ? "filled"
              : "outlined"
          }
          onClick={(e) => setCollection(showAllOption.name, showAllOption.id)}
          style={{ height: 46, marginRight: 6 }}
        />
        {collections.map((collection, i) => {
          const [menuOpen, setMenuOpen] = useState(false);

          return (
            <>
              <Chip
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
                style={{ height: 46 }}
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
                      setCollection(collection.name, collection.id);
                    }}
                  >
                    View
                  </MenuItem>
                  {/* edit collection dialog opener */}
                  <MenuItem
                    onClick={() => {
                      setCollection(collection.name, collection.id);
                      setEditDialogOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    Edit
                  </MenuItem>
                </Menu>
              )}
            </>
          );
        })}
      </div>
      <EditCollectionDialog
        selectedCollection={selectedCollection}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
    </>
  );
};

export default CollectionList;
