import { Typography } from "@mui/material";
import CollectionList from "../../Collection/CollectionList";
import Spacer from "../../Common/Spacer";
import GalleryGrid from "../../Collection/Gallery/GalleryGrid";
import ArtPreview from "../../Collection/Gallery/ArtPreview";
import { useState } from "react";
import { showAllOption } from "../../../utils/helpers/getDefaultValues";
import { useArtistsPaintings } from "../../../utils/hooks/useQueryData";
import { useRouter } from "next/router";
import EditCollectionDialog from "../../Modal/EditCollectionDialog";
import ArtDialog from "../../Collection/Gallery/Dialog/ArtDialog";

const Gallery = () => {
  const router = useRouter();
  const artistId = router.query?.artist_id as string;
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    // TODO: change to artist's default collection
    showAllOption.id
  );
  const showAllSelected = selectedCollectionId === showAllOption.id;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: gallery, isLoading: isLoadingGallery } = useArtistsPaintings(
    artistId,
    selectedCollectionId
  );

  return (
    <>
      <div style={{ minHeight: "94vh" }}>
        <Spacer y={1} />

        <CollectionList
          selectedCollectionId={selectedCollectionId}
          setSelectedCollectionId={setSelectedCollectionId}
          openEditDialog={() => setEditDialogOpen(true)}
        />

        {!gallery?.length && !isLoadingGallery && (
          <Typography variant="h5" marginLeft={3}>
            This collection is empty
          </Typography>
        )}

        {!!(gallery?.length && !isLoadingGallery) && (
          <GalleryGrid>
            {gallery?.map((artwork) => (
              <ArtPreview
                key={artwork.id}
                data={artwork}
                collectionId={selectedCollectionId}
              />
            ))}
          </GalleryGrid>
        )}
      </div>

      {editDialogOpen && (
        <EditCollectionDialog
          selectedCollectionId={selectedCollectionId}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
      {showAllSelected && <ArtDialog />}
    </>
  );
};

export default Gallery;
