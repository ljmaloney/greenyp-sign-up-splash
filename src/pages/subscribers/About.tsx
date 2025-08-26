
import React from 'react';
import SubscribersHeader from '../../components/SubscribersHeader';
import Footer from '../../components/Footer';
import { TrendingUp, Users, DollarSign, Building2, Leaf, BarChart3 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <SubscribersHeader />
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌱 The Green Industry: Definition & Economic Impact
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the scope, economic weight, and opportunities in America's Green Industry
            </p>
          </div>

          {/* Definition Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Industry Definition</h2>
            <div className="bg-greenyp-50 border border-greenyp-200 rounded-lg p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Green Industry is the network of businesses and professionals who grow, design, build, and maintain 
                the landscapes and outdoor environments that shape our daily lives. It spans a diverse range of sectors, including:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Leaf className="w-6 h-6 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Landscape & Horticultural Services</h4>
                    <p className="text-gray-600">Design, installation, and maintenance of outdoor spaces</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Care & Maintenance</h4>
                    <p className="text-gray-600">Lawn, tree, and turf care services</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building2 className="w-6 h-6 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Irrigation & Water Management</h4>
                    <p className="text-gray-600">Professional water system design and management</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Leaf className="w-6 h-6 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Nurseries & Garden Centers</h4>
                    <p className="text-gray-600">Greenhouses, plant suppliers, and retail centers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building2 className="w-6 h-6 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Equipment & Suppliers</h4>
                    <p className="text-gray-600">Tools, materials, and equipment providers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building2 className="w-6 h-6 text-greenyp-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Outdoor Construction</h4>
                    <p className="text-gray-600">Patios, retaining walls, lighting, and water features</p>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mt-6">
                Together, these enterprises provide essential services that add value to properties, strengthen communities, 
                and support environmental sustainability.
              </p>
            </div>
          </div>

          {/* Economic Impact Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">📊 National Economic Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <DollarSign className="w-12 h-12 text-greenyp-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">$159B</div>
                <div className="text-sm text-gray-600">Direct Sales Revenue (2018)</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <TrendingUp className="w-12 h-12 text-greenyp-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">$191B</div>
                <div className="text-sm text-gray-600">Contribution to GDP</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 text-greenyp-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">2.3M</div>
                <div className="text-sm text-gray-600">Jobs Supported Nationwide</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <BarChart3 className="w-12 h-12 text-greenyp-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">$348B</div>
                <div className="text-sm text-gray-600">Total Economic Output</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <DollarSign className="w-12 h-12 text-greenyp-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">$121.6B</div>
                <div className="text-sm text-gray-600">Labor Income</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Building2 className="w-12 h-12 text-greenyp-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">660K+</div>
                <div className="text-sm text-gray-600">Businesses (2024)</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth & Market Size</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Landscape and horticultural services</strong> accounted for $222 billion in output 
                  and 1.46 million jobs within the broader Green Industry.
                </p>
                <p>
                  Growth is steady and resilient. Between 2013 and 2018, industry employment grew by <strong>16%</strong> and 
                  GDP contribution rose by <strong>17%</strong> (inflation-adjusted).
                </p>
                <p>
                  By 2024, the landscaping services sector alone reached a market size of <strong>$153 billion</strong>, 
                  with over 1 million professionals working across 660,000+ businesses.
                </p>
              </div>
            </div>
          </div>

          {/* Why It Matters Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">🚀 Why It Matters for Professionals</h2>
            <div className="bg-greenyp-50 border border-greenyp-200 rounded-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                For business leaders, the Green Industry offers:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Scale and Diversity</h4>
                  <p className="text-gray-600 mb-4">Multiple revenue streams across services, retail, and products.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Stability</h4>
                  <p className="text-gray-600 mb-4">Essential maintenance and property care services ensure recurring demand.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Growth Potential</h4>
                  <p className="text-gray-600 mb-4">Consumer investment in outdoor living and sustainable practices continues to rise.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Impact</h4>
                  <p className="text-gray-600 mb-4">The sector drives profits while delivering measurable value through property enhancement, job creation, and environmental stewardship.</p>
                </div>
              </div>
              
              <div className="bg-white border border-greenyp-200 rounded-lg p-6 mt-8">
                <p className="text-gray-700 leading-relaxed">
                  <strong>This positions the Green Industry as both an economic powerhouse and a resilient, opportunity-rich sector</strong> — 
                  appealing to business professionals considering engagement or investment in this growing market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
