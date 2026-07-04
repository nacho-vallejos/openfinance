import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  usePathname: () => '/home',
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));
