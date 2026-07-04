import { render, screen } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';
import { AuthProvider } from '../../components/AuthContext';
import { SidebarProvider } from '../../components/SidebarContext';

describe('Sidebar component', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'openfinance-user',
      JSON.stringify({
        username: 'admin',
        name: 'Admin OF+',
        role: 'admin',
        roleLabel: 'Administrador',
      })
    );
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders navigation links', () => {
    render(
      <AuthProvider>
        <SidebarProvider>
          <Sidebar />
        </SidebarProvider>
      </AuthProvider>
    );

    const link = screen.getByRole('link', { name: /Inicio/i });
    expect(link).toBeInTheDocument();
  });
});
