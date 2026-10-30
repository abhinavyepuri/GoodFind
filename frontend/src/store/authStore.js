import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { mockCommunityUsers, mockCommunityAddresses } from '@/data/mockData';
import { useProductStore } from './productStore';

const refreshClientStateOnAuth = () => {
  try {
    // Evict old mock data/orders from local storage so only DB-grounded session data persists
    localStorage.removeItem('goodfind-commerce-storage');
    useProductStore.setState({ orders: [], currentUser: null });
  } catch {}
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: 'login', // 'login' | 'register'
      isLoading: false,

      openAuthModal: (tab = 'login') => {
        set({ isAuthModalOpen: true, authModalTab: tab });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false });
      },

      setAuthModalTab: (tab) => {
        set({ authModalTab: tab });
      },

      initAuth: async () => {
        try {
          const token = get().token;
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch('/api/auth/me', {
            method: 'GET',
            headers,
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();
            set({
              user: data.user,
              addresses: data.addresses || [],
              token: data.token || token,
              isAuthenticated: true,
            });
          } else if (res.status === 401 && !get().user) {
            set({ isAuthenticated: false, user: null, token: null });
          }
        } catch {
          // If offline / dev server not running, retain existing persisted state
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          if (res.ok) {
            refreshClientStateOnAuth();
            const data = await res.json();
            set({
              user: data.user,
              addresses: data.addresses || [],
              token: data.token,
              isAuthenticated: true,
              isAuthModalOpen: false,
              isLoading: false,
            });
            toast.success(`Welcome back, ${data.user.name || 'member'}!`);
            return { success: true, user: data.user };
          } else {
            const err = await res.json().catch(() => ({}));
            const message = err.error || 'Failed to sign in. Please verify your credentials.';
            toast.error(message);
            set({ isLoading: false });
            return { success: false, error: message };
          }
        } catch {
          // Local fallback for offline/client-only demonstration
          const cleanEmail = email.trim().toLowerCase();
          const foundCommunityUser = mockCommunityUsers?.find((u) => u.email === cleanEmail);
          const isUserAdmin = cleanEmail === 'admin@gf.test';

          let fallbackUser;
          let userAddresses = [];

          if (foundCommunityUser) {
            fallbackUser = {
              id: foundCommunityUser.id,
              email: foundCommunityUser.email,
              name: foundCommunityUser.name,
              phone: foundCommunityUser.phone || '',
              role: foundCommunityUser.role || 'customer',
              avatar: foundCommunityUser.avatar,
            };
            userAddresses = (mockCommunityAddresses || []).filter(
              (a) => a.userId === foundCommunityUser.id
            );
          } else if (isUserAdmin) {
            fallbackUser = {
              id: 'usr-admin-01',
              email: 'admin@gf.test',
              name: 'GoodFind Admin',
              phone: '+91 98200 11111',
              role: 'admin',
            };
          } else {
            fallbackUser = {
              id: `usr-${Date.now()}`,
              email: cleanEmail,
              name: cleanEmail.split('@')[0],
              phone: '',
              role: 'customer',
            };
          }

          set({
            user: fallbackUser,
            addresses: userAddresses,
            isAuthenticated: true,
            token: fallbackUser.id,
            isAuthModalOpen: false,
            isLoading: false,
          });
          toast.success(`Welcome back, ${fallbackUser.name}!`);
          return { success: true, user: fallbackUser };
        }
      },

      register: async ({ email, password, name, phone, address, orderNumber, orderId }) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password, name, phone, address, orderNumber, orderId }),
          });

          if (res.ok) {
            refreshClientStateOnAuth();
            const data = await res.json();
            set({
              user: data.user,
              addresses: data.addresses || [],
              token: data.token,
              isAuthenticated: true,
              isAuthModalOpen: false,
              isLoading: false,
            });
            toast.success(`Account created! Welcome to GoodFind, ${data.user.name}!`);
            return { success: true, user: data.user };
          } else {
            const err = await res.json().catch(() => ({}));
            const message = err.error || 'Failed to create account.';
            toast.error(message);
            set({ isLoading: false });
            return { success: false, error: message };
          }
        } catch {
          // Local fallback for offline/client-only demonstration
          const cleanEmail = email.trim().toLowerCase();
          const fallbackUser = {
            id: `usr-${Date.now()}`,
            email: cleanEmail,
            name: (name || cleanEmail.split('@')[0]).trim(),
            phone: phone || '',
            role: 'customer',
          };
          const fallbackAddresses = address
            ? [
                {
                  id: `addr-${Date.now()}`,
                  userId: fallbackUser.id,
                  title: address.title || 'Default Address',
                  fullName: address.fullName || fallbackUser.name,
                  street: address.street || '',
                  apartment: address.apartment || '',
                  city: address.city || '',
                  state: address.state || '',
                  postalCode: address.postalCode || '',
                  country: address.country || 'United States',
                  phone: address.phone || fallbackUser.phone,
                  isDefault: true,
                },
              ]
            : [];

          set({
            user: fallbackUser,
            addresses: fallbackAddresses,
            isAuthenticated: true,
            token: fallbackUser.id,
            isAuthModalOpen: false,
            isLoading: false,
          });
          toast.success(`Account created! Welcome, ${fallbackUser.name}!`);
          return { success: true, user: fallbackUser };
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch {
          // Ignore network errors on logout
        }
        refreshClientStateOnAuth();
        set({
          user: null,
          addresses: [],
          token: null,
          isAuthenticated: false,
        });
        toast.info('You have been signed out.');
      },

      fetchAddresses: async () => {
        try {
          const token = get().token;
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch('/api/user/addresses', {
            method: 'GET',
            headers,
            credentials: 'include',
          });
          if (res.ok) {
            const addresses = await res.json();
            set({ addresses });
            return addresses;
          }
        } catch {
          // Fall back to current in-memory/persisted addresses
        }
        return get().addresses;
      },

      addAddress: async (addressData) => {
        const token = get().token;
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch('/api/user/addresses', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(addressData),
          });

          if (res.ok) {
            const data = await res.json();
            set({ addresses: data.addresses });
            toast.success('Address added to your address book.');
            return data.address;
          }
        } catch {
          // Fallback to local
        }

        const newAddr = {
          ...addressData,
          id: `addr-${Date.now()}`,
          isDefault: addressData.isDefault || get().addresses.length === 0,
        };
        const updated = newAddr.isDefault
          ? [newAddr, ...get().addresses.map((a) => ({ ...a, isDefault: false }))]
          : [...get().addresses, newAddr];

        set({ addresses: updated });
        toast.success('Address added to your address book.');
        return newAddr;
      },

      setDefaultAddress: async (addressId) => {
        const token = get().token;
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch(`/api/user/addresses/${addressId}/default`, {
            method: 'PUT',
            headers,
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();
            set({ addresses: data.addresses });
            toast.success('Default shipping address updated.');
            return;
          }
        } catch {
          // Fallback
        }

        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === addressId,
          })),
        }));
        toast.success('Default shipping address updated.');
      },

      deleteAddress: async (addressId) => {
        const token = get().token;
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch(`/api/user/addresses/${addressId}`, {
            method: 'DELETE',
            headers,
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();
            set({ addresses: data.addresses });
            toast.success('Address removed from address book.');
            return;
          }
        } catch {
          // Fallback
        }

        set((state) => {
          const target = state.addresses.find((a) => a.id === addressId);
          const filtered = state.addresses.filter((a) => a.id !== addressId);
          if (target?.isDefault && filtered.length > 0) {
            filtered[0].isDefault = true;
          }
          return { addresses: filtered };
        });
        toast.success('Address removed from address book.');
      },
    }),
    {
      name: 'goodfind-auth-storage',
    }
  )
);
