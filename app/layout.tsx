export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>My Website</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>Footer content goes here.</p>
        </footer>
      </body>
    </html>
  );
}
