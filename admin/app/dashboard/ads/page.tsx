'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ChevronDown,
  Eye,
  Megaphone,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  fetchAds,
  updateAdStatus,
  updateAdType,
  type AdUser,
} from '@/store/slices/adSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '@/hooks/redux';

import Pagination from '@/components/ui/Pagination';
import SearchBar from '@/components/ui/SearchBar';
import TableSkeleton from '@/components/ui/TableSkeleton';
import EmptyState from '@/components/ui/EmptyState';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const AD_STATUSES = [
  'pending',
  'approved',
  'rejected',
];

const FALLBACK_TYPES = [
  'Super Ad',
  'Normal Ad',
  'VIP Ad',
  'NRA Ad',
];

const getImageUrl = (url?: string) => {
  if (!url) return '';

  if (url.startsWith('http')) {
    return url;
  }

  if (!API_BASE_URL) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
};

const getUserDisplayName = (
  user: AdUser | string | null | undefined
) => {
  if (!user || typeof user === 'string') {
    return 'Unknown User';
  }

  const combinedName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    user.name?.trim() ||
    user.fullName?.trim() ||
    user.username?.trim() ||
    combinedName ||
    user.email?.split('@')[0] ||
    'N/A'
  );
};

const getUserPhone = (
  user: AdUser | string | null | undefined
) => {
  if (!user || typeof user === 'string') {
    return '';
  }

  return (
    user.phone?.trim() ||
    user.phoneNumber?.trim() ||
    user.mobile?.trim() ||
    ''
  );
};

interface StatusDropdownProps {
  adId: string;
  current: string;
  onUpdate: (
    id: string,
    status: string
  ) => void;
}

