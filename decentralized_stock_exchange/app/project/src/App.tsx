import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ArrowUpDown, 
  PieChart, 
  Clock, 
  ChevronDown,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';

type CryptoData = {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  image: string;
};

type PortfolioAsset = {
  symbol: string;
  amount: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
};

type Transaction = {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
};

function App() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'history'>('market');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 125.45,
      change24h: 2.5,
      volume24h: 1234567890,
      marketCap: 53900000000,
      image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 52345.67,
      change24h: -1.2,
      volume24h: 28900000000,
      marketCap: 1020000000000,
      image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3245.89,
      change24h: 0.8,
      volume24h: 15600000000,
      marketCap: 389000000000,
      image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
    }
  ]);

  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([
    {
      symbol: 'SOL',
      amount: 15.5,
      value: 1944.475,
      profitLoss: 245.5,
      profitLossPercentage: 12.5
    },
    {
      symbol: 'BTC',
      amount: 0.05,
      value: 2617.28,
      profitLoss: -125.4,
      profitLossPercentage: -4.8
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      symbol: 'SOL',
      amount: 5.5,
      price: 124.32,
      total: 683.76,
      timestamp: new Date('2024-02-20T10:30:00'),
      status: 'completed'
    },
    {
      id: '2',
      type: 'sell',
      symbol: 'BTC',
      amount: 0.02,
      price: 52100.00,
      total: 1042.00,
      timestamp: new Date('2024-02-19T15:45:00'),
      status: 'completed'
    }
  ]);

  const [selectedCrypto, setSelectedCrypto] = useState<string>('SOL');
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(bal => {
        setBalance(bal / 1000000000);
      });
    } else {
      setBalance(null);
    }
  }, [publicKey, connection]);

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(decimals)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(decimals)}M`;
    } else {
      return `$${num.toFixed(decimals)}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredCryptoData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPortfolioValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const totalProfitLoss = portfolio.reduce((sum, asset) => sum + asset.profitLoss, 0);
  const totalProfitLossPercentage = (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Solana Exchange</h1>
          </div>
          <div className="flex items-center space-x-4">
            {connected && (
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-300">Balance:</span>
                <span className="ml-2 font-bold">{balance?.toFixed(4)} SOL</span>
              </div>
            )}
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'market'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'portfolio'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            History
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500"
          />
        </div>

        {activeTab === 'market' && (
          <>
            {/* Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {filteredCryptoData.map((crypto) => (
                <div 
                  key={crypto.symbol}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-6 cursor-pointer hover:bg-white/20 transition"
                  onClick={() => setSelectedCrypto(crypto.symbol)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-3 rounded-full" />
                      <div>
                        <h3 className="text-xl font-bold">{crypto.name}</h3>
                        <p className="text-sm text-gray-300">{crypto.symbol}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      crypto.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{formatNumber(crypto.price)}</p>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Vol 24h: {formatNumber(crypto.volume24h)}</span>
                      <span>MCap: {formatNumber(crypto.marketCap)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trading Interface */}
            {connected ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <ArrowUpDown className="w-6 h-6 mr-2" />
                  Trade {selectedCrypto}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {/* Order Type Selector */}
                    <div className="flex space-x-4 mb-4">
                      <button
                        onClick={() => setOrderType('market')}
                        className={`flex-1 py-2 rounded-lg transition ${
                          orderType === 'market'
                            ? 'bg-purple-600'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        Market
                      </button>
                      <button
                        onClick={() => setOrderType('limit')}
                        className={`flex-1 py-2 rounded-lg transition ${
                          orderType === 'limit'
                            ? 'bg-purple-600'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        Limit
                      </button>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Amount ({selectedCrypto})
                      </label>
                      <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Limit Price Input */}
                    {orderType === 'limit' && (
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Limit Price (USD)
                        </label>
                        <input
                          type="number"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    {/* Buy/Sell Buttons */}
                    <div className="flex space-x-4">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition">
                        Buy {selectedCrypto}
                      </button>
                      <button className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition">
                        Sell {selectedCrypto}
                      </button>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Price per {selectedCrypto}</span>
                        <span>{formatNumber(cryptoData.find(c => c.symbol === selectedCrypto)?.price || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Amount</span>
                        <span>{tradeAmount || '0.00'} {selectedCrypto}</span>
                      </div>
                      {orderType === 'limit' && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Limit Price</span>
                          <span>${limitPrice || '0.00'}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatNumber((cryptoData.find(c => c.symbol === selectedCrypto)?.price || 0) * (parseFloat(tradeAmount) || 0))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-lg p-8">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h2 className="text-xl font-bold mb-2">Connect Your Wallet to Trade</h2>
                <p className="text-gray-300 mb-6">Access advanced trading features by connecting your Solana wallet</p>
                <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
              </div>
            )}
          </>
        )}

        {activeTab === 'portfolio' && connected && (
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm text-gray-300 mb-1">Total Portfolio Value</h3>
                  <p className="text-2xl font-bold">{formatNumber(totalPortfolioValue)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-300 mb-1">24h Profit/Loss</h3>
                  <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalProfitLoss >= 0 ? '+' : ''}{formatNumber(totalProfitLoss)}
                    <span className="text-sm ml-1">
                      ({totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%)
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-300 mb-1">Number of Assets</h3>
                  <p className="text-2xl font-bold">{portfolio.length}</p>
                </div>
              </div>
            </div>

            {/* Portfolio Assets */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4">Asset</th>
                      <th className="text-right p-4">Balance</th>
                      <th className="text-right p-4">Value</th>
                      <th className="text-right p-4">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((asset) => (
                      <tr key={asset.symbol} className="border-t border-white/10">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={cryptoData.find(c => c.symbol === asset.symbol)?.image}
                              alt={asset.symbol}
                              className="w-8 h-8 mr-3 rounded-full"
                            />
                            <div>
                              <p className="font-semibold">{asset.symbol}</p>
                              <p className="text-sm text-gray-300">
                                {cryptoData.find(c => c.symbol === asset.symbol)?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {asset.amount.toFixed(4)} {asset.symbol}
                        </td>
                        <td className="p-4 text-right">{formatNumber(asset.value)}</td>
                        <td className="p-4 text-right">
                          <span className={asset.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {asset.profitLoss >= 0 ? '+' : ''}{formatNumber(asset.profitLoss)}
                            <span className="text-sm ml-1">
                              ({asset.profitLossPercentage >= 0 ? '+' : ''}{asset.profitLossPercentage.toFixed(2)}%)
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && connected && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Asset</th>
                    <th className="text-right p-4">Amount</th>
                    <th className="text-right p-4">Price</th>
                    <th className="text-right p-4">Total</th>
                    <th className="text-right p-4">Date</th>
                    <th className="text-right p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-white/10">
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={cryptoData.find(c => c.symbol === tx.symbol)?.image}
                            alt={tx.symbol}
                            className="w-6 h-6 mr-2 rounded-full"
                          />
                          {tx.symbol}
                        </div>
                      </td>
                      <td className="p-4 text-right">{tx.amount.toFixed(4)}</td>
                      <td className="p-4 text-right">{formatNumber(tx.price)}</td>
                      <td className="p-4 text-right">{formatNumber(tx.total)}</td>
                      <td className="p-4 text-right">{formatDate(tx.timestamp)}</td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-1 rounded text-sm ${
                          tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;