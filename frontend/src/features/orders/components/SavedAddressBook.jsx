import * as React from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Building2, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';

export function SavedAddressBook() {
  const {
    user,
    addresses,
    isAuthenticated,
    openAuthModal,
    addAddress,
    setDefaultAddress,
    deleteAddress,
  } = useAuthStore();

  const [isAdding, setIsAdding] = React.useState(false);
  const [title, setTitle] = React.useState('Home');
  const [fullName, setFullName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [street, setStreet] = React.useState('');
  const [apartment, setApartment] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [country, setCountry] = React.useState('United States');
  const [isDefault, setIsDefault] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setError('Please fill in all required address fields.');
      return;
    }

    await addAddress({
      title: title.trim() || 'Home',
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      apartment: apartment.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim() || 'United States',
      isDefault,
    });

    // Reset form
    setIsAdding(false);
    setStreet('');
    setApartment('');
    setCity('');
    setState('');
    setPostalCode('');
    setIsDefault(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 p-8 sm:p-12 text-center bg-card/40 space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
          <MapPin className="h-8 w-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">Sign In to View Saved Addresses</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Create a GoodFind account or sign in to save home, work, and studio destinations for 1-click checkout.
          </p>
        </div>
        <Button
          type="button"
          variant="brand"
          onClick={() => openAuthModal('login')}
          className="rounded-xl px-6 text-xs font-semibold shadow-md"
        >
          Sign In or Register
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl border bg-card/60 shadow-soft">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Saved Shipping Address Book</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your delivery destinations. Pre-selected automatically during checkout.
          </p>
        </div>

        <Button
          type="button"
          variant={isAdding ? 'secondary' : 'brand'}
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold rounded-xl gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{isAdding ? 'Cancel' : 'Add New Address'}</span>
        </Button>
      </div>

      {/* Inline Address Creation Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-6 rounded-3xl border border-primary/20 bg-card shadow-soft space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-foreground">New Delivery Destination</h3>
            <p className="text-[11px] text-muted-foreground">
              This address will be saved securely to your account for future purchases.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Label / Title
              </label>
              <Input
                placeholder="e.g. Home, Studio, Office"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Full Name
              </label>
              <Input
                placeholder="Recipient name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Phone Number
              </label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Street Address
              </label>
              <Input
                placeholder="450 West 14th Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Apartment / Suite
              </label>
              <Input
                placeholder="Suite 8B (Optional)"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                City
              </label>
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                State / Region
              </label>
              <Input
                placeholder="NY"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Postal / ZIP
              </label>
              <Input
                placeholder="10014"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Country
              </label>
              <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
              </Select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-muted-foreground text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-xs font-semibold text-foreground">
                Set as default shipping address
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand" size="sm" className="text-xs rounded-xl px-5">
                Save Address
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-3xl border bg-card/80 transition-all flex flex-col justify-between space-y-4 ${
                addr.isDefault
                  ? 'border-primary/40 ring-1 ring-primary/20 shadow-soft'
                  : 'border-border/70 hover:border-border'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-xl bg-muted flex items-center justify-center text-foreground">
                      {addr.title?.toLowerCase().includes('office') || addr.title?.toLowerCase().includes('studio') ? (
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Home className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-foreground">{addr.title || 'Address'}</span>
                  </div>

                  {addr.isDefault && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Default
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground text-sm">{addr.fullName}</p>
                  <p>{addr.street} {addr.apartment || ''}</p>
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className="text-[11px] pt-1">{addr.phone}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <span>Active Default</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${addr.title}" address?`)) {
                      deleteAddress(addr.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete address"
                  aria-label="Delete address"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-3xl border border-dashed text-center bg-card/40 space-y-3">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto stroke-[1.5]" />
          <p className="text-xs font-medium text-muted-foreground">
            No saved addresses in your address book yet.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="text-xs rounded-xl"
          >
            Add First Address
          </Button>
        </div>
      )}
    </div>
  );
}
