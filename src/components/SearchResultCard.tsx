
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, ChevronDown, ChevronUp, Building2, Store, Package, Wrench, Tag } from 'lucide-react';
import type { SearchResult } from '../types/search';
import { RecordType } from '../types/search';
import MDEditor from '@uiw/react-md-editor';
import LocationMap from './LocationMap';
import ContactSellerDialog from '@/components/classifieds/ContactSellerDialog';

interface SearchResultCardProps {
  result: SearchResult;
  isNarrativeExpanded: boolean;
  onToggleNarrative: (resultId: string) => void;
}

const SearchResultCard = ({ result, isNarrativeExpanded, onToggleNarrative }: SearchResultCardProps) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const fullAddress = [
    result.addressLine1,
    result.addressLine2,
    `${result.city}, ${result.state} ${result.postalCode}`
  ].filter(Boolean).join(', ');

  const shouldTruncateNarrative = result.description && result.description.length > 200;
  const displayNarrative = shouldTruncateNarrative && !isNarrativeExpanded 
    ? result.description.substring(0, 200) + '...'
    : result.description;

  // Function to get record type badge
  const getRecordTypeBadge = () => {
    switch (result.recordType) {
      case RecordType.GREEN_PRO:
        return {
          label: result.categoryName || 'Pro',
          icon: <Store className="w-3 h-3" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case RecordType.GREEN_PRO_SERVICE:
        return {
          label: 'Service',
          icon: <Wrench className="w-3 h-3" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case RecordType.GREEN_PRO_PRODUCT:
        return {
          label: 'Product',
          icon: <Package className="w-3 h-3" />,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case RecordType.CLASSIFIED:
        return {
          label: 'Classified',
          icon: <Tag className="w-3 h-3" />,
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      default:
        return {
          label: 'Other',
          icon: <Building2 className="w-3 h-3" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const badge = getRecordTypeBadge();

  // Price display for products and services
  const getPriceDisplay = () => {
    if (result.minPrice !== null) {
      const minPrice = `$${result.minPrice.toFixed(2)}`;
      const maxPrice = result.maxPrice ? `$${result.maxPrice.toFixed(2)}` : null;
      const unit = result.priceUnitsType ? ` / ${result.priceUnitsType}` : '';
      
      if (maxPrice && result.maxPrice !== result.minPrice) {
        return `${minPrice} - ${maxPrice}${unit}`;
      }
      return `${minPrice}${unit}`;
    }
    return null;
  };

  const priceDisplay = getPriceDisplay();

  // Phone number masking function for classified ads
  const maskPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    if (digitsOnly.length === 10) {
      // Format: (XXX) XXX-XXXX -> (XXX) XXX-XX##
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-XX${digitsOnly.slice(8)}`;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      // Format: 1XXXXXXXXXX -> 1 (XXX) XXX-XX##
      return `1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-XX${digitsOnly.slice(9)}`;
    }
    // Fallback: just mask the last 4 digits
    return phoneNumber.replace(/.{4}$/, 'XX##');
  };

  // Convert search result to classified format for dialog
  const getClassifiedForDialog = () => {
    if (result.recordType !== RecordType.CLASSIFIED) return null;
    
    return {
      id: result.externId,
      title: result.title,
      description: result.description || '',
      email: result.emailAddress || '',
      phone: result.phoneNumber || '',
      contactObfuscated: false, // Search results don't have this flag
      price: result.minPrice || 0,
      priceUnitsType: result.priceUnitsType || 'Each',
      category: result.categoryRef,
      images: result.imageUrl ? [result.imageUrl] : [],
      // Required fields for Classified interface
      zipCode: result.postalCode || '',
      pricingTier: '1', // Default tier since search results don't have this
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
  };

    if (result.businessIconUrl) {
        if (result.producerId && result.locationId) {
            return (
                <>
                    <Card className="border-greenyp-200 hover:border-yellow-500 transition-colors duration-200">
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                {/* Main Content Column */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            {result.recordType === RecordType.CLASSIFIED ? (
                                                <Tag className="w-8 h-8 text-greenyp-600"/>
                                            ) : <img
                                                src={result.businessIconUrl || ''}
                                                alt={`${result.businessName || result.title} icon`}
                                                className="w-8 h-8 rounded-lg object-cover"
                                                onError={(e) => {
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = target.nextElementSibling as HTMLElement;
                                                    if (fallback) {
                                                        fallback.style.display = 'block';
                                                    }
                                                }}
                                            />}
                                            {/* Hidden fallback icons for error handling */}
                                            {result.businessIconUrl && (
                                                result.recordType === RecordType.CLASSIFIED ? (
                                                    <Tag className="w-8 h-8 text-greenyp-600 hidden"/>
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-greenyp-600 hidden"/>
                                                )
                                            )}
                                            {result.recordType === RecordType.CLASSIFIED ? (
                                                <Link
                                                    to={`/classifieds/detail/${result.externId}`}
                                                    state={{from: window.location.pathname + window.location.search}}
                                                    className="text-xl font-semibold text-gray-900 hover:text-greenyp-600 transition-colors duration-200"
                                                >
                                                    {result.title}
                                                </Link>
                                            ) : (
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {result.businessName || result.title}
                                                </h3>
                                            )}
                                            <Badge className={`${badge.className} flex items-center gap-1`}>
                                                {badge.icon}
                                                {badge.label}
                                            </Badge>
                                            {result.recordType !== RecordType.CLASSIFIED && result.businessUrl && (
                                                <a
                                                    href={result.businessUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-greenyp-600 hover:text-greenyp-700"
                                                >
                                                    <Globe className="w-4 h-4 mr-1"/>
                                                    <span className="text-sm">Visit Website</span>
                                                </a>
                                            )}
                                        </div>
                                        {result.recordType !== RecordType.CLASSIFIED && result.title !== result.businessName && result.businessName && (
                                            <div className="text-lg font-medium text-gray-800 mb-1">
                                                {result.title}
                                            </div>
                                        )}
                                        {priceDisplay && (
                                            <div className="text-lg font-semibold text-green-600 mb-2">
                                                {priceDisplay}
                                            </div>
                                        )}
                                        <div className="text-gray-600 mb-2">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1 text-greenyp-600"/>
                                                <span className="text-sm">{fullAddress}</span>
                                            </div>
                                            {result.phoneNumber && (
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <Phone className="w-4 h-4 mr-1 text-greenyp-600"/>
                                                    <span className="text-sm">
                        {result.recordType === RecordType.CLASSIFIED
                            ? maskPhoneNumber(result.phoneNumber)
                            : result.phoneNumber
                        }
                      </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mb-3">
                                            {result.distance} miles away
                                        </div>
                                    </div>

                                    {displayNarrative && (
                                        <div className="mb-4">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                <MDEditor.Markdown
                                                    source={displayNarrative}
                                                    style={{ backgroundColor: 'transparent' }}
                                                />
                                            </p>
                                            {shouldTruncateNarrative && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onToggleNarrative(result.externId)}
                                                    className="text-greenyp-600 hover:text-greenyp-700 p-0 h-auto mt-2"
                                                >
                                                    {isNarrativeExpanded ? (
                                                        <>
                                                            Show less <ChevronUp className="w-4 h-4 ml-1"/>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Read more <ChevronDown className="w-4 h-4 ml-1"/>
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {result.recordType === RecordType.CLASSIFIED ? (
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/classifieds/detail/${result.externId}`}
                                                state={{from: window.location.pathname + window.location.search}}
                                                className="inline-block bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                            {result.emailAddress && (
                                                <Button
                                                    onClick={() => setShowContactDialog(true)}
                                                    className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                                >
                                                    Contact Seller
                                                </Button>
                                            )}
                                        </div>
                                    ) : <Link
                                        to={`/greenpro/profile/${result.producerId}/${result.locationId}`}
                                        state={{from: window.location.pathname + window.location.search}}
                                        className="inline-block bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                    >
                                        View Full Profile
                                    </Link>}
                                </div>

                                {/* Map Column */}
                                {result.latitude != null && result.longitude != null && (
                                    <div className="flex-shrink-0">
                                        <LocationMap
                                            latitude={result.latitude.toString()}
                                            longitude={result.longitude.toString()}
                                            businessName={result.businessName || result.title}
                                            width="w-48"
                                            height="h-36"
                                            showLinks={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Seller Dialog for Classified Ads */}
                    {result.recordType === RecordType.CLASSIFIED && (
                        <ContactSellerDialog
                            isOpen={showContactDialog}
                            onOpenChange={setShowContactDialog}
                            classified={getClassifiedForDialog()!}
                        />
                    )}
                </>
            );
        } else {
            return (
                <>
                    <Card className="border-greenyp-200 hover:border-yellow-500 transition-colors duration-200">
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                {/* Main Content Column */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            {result.recordType === RecordType.CLASSIFIED ? (
                                                <Tag className="w-8 h-8 text-greenyp-600"/>
                                            ) : <img
                                                src={result.businessIconUrl || ''}
                                                alt={`${result.businessName || result.title} icon`}
                                                className="w-8 h-8 rounded-lg object-cover"
                                                onError={(e) => {
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = target.nextElementSibling as HTMLElement;
                                                    if (fallback) {
                                                        fallback.style.display = 'block';
                                                    }
                                                }}
                                            />}
                                            {/* Hidden fallback icons for error handling */}
                                            {result.businessIconUrl && (
                                                result.recordType === RecordType.CLASSIFIED ? (
                                                    <Tag className="w-8 h-8 text-greenyp-600 hidden"/>
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-greenyp-600 hidden"/>
                                                )
                                            )}
                                            {result.recordType === RecordType.CLASSIFIED ? (
                                                <Link
                                                    to={`/classifieds/detail/${result.externId}`}
                                                    state={{from: window.location.pathname + window.location.search}}
                                                    className="text-xl font-semibold text-gray-900 hover:text-greenyp-600 transition-colors duration-200"
                                                >
                                                    {result.title}
                                                </Link>
                                            ) : (
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {result.businessName || result.title}
                                                </h3>
                                            )}
                                            <Badge className={`${badge.className} flex items-center gap-1`}>
                                                {badge.icon}
                                                {badge.label}
                                            </Badge>
                                            {result.recordType !== RecordType.CLASSIFIED && result.businessUrl && (
                                                <a
                                                    href={result.businessUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-greenyp-600 hover:text-greenyp-700"
                                                >
                                                    <Globe className="w-4 h-4 mr-1"/>
                                                    <span className="text-sm">Visit Website</span>
                                                </a>
                                            )}
                                        </div>
                                        {result.recordType !== RecordType.CLASSIFIED && result.title !== result.businessName && result.businessName && (
                                            <div className="text-lg font-medium text-gray-800 mb-1">
                                                {result.title}
                                            </div>
                                        )}
                                        {priceDisplay && (
                                            <div className="text-lg font-semibold text-green-600 mb-2">
                                                {priceDisplay}
                                            </div>
                                        )}
                                        <div className="text-gray-600 mb-2">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1 text-greenyp-600"/>
                                                <span className="text-sm">{fullAddress}</span>
                                            </div>
                                            {result.phoneNumber && (
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <Phone className="w-4 h-4 mr-1 text-greenyp-600"/>
                                                    <span className="text-sm">
                        {result.recordType === RecordType.CLASSIFIED
                            ? maskPhoneNumber(result.phoneNumber)
                            : result.phoneNumber
                        }
                      </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mb-3">
                                            {result.distance} miles away
                                        </div>
                                    </div>

                                    {displayNarrative && (
                                        <div className="mb-4">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                <MDEditor.Markdown
                                                    source={displayNarrative}
                                                    style={{ backgroundColor: 'transparent' }}
                                                />
                                            </p>
                                            {shouldTruncateNarrative && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onToggleNarrative(result.externId)}
                                                    className="text-greenyp-600 hover:text-greenyp-700 p-0 h-auto mt-2"
                                                >
                                                    {isNarrativeExpanded ? (
                                                        <>
                                                            Show less <ChevronUp className="w-4 h-4 ml-1"/>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Read more <ChevronDown className="w-4 h-4 ml-1"/>
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {result.recordType === RecordType.CLASSIFIED ? (
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/classifieds/detail/${result.externId}`}
                                                state={{from: window.location.pathname + window.location.search}}
                                                className="inline-block bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                            {result.emailAddress && (
                                                <Button
                                                    onClick={() => setShowContactDialog(true)}
                                                    className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                                >
                                                    Contact Seller
                                                </Button>
                                            )}
                                        </div>
                                    ) : <div className="text-sm text-gray-500">
                                        Contact information available above
                                    </div>}
                                </div>

                                {/* Map Column */}
                                {result.latitude != null && result.longitude != null && (
                                    <div className="flex-shrink-0">
                                        <LocationMap
                                            latitude={result.latitude.toString()}
                                            longitude={result.longitude.toString()}
                                            businessName={result.businessName || result.title}
                                            width="w-48"
                                            height="h-36"
                                            showLinks={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Seller Dialog for Classified Ads */}
                    {result.recordType === RecordType.CLASSIFIED && (
                        <ContactSellerDialog
                            isOpen={showContactDialog}
                            onOpenChange={setShowContactDialog}
                            classified={getClassifiedForDialog()!}
                        />
                    )}
                </>
            );
        }
    } else {
        return (
            <>
                <Card className="border-greenyp-200 hover:border-yellow-500 transition-colors duration-200">
                    <CardContent className="p-6">
                        <div className="flex gap-6">
                            {/* Main Content Column */}
                            <div className="flex-1">
                                <div className="mb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        {result.recordType === RecordType.CLASSIFIED ? (
                                            <Tag className="w-8 h-8 text-greenyp-600"/>
                                        ) : <Building2 className="w-8 h-8 text-greenyp-600"/>}
                                        {/* Hidden fallback icons for error handling */}
                                        {result.businessIconUrl && (
                                            result.recordType === RecordType.CLASSIFIED ? (
                                                <Tag className="w-8 h-8 text-greenyp-600 hidden"/>
                                            ) : (
                                                <Building2 className="w-8 h-8 text-greenyp-600 hidden"/>
                                            )
                                        )}
                                        {result.recordType === RecordType.CLASSIFIED ? (
                                            <Link
                                                to={`/classifieds/detail/${result.externId}`}
                                                state={{from: window.location.pathname + window.location.search}}
                                                className="text-xl font-semibold text-gray-900 hover:text-greenyp-600 transition-colors duration-200"
                                            >
                                                {result.title}
                                            </Link>
                                        ) : (
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {result.businessName || result.title}
                                            </h3>
                                        )}
                                        <Badge className={`${badge.className} flex items-center gap-1`}>
                                            {badge.icon}
                                            {badge.label}
                                        </Badge>
                                        {result.recordType !== RecordType.CLASSIFIED && result.businessUrl && (
                                            <a
                                                href={result.businessUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-greenyp-600 hover:text-greenyp-700"
                                            >
                                                <Globe className="w-4 h-4 mr-1"/>
                                                <span className="text-sm">Visit Website</span>
                                            </a>
                                        )}
                                    </div>
                                    {result.recordType !== RecordType.CLASSIFIED && result.title !== result.businessName && result.businessName && (
                                        <div className="text-lg font-medium text-gray-800 mb-1">
                                            {result.title}
                                        </div>
                                    )}
                                    {priceDisplay && (
                                        <div className="text-lg font-semibold text-green-600 mb-2">
                                            {priceDisplay}
                                        </div>
                                    )}
                                    <div className="text-gray-600 mb-2">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 text-greenyp-600"/>
                                            <span className="text-sm">{fullAddress}</span>
                                        </div>
                                        {result.phoneNumber && (
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <Phone className="w-4 h-4 mr-1 text-greenyp-600"/>
                                                <span className="text-sm">
                        {result.recordType === RecordType.CLASSIFIED
                            ? maskPhoneNumber(result.phoneNumber)
                            : result.phoneNumber
                        }
                      </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3">
                                        {result.distance} miles away
                                    </div>
                                </div>

                                {displayNarrative && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            <MDEditor.Markdown
                                                source={displayNarrative}
                                                style={{ backgroundColor: 'transparent' }}
                                            />
                                        </p>
                                        {shouldTruncateNarrative && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onToggleNarrative(result.externId)}
                                                className="text-greenyp-600 hover:text-greenyp-700 p-0 h-auto mt-2"
                                            >
                                                {isNarrativeExpanded ? (
                                                    <>
                                                        Show less <ChevronUp className="w-4 h-4 ml-1"/>
                                                    </>
                                                ) : (
                                                    <>
                                                        Read more <ChevronDown className="w-4 h-4 ml-1"/>
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {result.recordType === RecordType.CLASSIFIED ? (
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/classifieds/detail/${result.externId}`}
                                            state={{from: window.location.pathname + window.location.search}}
                                            className="inline-block bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                        >
                                            View Details
                                        </Link>
                                        {result.emailAddress && (
                                            <Button
                                                onClick={() => setShowContactDialog(true)}
                                                className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                            >
                                                Contact Seller
                                            </Button>
                                        )}
                                    </div>
                                ) : result.producerId && result.locationId ? (
                                    <Link
                                        to={`/greenpro/profile/${result.producerId}/${result.locationId}`}
                                        state={{from: window.location.pathname + window.location.search}}
                                        className="inline-block bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                                    >
                                        View Full Profile
                                    </Link>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        Contact information available above
                                    </div>
                                )}
                            </div>

                            {/* Map Column */}
                            {result.latitude != null && result.longitude != null && (
                                <div className="flex-shrink-0">
                                    <LocationMap
                                        latitude={result.latitude.toString()}
                                        longitude={result.longitude.toString()}
                                        businessName={result.businessName || result.title}
                                        width="w-48"
                                        height="h-36"
                                        showLinks={false}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Seller Dialog for Classified Ads */}
                {result.recordType === RecordType.CLASSIFIED && (
                    <ContactSellerDialog
                        isOpen={showContactDialog}
                        onOpenChange={setShowContactDialog}
                        classified={getClassifiedForDialog()}
                    />
                )}
            </>
        );
    }
};

export default SearchResultCard;
