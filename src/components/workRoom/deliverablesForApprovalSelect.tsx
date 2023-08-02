import {
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Chip,
  ListSubheader,
} from '@mui/material';
import IApiError from 'global/interfaces/api';
import { IChatUserThread } from 'global/interfaces/chatThread';
import {
  ContractDeliverableStatus,
  ContractStatus,
  IContract,
  IDeliverable,
  IDeliverableForApproval,
} from 'global/interfaces/contract';
import * as React from 'react';
import { getOpenContracts } from 'services/contractService';
import { showUIError } from 'utils/errorHandler';
import { UserAuth } from 'contexts/AuthContext';

interface IDeliverablesForApprovalSelectProps {
  user: UserAuth | null;
  selectedThread?: IChatUserThread;
  handleSelectedDeliverblesChange: (selectedDeliverables: IDeliverableForApproval[]) => void;
  handleLoaded?: (deliverablesAvailable: boolean) => void;
}

export default function DeliverablesForApprovalSelect(props: IDeliverablesForApprovalSelectProps): JSX.Element {
  const [deliverables, setDeliverables] = React.useState<IDeliverableForApproval[]>([]);
  const [selectedIndexes, setSelectedIndexes] = React.useState<number[]>([]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    const selectedDeliverablesForApproval: IDeliverableForApproval[] = [];

    if (typeof value === 'string') {
      setSelectedIndexes([]);
    } else {
      setSelectedIndexes(value);
      for (const index of value) {
        selectedDeliverablesForApproval.push(deliverables[index]);
      }
    }

    props.handleSelectedDeliverblesChange(selectedDeliverablesForApproval);
  };

  const getDeliverablesForApproval = (chatThreadId: string): void => {
    getOpenContracts(chatThreadId)
      .then((res: IContract[]) => {
        const deliverableList: IDeliverable[] = [];
        const inProgressContracts = res.filter(
          p => p.status === ContractStatus.InProgress || p.status === ContractStatus.Disputed,
        );
        let lastContractId: string | null = null;
        for (const contract of inProgressContracts) {
          const relevantDeliverables: IDeliverableForApproval[] = contract.deliverables.filter(
            p => p.status !== ContractDeliverableStatus.Approved,
          );

          for (const del of relevantDeliverables) {
            del.first = lastContractId !== contract.contractId;
            del.contractId = contract.contractId;
            del.contractName = contract.name;

            lastContractId = contract.contractId;
            deliverableList.push(del);
          }
        }
        setDeliverables(deliverableList);
        setSelectedIndexes([]);
        if (props.handleLoaded !== undefined) {
          const deliverablesAvailable = deliverableList.length > 0;
          props.handleLoaded(deliverablesAvailable);
        }
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  React.useEffect(() => {
    setDeliverables([]);
    const chatThreadId: string = props.selectedThread?.chatThreadId ?? '';
    if (chatThreadId != '') {
      getDeliverablesForApproval(chatThreadId);
    }
  }, [props.selectedThread, props.user]);

  return (
    <React.Fragment>
      {deliverables.length > 0 && (
        <React.Fragment>
          <FormControl sx={{ mr: 1, mt: 2 }} fullWidth>
            <Select
              multiple
              value={selectedIndexes}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => (
                    <Chip key={value} label={deliverables[value].contractName + ': ' + deliverables[value].name} />
                  ))}
                </Box>
              )}
            >
              {deliverables.map((item, index) =>
                item.first
                  ? [
                      <ListSubheader key={index + 'head'}>{item.contractName}</ListSubheader>,
                      <MenuItem key={index} value={index}>
                        <Checkbox checked={selectedIndexes.indexOf(index) >= 0} />
                        <ListItemText primary={item.name} />
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem key={index} value={index}>
                        <Checkbox checked={selectedIndexes.indexOf(index) >= 0} />
                        <ListItemText primary={item.name} />
                      </MenuItem>,
                    ],
              )}
            </Select>
          </FormControl>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
