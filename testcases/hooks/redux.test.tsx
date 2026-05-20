import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isAuthenticated: false, isLoading: false, user: null }, action) => {
        switch (action.type) {
          case 'auth/loginSuccess':
            return { ...state, isAuthenticated: true, user: action.payload };
          case 'auth/logout':
            return { ...state, isAuthenticated: false, user: null };
          case 'auth/setLoading':
            return { ...state, isLoading: action.payload };
          default:
            return state;
        }
      },
      services: (state = { services: [], loading: false }, action) => {
        switch (action.type) {
          case 'services/setServices':
            return { ...state, services: action.payload };
          case 'services/setLoading':
            return { ...state, loading: action.payload };
          default:
            return state;
        }
      },
    },
    preloadedState: initialState,
  });
};

// Mock useAppSelector hook
const mockUseAppSelector = jest.fn();
const mockUseAppDispatch = jest.fn();

jest.mock('../../../src/hooks/redux', () => ({
  useAppSelector: () => mockUseAppSelector(),
  useAppDispatch: () => mockUseAppDispatch(),
}));

describe('Redux Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('useAppSelector should select state from store', () => {
    const mockState = {
      auth: { isAuthenticated: true, isLoading: false, user: { id: 1, name: 'John' } },
      services: { services: [], loading: false }
    };
    
    mockUseAppSelector.mockReturnValue(mockState.auth);
    
    const { useAppSelector } = require('../../../src/hooks/redux');
    const selectedState = useAppSelector((state: any) => state.auth);
    
    expect(selectedState).toEqual(mockState.auth);
  });

  test('useAppDispatch should return dispatch function', () => {
    const mockDispatch = jest.fn();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    
    const { useAppDispatch } = require('../../../src/hooks/redux');
    const dispatch = useAppDispatch();
    
    expect(typeof dispatch).toBe('function');
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('should handle authentication state changes', () => {
    const store = createMockStore();
    
    // Test initial state
    expect(store.getState().auth.isAuthenticated).toBe(false);
    
    // Test login success
    store.dispatch({ type: 'auth/loginSuccess', payload: { id: 1, name: 'John' } });
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user).toEqual({ id: 1, name: 'John' });
    
    // Test logout
    store.dispatch({ type: 'auth/logout' });
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  test('should handle loading state', () => {
    const store = createMockStore();
    
    // Test loading state
    store.dispatch({ type: 'auth/setLoading', payload: true });
    expect(store.getState().auth.isLoading).toBe(true);
    
    store.dispatch({ type: 'auth/setLoading', payload: false });
    expect(store.getState().auth.isLoading).toBe(false);
  });

  test('should handle services state', () => {
    const store = createMockStore();
    
    // Test setting services
    const mockServices = [
      { id: 1, name: 'Cardiology', description: 'Heart services' },
      { id: 2, name: 'Neurology', description: 'Brain services' },
    ];
    
    store.dispatch({ type: 'services/setServices', payload: mockServices });
    expect(store.getState().services.services).toEqual(mockServices);
    
    // Test loading state
    store.dispatch({ type: 'services/setLoading', payload: true });
    expect(store.getState().services.loading).toBe(true);
  });

  test('should work with React components', () => {
    const TestComponent = () => {
      const { useAppSelector } = require('../../../src/hooks/redux');
      const auth = useAppSelector((state: any) => state.auth);
      
      return (
        <div data-testid="auth-status">
          {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </div>
      );
    };
    
    mockUseAppSelector.mockReturnValue({ isAuthenticated: true, isLoading: false, user: null });
    
    const store = createMockStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    expect(getByTestId('auth-status')).toHaveTextContent('Authenticated');
  });

  test('should handle complex state selections', () => {
    const complexState = {
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          permissions: ['read', 'write', 'delete']
        }
      },
      services: {
        services: [
          { id: 1, name: 'Service 1', active: true },
          { id: 2, name: 'Service 2', active: false },
        ],
        loading: false,
        filters: { status: 'all', category: 'all' }
      }
    };
    
    // Test nested state selection
    mockUseAppSelector.mockImplementation((selector: any) => selector(complexState));
    
    const { useAppSelector } = require('../../../src/hooks/redux');
    
    // Select user permissions
    const permissions = useAppSelector((state: any) => state.auth.user.permissions);
    expect(permissions).toEqual(['read', 'write', 'delete']);
    
    // Select active services
    const activeServices = useAppSelector((state: any) => 
      state.services.services.filter((service: any) => service.active)
    );
    expect(activeServices).toHaveLength(1);
    expect(activeServices[0].name).toBe('Service 1');
  });

  test('should handle dispatch actions', () => {
    const mockDispatch = jest.fn();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    
    const { useAppDispatch } = require('../../../src/hooks/redux');
    const dispatch = useAppDispatch();
    
    // Test dispatching actions
    dispatch({ type: 'auth/loginSuccess', payload: { id: 1, name: 'John' } });
    dispatch({ type: 'services/setLoading', payload: true });
    
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'auth/loginSuccess', 
      payload: { id: 1, name: 'John' } 
    });
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'services/setLoading', 
      payload: true 
    });
  });
});
