import React, { useState, useEffect } from 'react';
import { Container, Paper, Grid, Typography, TextField, MenuItem, Button } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// colors: 
// green: #e2fca4
// blue: #1a3b4d
// white: #ffffff

const theme = createTheme({
  palette: {
    text: {
      primary: "#ffffff",
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({
          "& .MuiInputLabel-root": {
            color: "#e2fca4", // Styles the label color to green
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#ffffff", // Styles the focused label color to white
          },
          "& .MuiOutlinedInput-root": {
            '& fieldset': {
              borderColor: '#e2fca4', // Change the outline color to green
              borderRadius: '10px'
            },
            "&:hover fieldset": {
              borderColor: "#ffffff", // Styles the border color on hover to white
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e2fca4", // Styles the focused border color to green
            },
            "& .MuiOutlinedInput-root .MuiMenuItem-root": {
              color: "#1a3b4d", // Set the text color to blue
            },

          },
          "& input": {color: "#ffffff"},
          
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#1a3b4d", // Set the text color of MenuItem to blue
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#1a3b4d", // Set the select arrow color to blue
        },
      },
    },

  }
});


const CurrencySwap = () => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [result, setResult] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isSwapped, setIsSwapped] = useState(false);


  // Fetching data from prices.json
  // Store currency into currencies and prices into exchangeRates
  useEffect(() => {
    fetch('data/prices.json')
      .then((response) => response.json())
      .then((data) => {
        const uniqueCurrencies = Array.from(new Set(data.map((item) => item.currency)));
        const rates = {};
        data.forEach((item) => {
          rates[item.currency] = item.price;
        });
        setCurrencies(uniqueCurrencies);
        setExchangeRates(rates);
      })
      .catch((error) => console.error('Error fetching prices.json:', error));
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      const fromRate = exchangeRates[fromCurrency];
      const toRate = exchangeRates[toCurrency];
      if (fromRate && toRate) {
        const convertedAmount = (amount / fromRate) * toRate;
        setResult(convertedAmount);
      } else {
        setResult('Invalid currencies');
      }
    } else {
      setResult('Please fill in all fields');
    }
  }, [fromCurrency, toCurrency, amount, exchangeRates]);

  useEffect(() => {
    if (originalAmount) {
      if (amount !== originalAmount) {
        setFromCurrency(isSwapped ? toCurrency : fromCurrency);
        setToCurrency(isSwapped ? fromCurrency : toCurrency);
        setIsSwapped(!isSwapped);
        setOriginalAmount(amount);
        setResult('');
      }
    } else {
      setOriginalAmount(amount);
    }
  }, [amount, isSwapped, originalAmount, fromCurrency, toCurrency]);

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ backgroundColor: "#1a3b4d", padding: "20px", borderRadius: "20px" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Currency Swap
        </Typography>
        <form id="currencySwapForm" onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
             From
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={() => {
                    if (!isSwapped) {
                      setOriginalAmount(amount);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  label="Currency"
                  value={isSwapped ? toCurrency : fromCurrency}
                  onChange={(e) => (isSwapped ? setToCurrency(e.target.value) : setFromCurrency(e.target.value))}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              style={{ color: '#1a3b4d', backgroundColor: "#e2fca4" }}
              onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
                setIsSwapped(!isSwapped);
              }}
            >
              <SwapVertIcon fontSize="large" />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              To
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={result}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  label="Currency"
                  value={isSwapped ? fromCurrency : toCurrency}
                  onChange={(e) => (isSwapped ? setFromCurrency(e.target.value) : setToCurrency(e.target.value))}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </form>

        {/* Conversion rate section */}
        {fromCurrency && toCurrency && (
            <Typography variant="body1" gutterBottom sx={{ marginTop: 4, fontWeight: 'bold' }}>
              1 {fromCurrency} = {exchangeRates[fromCurrency] / exchangeRates[toCurrency]} {toCurrency}
            </Typography>
          )}
      </Paper>
    </ThemeProvider>
  );
};

const CurrencySwapPage = () => {
  return (
    <Container maxWidth="md" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <CurrencySwap />
    </Container>
  );
};

export default CurrencySwapPage;
