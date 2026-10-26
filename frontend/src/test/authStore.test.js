import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/store/authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.setState({
      user: null,
      addresses: [],
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: 'login',
      isLoading: false,
    });
    vi.restoreAllMocks();
  });

  it('manages auth modal open, close, and tab switching', () => {
    const { openAuthModal, closeAuthModal, setAuthModalTab } = useAuthStore.getState();

    openAuthModal('register');
    expect(useAuthStore.getState().isAuthModalOpen).toBe(true);
    expect(useAuthStore.getState().authModalTab).toBe('register');

    setAuthModalTab('login');
    expect(useAuthStore.getState().authModalTab).toBe('login');

    closeAuthModal();
    expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
  });

  it('handles client registration and address book creation with fallback', async () => {
    const { register } = useAuthStore.getState();

    const res = await register({
      email: 'test@goodfind.io',
      password: 'password123',
      name: 'Alexandria',
      phone: '+1 555-0199',
      address: {
        street: '123 Luxury Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
      },
    });

    expect(res.success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.email).toBe('test@goodfind.io');
    expect(state.addresses.length).toBe(1);
    expect(state.addresses[0].street).toBe('123 Luxury Ave');
    expect(state.addresses[0].isDefault).toBe(true);
  });

  it('manages address book additions, default flag updates, and deletions', async () => {
    const store = useAuthStore.getState();

    // 1. Add first address (automatically default)
    await store.addAddress({
      title: 'Studio',
      fullName: 'Alexandria M.',
      street: '450 West 14th St',
      city: 'New York',
      state: 'NY',
      postalCode: '10014',
    });

    expect(useAuthStore.getState().addresses.length).toBe(1);
    expect(useAuthStore.getState().addresses[0].isDefault).toBe(true);

    // 2. Add second address
    const secondAddr = await store.addAddress({
      title: 'Weekend Loft',
      fullName: 'Alexandria M.',
      street: '72 Ocean Lane',
      city: 'Montauk',
      state: 'NY',
      postalCode: '11954',
      isDefault: false,
    });

    expect(useAuthStore.getState().addresses.length).toBe(2);
    expect(secondAddr.isDefault).toBe(false);

    // 3. Set second address as default
    await store.setDefaultAddress(secondAddr.id);
    const updated = useAuthStore.getState().addresses;
    expect(updated.find((a) => a.id === secondAddr.id).isDefault).toBe(true);
    expect(updated.find((a) => a.title === 'Studio').isDefault).toBe(false);

    // 4. Delete an address
    await store.deleteAddress(secondAddr.id);
    expect(useAuthStore.getState().addresses.length).toBe(1);
    expect(useAuthStore.getState().addresses[0].title).toBe('Studio');
    expect(useAuthStore.getState().addresses[0].isDefault).toBe(true);
  });

  it('signs out user and resets authentication state', async () => {
    useAuthStore.setState({
      user: { id: 'usr-1', email: 'user@test.com' },
      isAuthenticated: true,
      addresses: [{ id: 'addr-1', street: '123 St' }],
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.addresses).toEqual([]);
  });
});
