
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users, Calendar, TrendingUp } from 'lucide-react';
import { useRecentClassifieds } from '@/hooks/classifieds/useRecentClassifieds';
import { format } from 'date-fns';

const AdminClassifieds = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [phoneSearch, setPhoneSearch] = useState('');
    const { data: recentClassifieds, isLoading } = useRecentClassifieds();

    // Mock analytics data
    const analyticsData = {
        totalAds: 1247,
        activeAds: 892,
        expiredAds: 355,
        monthlyGrowth: 12.5
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', { searchTerm, emailSearch, phoneSearch });
        // TODO: Implement search functionality
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Classifieds Management</h1>
                    <p className="text-gray-600">Monitor and manage classified advertisements</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.totalAds.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{analyticsData.activeAds.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Currently live</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expired Ads</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{analyticsData.expiredAds.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Past 30 days</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">+{analyticsData.monthlyGrowth}%</div>
                            <p className="text-xs text-muted-foreground">vs last month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Classifieds</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Search by title, category..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Search by email address..."
                                        value={emailSearch}
                                        onChange={(e) => setEmailSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="tel"
                                        placeholder="Search by phone number..."
                                        value={phoneSearch}
                                        onChange={(e) => setPhoneSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Ads */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recently Placed Ads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentClassifieds?.map((ad) => (
                                    <div key={ad.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{ad.title}</h3>
                                            <Badge variant="secondary">{ad.category}</Badge>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ad.description}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <span>📍 {ad.zipCode}</span>
                                                <span>📧 {ad.email}</span>
                                                <span>📞 {ad.phone}</span>
                                            </div>
                                            <span>{format(new Date(ad.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminClassifieds;
