import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import { css, styled } from '@mui/material';

interface SearchFormProps {
  search: string;
}

const StyledTextField = styled(TextField)(
  ({ theme }) => css`
    margin-right: ${theme.spacing(1)};
    & .MuiInputBase-input {
      padding: ${theme.spacing(0.75)} 0;
      height: 32px;
      box-sizing: border-box;
      font-size: 14px;
    }
  `,
);

const UserSearch = () => {
  const navigate = useNavigate();

  const form = useFormik<SearchFormProps>({
    initialValues: {
      search: '',
    },
    onSubmit: (values: SearchFormProps): void => {
      const queryParams = values.search ? new URLSearchParams({ search: values.search }).toString() : '';
      form.resetForm();
      navigate(`/users?${queryParams}`);
    },
    validationSchema: object({
      search: string().notRequired(),
    }),
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <StyledTextField
        id="search"
        variant="outlined"
        placeholder="Search"
        size="small"
        value={form.values.search}
        onChange={form.handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="outlined" type="submit" aria-label="search" size="medium">
        Search
      </Button>
    </form>
  );
};

export default UserSearch;
