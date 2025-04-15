"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getTopCoins } from "../../lib/coinGecko";
import CoinChart from "../components/CoinChart";
import MarketCapTrendChart from "../components/MarketCapTrendChart";
import { getGlobalStats } from "../../lib/coinGecko";
import Loading from "../components/Loading";
import axios from "axios";
import Image from "next/image";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}
interface GlobalStats {
  active_cryptocurrencies: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number };
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);

    async function loadEverything() {
      // 🔄 Fetch Top Coins
      try {
        const coinsData = await getTopCoins();
        if (coinsData) {
          setCoins(coinsData);
        } else {
          console.warn("Coins not available, skipping.");
        }
      } catch (error: unknown) {
        console.warn("Top coins fetch error:", error?.message ?? error);
      }

      // 📊 Fetch Global Stats
      try {
        const statsData = await getGlobalStats();
        if (statsData) {
          setStats(statsData);
        } else {
          console.warn("Stats not available, skipping.");
        }
      } catch (error: unknown) {
        console.warn("Global stats fetch error:", error?.message ?? error);
      }

      // 📈 Fetch Chart Data
      try {
        const chartRes = await axios.get(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
          {
            params: {
              vs_currency: "usd",
              days: 30,
              interval: "daily",
            },
          }
        );

        if (chartRes?.data?.market_caps) {
          const raw = chartRes.data.market_caps;
          const labels = raw.map(([timestamp]: [number, number]) =>
            new Date(timestamp).toISOString()
          );
          const values = raw.map(([, value]: [number, number]) => value);
          setChartData({ labels, values });
        }
      } catch (error: unknown) {
        console.warn("Chart data fetch error:", error?.message ?? error);
      }

      setLoading(false);
    }

    loadEverything();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.site_name}>CoinVista</h1>
          <p className={styles.slogan_style}>Track.</p>
          <p className={styles.slogan_style}>Analyze.</p>
          <p className={styles.slogan_style}>Invest.</p>
          <div className={styles.scrollIndicator}>↓</div>
        </div>
      </section>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={`${styles.main}`}>
            <div className="row m-0 py-4">
              <div className="col-12 col-md-8">
                {!stats && (
                  <div className="text-center text-muted">
                    ⚠️ Unable to load global market stats, Reload Please.
                  </div>
                )}
                {stats && (
                  <div className="row text-center">
                    <div className="col-sm-6 col-md-6 m-0 pb-3">
                      <div
                        className={`card p-2 p-md-3 shadow-sm ${styles.card}`}
                      >
                        <i
                          className="bi bi-currency-dollar fs-3 mb-2"
                          style={{ color: "red" }}
                        ></i>
                        <h6 className="mb-1 text-muted">Market Cap</h6>
                        <strong>
                          ${stats.total_market_cap.usd.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 m-0 pb-3">
                      <div className={`card p-3 shadow-sm ${styles.card}`}>
                        <i
                          className="bi bi-graph-up fs-3 mb-2"
                          style={{ color: "red" }}
                        ></i>
                        <h6 className="mb-1 text-muted">24h Volume</h6>
                        <strong>
                          ${stats.total_volume.usd.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 m-0 pb-3">
                      <div className={`card p-3 shadow-sm ${styles.card}`}>
                        <i
                          className="bi bi-currency-bitcoin fs-3 mb-2"
                          style={{ color: "red" }}
                        ></i>
                        <h6 className="mb-1 text-muted">BTC Dominance</h6>
                        <strong>
                          {stats.market_cap_percentage.btc.toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 m-0 pb-3">
                      <div className={`card p-3 shadow-sm ${styles.card}`}>
                        <i
                          className="bi bi-stack fs-3 mb-2"
                          style={{ color: "red" }}
                        ></i>
                        <h6 className="mb-1 text-muted">Total Coins</h6>
                        <strong>
                          {stats.active_cryptocurrencies.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {mounted && chartData.labels.length > 0 ? (
                  <div className="card mt-4 p-4 shadow-sm">
                    <h5 className="mb-3">Bitcoin Market Cap Trend</h5>
                    <div className={`${styles.btc_trend}`}>
                      <MarketCapTrendChart
                        labels={chartData.labels}
                        dataPoints={chartData.values}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted mt-4">
                    ⚠️ Market cap trend data not available.
                  </div>
                )}
              </div>
              <div className="col-12 col-md-4 justify-center mt-3 mt-md-0">
                <input
                  className="m-0 w-100"
                  type="text"
                  placeholder="Search by name or symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    marginBottom: "1rem",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />

                <h4
                  className="m-0 py-3 justify-center text-center"
                  style={{ fontWeight: 700 }}
                >
                  Top 10 Cryptocurrencies
                </h4>
                {filteredCoins.length > 0 ? (
                  <ul className="p-0" style={{ listStyle: "none" }}>
                    {filteredCoins.map((coin) => (
                      <li
                        key={coin.id}
                        className="row m-0 p-0 flex-row justify-start"
                      >
                        <div className="position-relative col-2 d-flex align-items-center ">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            className={styles.top_crypto_icons}
                            fill
                            style={{ objectFit: "contain" }}
                            unoptimized
                          />
                          {/* <img
                            className={`${styles.top_crypto_icons}`}
                            src={coin.image}
                            alt={coin.name}
                          /> */}
                        </div>
                        <div className="col-3 d-flex align-items-center">
                          <strong>{coin.name}</strong>
                        </div>
                        <div className="col-5 d-flex align-items-center">
                          <span style={{ fontWeight: 500 }}>
                            $
                            {coin.current_price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span
                            style={{
                              marginLeft: "10px",

                              color:
                                coin.price_change_percentage_24h >= 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        </div>
                        <CoinChart sparklineData={coin.sparkline_in_7d.price} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted">
                    🔍 No coins match your search — or data couldn’t load.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
