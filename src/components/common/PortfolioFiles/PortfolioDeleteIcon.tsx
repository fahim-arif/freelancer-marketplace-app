import { IconButton, ImageListItemBar } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React from 'react';

interface IPortfolioDeleteProps {
  id: string;
  onDelete?: (path: string) => void;
}

export default function PortfolioDeleteIcon(props: IPortfolioDeleteProps): JSX.Element {
  return (
    <ImageListItemBar
      position="top"
      className="image-list-header-bar"
      actionIcon={
        <IconButton
          onClick={(e: React.MouseEvent) => {
            if (props.onDelete !== undefined) {
              e.stopPropagation();
              props.onDelete(props.id);
            }
          }}
          sx={{ color: 'rgba(180, 180, 180, 1)' }}
        >
          <HighlightOffIcon />
        </IconButton>
      }
    />
  );
}