function StatusDropdown({
  adId,
  current,
  onUpdate,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);

  const colors: Record<string, string> = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
  };

  const color =
    colors[current] || '#374151';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize transition-all hover:opacity-80"
        style={{
          borderColor: color,
          color,
          background: `${color}15`,
        }}
      >
        {current}

        <ChevronDown size={11} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute left-0 top-full z-20 mt-1 min-w-[110px] overflow-hidden rounded-lg shadow-lg"
            style={{
              background: 'var(--white)',
              border:
                '1px solid var(--border)',
            }}
          >
            {AD_STATUSES.filter(
              (status) => status !== current
            ).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onUpdate(adId, status);
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold capitalize transition-all hover:bg-gray-50"
                style={{
                  color:
                    colors[status] ||
                    '#374151',
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface TypeDropdownProps {
  adId: string;
  current: string;
  types: string[];
  onUpdate: (
    id: string,
    type: string
  ) => void;
}

function TypeDropdown({
  adId,
  current,
  types,
  onUpdate,
}: TypeDropdownProps) {
  const [open, setOpen] = useState(false);

  const colors: Record<string, string> = {
    'Super Ad': '#7c3aed',
    'Normal Ad': '#374151',
    'VIP Ad': '#d97706',
    'NRA Ad': '#0891b2',
  };

  const color =
    colors[current] || '#374151';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all hover:opacity-80"
        style={{
          borderColor: color,
          color,
          background: `${color}15`,
        }}
      >
        {current}

        <ChevronDown size={11} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute left-0 top-full z-20 mt-1 flex min-w-[130px] flex-col overflow-hidden rounded-lg shadow-lg"
            style={{
              background: 'var(--white)',
              border:
                '1px solid var(--border)',
            }}
          >
            {types
              .filter(
                (type) => type !== current
              )
              .map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onUpdate(adId, type);
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold transition-all hover:bg-gray-50"
                  style={{
                    color:
                      colors[type] ||
                      '#374151',
                  }}
                >
                  {type}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

interface DescriptionModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

function DescriptionModal({
  title,
  description,
  onClose,
}: DescriptionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close description"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2
          className="pr-8 text-[18px] font-bold"
          style={{
            color: 'var(--dark)',
          }}
        >
          {title}
        </h2>

        <div className="mt-4 max-h-[360px] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--gray)] p-4">
          <p className="whitespace-pre-wrap text-[14px] leading-6 text-gray-600">
            {description ||
              'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SelectedDescription {
  title: string;
  description: string;
}

export default function AdsPage() {
  const dispatch = useAppDispatch();

  const {
    ads,
    total,
    pages,
    loading,
    adTypes,
  } = useAppSelector(
    (state) => state.ads
  );

  const [search, setSearch] =
    useState('');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    selectedDescription,
    setSelectedDescription,
  ] =
    useState<SelectedDescription | null>(
      null
    );

  const load = useCallback(() => {
    dispatch(
      fetchAds({
        page: currentPage,
        search,
      })
    );
  }, [
    dispatch,
    currentPage,
    search,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(
      load,
      search ? 400 : 0
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [load, search]);

  const handleStatusChange = async (
    id: string,
    status: string
  ) => {
    const result = await dispatch(
      updateAdStatus({
        id,
        status,
      })
    );

    if (
      updateAdStatus.fulfilled.match(
        result
      )
    ) {
      const creditCost = result.payload.ad?.creditCost;

      toast.success(
        typeof creditCost === 'number' && creditCost > 0
          ? `Ad approved — ${creditCost} credits deducted (balance: ${result.payload.agentBalance})`
          : 'Ad status updated successfully'
      );
    } else {
      toast.error(
        result.payload || 'Failed to update status'
      );
    }
  };

  const handleTypeChange = async (
    id: string,
    type: string
  ) => {
    const result = await dispatch(
      updateAdType({
        id,
        type,
      })
    );

    if (
      updateAdType.fulfilled.match(
        result
      )
    ) {
      toast.success(
        'Ad type updated successfully'
      );
    } else {
      toast.error(
        'Failed to update type'
      );
    }
  };

  const formatDate = (
    date: string
  ) => {
    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return '—';
    }

    return parsedDate.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const availableTypes =
    adTypes?.length
      ? adTypes
      : FALLBACK_TYPES;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <h1
          className="text-xl font-bold"
          style={{
            color: 'var(--dark)',
          }}
        >
          All Ads
        </h1>

        <p className="mt-0.5 text-sm text-gray-400">
          Review, approve, reject and
          manage user-submitted listings.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-xl shadow-sm"
        style={{
          background: 'var(--white)',
          border:
            '1px solid var(--border)',
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
          style={{
            borderBottom:
              '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
              style={{
                background: '#7c3aed',
              }}
            >
              <Megaphone size={14} />
            </div>

            <span
              className="text-sm font-semibold"
              style={{
                color: 'var(--dark)',
              }}
            >
              {total} Ads
            </span>
          </div>

          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Search title or category…"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background:
                    'var(--gray)',
                  borderBottom:
                    '1px solid var(--border)',
                }}
              >
                {[
                  'Image',
                  'Ad ID',
                  'User Info',
                  'Ad Phone',
                  'Title',
                  'Description',
                  'Category',
                  'Location',
                  'Price',
                  'Type',
                  'Status',
                  'Submitted',
                  'Approved',
                  'Expires',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton
                  rows={5}
                  cols={14}
                />
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={14}>
                    <EmptyState message="No ads found. Try a different search." />
                  </td>
                </tr>
              ) : (
                ads.map((ad) => {
                  const imageUrl =
                    getImageUrl(
                      ad.image?.url
                    );

                  const userName =
                    getUserDisplayName(
                      ad.user
                    );

                  const userPhone =
                    getUserPhone(ad.user);

                  const isAgentAd =
                    typeof ad.user === 'object' &&
                    ad.user?.role === 'agent';

                  return (
                    <tr
                      key={ad._id}
                      className="transition-colors hover:bg-gray-50"
                      style={{
                        borderBottom:
                          '1px solid var(--border)',
                        borderLeft: isAgentAd
                          ? '3px solid #d97706'
                          : '3px solid transparent',
                        background: isAgentAd
                          ? '#fffbeb'
                          : undefined,
                      }}
                    >
                      {/* Image */}
                      <td className="px-4 py-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={ad.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <Megaphone
                              size={16}
                              className="text-gray-400"
                            />
                          </div>
                        )}
                      </td>

                      {/* Ad ID */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <code
                          className="rounded px-1.5 py-0.5 font-mono text-xs"
                          style={{
                            background:
                              'var(--gray)',
                            color:
                              '#7c3aed',
                          }}
                        >
                          {ad.adId || '—'}
                        </code>
                      </td>

                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="min-w-[150px]">
                          <div className="flex items-center gap-1.5">
                            <p
                              className="max-w-[150px] truncate text-[13px] font-normal"
                              style={{
                                color:
                                  'var(--dark)',
                              }}
                              title={userName}
                            >
                              {userName}
                            </p>

                            {isAgentAd && (
                              <span
                                className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                style={{
                                  background: '#fef3c7',
                                  color: '#b45309',
                                }}
                                title="Submitted by an agent account"
                              >
                                Agent
                              </span>
                            )}
                          </div>

                          <p
                            className="mt-0.5 whitespace-nowrap text-xs text-gray-400"
                            title={
                              userPhone ||
                              'Phone number unavailable'
                            }
                          >
                            {userPhone ||
                              'No phone number'}
                          </p>
                        </div>
                      </td>

                      {/* Ad Phone */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {ad.phone || ad.whatsappNumber || '—'}
                      </td>

                      {/* Title */}
                      <td
                        className="max-w-[160px] truncate px-4 py-3 font-medium"
                        style={{
                          color:
                            'var(--dark)',
                        }}
                        title={ad.title}
                      >
                        {ad.title}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDescription(
                              {
                                title:
                                  ad.title,
                                description:
                                  ad.description,
                              }
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--primary)] transition hover:border-[var(--primary)] hover:bg-pink-50"
                          title="View description"
                          aria-label={`View description for ${ad.title}`}
                        >
                          <Eye size={16} />
                        </button>
                      </td>

                      {/* Category */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {ad.category || '—'}
                      </td>

                      {/* Location */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {ad.location || '—'}
                      </td>

                      {/* Price */}
                      <td
                        className="whitespace-nowrap px-4 py-3 font-semibold"
                        style={{
                          color:
                            'var(--dark)',
                        }}
                      >
                        {typeof ad.price ===
                          'number' &&
                          ad.price > 0
                          ? `LKR ${ad.price.toLocaleString()}`
                          : '—'}
                      </td>

                      {/* Type */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <TypeDropdown
                          adId={ad._id}
                          current={
                            ad.type ||
                            'Normal Ad'
                          }
                          types={
                            availableTypes
                          }
                          onUpdate={
                            handleTypeChange
                          }
                        />
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusDropdown
                          adId={ad._id}
                          current={
                            ad.status
                          }
                          onUpdate={
                            handleStatusChange
                          }
                        />
                      </td>

                      {/* Submitted */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                        {formatDate(ad.createdAt)}
                      </td>

                      {/* Approved */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                        {ad.approvedAt ? formatDate(ad.approvedAt) : '—'}
                      </td>

                      {/* Expires */}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                        {ad.expiresAt ? formatDate(ad.expiresAt) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          pages={pages}
          total={total}
          limit={20}
          onPageChange={(page) => {
            setCurrentPage(page);

            dispatch(
              fetchAds({
                page,
                search,
              })
            );
          }}
        />
      </div>

      {selectedDescription && (
        <DescriptionModal
          title={
            selectedDescription.title
          }
          description={
            selectedDescription.description
          }
          onClose={() =>
            setSelectedDescription(
              null
            )
          }
        />
      )}
    </div>
  );
}
