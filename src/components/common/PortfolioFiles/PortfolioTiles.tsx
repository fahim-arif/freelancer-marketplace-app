import { SelectProps } from '@mui/material/Select';
import PortfolioPDF from './PortfolioPDF';
import PortfolioVideo from './PortfolioVideo';
import PortfolioImage from './PortfolioImage';
import PortfolioVideoProgress from './PortfolioVideoProgress';
import ImageListItem from '@mui/material/ImageListItem';
import { FileType } from 'global/enums/fileTypes';
import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { IPortfolioFile } from 'global/interfaces/user';

interface IPortfolioTilesProps extends SelectProps {
  files: IPortfolioFile[];
  isEditView: boolean;
  onClickFile?: (e: React.MouseEvent, index: number, fileType: FileType) => void;
  onDelete?: (path: string) => void;
  onNameChange?: (path: string, fileName: string) => void;
  onChecked?: (path: string, fileName: string) => void;
  onFeaturedSelected?: (id: string) => void;
}

export default function PortfolioTiles(props: IPortfolioTilesProps) {
  const handleChange = (id: string) => () => {
    if (props.onFeaturedSelected) {
      props.onFeaturedSelected(id);
    }
  };

  return (
    <React.Fragment>
      {props.files.map((item: IPortfolioFile, i: number) => (
        // Show loading element if not uploaded
        <ImageListItem key={i}>
          <div
            onClick={(e: React.MouseEvent) => {
              if (props.onClickFile !== undefined) {
                props.onClickFile(e, i, item.type);
              }
            }}
          >
            {
              // Edit mode files with click and name change etc.
              props.isEditView && item.type === FileType.Pdf ? (
                <PortfolioPDF
                  isEditView={props.isEditView}
                  id={item.id}
                  directory={item.directory}
                  extension={item.extension}
                  fileName={item.name}
                  onDelete={props.onDelete}
                  onNameChange={props.onNameChange}
                />
              ) : // Video Files, show process loader if not processed
              props.isEditView && item.type === FileType.Video ? (
                item.isProcessed ? (
                  <PortfolioVideo
                    id={item.id}
                    directory={item.directory}
                    extension={item.extension}
                    fileName={item.name}
                    onDelete={props.onDelete}
                  />
                ) : (
                  <PortfolioVideoProgress onDelete={props.onDelete} id={item.id} fileName={item.name} key={i} />
                )
              ) : (
                // Image Files
                props.isEditView && (
                  <PortfolioImage
                    id={item.id}
                    directory={item.directory}
                    extension={item.extension}
                    fileName={item.name}
                    onDelete={props.onDelete}
                  />
                )
              )
            }
            {
              // Veiw mode with only PDF files with click and name change etc.
              !props.isEditView && item.type === FileType.Pdf && (
                <PortfolioPDF
                  id={item.id}
                  directory={item.directory}
                  extension={item.extension}
                  fileName={item.name}
                  isEditView={props.isEditView}
                />
              )
            }
          </div>
          {item.type === FileType.Image && (
            <FormControlLabel
              sx={{ ml: 1 }}
              control={<Checkbox checked={item.isFeatured} onChange={handleChange(item.id)} />}
              label="Featured"
            />
          )}
        </ImageListItem>
      ))}
    </React.Fragment>
  );
}
