import React, { useState, useEffect } from 'react';
import { Container, Paper, Grid, Typography, TextField, MenuItem, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import SwapVertIcon from '@mui/icons-material/SwapVert';

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
  // Store  currency into currencies and prices into exchangeRates
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
        setResult(convertedAmount.toFixed(2));
      } else {
        setResult('Invalid currencies');
      }
    } else {
      setResult('Please fill in all fields');
    }
  }, [fromCurrency, toCurrency, amount, exchangeRates]);

  const handleSwapCurrencies = () => {
    if (originalAmount) {
      setFromCurrency(isSwapped ? toCurrency : fromCurrency);
      setToCurrency(isSwapped ? fromCurrency : toCurrency);
      setIsSwapped(!isSwapped);
      setAmount(originalAmount);
      setResult('');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Currency Swap
      </Typography>
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
          <Button variant="outlined" style={{ color: 'black' }} onClick={handleSwapCurrencies}>
            {/* <SwapVerticalCircleIcon fontSize="large" /> */}
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
    </Paper>
  );
};

const CurrencySwapPage = () => {
  return (
    <Container maxWidth="md" style={{ paddingTop: '20px' }}>
      <CurrencySwap />
    </Container>
  );
};

export default CurrencySwapPage;
