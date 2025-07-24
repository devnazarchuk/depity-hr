import React, { useState } from 'react';
import { Gift, Heart, Umbrella, GraduationCap, Car, Home, DollarSign, Calendar } from 'lucide-react';

interface Benefit {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'financial' | 'time-off' | 'learning' | 'wellness' | 'other';
  icon: React.ComponentType<any>;
  isActive: boolean;
  value?: string;
  details: string[];
}

const BenefitsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const benefits: Benefit[] = [
    {
      id: '1',
      title: 'Health Insurance',
      description: 'Comprehensive medical, dental, and vision coverage',
      category: 'health',
      icon: Heart,
      isActive: true,
      value: '100% Premium Coverage',
      details: [
        'Medical insurance with $0 deductible',
        'Dental coverage including orthodontics',
        'Vision care with annual eye exams',
        'Mental health support and counseling'
      ]
    },
    {
      id: '2',
      title: 'Flexible Time Off',
      description: 'Unlimited PTO policy with minimum 3 weeks encouraged',
      category: 'time-off',
      icon: Calendar,
      isActive: true,
      value: 'Unlimited PTO',
      details: [
        'Unlimited vacation days',
        'Sick leave as needed',
        'Personal days for life events',
        'Company holidays and floating holidays'
      ]
    },
    {
      id: '3',
      title: 'Learning & Development',
      description: 'Annual budget for courses, conferences, and certifications',
      category: 'learning',
      icon: GraduationCap,
      isActive: true,
      value: '$2,000/year',
      details: [
        'Online course subscriptions',
        'Conference attendance',
        'Professional certifications',
        'Internal training programs'
      ]
    },
    {
      id: '4',
      title: 'Retirement Savings',
      description: '401(k) with company matching up to 6%',
      category: 'financial',
      icon: DollarSign,
      isActive: true,
      value: '6% Match',
      details: [
        '401(k) plan with immediate vesting',
        'Company match up to 6% of salary',
        'Financial planning resources',
        'Investment guidance and tools'
      ]
    },
    {
      id: '5',
      title: 'Wellness Programs',
      description: 'Gym membership, wellness apps, and health initiatives',
      category: 'wellness',
      icon: Heart,
      isActive: true,
      value: '$100/month',
      details: [
        'Gym membership reimbursement',
        'Wellness app subscriptions',
        'On-site fitness classes',
        'Health screenings and flu shots'
      ]
    },
    {
      id: '6',
      title: 'Remote Work Stipend',
      description: 'Home office setup and equipment allowance',
      category: 'other',
      icon: Home,
      isActive: true,
      value: '$1,500 Setup',
      details: [
        'Home office furniture allowance',
        'Technology equipment budget',
        'Internet reimbursement',
        'Co-working space access'
      ]
    },
    {
      id: '7',
      title: 'Transportation Benefits',
      description: 'Commuter benefits and parking allowances',
      category: 'other',
      icon: Car,
      isActive: true,
      value: '$200/month',
      details: [
        'Public transit subsidies',
        'Parking reimbursement',
        'Bike share memberships',
        'Electric vehicle charging'
      ]
    },
    {
      id: '8',
      title: 'Life Insurance',
      description: 'Company-paid life and disability insurance',
      category: 'health',
      icon: Umbrella,
      isActive: true,
      value: '2x Salary',
      details: [
        'Basic life insurance coverage',
        'Short-term disability insurance',
        'Long-term disability insurance',
        'Optional additional coverage'
      ]
    }
  ];

  const categories = [
    { id: 'health', name: 'Health & Insurance', icon: Heart, color: 'bg-red-500' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: 'bg-green-500' },
    { id: 'time-off', name: 'Time Off', icon: Calendar, color: 'bg-blue-500' },
    { id: 'learning', name: 'Learning', icon: GraduationCap, color: 'bg-purple-500' },
    { id: 'wellness', name: 'Wellness', icon: Heart, color: 'bg-pink-500' },
    { id: 'other', name: 'Other', icon: Gift, color: 'bg-amber-500' }
  ];

  const filteredBenefits = selectedCategory 
    ? benefits.filter(benefit => benefit.category === selectedCategory)
    : benefits;

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <Gift className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Benefits
                </h1>
                <p className="text-gray-400 font-medium">Explore your comprehensive benefits package</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$50K+</div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                selectedCategory === '' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>All Benefits</span>
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id 
                    ? `${category.color} text-white shadow-lg` 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Gift className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{benefits.length}</div>
                  <div className="text-sm text-gray-400">Total Benefits</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Health Coverage</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-gray-400">PTO Days</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">$2K</div>
                  <div className="text-sm text-gray-400">Learning Budget</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBenefits.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                <Gift className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="font-medium mb-2">No benefits found</p>
              <p className="text-sm">Try selecting a different category</p>
            </div>
          ) : (
            filteredBenefits.map((benefit) => (
              <div key={benefit.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${getCategoryColor(benefit.category)}/20`}>
                      <benefit.icon className={`w-6 h-6 text-white`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors break-words">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 text-sm break-words">{benefit.description}</p>
                    </div>
                  </div>
                  
                  {benefit.value && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-400">{benefit.value}</div>
                      <div className="text-xs text-gray-500">Value</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {benefit.details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <span className="text-gray-300 break-words">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <span className={`px-3 py-1 rounded-xl text-xs font-semibold text-white ${getCategoryColor(benefit.category)}`}>
                    {categories.find(cat => cat.id === benefit.category)?.name}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Have questions about your benefits? Our HR team is here to help you make the most of your package.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Contact HR
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-white/10 hover:border-white/20">
              Benefits Handbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsPage;