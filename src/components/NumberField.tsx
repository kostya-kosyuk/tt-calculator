import { TextField } from "@mui/material";

type Props = {
    value: string,
    handleChange: (value: string) => void,
};

const NumberField = ({value, handleChange}:Props) => {
    return (
        <TextField
            placeholder='Enter Number'
            variant="outlined"
            className='backgroundWhite'
            value={value}
            inputProps={{ maxLength: 16 }}
            onChange={(event) => {
                const { value } = event.target;
                if (value || value === '') {
                    handleChange(value);
                }
            }}
            sx={{
                marginBottom: 3,
            }}
        />
    );
};

export default NumberField;