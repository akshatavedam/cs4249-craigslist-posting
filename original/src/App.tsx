/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, ChangeEvent } from 'react';
import { Search, MapPin, Star, SquarePen, User, Plus, X } from 'lucide-react';

type View = 'home' | 'post' | 'category' | 'form' | 'images' | 'review' | 'wrong';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    description: '',
    rent: '',
    rentPeriod: 'month',
    sqft: '',
    housingType: 'apartment',
    laundry: '-',
    parking: '-',
    bedrooms: '-',
    bathrooms: '-',
    catsOk: false,
    dogsOk: false,
    furnished: false,
    noSmoking: false,
    wheelchair: false,
    airConditioning: false,
    evCharging: false,
    washer: false,
    startDate: '',
    email: '',
    phone: '',
    contactName: '',
    showPhone: false
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [workerId, setWorkerId] = useState('');
  const [isWorkerIdSubmitted, setIsWorkerIdSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.address) newErrors.address = 'Street Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zip) newErrors.zip = 'ZIP is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.rent) newErrors.rent = 'Rent is required';
    if (!formData.sqft) newErrors.sqft = 'Sqft is required';
    if (!formData.email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPhotos = filesArray.map(file => URL.createObjectURL(file as Blob));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
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
      else if (s === 'w') setView('wrong');
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
    else if (newView === 'wrong') url = '?s=w';

    window.history.pushState({}, '', url);
    setView(newView);
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
          onClick={() => navigate('post')}
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
            <button onClick={() => navigate('post')} className="nav-icon-link">
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
                navigate('wrong');
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
                navigate('wrong');
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
      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-4 border-2 border-red-500 bg-[#ffffcc]">
          <p className="text-red-600 font-bold mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-red-600 text-[11px]">
            {Object.values(errors).map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
        </div>
      )}

      {/* Top Row */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <label className="cl-form-section-label">posting title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-1 py-0.5 outline-none border border-[#006600]"
          />
        </div>
        <div className="w-1/2">
          <label className="cl-form-section-label">street address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-1 py-0.5 outline-none border border-[#006600]"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="w-1/3">
          <label className="cl-form-section-label">city</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-1 py-0.5 outline-none border border-[#006600]"
          />
        </div>
        <div className="w-1/3">
          <label className="cl-form-section-label">ZIP code</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            className="w-full px-1 py-0.5 outline-none border border-[#006600]"
          />
        </div>
        <div className="w-1/3">
          <label className="cl-form-section-label">country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-1 py-0.5 outline-none border border-[#006600]"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="cl-form-section-label">description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full h-48 border border-[#ccc] p-1 resize-y outline-none"
        />
      </div>

      {/* Posting Details */}
      <div className="cl-form-group">
        <span className="cl-form-label-top">posting details</span>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-8 gap-y-4">
          {/* Left Col */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="cl-form-section-label">rent</label>
              <div className="flex items-center border px-1 border-[#006600]">
                <span className="text-[#006600]">$</span>
                <input
                  type="text"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className="w-full outline-none py-0.5 px-1"
                />
              </div>
            </div>
            <div>
              <label className="cl-form-section-label">per</label>
              <select
                name="rentPeriod"
                value={formData.rentPeriod}
                onChange={handleInputChange}
                className="cl-select w-full"
              >
                <option value="-">-</option>
                <option value="month">month</option>
                <option value="week">week</option>
                <option value="day">day</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">sqft</label>
              <input
                type="text"
                name="sqft"
                value={formData.sqft}
                onChange={handleInputChange}
                className="w-full px-1 py-0.5 outline-none border border-[#006600]"
              />
            </div>
          </div>

          {/* Middle Col 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="cl-form-section-label">housing type</label>
              <select
                name="housingType"
                value={formData.housingType}
                onChange={handleInputChange}
                className="cl-select w-full"
              >
                <option value="apartment">apartment</option>
                <option value="condo">condo</option>
                <option value="house">house</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">laundry</label>
              <select
                name="laundry"
                value={formData.laundry}
                onChange={handleInputChange}
                className="cl-select w-full"
              >
                <option value="-">-</option>
                <option value="w/d in unit">w/d in unit</option>
                <option value="w/d hookups">w/d hookups</option>
                <option value="laundry in bldg">laundry in bldg</option>
                <option value="laundry on site">laundry on site</option>
                <option value="no laundry on site">no laundry on site</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">parking</label>
              <select
                name="parking"
                value={formData.parking}
                onChange={handleInputChange}
                className="cl-select w-full"
              >
                <option value="-">-</option>
                <option value="carport">carport</option>
                <option value="attached garage">attached garage</option>
                <option value="detached garage">detached garage</option>
                <option value="off-street parking">off-street parking</option>
                <option value="street parking">street parking</option>
                <option value="valet parking">free parking</option>
                <option value="no parking">no parking</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">bedrooms</label>
              <select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="cl-select w-full"
              >
                <option value="-">-</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
            <div>
              <label className="cl-form-section-label">bathrooms</label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="cl-select w-full"
              >
                <option value="-">-</option>
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          {/* Middle Col 2 (Checkboxes) */}
          <div className="flex flex-col gap-1 text-[11px]">
            <label className="flex items-center gap-2"><input type="checkbox" name="catsOk" checked={formData.catsOk} onChange={handleInputChange} /> cats ok</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="dogsOk" checked={formData.dogsOk} onChange={handleInputChange} /> dogs ok</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleInputChange} /> furnished</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="noSmoking" checked={formData.noSmoking} onChange={handleInputChange} /> no smoking</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="wheelchair" checked={formData.wheelchair} onChange={handleInputChange} /> wheelchair accessible</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="airConditioning" checked={formData.airConditioning} onChange={handleInputChange} /> air conditioning</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="evCharging" checked={formData.evCharging} onChange={handleInputChange} /> EV charging</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="washer" checked={formData.washer} onChange={handleInputChange} /> washer</label>
          </div>

          {/* Right Col */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="cl-form-section-label">available on</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="cl-input w-full"
              />
            </div>
            <div className="border border-[#ccc] p-2 relative pt-4 text-[10px]">
              <span className="absolute -top-2 left-2 bg-white px-1 text-gray-600">open house dates</span>
              <div className="flex flex-col gap-2">
                <p className="text-gray-400 italic">feature coming soon</p>
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
            <label className="flex items-center gap-2 font-bold"><input type="checkbox" disabled /> broker fee</label>
            <p className="text-[10px] text-gray-400 mt-1">Contact your admin to enable fee sections</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="cl-form-group">
        <span className="cl-form-label-top">contact info</span>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="cl-form-section-label">email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="cl-input-green w-full"
            />
            <p className="text-[11px] mt-1">replies use CL mail relay <a href="#" className="text-blue-700 font-normal">[?]</a></p>
          </div>
          <div className="border border-[#ccc] p-4 relative pt-6">
            <span className="absolute -top-3 left-2 bg-white px-1 text-[11px] text-gray-500">phone/text</span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="showPhone"
                  checked={formData.showPhone}
                  onChange={handleInputChange}
                />
                show my phone number
              </label>
              <div className={`flex gap-4 text-[11px] ${!formData.showPhone ? 'text-gray-300' : ''}`}>
                <label className="flex items-center gap-1"><input type="checkbox" disabled /> phone calls OK</label>
                <label className="flex items-center gap-1"><input type="checkbox" disabled /> text/sms OK</label>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block">phone number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!formData.showPhone}
                  className="w-full border border-[#ccc] px-1 py-0.5 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block">contact name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full border border-[#ccc] px-1 py-0.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => {
            if (validateForm()) {
              navigate('images');
            }
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
      <p className="text-[15px] mb-4">this posting has {photos.length} images of a maximum 24</p>

      <div className="grid grid-cols-[1fr_300px] gap-12 items-start">
        <div className="flex flex-col gap-4">
          <div className="cl-upload-box">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="absolute top-12 left-8 pointer-events-none">
              <button className="cl-add-images-btn">Add Images</button>
            </div>
            <span className="text-[#999] text-2xl">Drop image files here</span>
            <a href="#" className="absolute bottom-2 right-2 text-blue-600 text-[11px]">Use classic image uploader</a>
          </div>

          {/* Photo Previews */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square border border-gray-200">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
                {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-[10px] text-center font-bold">featured</span>}
              </div>
            ))}
            {photos.length > 0 && photos.length < 24 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Plus size={24} className="text-gray-400" />
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate('review')}
            className="cl-done-btn mt-8"
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
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">
              ${formData.rent || '0'} / {formData.bedrooms !== '-' ? `${formData.bedrooms}br` : ''} {formData.sqft ? `- ${formData.sqft}ft2` : ''} - {formData.title || '(no title)'} {formData.city && `(${formData.city})`}
            </h1>

            {/* Review Photos */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 border border-gray-200">
                {photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="h-24 w-auto object-cover border border-gray-300" />
                ))}
              </div>
            )}

            <p className="text-sm mb-12 whitespace-pre-wrap">{formData.description || '(no description)'}</p>

            <div className="flex items-center gap-1 text-gray-400 text-[11px]">
              <span>♥</span>
              <span>best of <sup>[?]</sup></span>
            </div>

            {formData.showPhone && formData.phone && (
              <div className="mt-4 p-2 border border-blue-200 bg-blue-50 text-[12px]">
                <span className="font-bold">Contact:</span> {formData.contactName || 'Poster'} @ {formData.phone}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 text-right min-w-[150px]">
            {formData.bedrooms !== '-' && <span className="text-[13px] font-bold">{formData.bedrooms}BR / {formData.bathrooms !== '-' ? `${formData.bathrooms}Ba` : '?Ba'}</span>}
            <span className="text-[13px]">rent period: <span className="text-blue-700">{formData.rentPeriod}</span></span>
            <a href="#" className="cl-attribute-link">{formData.housingType}</a>
            {formData.laundry !== '-' && <a href="#" className="cl-attribute-link">{formData.laundry}</a>}
            {formData.parking !== '-' && <a href="#" className="cl-attribute-link">{formData.parking}</a>}
            {formData.catsOk && <span className="cl-attribute-link">cats ok</span>}
            {formData.dogsOk && <span className="cl-attribute-link">dogs ok</span>}
            {formData.furnished && <span className="cl-attribute-link">furnished</span>}
            {formData.noSmoking && <span className="cl-attribute-link">no smoking</span>}
            {formData.washer && <span className="cl-attribute-link">washer</span>}
            {formData.startDate && <span className="cl-attribute-link">available: {formData.startDate}</span>}
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

  return (
    <>
      {!isWorkerIdSubmitted && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-black max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Welcome</h2>
            <p className="mb-4 text-sm">Please enter your Worker ID to begin the interaction.</p>
            <div className="mb-4">
              <label className="font-bold text-sm block mb-1">Worker ID*</label>
              <input
                type="text"
                className="w-full border-2 border-black px-2 py-1"
                placeholder="Enter your ID"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                if (workerId.trim()) {
                  setIsWorkerIdSubmitted(true);
                } else {
                  alert('Worker ID is compulsory');
                }
              }}
              className="w-full bg-[#efefef] border border-black py-2 font-bold hover:bg-[#e5e5e5]"
            >
              Start Interaction
            </button>
          </div>
        </div>
      )}
      <div className="max-w-[1100px] mx-auto p-4">
        {view === 'home' && renderHome()}
        {view === 'post' && renderPostAd()}
        {view === 'category' && renderCategorySelection()}
        {view === 'form' && renderPostingForm()}
        {view === 'images' && renderImageUpload()}
        {view === 'review' && renderReview()}
        {view === 'wrong' && (
          <div className="max-w-[800px] mx-auto p-12 text-center font-sans">
            <h1 className="text-3xl font-bold mb-4">wrong page</h1>
            <p className="text-gray-600 mb-8">This is not the correct path for this mock flow.</p>
            <button
              onClick={() => window.history.back()}
              className="cl-button px-6 py-2"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </>
  );
}
