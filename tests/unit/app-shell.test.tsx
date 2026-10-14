import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import Home from '@/app/page';
import RootLayout from '@/app/layout';
jest.mock('next/font/google', (): object => ({
  Geist: (): object => ({ variable: 'sans' }),
  Geist_Mono: (): object => ({ variable: 'mono' }),
}));
test('starter home preserves heading and outbound links', (): void => {
  render(<Home />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'To get started',
  );
  expect(screen.getByText('Documentation')).toHaveAttribute(
    'href',
    expect.stringContaining('nextjs.org'),
  );
});
test('root preserves language and children', (): void => {
  const result: ReactNode = RootLayout({
    children: <span>Content</span>,
    params: Promise.resolve({}),
  });
  expect(result).toMatchObject({ props: { lang: 'en' } });
});
