import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslate } from "@refinedev/core";

interface Props {
  selectedFiles: File[];
  existingPhotos: string[]; // 👈 Новое поле: Фотки из заявки
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  removeExistingPhoto: (index: number) => void; // 👈 Удалить фотку из заявки
}

export const ImagesCard = ({
  selectedFiles,
  existingPhotos,
  handleFileChange,
  removeFile,
  removeExistingPhoto,
}: Props) => {
  const t = useTranslate();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        textAlign: "center",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {t("cars.titles.images", "Фотографии автомобиля")}
      </Typography>

      <Button
        component="label"
        variant="contained"
        size="large"
        startIcon={<CloudUploadIcon />}
        sx={{ borderRadius: 2, textTransform: "none", mb: 3 }}
      >
        {t("buttons.select_files", "Загрузить новые файлы")}
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {/* 1. УЖЕ ЗАГРУЖЕННЫЕ ФОТО (Из заявки) */}
      {existingPhotos.length > 0 && (
        <Box mb={3}>
          <Typography variant="subtitle2" color="success.main" mb={1}>
            📸 Фотографии из заявки партнера:
          </Typography>
          <List
            dense
            sx={{
              maxWidth: 500,
              mx: "auto",
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "success.light",
            }}
          >
            {existingPhotos.map((url, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => removeExistingPhoto(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <img
                      src={url}
                      alt="Car"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        objectFit: "cover",
                      }}
                    />
                    <ListItemText
                      primary={`Photo ${index + 1}`}
                      secondary="Из Cloudinary"
                    />
                  </Stack>
                </ListItem>
                {index < existingPhotos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {/* 2. НОВЫЕ ФАЙЛЫ */}
      {selectedFiles.length > 0 && (
        <List
          dense
          sx={{
            maxWidth: 500,
            mx: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {selectedFiles.map((file, index) => (
            <React.Fragment key={index}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  primaryTypographyProps={{ fontWeight: "500" }}
                />
              </ListItem>
              {index < selectedFiles.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};
