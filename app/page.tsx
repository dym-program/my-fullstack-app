import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>My Test full-stack app</h1>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </div>
  )
}