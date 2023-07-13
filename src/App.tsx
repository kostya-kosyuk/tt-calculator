import { useEffect, useLayoutEffect, useState } from 'react';
import './style.css';
import { Box, Button, CircularProgress, Container, IconButton, MenuItem, Select, Typography } from '@mui/material';
import NumberField from './components/NumberField';
import changeNum from './helpers/changeNum';
import checkWalletConnection from './utils/checkMetamask';
import RefreshIcon from '@mui/icons-material/Refresh';
import classNames from 'classnames';
import { web3Initialize, sendTransaction, getUsageCount } from './utils/contracts';

const operations = ['+', '-', ':', '*'];

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: (args: { method: string }) => Promise<void>;
    };
  }
}

const App = () => {
  const [calculatorUsedCount, setCalculatorUsedCount] = useState(0);

  const [operation, setOperation] = useState(0);
  const [numA, setNumA] = useState('');
  const [numB, setNumB] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<number | string>('0');


  const [isWalletConnected, setIsWalletConnected] = useState<null | boolean>(null);
  const [isChecking, setChecking] = useState(false);

  const handleChangeNumA = (num: string) => {
    changeNum(num, setNumA);
  };

  const handleChangeNumB = (num: string) => {
    changeNum(num, setNumB);
  };

  const handleOperationChange = (index: string | number) => {
    if (Number.isInteger(index)) {
      setOperation(index as number);
    };
  };

  const handleCalculate = () => {
    setLoading(true);
    const response = sendTransaction(+numA, +numB, operations[operation]);

    response?.then(res => {
      if (res === null) {
        setResult(0);
      } else {
        setResult(res);
      }
    }).finally(() => {
      setLoading(false);

    });
  };


  const hanleCheckMetaMask = () => {
    setChecking(true);

    const request = checkWalletConnection();

    if (!request) {
      setIsWalletConnected(false);
    } else {
      request
        .then(() => {
          setIsWalletConnected(true);
        })
        .catch(() => {
          setIsWalletConnected(false);
        });
    }

    setChecking(false);
  }

  useLayoutEffect(() => {
    hanleCheckMetaMask();
  }, []);

  useEffect(() => {
    if (isWalletConnected) {
      web3Initialize();

      getUsageCount().then((data) => {
          setCalculatorUsedCount(Number(data));
      });
    }
  }, [isWalletConnected, result]);

    return (
      <Box className='gradient'>
        <Container
          sx={{
            display: 'grid',
            height: '100vh',
          }}
        >
          <Box
            className={'container'}
            sx={{
              padding: 3,
              borderRadius: 2,

              placeSelf: 'center',

              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <NumberField value={numA} handleChange={handleChangeNumA} />
            <Select
              value={operation}
              onChange={(event) => {
                const index = event.target.value;
                if (index) {
                  handleOperationChange(index);
                }
              }}
              className='backgroundWhite'
              sx={{
                marginBottom: 3,
                width: 80,
              }}
            >
              {operations.map((operation, index) => (
                <MenuItem value={index} key={operation}>{operation}</MenuItem>
              ))}
            </Select>
            <NumberField value={numB} handleChange={handleChangeNumB} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 3,
              }}>
              <Typography>Result: {isLoading ? '' : result}</Typography>
              {isLoading && <CircularProgress
                size={18}
                sx={{
                  marginLeft: 1
                }}
              />}
            </Box>
            <Button className={'button'}
              onClick={handleCalculate}
              disabled={!isWalletConnected || isLoading}
              sx={{
                backgroundColor:'rgba(255, 255, 255, .5)',
                marginBottom: 3
              }}
            >
              Calculate
            </Button>
            <Typography
              sx={{
                visibility: isWalletConnected ? 'visible' : 'hidden'
              }}
            >
              Calculator used: {calculatorUsedCount} times
            </Typography>
            {isWalletConnected === false &&
            (
              <Box
              className={classNames(isChecking && 'shake')}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, .3)',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                paddingX: 1,
              }}
              >
                <Typography
                  align='center'
                >I connected my MetaMask</Typography>
                <IconButton
                  color="primary"
                  disabled={isChecking}
                  onClick={hanleCheckMetaMask}
                >
                  {isChecking ? <CircularProgress size={24} /> : <RefreshIcon />}
                </IconButton>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    );
  }

export default App;