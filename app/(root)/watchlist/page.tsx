import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import { getUserAlerts } from '@/lib/actions/alert.actions';
import WatchlistTable from '@/components/WatchlistTable';
import SearchCommand from '@/components/SearchCommand';
import { searchStocks } from '@/lib/actions/finnhub.actions';

export default async function WatchlistPage() {
  const [watchlistResult, alertsResult, initialStocks] = await Promise.all([
    getUserWatchlist(),
    getUserAlerts(),
    searchStocks(),
  ]);

  const watchlist = watchlistResult.success ? watchlistResult.data : [];
  const alerts = alertsResult.success ? alertsResult.data : [];

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">My Watchlist</h1>
        <SearchCommand renderAs="button" label="Add Stock" initialStocks={initialStocks} />
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            Your watchlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Start tracking stocks by adding them to your watchlist
          </p>
          <SearchCommand renderAs="button" label="Add Your First Stock" initialStocks={initialStocks} />
        </div>
      ) : (
        <WatchlistTable watchlist={watchlist} alerts={alerts} />
      )}
    </div>
  );
}
