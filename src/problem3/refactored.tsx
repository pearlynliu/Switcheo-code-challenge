// import React from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Assuming blockchain property is required
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Import or define BoxProps, WalletRow, and classes here

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { ...rest } = props; // Remove children
  const balances = useWalletBalances(); // Make sure to import or define useWalletBalances
  const prices = usePrices(); // Make sure to import or define usePrices

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // Calculate balance priorities once
  const balancesWithPriority = balances.map((balance: WalletBalance) => ({
    ...balance,
    priority: getPriority(balance.blockchain),
  }));

  const sortedBalances = useMemo(() => {
    return balancesWithPriority
      .filter((balance: WalletBalance) => balance.priority > -99 && balance.amount > 0)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => rhs.priority - lhs.priority);
  }, [balancesWithPriority, balance.amount]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row} // Make sure classes is correctly defined or imported
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
