/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, ChangeEvent } from 'react';
import { Search, MapPin, Star, SquarePen, User, Dog, Waves, ParkingCircle, Bed, Wind, Cigarette, Plus } from 'lucide-react';

type View = 'home' | 'post' | 'category' | 'form' | 'images' | 'review' | 'redesign' | 'rd-form' | 'rd-preview';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showRedesignSubcategories, setShowRedesignSubcategories] = useState(false);

  // Redesign Form State
  const [rdForm, setRdForm] = useState({
    title: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    description: '',
    phone: '',
    email: '',
    rent: '',
    sqft: '',
    housingType: 'Apartment',
    bedrooms: '0',
    bathrooms: '0',
    startDate: ''
  });
  const [rdRentPeriod, setRdRentPeriod] = useState<'Monthly' | 'Weekly' | 'Daily'>('Daily');
  const [rdAmenities, setRdAmenities] = useState<string[]>(['Free Parking', 'Furnished', 'Air-conditioned']);
  const [rdPhotos, setRdPhotos] = useState<string[]>([]);
  const [rdErrors, setRdErrors] = useState<string[]>([]);

  const toggleRdAmenity = (label: string) => {
    setRdAmenities(prev => 
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleRdPhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPhotos = filesArray.map(file => URL.createObjectURL(file as Blob));
      setRdPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const validateRdForm = () => {
    const errors: string[] = [];
    if (!rdForm.title) errors.push('Title is required');
    if (!rdForm.address) errors.push('Street Address is required');
    if (!rdForm.city) errors.push('City is required');
    if (!rdForm.zip) errors.push('ZIP Code is required');
    if (!rdForm.country) errors.push('Country is required');
    if (!rdForm.rent) errors.push('Rent is required');
    if (!rdForm.sqft) errors.push('Sqft is required');
    
    setRdErrors(errors);
    return errors.length === 0;
  };

  // Sync state with URL query parameters
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('s');
      if (s === 'p') setView('post');
      else if (s === 'c') setView('category');
      else if (s === 'f') setView('form');
      else if (s === 'i') setView('images');
      else if (s === 'r') setView('review');
      else if (s === 'rd') setView('redesign');
      else if (s === 'rdf') setView('rd-form');
      else if (s === 'rdp') setView('rd-preview');
      else setView('home');
    };

    // Initial check
    handleUrlChange();

    // Listen for back/forward buttons
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigate = (newView: View) => {
    let url = window.location.pathname;
    if (newView === 'post') url = '?s=p';
    else if (newView === 'category') url = '?s=c';
    else if (newView === 'form') url = '?s=f';
    else if (newView === 'images') url = '?s=i';
    else if (newView === 'review') url = '?s=r';
    else if (newView === 'redesign') url = '?s=rd';
    else if (newView === 'rd-form') url = '?s=rdf';
    else if (newView === 'rd-preview') url = '?s=rdp';
    
    window.history.pushState({}, '', url);
    setView(newView);
    // Reset redesign state when navigating
    if (newView !== 'redesign') setShowRedesignSubcategories(false);
  };

  const renderHome = () => (
    <div className="grid grid-cols-[200px_1fr_150px] gap-4">
      {/* Left Sidebar */}
      <aside className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-purple-800 flex items-center justify-center text-purple-800 font-bold text-xl">
            ☮
          </div>
          <h1 className="text-2xl font-bold text-purple-900">craigslist</h1>
          <span className="text-[10px] self-start mt-1">sg</span>
        </div>

        <button 
          onClick={() => navigate('redesign')}
          className="post-ad-btn w-full"
        >
          <SquarePen size={16} />
          post an ad
        </button>

        <div className="relative mt-2">
          <input 
            type="text" 
            className="w-full border border-[#ccc] px-2 py-1 pr-8 text-xs"
            placeholder="search craigslist"
          />
          <Search size={14} className="absolute right-2 top-2 text-gray-400" />
        </div>

        <div className="mt-4">
          <h3 className="text-blue-800 font-bold text-center mb-1 text-xs">event calendar</h3>
          <table className="w-full text-[10px] border-collapse text-center">
            <thead>
              <tr className="bg-gray-100">
                <th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th>
              </tr>
            </thead>
            <tbody>
              <tr><td></td><td></td><td></td><td></td><td></td><td>1</td><td>2</td></tr>
              <tr><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>
              <tr className="bg-yellow-100 font-bold"><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr>
              <tr><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td></tr>
              <tr><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td></tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 text-[11px] mt-4">
          <a href="#">help, faq, abuse, legal</a>
          <a href="#">avoid scams & fraud</a>
          <a href="#">personal safety tips</a>
        </div>

        <div className="flex flex-col gap-1 text-[11px] mt-4">
          <a href="#">about craigslist</a>
          <a href="#">best-of-craigslist</a>
          <a href="#">what's new</a>
          <a href="#">system status</a>
        </div>

        <div className="mt-4">
          <span className="text-[11px] text-blue-800 font-bold">craigslist charitable</span>
          <div className="flex gap-2 mt-1">
            <span className="text-lg">🌍</span>
            <span className="text-lg">🐕</span>
            <span className="text-lg">🐷</span>
            <span className="text-lg">🦄</span>
            <span className="text-lg">🐟</span>
          </div>
        </div>

        <div className="mt-4">
          <a href="#" className="text-[11px] text-blue-800 font-bold">craig newmark philanthropies</a>
        </div>
      </aside>

      {/* Middle Content */}
      <main>
        <div className="location-header">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-lg">
            <MapPin size={20} />
            singapore
          </div>
          <div className="flex gap-6">
            <a href="#" className="nav-icon-link">
              <Star size={20} className="text-yellow-500" />
              <span>faves</span>
            </a>
            <button onClick={() => navigate('redesign')} className="nav-icon-link">
              <SquarePen size={20} className="text-green-600" />
              <span>post</span>
            </button>
            <a href="#" className="nav-icon-link">
              <User size={20} className="text-gray-600" />
              <span>acct</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="flex flex-col">
            <section className="cl-box">
              <div className="cl-header">community</div>
              <div className="cl-link-list grid grid-cols-2">
                <a href="#">activities</a>
                <a href="#">lost+found</a>
                <a href="#">artists</a>
                <a href="#">missed</a>
                <a href="#">childcare</a>
                <a href="#">connections</a>
                <a href="#">classes</a>
                <a href="#">musicians</a>
                <a href="#">events</a>
                <a href="#">pets</a>
                <a href="#">general</a>
                <a href="#">politics</a>
                <a href="#">groups</a>
                <a href="#">rants & raves</a>
                <a href="#">local news</a>
                <a href="#">rideshare</a>
                <a href="#">volunteers</a>
              </div>
            </section>

            <section className="cl-box">
              <div className="cl-header">services</div>
              <div className="cl-link-list grid grid-cols-2">
                <a href="#">automotive</a>
                <a href="#">labor/move</a>
                <a href="#">beauty</a>
                <a href="#">legal</a>
                <a href="#">cell/mobile</a>
                <a href="#">lessons</a>
                <a href="#">computer</a>
                <a href="#">marine</a>
                <a href="#">creative</a>
                <a href="#">pet</a>
                <a href="#">cycle</a>
                <a href="#">real estate</a>
                <a href="#">event</a>
                <a href="#">skilled trade</a>
                <a href="#">farm+garden</a>
                <a href="#">sm biz ads</a>
                <a href="#">financial</a>
                <a href="#">travel/vac</a>
                <a href="#">health/well</a>
                <a href="#">write/ed/tran</a>
                <a href="#">household</a>
              </div>
            </section>

            <section className="cl-box">
              <div className="cl-header">discussion forums</div>
              <div className="cl-link-list grid grid-cols-3 text-[10px]">
                <a href="#">apple</a><a href="#">frugal</a><a href="#">philos</a>
                <a href="#">arts</a><a href="#">gaming</a><a href="#">photo</a>
                <a href="#">atheist</a><a href="#">garden</a><a href="#">politics</a>
                <a href="#">autos</a><a href="#">haiku</a><a href="#">psych</a>
                <a href="#">beauty</a><a href="#">help</a><a href="#">recover</a>
                <a href="#">bikes</a><a href="#">history</a><a href="#">religion</a>
                <a href="#">celebs</a><a href="#">housing</a><a href="#">rofo</a>
                <a href="#">comp</a><a href="#">jobs</a><a href="#">science</a>
                <a href="#">cosmos</a><a href="#">jokes</a><a href="#">spirit</a>
                <a href="#">diet</a><a href="#">legal</a><a href="#">sports</a>
                <a href="#">divorce</a><a href="#">manners</a><a href="#">super</a>
                <a href="#">dying</a><a href="#">marriage</a><a href="#">tax</a>
                <a href="#">eco</a><a href="#">money</a><a href="#">travel</a>
                <a href="#">feedbk</a><a href="#">music</a><a href="#">tv</a>
              </div>
            </section>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <section className="cl-box">
              <div className="cl-header">housing</div>
              <div className="cl-link-list">
                <a href="#">apts / housing</a>
                <a href="#">housing swap</a>
                <a href="#">housing wanted</a>
                <a href="#">office / commercial</a>
                <a href="#">parking / storage</a>
                <a href="#">real estate for sale</a>
                <a href="#">rooms / shared</a>
                <a href="#">rooms wanted</a>
                <a href="#">sublets / temporary</a>
                <a href="#">vacation rentals</a>
              </div>
            </section>

            <section className="cl-box">
              <div className="cl-header">for sale</div>
              <div className="cl-link-list grid grid-cols-2">
                <a href="#">antiques</a>
                <a href="#">farm+garden</a>
                <a href="#">appliances</a>
                <a href="#">free</a>
                <a href="#">arts+crafts</a>
                <a href="#">furniture</a>
                <a href="#">atv/utv/sno</a>
                <a href="#">garage sale</a>
                <a href="#">auto parts</a>
                <a href="#">general</a>
                <a href="#">aviation</a>
                <a href="#">heavy equip</a>
                <a href="#">baby+kid</a>
                <a href="#">household</a>
                <a href="#">barter</a>
                <a href="#">jewelry</a>
                <a href="#">beauty+hlth</a>
                <a href="#">materials</a>
                <a href="#">bike parts</a>
                <a href="#">motorcycle parts</a>
                <a href="#">bikes</a>
                <a href="#">motorcycles</a>
                <a href="#">boat parts</a>
                <a href="#">music instr</a>
                <a href="#">boats</a>
                <a href="#">photo+video</a>
                <a href="#">books</a>
                <a href="#">rvs+camp</a>
                <a href="#">business</a>
                <a href="#">sporting</a>
                <a href="#">cars+trucks</a>
                <a href="#">tickets</a>
                <a href="#">cds/dvd/vhs</a>
                <a href="#">tools</a>
                <a href="#">cell phones</a>
                <a href="#">toys+games</a>
                <a href="#">clothes+acc</a>
                <a href="#">trailers</a>
                <a href="#">collectibles</a>
                <a href="#">video gaming</a>
                <a href="#">computer parts</a>
                <a href="#">wanted</a>
                <a href="#">computers</a>
                <a href="#">wheels+tires</a>
                <a href="#">electronics</a>
              </div>
            </section>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <section className="cl-box">
              <div className="cl-header">jobs</div>
              <div className="cl-link-list">
                <a href="#">accounting+finance</a>
                <a href="#">admin / office</a>
                <a href="#">arch / engineering</a>
                <a href="#">art / media / design</a>
                <a href="#">biotech / science</a>
                <a href="#">business / mgmt</a>
                <a href="#">customer service</a>
                <a href="#">education</a>
                <a href="#">etc / misc</a>
                <a href="#">food / bev / hosp</a>
                <a href="#">general labor</a>
                <a href="#">government</a>
                <a href="#">human resources</a>
                <a href="#">legal / paralegal</a>
                <a href="#">manufacturing</a>
                <a href="#">marketing / pr / ad</a>
                <a href="#">medical / health</a>
                <a href="#">nonprofit sector</a>
                <a href="#">real estate</a>
                <a href="#">retail / wholesale</a>
                <a href="#">sales / biz dev</a>
                <a href="#">salon / spa / fitness</a>
                <a href="#">security</a>
                <a href="#">skilled trade / craft</a>
                <a href="#">software / qa / dba</a>
                <a href="#">systems / network</a>
                <a href="#">technical support</a>
                <a href="#">transport</a>
                <a href="#">tv / film / video</a>
                <a href="#">web / info design</a>
                <a href="#">writing / editing</a>
              </div>
            </section>

            <section className="cl-box">
              <div className="cl-header">gigs</div>
            </section>

            <section className="cl-box">
              <div className="cl-header">resumes</div>
            </section>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside>
        <div className="mb-4">
          <select className="w-full border border-[#ccc] text-xs p-1">
            <option>english</option>
            <option>español</option>
            <option>français</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 text-[11px] text-center">
          <a href="#" className="font-bold">asia/pacific</a>
          <a href="#" className="font-bold">cl worldwide</a>
        </div>
      </aside>
    </div>
  );

  const renderPostAd = () => (
    <div className="max-w-[400px] mx-auto p-8 font-sans">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold mb-4">
          what type of posting is this: (see <a href="#" className="text-blue-700 font-normal">prohibited</a>)
        </h2>
        
        <div className="flex flex-col gap-1">
          {[
            'job offered',
            'gig offered',
            'resume / job wanted',
            '', // Spacer
            'housing offered',
            'housing wanted',
            '', // Spacer
            'for sale by owner',
            'for sale by dealer',
            'wanted by owner',
            'wanted by dealer',
            '', // Spacer
            'service offered',
            '', // Spacer
            'community',
            'event / class'
          ].map((type, idx) => {
            if (type === '') return <div key={`spacer-${idx}`} className="h-4" />;
            return (
              <label key={type} className="cl-radio-label">
                <input 
                  type="radio" 
                  name="postType" 
                  className="w-3 h-3" 
                  onChange={() => setSelectedType(type)}
                  checked={selectedType === type}
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => {
              if (selectedType === 'housing offered') {
                navigate('category');
              } else {
                alert('Workflow test: Currently only "housing offered" is implemented for the next step.');
              }
            }}
            className="cl-button"
          >
            continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="max-w-[400px] mx-auto p-8 font-sans">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold mb-4">
          please choose a category: (see <a href="#" className="text-blue-700 font-normal">prohibited</a>)
        </h2>
        
        <div className="flex flex-col gap-1">
          {[
            'rooms & shares',
            'apartments / housing for rent',
            'housing swap',
            'office & commercial',
            'parking & storage',
            'real estate - by broker',
            'real estate - by owner',
            'sublets & temporary',
            'vacation rentals'
          ].map((cat) => (
            <label key={cat} className="cl-radio-label items-start">
              <input 
                type="radio" 
                name="category" 
                className="w-3 h-3 mt-1" 
                onChange={() => setSelectedCategory(cat)}
                checked={selectedCategory === cat}
              />
              <div className="flex flex-col">
                <span>{cat}</span>
                {cat === 'apartments / housing for rent' && (
                  <span className="text-[11px] text-gray-600">(no shares, roommates, or sublets please!)</span>
                )}
              </div>
            </label>
          ))}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => {
              if (selectedCategory === 'apartments / housing for rent') {
                navigate('form');
              } else {
                alert('Workflow test: Currently only "apartments / housing for rent" is implemented for the next step.');
              }
            }}
            className="cl-button"
          >
            continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderPostingForm = () => (
    <div className="max-w-[800px] mx-auto p-4 font-sans text-[13px]">
      {/* Top Row */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <label className="cl-form-section-label">posting title</label>
          <input type="text" className="w-full border-2 border-black px-1 py-0.5" />
        </div>
        <div className="w-48">
          <label className="cl-form-section-label">city or neighborhood</label>
          <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
        </div>
        <div className="w-24">
          <label className="cl-form-section-label">ZIP code</label>
          <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="cl-form-section-label">description</label>
        <textarea className="w-full h-48 border border-[#006600] p-1 resize-y outline-none" />
      </div>

      {/* Posting Details */}
      <div className="cl-form-group">
        <span className="cl-form-label-top">posting details</span>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-8 gap-y-4">
          {/* Left Col */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="cl-form-section-label">rent</label>
              <div className="flex items-center border border-[#006600] px-1">
                <span className="text-[#006600]">$</span>
                <input type="text" className="w-full outline-none py-0.5 px-1" />
              </div>
            </div>
            <div>
              <label className="cl-form-section-label">per</label>
              <select className="cl-select w-full">
                <option>-</option>
                <option>month</option>
                <option>week</option>
                <option>day</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">sqft</label>
              <input type="text" className="cl-input-green w-full" defaultValue="0" />
            </div>
          </div>

          {/* Middle Col 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="cl-form-section-label">housing type</label>
              <select className="cl-select w-full">
                <option>apartment</option>
                <option>condo</option>
                <option>house</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">laundry</label>
              <select className="cl-select w-full">
                <option>-</option>
                <option>w/d in unit</option>
                <option>w/d hookups</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">parking</label>
              <select className="cl-select w-full">
                <option>-</option>
                <option>carport</option>
                <option>attached garage</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">bedrooms</label>
              <select className="cl-select w-full">
                <option>-</option>
                <option>1</option>
                <option>2</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">bathrooms</label>
              <select className="cl-select w-full">
                <option>-</option>
                <option>1</option>
                <option>2</option>
              </select>
            </div>
          </div>

          {/* Middle Col 2 (Checkboxes) */}
          <div className="flex flex-col gap-1 text-[11px]">
            <label className="flex items-center gap-2"><input type="checkbox" /> cats ok</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> dogs ok</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> furnished</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> no smoking</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> wheelchair accessible</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> air conditioning</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> EV charging</label>
          </div>

          {/* Right Col */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="cl-form-section-label">available on</label>
              <input type="text" className="cl-input w-full" placeholder="select date" />
            </div>
            <div className="border border-[#ccc] p-2 relative pt-4">
              <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-600">open house dates</span>
              <div className="flex flex-col gap-2">
                <select className="border border-[#ccc] text-[11px]"><option>-</option></select>
                <select className="border border-[#ccc] text-[11px]"><option>-</option></select>
                <select className="border border-[#ccc] text-[11px]"><option>-</option></select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fees and Licensure */}
      <div className="cl-form-group">
        <span className="cl-form-label-top">fees and licensure</span>
        <div className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-2 font-bold"><input type="checkbox" /> broker fee</label>
            <div className="mt-1">
              <label className="text-[10px] text-gray-400 block">detailed fee description please</label>
              <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
            </div>
            <div className="mt-2">
              <label className="text-[10px] text-gray-400 block">name or license of the company or broker posting this ad</label>
              <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 font-bold"><input type="checkbox" /> application fee</label>
            <div className="mt-1">
              <label className="text-[10px] text-gray-400 block">detailed fee description please</label>
              <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="cl-form-group">
        <span className="cl-form-label-top">contact info</span>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="cl-form-section-label">email</label>
            <input type="text" className="cl-input-green w-full" defaultValue="Your email address" />
            <p className="text-[11px] mt-1">replies use CL mail relay <a href="#" className="text-blue-700">[?]</a></p>
          </div>
          <div className="border border-[#ccc] p-4 relative pt-6">
            <span className="absolute -top-3 left-2 bg-white px-1 text-[11px] text-gray-500">phone/text</span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2"><input type="checkbox" /> show my phone number</label>
              <div className="flex gap-4 text-gray-300 text-[11px]">
                <label className="flex items-center gap-1"><input type="checkbox" disabled /> phone calls OK</label>
                <label className="flex items-center gap-1"><input type="checkbox" disabled /> text/sms OK</label>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block">phone number</label>
                <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block">extension</label>
                <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block">contact name</label>
                <input type="text" className="w-full border border-[#ccc] px-1 py-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button 
          onClick={() => {
            navigate('images');
          }}
          className="cl-button px-4 py-1"
        >
          continue
        </button>
      </div>
    </div>
  );

  const renderImageUpload = () => (
    <div className="max-w-[1000px] mx-auto p-8 font-sans">
      <p className="text-[15px] mb-4">this posting has 0 images of a maximum 24</p>
      
      <div className="grid grid-cols-[1fr_300px] gap-12 items-start">
        <div className="cl-upload-box">
          <div className="absolute top-12 left-8">
            <button className="cl-add-images-btn">Add Images</button>
          </div>
          <span className="text-[#999] text-2xl">Drop image files here</span>
          <a href="#" className="absolute bottom-2 right-2 text-blue-600 text-[11px]">Use classic image uploader</a>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <p className="text-sm">Scan the QR code to upload images from your phone</p>
            <div className="w-32 h-32 bg-gray-100 border border-gray-300 mx-auto my-2 flex items-center justify-center text-[10px] text-gray-400">
              [QR CODE]
            </div>
            <p className="text-[11px] font-bold">Stay on this page while uploading.</p>
          </div>
          
          <button 
            onClick={() => navigate('review')}
            className="cl-done-btn"
          >
            done with images
          </button>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-[900px] mx-auto p-4 font-sans">
      <p className="text-center text-sm mb-4">Attention: posting will expire in 45 days</p>
      
      <div className="cl-review-banner">
        <span className="font-bold text-lg ml-4">this is an unpublished draft.</span>
        <button 
          onClick={() => {
            alert('Success!');
            navigate('home');
          }}
          className="bg-white text-black px-4 py-0.5 font-bold mr-2 border border-black"
        >
          publish
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button className="cl-review-btn-small">edit post</button>
        <button className="cl-review-btn-small">edit images</button>
      </div>

      <div className="cl-breadcrumb-bar">
        <span className="text-blue-800 font-bold">CL</span>
        <span className="text-gray-500">singapore &gt; housing &gt; apartments / housing for rent</span>
      </div>

      <div className="mt-6">
        <button className="cl-reply-btn mb-4">reply</button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold mb-2">$12 / 7br - a (a)</h1>
            <p className="text-sm mb-12">a</p>
            <div className="flex items-center gap-1 text-gray-400 text-[11px]">
              <span>♥</span>
              <span>best of <sup>[?]</sup></span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-right">
            <span className="text-[13px] font-bold">7BR / 3.5Ba</span>
            <span className="text-[13px]">rent period: <span className="text-blue-700">daily</span></span>
            <a href="#" className="cl-attribute-link">apartment</a>
            <a href="#" className="cl-attribute-link">w/d in unit</a>
            <a href="#" className="cl-attribute-link">detached garage</a>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
        <div className="flex gap-2">
          <button className="cl-review-btn-small">edit post</button>
          <button className="cl-review-btn-small">edit images</button>
        </div>
        <button 
          onClick={() => {
            alert('Success!');
            navigate('home');
          }}
          className="cl-button px-6 py-1 text-lg"
        >
          publish
        </button>
      </div>
    </div>
  );

  const renderRedesign = () => (
    <div className="max-w-[1200px] mx-auto p-4 font-sans">
      {/* Progress Bar */}
      <div className="rd-progress-container">
        <div className="rd-step-circle rd-step-active">1</div>
        <div className="rd-step-line"></div>
        <div className="rd-step-circle rd-step-inactive">2</div>
        <div className="rd-step-line"></div>
        <div className="rd-step-circle rd-step-inactive">3</div>
      </div>

      <h2 className="text-center text-2xl font-bold mb-12">What are you posting today?</h2>

      {/* Category Boxes */}
      <div className="rd-category-container">
        {/* Jobs & Services */}
        <div className="rd-category-box">
          <h3 className="rd-category-title">Jobs & Services</h3>
          <div className="rd-category-divider"></div>
          <div className="rd-category-grid">
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
          </div>
        </div>

        {/* Housing */}
        <div className="rd-category-box">
          <h3 className="rd-category-title">Housing</h3>
          <div className="rd-category-divider"></div>
          <div className="rd-category-grid">
            <div className="rd-dummy-btn"></div>
            <button 
              onClick={() => setShowRedesignSubcategories(true)}
              className="rd-active-btn"
            >
              Housing offered
            </button>
          </div>
        </div>

        {/* Items & Community */}
        <div className="rd-category-box">
          <h3 className="rd-category-title">Items & Community</h3>
          <div className="rd-category-divider"></div>
          <div className="rd-category-grid grid-cols-3">
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
            <div className="rd-dummy-btn"></div>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      {showRedesignSubcategories && (
        <div className="rd-subcategory-grid mt-12">
          {[
            { label: 'room & shares' },
            { label: 'apartments / housing for rent', sub: '(no shares, roommates, or sublets please!)' },
            { label: 'housing swap' },
            { label: 'office & commercial' },
            { label: 'parking & storage' },
            { label: 'real estate - by broker' },
            { label: 'real estate - by owner' },
            { label: 'sublets & temporary' },
            { label: 'vacation rentals' },
            { label: '' } // Empty cell
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="rd-subcategory-item"
              onClick={() => {
                if (item.label === 'apartments / housing for rent') {
                  navigate('rd-form');
                }
              }}
            >
              <span className="font-medium">{item.label}</span>
              {item.sub && <span className="text-[9px] mt-1">{item.sub}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRedesignForm = () => (
    <div className="max-w-[800px] mx-auto p-4 font-sans">
      {/* Progress Bar */}
      <div className="rd-progress-container">
        <div className="rd-step-circle rd-step-active">1</div>
        <div className="rd-step-line bg-[#a855f7]"></div>
        <div className="rd-step-circle rd-step-active">2</div>
        <div className="rd-step-line"></div>
        <div className="rd-step-circle rd-step-inactive">3</div>
      </div>

      <h2 className="text-center text-lg font-bold mb-8">Details</h2>

      {/* Validation Errors */}
      {rdErrors.length > 0 && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-bold text-sm mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-red-500 text-xs">
            {rdErrors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
        </div>
      )}

      {/* Photos */}
      <section className="mb-12">
        <h3 className="rd-section-title">Photos <span className="text-[11px] text-gray-400 font-normal">(if applicable)</span></h3>
        <div className="rd-upload-area relative">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleRdPhotoUpload}
          />
          <button className="rd-purple-btn mb-4 pointer-events-none">Upload Photos</button>
          <p className="text-gray-400 text-sm">or drag and drop up to 24 photos</p>
          
          {rdPhotos.length > 0 && (
            <div className="mt-8 grid grid-cols-4 gap-4 w-full">
              {rdPhotos.map((photo, idx) => (
                <div key={idx} className="aspect-square relative group">
                  <img src={photo} alt={`Upload ${idx}`} className="w-full h-full object-cover rounded-sm border border-gray-200" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRdPhotos(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus size={12} className="rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* General Information */}
      <section className="mb-12">
        <h3 className="rd-section-title">General Information</h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="rd-input-label">Title*</label>
              <span className="text-[10px] text-gray-400 font-bold">({rdForm.title.length}/80)</span>
            </div>
            <input 
              type="text" 
              className="rd-input" 
              placeholder="What are you offering?" 
              value={rdForm.title}
              onChange={(e) => setRdForm({...rdForm, title: e.target.value.slice(0, 80)})}
            />
          </div>
          <div>
            <label className="rd-input-label">Street Address*</label>
            <input 
              type="text" 
              className="rd-input" 
              value={rdForm.address}
              onChange={(e) => setRdForm({...rdForm, address: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="rd-input-label">City*</label>
              <input 
                type="text" 
                className="rd-input" 
                value={rdForm.city}
                onChange={(e) => setRdForm({...rdForm, city: e.target.value})}
              />
            </div>
            <div>
              <label className="rd-input-label">ZIP Code*</label>
              <input 
                type="text" 
                className="rd-input" 
                value={rdForm.zip}
                onChange={(e) => setRdForm({...rdForm, zip: e.target.value})}
              />
            </div>
            <div>
              <label className="rd-input-label">Country*</label>
              <input 
                type="text" 
                className="rd-input" 
                value={rdForm.country}
                onChange={(e) => setRdForm({...rdForm, country: e.target.value})}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="rd-input-label">Description</label>
              <span className="text-[10px] text-gray-400 font-bold">({rdForm.description.length}/500)</span>
            </div>
            <textarea 
              className="rd-input h-32 resize-none" 
              placeholder="Describe your offering..." 
              value={rdForm.description}
              onChange={(e) => setRdForm({...rdForm, description: e.target.value.slice(0, 500)})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rd-input-label">Phone number</label>
              <input 
                type="text" 
                className="rd-input" 
                placeholder="Your phone number" 
                value={rdForm.phone}
                onChange={(e) => setRdForm({...rdForm, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="rd-input-label">Preferred email</label>
              <input 
                type="text" 
                className="rd-input" 
                placeholder="Your preferred email to be contacted" 
                value={rdForm.email}
                onChange={(e) => setRdForm({...rdForm, email: e.target.value})}
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-[#eee] mb-12" />

      {/* Posting Details */}
      <section className="mb-12">
        <h3 className="rd-section-title">Posting Details</h3>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-12 gap-y-6">
          <div>
            <label className="rd-input-label">Rent*</label>
            <div className="flex items-center bg-[#f9f9f9] border border-[#ccc] rounded-sm px-2">
              <span className="text-sm font-bold">$</span>
              <input 
                type="text" 
                className="w-full bg-transparent py-1.5 px-1 text-sm outline-none" 
                value={rdForm.rent}
                onChange={(e) => setRdForm({...rdForm, rent: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex">
              <button 
                onClick={() => setRdRentPeriod('Monthly')}
                className={`rd-period-btn rounded-l-md ${rdRentPeriod === 'Monthly' ? 'active' : ''}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setRdRentPeriod('Weekly')}
                className={`rd-period-btn ${rdRentPeriod === 'Weekly' ? 'active' : ''}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setRdRentPeriod('Daily')}
                className={`rd-period-btn rounded-r-md ${rdRentPeriod === 'Daily' ? 'active' : ''}`}
              >
                Daily
              </button>
            </div>
          </div>
          <div>
            <label className="rd-input-label">Sqft*</label>
            <input 
              type="text" 
              className="rd-input" 
              placeholder="Size in square feet" 
              value={rdForm.sqft}
              onChange={(e) => setRdForm({...rdForm, sqft: e.target.value})}
            />
          </div>
          <div>
            <label className="rd-input-label">Housing Type</label>
            <select 
              className="rd-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat"
              value={rdForm.housingType}
              onChange={(e) => setRdForm({...rdForm, housingType: e.target.value})}
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Townhouse</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="rd-input-label">Bedrooms</label>
              <input 
                type="number" 
                className="rd-input" 
                value={rdForm.bedrooms}
                onChange={(e) => setRdForm({...rdForm, bedrooms: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="rd-input-label">Bathrooms</label>
              <input 
                type="number" 
                className="rd-input" 
                value={rdForm.bathrooms}
                onChange={(e) => setRdForm({...rdForm, bathrooms: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="rd-input-label">Start Date</label>
            <input 
              type="date" 
              className="rd-input" 
              value={rdForm.startDate}
              onChange={(e) => setRdForm({...rdForm, startDate: e.target.value})}
            />
          </div>
        </div>
      </section>

      <hr className="border-[#eee] mb-12" />

      {/* Amenities */}
      <section className="mb-12">
        <h3 className="rd-section-title">Amenities</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Pet-friendly', icon: Dog },
            { label: 'Washer', icon: Waves },
            { label: 'Free Parking', icon: ParkingCircle },
            { label: 'Furnished', icon: Bed },
            { label: 'Air-conditioned', icon: Wind },
            { label: 'No smoking', icon: Cigarette }
          ].map((amenity, idx) => {
            const Icon = amenity.icon;
            const isActive = rdAmenities.includes(amenity.label);
            return (
              <div 
                key={idx} 
                className={`rd-amenity-card ${isActive ? 'active' : ''}`}
                onClick={() => toggleRdAmenity(amenity.label)}
              >
                <Icon className="rd-amenity-icon" />
                <span className="rd-amenity-label">{amenity.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex justify-between items-center mt-12 pt-4 border-t border-[#eee]">
        <button onClick={() => navigate('redesign')} className="rd-nav-btn-back">Back</button>
        <button 
          onClick={() => {
            if (validateRdForm()) {
              navigate('rd-preview');
            }
          }} 
          className="rd-nav-btn-next"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderRedesignPreview = () => (
    <div className="max-w-[1000px] mx-auto p-4 font-sans">
      {/* Progress Bar */}
      <div className="rd-progress-container">
        <div className="rd-step-circle rd-step-active">1</div>
        <div className="rd-step-line bg-[#a855f7]"></div>
        <div className="rd-step-circle rd-step-active">2</div>
        <div className="rd-step-line bg-[#a855f7]"></div>
        <div className="rd-step-circle rd-step-active">3</div>
      </div>

      <h2 className="text-center text-2xl font-bold mb-12">Preview & Publish</h2>

      <div className="grid grid-cols-[400px_1fr] gap-12 mb-12">
        {/* Image Placeholder or Actual Images */}
        <div className="aspect-square bg-[#f0f0f0] relative border border-[#ccc] overflow-hidden">
          {rdPhotos.length > 0 ? (
            <div className="w-full h-full relative">
              <img src={rdPhotos[0]} alt="Preview" className="w-full h-full object-cover" />
              {rdPhotos.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                  + {rdPhotos.length - 1} more
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full text-gray-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h1 className="text-5xl font-bold mb-6">{rdForm.title || 'Title'}</h1>
          <div className="flex gap-4 mb-6 text-sm text-gray-600 font-medium">
            <span>${rdForm.rent} / {rdRentPeriod.toLowerCase()}</span>
            <span>•</span>
            <span>{rdForm.sqft} sqft</span>
            <span>•</span>
            <span>{rdForm.housingType}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-800 mb-12 whitespace-pre-wrap">
            {rdForm.description || 'No description provided.'}
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold underline text-sm mb-2">Location</h4>
              <p className="text-sm text-gray-700">
                {rdForm.address}<br />
                {rdForm.city}, {rdForm.zip}<br />
                {rdForm.country}
              </p>
            </div>
            <div>
              <h4 className="font-bold underline text-sm mb-2">Amenities</h4>
              {rdAmenities.length > 0 ? (
                <ul className="list-disc list-inside text-sm flex flex-col gap-1">
                  {rdAmenities.map((amenity, idx) => (
                    <li key={idx}>{amenity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No amenities selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 pt-4">
        <button onClick={() => navigate('rd-form')} className="rd-nav-btn-back text-lg">Back</button>
        <button 
          onClick={() => {
            alert('Success! Your ad has been published.');
            navigate('home');
          }}
          className="rd-purple-btn px-12 text-lg"
        >
          Publish
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto p-4">
      {view === 'home' && renderHome()}
      {view === 'post' && renderPostAd()}
      {view === 'category' && renderCategorySelection()}
      {view === 'form' && renderPostingForm()}
      {view === 'images' && renderImageUpload()}
      {view === 'review' && renderReview()}
      {view === 'redesign' && renderRedesign()}
      {view === 'rd-form' && renderRedesignForm()}
      {view === 'rd-preview' && renderRedesignPreview()}
      
      <footer className="mt-12 pt-4 border-t border-[#ccc] text-[10px] text-center text-gray-500 flex justify-center gap-4">
        <span>© craigslist</span>
        <a href="#">help</a>
        <a href="#">safety</a>
        <a href="#">privacy</a>
        <a href="#">feedback</a>
        <a href="#">terms</a>
        <a href="#">about</a>
        <a href="#">mobile</a>
      </footer>
    </div>
  );
}
